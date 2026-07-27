import { prisma } from "@/server/prisma";
import { cache } from "react";
import { DEFAULT_EDITOR_PREFERENCES } from "@/server/constants";
import type { EditorPreferences } from "@/types/editor-preferences";

export const getUserProfile = cache(async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isPro: true,
      createdAt: true,
      password: true,
    }
  });

  if (!user) {
    return {
      id: "guest-id",
      email: userEmail,
      name: "Guest User",
      image: "https://github.com/shadcn.png",
      isPro: false,
      createdAt: new Date(),
      hasPassword: false,
    };
  }

  const { password, ...safeUser } = user;

  return {
    ...safeUser,
    name: safeUser.name || "User", // Fallback
    image: safeUser.image || "https://github.com/shadcn.png", // Fallback
    hasPassword: !!password,
  };
});

const EDITOR_THEMES = ["vs-dark", "monokai", "github-dark"];

function mergeEditorPreferences(stored: unknown): EditorPreferences {
  if (!stored || typeof stored !== "object") return DEFAULT_EDITOR_PREFERENCES;
  const raw = stored as Record<string, unknown>;

  return {
    fontSize: typeof raw.fontSize === "number" ? raw.fontSize : DEFAULT_EDITOR_PREFERENCES.fontSize,
    tabSize: typeof raw.tabSize === "number" ? raw.tabSize : DEFAULT_EDITOR_PREFERENCES.tabSize,
    wordWrap: typeof raw.wordWrap === "boolean" ? raw.wordWrap : DEFAULT_EDITOR_PREFERENCES.wordWrap,
    minimap: typeof raw.minimap === "boolean" ? raw.minimap : DEFAULT_EDITOR_PREFERENCES.minimap,
    theme: typeof raw.theme === "string" && EDITOR_THEMES.includes(raw.theme)
      ? (raw.theme as EditorPreferences["theme"])
      : DEFAULT_EDITOR_PREFERENCES.theme,
  };
}

export const getEditorPreferences = cache(async (userId: string): Promise<EditorPreferences> => {
  if (userId === "guest-id") return DEFAULT_EDITOR_PREFERENCES;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { editorPreferences: true },
  });

  return mergeEditorPreferences(user?.editorPreferences);
});
