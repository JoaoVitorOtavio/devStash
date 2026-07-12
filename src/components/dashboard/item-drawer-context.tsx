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

export function ItemDrawerProvider({ children }: { children: ReactNode }) {
  const [itemId, setItemId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const openItem = useCallback((id: string) => {
    setItemId(id);
    setOpen(true);
  }, []);

  return (
    <ItemDrawerContext.Provider value={{ openItem }}>
      {children}
      <ItemDrawer itemId={itemId} open={open} onOpenChange={setOpen} />
    </ItemDrawerContext.Provider>
  );
}
