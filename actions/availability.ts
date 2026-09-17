"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { DayOfWeek } from "@prisma/client";

export interface DaySchedule {
  day: DayOfWeek;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export async function getUserAvailability() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { availability: true },
  });

  if (!user) return null;
  return user.availability;
}

export async function updateAvailability(schedule: DaySchedule[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  await db.$transaction(async (tx) => {
    await tx.availability.deleteMany({
      where: { userId: user.id },
    });

    const activeDays = schedule.filter((s) => s.isAvailable);

    if (activeDays.length > 0) {
      await tx.availability.createMany({
        data: activeDays.map((item) => ({
          userId: user.id,
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
        })),
      });
    }
  });

  revalidatePath("/availability");
  return { success: true };
}