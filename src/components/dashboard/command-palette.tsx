"use client";

import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import { getIcon } from "@/server/icons";
import { useItemDrawer } from "@/components/dashboard/item-drawer-context";
import { encodeSearchValue, searchValueFilter } from "@/server/search-filter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface SearchItem {
  id: string;
  title: string;
  contentPreview: string;
  type: { id: string; name: string; icon: string | null; color: string | null };
}

export interface SearchCollection {
  id: string;
  name: string;
  itemCount: number;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItem[];
  collections: SearchCollection[];
}

export function CommandPalette({ open, onOpenChange, items, collections }: CommandPaletteProps) {
  const router = useRouter();
  const { openItem } = useItemDrawer();

  function handleSelectItem(id: string) {
    onOpenChange(false);
    openItem(id);
  }

  function handleSelectCollection(id: string) {
    onOpenChange(false);
    router.push(`/collections/${id}`);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search items and collections"
      filter={searchValueFilter}
    >
      <CommandInput placeholder="Search items and collections..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {items.length > 0 && (
          <CommandGroup heading="Items">
            {items.map((item) => {
              const Icon = getIcon(item.type.icon || "file");
              return (
                <CommandItem
                  key={item.id}
                  value={encodeSearchValue(item.title, item.contentPreview)}
                  onSelect={() => handleSelectItem(item.id)}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: item.type.color || undefined }} />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{item.title}</span>
                    {item.contentPreview && (
                      <span className="truncate text-xs text-muted-foreground">
                        {item.contentPreview}
                      </span>
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        {collections.length > 0 && (
          <CommandGroup heading="Collections">
            {collections.map((collection) => (
              <CommandItem
                key={collection.id}
                value={encodeSearchValue(collection.name)}
                onSelect={() => handleSelectCollection(collection.id)}
              >
                <Folder className="h-4 w-4 shrink-0 text-primary" />
                <span className="flex-1 truncate">{collection.name}</span>
                <span className="text-xs text-muted-foreground">{collection.itemCount} items</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
