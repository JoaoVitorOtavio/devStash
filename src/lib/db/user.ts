import { prisma } from "@/lib/prisma";

export async function getUserProfile(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isPro: true,
    }
  });

  if (!user) return null;

  return {
    ...user,
    name: user.name || "User", // Fallback
    image: user.image || "https://github.com/shadcn.png", // Fallback
  };
}
