"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemCreateDialog } from "@/components/dashboard/item-create-dialog";

interface ItemCreateButtonProps {
  collections: { id: string; name: string }[];
}

export function ItemCreateButton({ collections }: ItemCreateButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="h-9" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        <span>New Item</span>
      </Button>
      <ItemCreateDialog open={open} onOpenChange={setOpen} collections={collections} />
    </>
  );
}
