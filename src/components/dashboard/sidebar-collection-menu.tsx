"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { CollectionEditDialog } from "@/components/dashboard/collection-edit-dialog";
import { CollectionDeleteDialog } from "@/components/dashboard/collection-delete-dialog";

interface SidebarCollectionMenuProps {
  collectionId: string;
  name: string;
  description: string | null;
}

export function SidebarCollectionMenu({ collectionId, name, description }: SidebarCollectionMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      {/* modal=false: avoids the same body pointer-events lock race that
          CollectionCardMenu works around when opening a Dialog/AlertDialog
          from a DropdownMenuItem.onSelect. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onSelect={() => setEditOpen(true)} className="cursor-pointer">
            <Pencil className="h-4 w-4" />
            Edit Collection
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
      />
    </>
  );
}