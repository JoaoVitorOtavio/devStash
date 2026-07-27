"use server";

import { auth } from "@/auth";
import { prisma } from "@/server/prisma";
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
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = editorPreferencesSchema.safeParse(preferences);
  if (!parsed.success) {
    return { success: false, error: "Invalid editor preferences." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { editorPreferences: parsed.data },
  });

  return { success: true, data: parsed.data };
}
