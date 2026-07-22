"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CollectionDeleteDialogProps {
  collectionId: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
}

export function CollectionDeleteDialog({ collectionId, name, open, onOpenChange, redirectTo }: CollectionDeleteDialogProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDeleting(true);

    try {
      const response = await fetch(`/api/collections/${collectionId}`, { method: "DELETE" });
      const result = await response.json();

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete collection.");
        return;
      }

      onOpenChange(false);
      toast.success("Collection deleted.");

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-popover text-popover-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the collection. Items inside it will not be deleted — they will just no longer belong to this collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
