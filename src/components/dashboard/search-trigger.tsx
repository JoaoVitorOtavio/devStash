"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "@/components/dashboard/command-palette-context";

export function SearchTrigger() {
  const { open } = useCommandPalette();

  return (
    <button
      type="button"
      onClick={open}
      className="group relative w-full max-w-md cursor-pointer text-left"
    >
      <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <span className="flex h-9 w-full items-center rounded-md border border-input bg-background/50 pl-9 pr-3 text-sm text-muted-foreground shadow-sm transition-colors group-hover:bg-background">
        Search items...
      </span>
      <div className="absolute right-2 top-1.5 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </div>
    </button>
  );
}
