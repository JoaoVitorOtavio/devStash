import { prisma } from "@/server/prisma";
import { cache } from "react";

export const getDashboardStats = cache(async (userId: string) => {
  if (userId === "guest-id") {
    return {
      totalItems: 0,
      totalCollections: 0,
      favoriteItems: 0,
      favoriteCollections: 0,
      pinnedItems: 0,
    };
  }

  const [totalItems, totalCollections, favoriteItems, favoriteCollections, pinnedItems] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
    prisma.item.count({ where: { userId, isPinned: true } }),
  ]);

  return {
    totalItems,
    totalCollections,
    favoriteItems,
    favoriteCollections,
    pinnedItems,
  };
});

export const getUserStats = cache(async (userId: string) => {
  if (userId === "guest-id") {
    return {
      totalItems: 0,
      totalCollections: 0,
      itemTypeBreakdown: [],
    };
  }

  const [totalItems, totalCollections, itemTypes] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
      where: { OR: [{ userId }, { isSystem: true }] },
      select: {
        name: true,
        icon: true,
        color: true,
        _count: {
          select: {
            items: { where: { userId } }
          }
        }
      }
    }),
  ]);

  return {
    totalItems,
    totalCollections,
    itemTypeBreakdown: itemTypes.map(type => ({
      name: type.name,
      icon: type.icon,
      color: type.color,
      count: type._count.items
    })),
  };
});
