"use client";

import { useState } from "react";
import { Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionEditDialog } from "@/components/dashboard/collection-edit-dialog";
import { CollectionDeleteDialog } from "@/components/dashboard/collection-delete-dialog";

interface CollectionDetailActionsProps {
  collectionId: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
}

export function CollectionDetailActions({ collectionId, name, description, isFavorite }: CollectionDetailActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-label="Favorite collection" className="cursor-pointer">
        <Star className={isFavorite ? "h-4 w-4 fill-current" : "h-4 w-4"} />
      </Button>
      <Button variant="outline" size="icon" aria-label="Edit collection" className="cursor-pointer" onClick={() => setEditOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Delete collection" className="cursor-pointer" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <CollectionEditDialog
        collectionId={collectionId}
        name={name}
        description={description}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <CollectionDeleteDialog
        collectionId={collectionId}
        name={name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        redirectTo="/collections"
      />
    </div>
  );
}
