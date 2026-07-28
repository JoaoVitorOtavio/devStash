import { prisma } from "@/server/prisma";
import { cache } from "react";
import { COLLECTIONS_PER_PAGE, ITEMS_PER_PAGE } from "@/server/constants";

const collectionStatsInclude = {
  _count: {
    select: { items: true }
  },
  items: {
    select: {
      item: {
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
  }
} as const;

function mapCollectionWithStats(collection: {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  updatedAt: Date;
  _count: { items: number };
  items: { item: { type: { id: string; name: string; icon: string | null; color: string | null } } }[];
}) {
  // Extract unique types and their counts
  const typeCounts: Record<string, { count: number, color: string, icon: string, name: string }> = {};

  collection.items.forEach(itemCollection => {
    const type = itemCollection.item.type;
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
}

export const getRecentCollections = cache(async (userId: string, limit = 4) => {
  if (userId === "guest-id") return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: collectionStatsInclude
  });

  return collections.map(mapCollectionWithStats);
});

export const getFavoriteCollections = cache(async (userId: string) => {
  if (userId === "guest-id") return [];

  const collections = await prisma.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    include: collectionStatsInclude
  });

  return collections.map(mapCollectionWithStats);
});

export const getAllCollectionsForSearch = cache(async (userId: string) => {
  if (userId === "guest-id") return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { items: true } } }
  });

  return collections.map(collection => ({
    id: collection.id,
    name: collection.name,
    itemCount: collection._count.items,
  }));
});

export const getAllCollectionsWithStats = cache(async (userId: string, page = 1) => {
  if (userId === "guest-id") return { collections: [], totalCount: 0 };

  const where = { userId };

  const [collections, totalCount] = await Promise.all([
    prisma.collection.findMany({
      where,
      skip: (page - 1) * COLLECTIONS_PER_PAGE,
      take: COLLECTIONS_PER_PAGE,
      orderBy: { updatedAt: 'desc' },
      include: collectionStatsInclude
    }),
    prisma.collection.count({ where }),
  ]);

  return {
    collections: collections.map(mapCollectionWithStats),
    totalCount,
  };
});

export const getCollectionWithItems = cache(async (userId: string, collectionId: string, page = 1) => {
  if (userId === "guest-id") return null;

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId, userId },
    include: {
      _count: { select: { items: true } },
      items: {
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        orderBy: { item: { updatedAt: 'desc' } },
        include: {
          item: {
            include: {
              type: true,
              tags: {
                include: { tag: true }
              }
            }
          }
        }
      }
    }
  });

  if (!collection) return null;

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    totalItemCount: collection._count.items,
    items: collection.items.map(({ item }) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      content: item.content,
      url: item.url,
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
    }))
  };
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

export interface CreateCollectionInput {
  name: string;
  description: string | null;
}

export async function createCollection(userId: string, data: CreateCollectionInput) {
  const collection = await prisma.collection.create({
    data: {
      name: data.name,
      description: data.description,
      userId,
    },
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    updatedAt: collection.updatedAt,
  };
}

export interface UpdateCollectionInput {
  name: string;
  description: string | null;
}

export async function updateCollection(userId: string, id: string, data: UpdateCollectionInput) {
  const existing = await prisma.collection.findUnique({ where: { id, userId } });
  if (!existing) return null;

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    updatedAt: collection.updatedAt,
  };
}

export async function deleteCollection(userId: string, id: string) {
  const existing = await prisma.collection.findUnique({ where: { id, userId } });
  if (!existing) return false;

  // ItemCollection rows cascade-delete with the collection; items themselves are untouched.
  await prisma.collection.delete({ where: { id } });

  return true;
}
