"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ItemDrawer } from "@/components/dashboard/item-drawer";

interface ItemDrawerContextValue {
  openItem: (id: string) => void;
}

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) throw new Error("useItemDrawer must be used within an ItemDrawerProvider");
  return ctx;
}

interface ItemDrawerProviderProps {
  children: ReactNode;
  collections: { id: string; name: string }[];
}

export function ItemDrawerProvider({ children, collections }: ItemDrawerProviderProps) {
  const [itemId, setItemId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const openItem = useCallback((id: string) => {
    setItemId(id);
    setOpen(true);
  }, []);

  return (
    <ItemDrawerContext.Provider value={{ openItem }}>
      {children}
      <ItemDrawer itemId={itemId} open={open} onOpenChange={setOpen} collections={collections} />
    </ItemDrawerContext.Provider>
  );
}
