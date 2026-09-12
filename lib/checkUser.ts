import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || "Anonymous",
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        username:
          user.username ||
          user.emailAddresses[0]?.emailAddress.split("@")[0] ||
          user.id,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error syncing user to database:", error);
    return null;
  }
};