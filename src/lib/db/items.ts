import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getPinnedItems = cache(async (userId: string, limit = 4) => {
  if (userId === "guest-id") return [];

  const items = await prisma.item.findMany({
    where: { 
      userId,
      isPinned: true
    },
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      type: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  return items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color
    },
    tags: item.tags.map(it => it.tag.name),
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }));
});

export const getItemTypes = cache(async (userId: string) => {
  const isGuest = userId === "guest-id";

  const types = await prisma.itemType.findMany({
    where: {
      OR: [
        { isSystem: true },
        ...(!isGuest ? [{ userId }] : [])
      ]
    },
    include: {
      _count: {
        select: { 
          items: {
            where: !isGuest ? { userId } : { userId: 'non-existent' }
          } 
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  return types.map(type => ({
    id: type.id,
    name: type.name,
    icon: type.icon,
    color: type.color,
    count: type._count.items,
  }));
});

export const getRecentItems = cache(async (userId: string, limit = 10) => {
  if (userId === "guest-id") return [];

  const items = await prisma.item.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      type: true,
      collection: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  return items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color
    },
    collection: item.collection ? {
      id: item.collection.id,
      name: item.collection.name
    } : null,
    tags: item.tags.map(it => it.tag.name),
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }));
});
