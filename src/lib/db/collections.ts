import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getRecentCollections = cache(async (userId: string, limit = 4) => {
  if (userId === "guest-id") return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { items: true }
      },
      items: {
        select: {
          type: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true
            }
          }
        }
      }
    }
  });

  return collections.map(collection => {
    // Extract unique types and their counts
    const typeCounts: Record<string, { count: number, color: string, icon: string, name: string }> = {};
    
    collection.items.forEach(item => {
      const type = item.type;
      if (!typeCounts[type.id]) {
        typeCounts[type.id] = { 
          count: 0, 
          color: type.color || '#3b82f6', 
          icon: type.icon || 'Folder',
          name: type.name
        };
      }
      typeCounts[type.id].count++;
    });

    const types = Object.keys(typeCounts).map(id => ({
      id,
      ...typeCounts[id]
    }));

    // Determine primary type (most frequent)
    const primaryType = types.length > 0 
      ? types.reduce((prev, current) => (prev.count > current.count) ? prev : current)
      : null;

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      itemCount: collection._count.items,
      isFavorite: collection.isFavorite,
      types: types,
      primaryColor: primaryType?.color || 'var(--color-primary)',
      updatedAt: collection.updatedAt
    };
  });
});

export const getAllCollections = cache(async (userId: string) => {
  if (userId === "guest-id") return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  return collections.map(collection => ({
    id: collection.id,
    name: collection.name,
    isFavorite: collection.isFavorite,
    updatedAt: collection.updatedAt
  }));
});
