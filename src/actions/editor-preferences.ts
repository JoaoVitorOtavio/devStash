"use server";

import { prisma } from "@/server/prisma";
import { requireUserId } from "@/server/auth-utils";
import { z } from "zod";
import type { EditorPreferences } from "@/types/editor-preferences";

const editorPreferencesSchema = z.object({
  fontSize: z.number().int().min(10).max(24),
  tabSize: z.number().int().min(1).max(8),
  wordWrap: z.boolean(),
  minimap: z.boolean(),
  theme: z.enum(["vs-dark", "monokai", "github-dark"]),
});

export async function updateEditorPreferences(preferences: EditorPreferences) {
  const { userId, error } = await requireUserId();
  if (!userId) return { success: false, error };

  const parsed = editorPreferencesSchema.safeParse(preferences);
  if (!parsed.success) {
    return { success: false, error: "Invalid editor preferences." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { editorPreferences: parsed.data },
  });

  return { success: true, data: parsed.data };
}
