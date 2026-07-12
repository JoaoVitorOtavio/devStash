"use server";

import { auth } from "@/auth";
import { prisma } from "@/server/prisma";

export async function toggleItemFavorite(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const item = await prisma.item.findUnique({ where: { id: itemId, userId: session.user.id } });
  if (!item) return { success: false, error: "Item not found" };

  const updated = await prisma.item.update({
    where: { id: itemId },
    data: { isFavorite: !item.isFavorite },
  });

  return { success: true, data: { isFavorite: updated.isFavorite } };
}

export async function toggleItemPin(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const item = await prisma.item.findUnique({ where: { id: itemId, userId: session.user.id } });
  if (!item) return { success: false, error: "Item not found" };

  const updated = await prisma.item.update({
    where: { id: itemId },
    data: { isPinned: !item.isPinned },
  });

  return { success: true, data: { isPinned: updated.isPinned } };
}
