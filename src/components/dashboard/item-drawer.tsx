"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Pin, Copy, Pencil, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getIcon } from "@/server/icons";
import { cn } from "@/server/utils";
import { toggleItemFavorite, toggleItemPin } from "@/actions/items";

interface ItemDetail {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  url: string | null;
  language: string | null;
  type: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
  collection: {
    id: string;
    name: string;
  } | null;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ItemDrawerProps {
  itemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDrawer({ itemId, open, onOpenChange }: ItemDrawerProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !itemId) return;

    let cancelled = false;
    setLoading(true);
    setItem(null);

    fetch(`/api/items/${itemId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load item");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load item details.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [itemId, open]);

  async function handleToggleFavorite() {
    if (!item) return;
    const previous = item.isFavorite;
    setItem({ ...item, isFavorite: !previous });
    const result = await toggleItemFavorite(item.id);
    if (!result.success) {
      setItem((current) => (current ? { ...current, isFavorite: previous } : current));
      toast.error(result.error ?? "Failed to update favorite.");
      return;
    }
    router.refresh();
  }

  async function handleTogglePin() {
    if (!item) return;
    const previous = item.isPinned;
    setItem({ ...item, isPinned: !previous });
    const result = await toggleItemPin(item.id);
    if (!result.success) {
      setItem((current) => (current ? { ...current, isPinned: previous } : current));
      toast.error(result.error ?? "Failed to update pin.");
      return;
    }
    router.refresh();
  }

  async function handleCopy() {
    if (!item?.content) return;
    await navigator.clipboard.writeText(item.content);
    toast.success("Copied to clipboard.");
  }

  function handleEdit() {
    toast.info("Editing is coming soon.");
  }

  function handleDelete() {
    toast.info("Deleting is coming soon.");
  }

  const Icon = item ? getIcon(item.type.icon || "file") : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {loading && (
          <div className="space-y-4">
            <SheetHeader>
              <SheetTitle className="sr-only">Loading item</SheetTitle>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </SheetHeader>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        )}

        {!loading && item && (
          <div className="flex h-full flex-col">
            <SheetHeader>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center"
                  style={{ color: item.type.color || undefined }}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <SheetTitle>{item.title}</SheetTitle>
                  <SheetDescription className="capitalize">{item.type.name}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-4 flex items-center gap-1 border-y py-2">
              <Button variant="ghost" size="icon" onClick={handleToggleFavorite} aria-label="Toggle favorite">
                <Star className={cn("h-4 w-4", item.isFavorite && "fill-yellow-400 text-yellow-400")} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleTogglePin} aria-label="Toggle pin">
                <Pin className={cn("h-4 w-4", item.isPinned && "fill-amber-500 text-amber-500")} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!item.content} aria-label="Copy content">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleEdit} aria-label="Edit item">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="ml-auto text-red-500 hover:text-red-400 hover:bg-red-500/10"
                aria-label="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-4 flex-1">
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {item.content && (
                <pre className="rounded-lg bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap break-words">
                  {item.content}
                </pre>
              )}

              {item.contentType === "file" && item.fileUrl && (
                item.type.name.toLowerCase() === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.fileUrl}
                    alt={item.fileName ?? item.title}
                    className="w-full rounded-lg border object-contain max-h-64"
                  />
                ) : (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border bg-muted p-3 text-sm hover:bg-muted/70 transition-colors"
                  >
                    <span className="truncate">{item.fileName ?? "Download file"}</span>
                    {item.fileSize != null && (
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {(item.fileSize / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </a>
                )
              )}

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline break-all"
                >
                  {item.url}
                </a>
              )}

              <Separator />

              <div className="space-y-2 text-xs text-muted-foreground">
                {item.collection && (
                  <div className="flex justify-between">
                    <span>Collection</span>
                    <Badge variant="secondary" className="font-normal">{item.collection.name}</Badge>
                  </div>
                )}
                {item.language && (
                  <div className="flex justify-between">
                    <span>Language</span>
                    <span className="capitalize">{item.language}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated</span>
                  <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
