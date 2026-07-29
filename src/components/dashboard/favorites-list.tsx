"use client";

import Link from "next/link";
import { Folder, Star } from "lucide-react";
import { getIcon } from "@/server/icons";
import { useItemDrawer } from "@/components/dashboard/item-drawer-context";

interface FavoriteItem {
  id: string;
  title: string;
  type: {
    name: string;
    icon: string | null;
    color: string | null;
  };
  updatedAt: Date;
}

interface FavoriteCollection {
  id: string;
  name: string;
  itemCount: number;
  types: { id: string; color: string; count: number }[];
  primaryColor: string;
  updatedAt: Date;
}

interface FavoritesListProps {
  items: FavoriteItem[];
  collections: FavoriteCollection[];
}

function formatDate(date: Date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function collectionGradient(collection: FavoriteCollection) {
  const colors = collection.types.map((t) => t.color).filter(Boolean);

  if (colors.length === 0) return collection.primaryColor || "var(--color-primary)";
  if (colors.length === 1) return colors[0];

  const used = colors.slice(0, 3).join(", ");
  return `linear-gradient(135deg, ${used})`;
}

function HoverBorder({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        padding: "1px",
        background: color,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
}

export function FavoritesList({ items, collections }: FavoritesListProps) {
  const { openItem } = useItemDrawer();

  if (items.length === 0 && collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-mono text-sm">
        <Star className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No favorites yet.</p>
        <p className="text-muted-foreground/70 mt-1">Star items and collections to see them here.</p>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm space-y-8">
      <section>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Items <span className="text-muted-foreground/60">({items.length})</span>
        </h3>
        {items.length === 0 ? (
          <p className="text-muted-foreground/70 py-2">No favorite items.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = getIcon(item.type.icon || "file");
              const accentColor = item.type.color || "var(--border)";
              return (
                <div
                  key={item.id}
                  onClick={() => openItem(item.id)}
                  className="group relative flex items-center gap-3 pl-3 pr-3 py-2.5 md:py-2 rounded-md border border-transparent bg-card cursor-pointer transition-colors overflow-hidden"
                >
                  <HoverBorder color={accentColor} />
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ background: accentColor }}
                  />
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: item.type.color || undefined }} />
                  <span className="flex-1 truncate min-w-0">{item.title}</span>
                  <span className="hidden md:inline shrink-0 text-xs text-muted-foreground">{item.type.name}</span>
                  <span className="hidden md:inline shrink-0 w-24 text-right text-xs text-muted-foreground/70">
                    {formatDate(item.updatedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Collections <span className="text-muted-foreground/60">({collections.length})</span>
        </h3>
        {collections.length === 0 ? (
          <p className="text-muted-foreground/70 py-2">No favorite collections.</p>
        ) : (
          <div className="space-y-2">
            {collections.map((collection) => {
              const gradient = collectionGradient(collection);
              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  className="group relative flex items-center gap-3 pl-3 pr-3 py-2.5 md:py-2 rounded-md border border-transparent bg-card cursor-pointer transition-colors overflow-hidden"
                >
                  <HoverBorder color={gradient} />
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ background: gradient }}
                  />
                  <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate min-w-0">{collection.name}</span>
                  <span className="hidden md:inline shrink-0 text-xs text-muted-foreground">
                    {collection.itemCount} item{collection.itemCount === 1 ? "" : "s"}
                  </span>
                  <span className="hidden md:inline shrink-0 w-24 text-right text-xs text-muted-foreground/70">
                    {formatDate(collection.updatedAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
