import type { EditorPreferences } from "@/types/editor-preferences";

export const ITEMS_PER_PAGE = 21;
export const COLLECTIONS_PER_PAGE = 21;

export const DASHBOARD_COLLECTIONS_LIMIT = 6;
export const DASHBOARD_RECENT_ITEMS_LIMIT = 10;

export const DEFAULT_EDITOR_PREFERENCES: EditorPreferences = {
  fontSize: 13,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  theme: "vs-dark",
};

export const EDITOR_FONT_SIZE_OPTIONS = [12, 13, 14, 16, 18, 20];
export const EDITOR_TAB_SIZE_OPTIONS = [2, 4, 8];
export const EDITOR_THEME_OPTIONS: { value: EditorPreferences["theme"]; label: string }[] = [
  { value: "vs-dark", label: "VS Dark" },
  { value: "monokai", label: "Monokai" },
  { value: "github-dark", label: "GitHub Dark" },
];
