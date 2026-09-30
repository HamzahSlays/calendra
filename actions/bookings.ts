"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelBooking(bookingId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) throw new Error("User record not found");

  // Ensure the booking belongs to the current user before deleting
  await db.booking.deleteMany({
    where: {
      id: bookingId,
      userId: dbUser.id,
    },
  });

  revalidatePath("/dashboard");
}