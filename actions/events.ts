"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createEventType(formData: {
  title: string;
  description?: string;
  duration: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Generate slug from title: "30 Min Chat" -> "30-min-chat"
  const slug = formData.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    const event = await db.eventType.create({
      data: {
        userId: user.id,
        title: formData.title,
        slug,
        description: formData.description,
        duration: Number(formData.duration),
      },
    });

    revalidatePath("/dashboard");
    return { success: true, event };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { success: false, error: "An event type with this title/slug already exists." };
    }
    return { success: false, error: "Failed to create event type." };
  }
}

export async function toggleEventTypeStatus(eventId: string, currentStatus: boolean) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.eventType.update({
    where: { id: eventId },
    data: { isActive: !currentStatus },
  });

  revalidatePath("/dashboard");
  return { success: true };
}