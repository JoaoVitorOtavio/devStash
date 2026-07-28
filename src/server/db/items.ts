import { prisma } from "@/server/prisma";
import { cache } from "react";
import { ITEMS_PER_PAGE } from "@/server/constants";

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
  }));
});

export const getFavoriteItems = cache(async (userId: string) => {
  if (userId === "guest-id") return [];

  const items = await prisma.item.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    include: { type: true }
  });

  return items.map(item => ({
    id: item.id,
    title: item.title,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color
    },
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
      collections: {
        include: { collection: true }
      },
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
    content: item.content,
    url: item.url,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color
    },
    collections: item.collections.map(ic => ({
      id: ic.collection.id,
      name: ic.collection.name
    })),
    tags: item.tags.map(it => it.tag.name),
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }));
});

export const getAllItemsForSearch = cache(async (userId: string) => {
  if (userId === "guest-id") return [];

  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { type: true }
  });

  return items.map(item => ({
    id: item.id,
    title: item.title,
    contentPreview: (item.content ?? item.description ?? "").slice(0, 100),
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color
    }
  }));
});

const itemDetailInclude = {
  type: true,
  collections: {
    include: { collection: true }
  },
  tags: {
    include: {
      tag: true
    }
  }
} as const;

function mapItemDetail(item: {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: { id: string; name: string; icon: string | null; color: string | null };
  collections: { collection: { id: string; name: string } }[];
  tags: { tag: { name: string } }[];
}) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentType: item.contentType,
    content: item.content,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    url: item.url,
    language: item.language,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color
    },
    collections: item.collections.map(ic => ({
      id: ic.collection.id,
      name: ic.collection.name
    })),
    tags: item.tags.map(it => it.tag.name),
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export const getItemById = cache(async (userId: string, id: string) => {
  if (userId === "guest-id") return null;

  const item = await prisma.item.findUnique({
    where: { id, userId },
    include: itemDetailInclude
  });

  if (!item) return null;

  return mapItemDetail(item);
});

export interface UpdateItemInput {
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
  collectionIds: string[];
}

export async function updateItem(userId: string, id: string, data: UpdateItemInput) {
  const existing = await prisma.item.findUnique({ where: { id, userId } });
  if (!existing) return null;

  const ownedCollections = data.collectionIds.length > 0
    ? await prisma.collection.findMany({
        where: { id: { in: data.collectionIds }, userId },
        select: { id: true },
      })
    : [];

  await prisma.$transaction(async (tx) => {
    await tx.item.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        url: data.url,
        language: data.language,
      }
    });

    await tx.itemTag.deleteMany({ where: { itemId: id } });

    for (const tagName of data.tags) {
      const tag = await tx.tag.findFirst({ where: { userId, name: tagName } })
        ?? await tx.tag.create({ data: { userId, name: tagName } });

      await tx.itemTag.create({ data: { itemId: id, tagId: tag.id } });
    }

    await tx.itemCollection.deleteMany({ where: { itemId: id } });

    for (const collection of ownedCollections) {
      await tx.itemCollection.create({ data: { itemId: id, collectionId: collection.id } });
    }
  });

  const updated = await prisma.item.findUnique({
    where: { id },
    include: itemDetailInclude
  });

  return updated ? mapItemDetail(updated) : null;
}

export interface CreateItemInput {
  typeName: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
  collectionIds: string[];
}

export async function createItem(userId: string, data: CreateItemInput) {
  const type = await prisma.itemType.findFirst({
    where: {
      name: { equals: data.typeName, mode: "insensitive" },
      OR: [{ isSystem: true }, { userId }],
    },
  });
  if (!type) return null;

  const ownedCollections = data.collectionIds.length > 0
    ? await prisma.collection.findMany({
        where: { id: { in: data.collectionIds }, userId },
        select: { id: true },
      })
    : [];

  const created = await prisma.$transaction(async (tx) => {
    const item = await tx.item.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        url: data.url,
        language: data.language,
        contentType: "text",
        userId,
        typeId: type.id,
      },
    });

    for (const tagName of data.tags) {
      const tag = await tx.tag.findFirst({ where: { userId, name: tagName } })
        ?? await tx.tag.create({ data: { userId, name: tagName } });

      await tx.itemTag.create({ data: { itemId: item.id, tagId: tag.id } });
    }

    for (const collection of ownedCollections) {
      await tx.itemCollection.create({ data: { itemId: item.id, collectionId: collection.id } });
    }

    return item;
  });

  const full = await prisma.item.findUnique({
    where: { id: created.id },
    include: itemDetailInclude,
  });

  return full ? mapItemDetail(full) : null;
}

export async function deleteItem(userId: string, id: string) {
  const existing = await prisma.item.findUnique({ where: { id, userId } });
  if (!existing) return false;

  await prisma.$transaction(async (tx) => {
    await tx.itemTag.deleteMany({ where: { itemId: id } });
    await tx.item.delete({ where: { id } });
  });

  return true;
}

export const getItemsByType = cache(async (userId: string, typeName: string, page = 1) => {
  if (userId === "guest-id") return { items: [], totalCount: 0 };

  const where = {
    userId,
    type: {
      name: typeName
    }
  };

  const [items, totalCount] = await Promise.all([
    prisma.item.findMany({
      where,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { updatedAt: 'desc' },
      include: {
        type: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    }),
    prisma.item.count({ where }),
  ]);

  return {
    items: items.map(item => ({
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
    })),
    totalCount,
  };
});
