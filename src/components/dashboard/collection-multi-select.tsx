"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/server/utils";

interface Collection {
  id: string;
  name: string;
}

interface CollectionMultiSelectProps {
  collections: Collection[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function CollectionMultiSelect({ collections, selectedIds, onChange }: CollectionMultiSelectProps) {
  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
  }

  if (collections.length === 0) {
    return <p className="text-xs text-muted-foreground italic">No collections yet</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {collections.map((collection) => {
        const selected = selectedIds.includes(collection.id);
        return (
          <Badge
            key={collection.id}
            variant={selected ? "default" : "outline"}
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
            onClick={() => toggle(collection.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(collection.id);
              }
            }}
            className={cn("cursor-pointer font-normal select-none", !selected && "hover:bg-accent")}
          >
            {collection.name}
          </Badge>
        );
      })}
    </div>
  );
}
