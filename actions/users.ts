"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUsername(username: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Sanitize username: lowercase, alphanumeric and dashes only
  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters long." };
  }

  // Check if username is already taken by someone else
  const existingUser = await db.user.findUnique({
    where: { username: cleanUsername },
  });

  if (existingUser && existingUser.clerkUserId !== userId) {
    return { success: false, error: "Username is already taken. Try another." };
  }

  // Update in database
  await db.user.update({
    where: { clerkUserId: userId },
    data: { username: cleanUsername },
  });

  revalidatePath("/dashboard");
  return { success: true, username: cleanUsername };
}