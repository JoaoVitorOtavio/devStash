import { prisma } from "@/server/prisma";
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

const itemDetailInclude = {
  type: true,
  collection: true,
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
  collection: { id: string; name: string } | null;
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
    collection: item.collection ? {
      id: item.collection.id,
      name: item.collection.name
    } : null,
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
}

export async function updateItem(userId: string, id: string, data: UpdateItemInput) {
  const existing = await prisma.item.findUnique({ where: { id, userId } });
  if (!existing) return null;

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
  });

  const updated = await prisma.item.findUnique({
    where: { id },
    include: itemDetailInclude
  });

  return updated ? mapItemDetail(updated) : null;
}

export const getItemsByType = cache(async (userId: string, typeName: string) => {
  if (userId === "guest-id") return [];

  const items = await prisma.item.findMany({
    where: {
      userId,
      type: {
        name: typeName
      }
    },
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
