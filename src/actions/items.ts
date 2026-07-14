"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/server/prisma";
import {
  updateItem as updateItemQuery,
  deleteItem as deleteItemQuery,
  createItem as createItemQuery,
} from "@/server/db/items";

const ITEM_TYPE_NAMES = ["snippet", "prompt", "command", "note", "link"] as const;

const createItemSchema = z
  .object({
    type: z.enum(ITEM_TYPE_NAMES),
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().nullable().optional().default(null),
    content: z.string().nullable().optional().default(null),
    url: z.preprocess(
      (v) => (v === "" ? null : v),
      z.string().url("Invalid URL").nullable().optional().default(null)
    ),
    language: z.string().nullable().optional().default(null),
    tags: z.array(z.string().trim().min(1)).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.type === "link" && !data.url) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "URL is required", path: ["url"] });
    }
  });

export type CreateItemPayload = z.input<typeof createItemSchema>;

const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().nullable().optional().default(null),
  content: z.string().nullable().optional().default(null),
  url: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().url("Invalid URL").nullable().optional().default(null)
  ),
  language: z.string().nullable().optional().default(null),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type UpdateItemPayload = z.input<typeof updateItemSchema>;

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

export async function updateItem(itemId: string, payload: UpdateItemPayload) {
  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Unauthorized" };

  const parsed = updateItemSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const updated = await updateItemQuery(session.user.id, itemId, parsed.data);
  if (!updated) return { success: false as const, error: "Item not found" };

  return { success: true as const, data: updated };
}

export async function createItem(payload: CreateItemPayload) {
  const session = await auth();
  if (!session?.user?.id) return { success: Boolean(false), error: "Unauthorized" };

  const parsed = createItemSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: Boolean(false), error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { type, ...rest } = parsed.data;
  const created = await createItemQuery(session.user.id, { typeName: type, ...rest });
  if (!created) return { success: Boolean(false), error: "Invalid item type" };

  return { success: Boolean(true), data: created };
}

export async function deleteItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: Boolean(false), error: "Unauthorized" };

  const deleted = await deleteItemQuery(session.user.id, itemId);
  if (!deleted) return { success: Boolean(false), error: "Item not found" };

  return { success: Boolean(true) };
}
