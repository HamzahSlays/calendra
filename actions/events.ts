"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEventType(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const duration = parseInt(formData.get("duration") as string, 10);

  if (!title || isNaN(duration)) {
    throw new Error("Invalid form data");
  }

  // Generate URL slug from title (e.g. "30 Min Chat" -> "30-min-chat")
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) throw new Error("User record not found");

  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  await db.eventType.create({
    data: {
      userId: dbUser.id,
      title,
      description: description || null,
      duration,
      slug,
      isActive: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${dbUser.username}`);
}
export async function deleteEventType(id: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) throw new Error("User record not found");

  // Ensure user owns the event before deleting
  await db.eventType.deleteMany({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${dbUser.username}`);
}