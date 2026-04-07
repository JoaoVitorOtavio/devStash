import { prisma } from "@/lib/prisma";

export async function getDashboardStats(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true }
  });

  if (!user) {
    return {
      totalItems: 0,
      totalCollections: 0,
      favoriteItems: 0,
      favoriteCollections: 0,
      pinnedItems: 0,
    };
  }

  const [totalItems, totalCollections, favoriteItems, favoriteCollections, pinnedItems] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.collection.count({ where: { userId: user.id } }),
    prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
    prisma.collection.count({ where: { userId: user.id, isFavorite: true } }),
    prisma.item.count({ where: { userId: user.id, isPinned: true } }),
  ]);

  return {
    totalItems,
    totalCollections,
    favoriteItems,
    favoriteCollections,
    pinnedItems,
  };
}
