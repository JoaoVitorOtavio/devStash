"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionCreateDialog } from "@/components/dashboard/collection-create-dialog";

export function CollectionCreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" className="hidden sm:flex h-9" onClick={() => setOpen(true)}>
        <FolderPlus className="h-4 w-4 mr-2" />
        <span>New Collection</span>
      </Button>
      <CollectionCreateDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
