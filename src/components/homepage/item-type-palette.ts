// Mirrors the real system ItemType rows seeded in prisma/seed.ts, so the
// marketing page's colors/icons never drift from what users actually see
// in the app. Hardcoded (not fetched) since this page is public/unauthenticated.
export const ITEM_TYPE_PALETTE = {
  snippet: { color: "#3b82f6", icon: "Code" },
  prompt: { color: "#8b5cf6", icon: "Sparkles" },
  command: { color: "#f97316", icon: "Terminal" },
  note: { color: "#fde047", icon: "StickyNote" },
  file: { color: "#6b7280", icon: "File" },
  image: { color: "#ec4899", icon: "Image" },
  url: { color: "#10b981", icon: "Link" },
} as const;
