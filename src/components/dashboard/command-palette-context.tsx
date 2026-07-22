"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CommandPalette, type SearchItem, type SearchCollection } from "@/components/dashboard/command-palette";

interface CommandPaletteContextValue {
  open: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used within a CommandPaletteProvider");
  return ctx;
}

interface CommandPaletteProviderProps {
  children: ReactNode;
  items: SearchItem[];
  collections: SearchCollection[];
}

export function CommandPaletteProvider({ children, items, collections }: CommandPaletteProviderProps) {
  const [open, setOpen] = useState(false);

  const openPalette = useCallback(() => setOpen(true), []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ open: openPalette }}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} items={items} collections={collections} />
    </CommandPaletteContext.Provider>
  );
}
