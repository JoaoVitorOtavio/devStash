"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CollectionEditDialog } from "@/components/dashboard/collection-edit-dialog";
import { CollectionDeleteDialog } from "@/components/dashboard/collection-delete-dialog";

interface CollectionCardMenuProps {
  collectionId: string;
  name: string;
  description: string | null;
  isFavorite?: boolean;
}

export function CollectionCardMenu({ collectionId, name, description, isFavorite }: CollectionCardMenuProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [favorite, setFavorite] = useState(Boolean(isFavorite));

  async function handleToggleFavorite() {
    const previous = favorite;
    setFavorite(!previous);

    const response = await fetch(`/api/collections/${collectionId}/favorite`, { method: "PATCH" });
    const result = await response.json();

    if (!result.success) {
      setFavorite(previous);
      toast.error(result.error ?? "Failed to update favorite.");
      return;
    }

    router.refresh();
  }

  // The trigger button is a real DOM descendant of the card's Link, so a plain
  // click bubbles natively to it and would navigate — block both the synthetic
  // bubble and the browser's default anchor action.
  function stopTriggerNavigation(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  // The dialogs render into a portal outside the card's DOM, so there's no
  // native anchor action to block here — only React's fiber-tree bubbling
  // (portals still bubble to their React ancestors) needs stopping. Calling
  // preventDefault() here would also cancel the Save/Delete buttons' own
  // native click behavior (e.g. form submission), so it must be omitted.
  function stopDialogNavigation(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <>
      <div className="absolute top-2 right-2 z-10" onClick={stopTriggerNavigation}>
        {/* modal=false: this menu only ever triggers a Dialog/AlertDialog on
            select. Radix's default modal DropdownMenu and the modal Dialog it
            opens both lock document.body's pointer-events, and their lock/
            unlock cycles can race, leaving the body stuck as unclickable.
            The dropdown doesn't need its own modal lock, so disable it. */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)} className="cursor-pointer">
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleToggleFavorite} className="cursor-pointer">
              <Star className={favorite ? "h-4 w-4 fill-current" : "h-4 w-4"} />
              {favorite ? "Unfavorite" : "Favorite"}
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
      </div>

      <div onClick={stopDialogNavigation}>
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
      </div>
    </>
  );
}
