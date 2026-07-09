import { prisma } from "@/server/prisma";
import { cache } from "react";

export const getUserProfile = cache(async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isPro: true,
      createdAt: true,
      password: true,
    }
  });

  if (!user) {
    return {
      id: "guest-id",
      email: userEmail,
      name: "Guest User",
      image: "https://github.com/shadcn.png",
      isPro: false,
      createdAt: new Date(),
      hasPassword: false,
    };
  }

  return {
    ...user,
    name: user.name || "User", // Fallback
    image: user.image || "https://github.com/shadcn.png", // Fallback
    hasPassword: !!user.password,
  };
});
