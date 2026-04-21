import { prisma } from "@/lib/prisma";

export async function getPinnedItems(userEmail: string, limit = 4) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true }
  });

  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { 
      userId: user.id,
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
}

export async function getItemTypes(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true }
  });

  const types = await prisma.itemType.findMany({
    where: {
      OR: [
        { isSystem: true },
        ...(user ? [{ userId: user.id }] : [])
      ]
    },
    include: {
      _count: {
        select: { 
          items: {
            where: user ? { userId: user.id } : { userId: 'non-existent' }
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
}

export async function getRecentItems(userEmail: string, limit = 10) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true }
  });

  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { userId: user.id },
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
}
