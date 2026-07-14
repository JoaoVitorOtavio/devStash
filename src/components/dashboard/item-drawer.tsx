"use client";

import { useEffect, useState, type MouseEvent } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/dashboard/code-editor";
import { getIcon } from "@/server/icons";
import { cn } from "@/server/utils";
import { toggleItemFavorite, toggleItemPin, updateItem, deleteItem } from "@/actions/items";

const CONTENT_TYPES = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES = ["snippet", "command"];
const URL_TYPES = ["link"];

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

interface EditForm {
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
}

function toEditForm(item: ItemDetail): EditForm {
  return {
    title: item.title,
    description: item.description ?? "",
    content: item.content ?? "",
    url: item.url ?? "",
    language: item.language ?? "",
    tags: item.tags.join(", "),
  };
}

export function ItemDrawer({ itemId, open, onOpenChange }: ItemDrawerProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open || !itemId) return;

    let cancelled = false;
    setLoading(true);
    setItem(null);
    setMode("view");
    setForm(null);

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
    if (!item) return;
    setForm(toEditForm(item));
    setMode("edit");
  }

  function handleCancelEdit() {
    setForm(null);
    setMode("view");
  }

  async function handleSave() {
    if (!item || !form) return;

    setSaving(true);
    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const result = await updateItem(item.id, {
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags,
    });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error ?? "Failed to save changes.");
      return;
    }

    setItem({
      ...result.data,
      createdAt: new Date(result.data.createdAt).toISOString(),
      updatedAt: new Date(result.data.updatedAt).toISOString(),
    });
    setForm(null);
    setMode("view");
    toast.success("Item updated.");
    router.refresh();
  }

  async function handleConfirmDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!item) return;

    setDeleting(true);
    try {
      const result = await deleteItem(item.id);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete item.");
        return;
      }

      setDeleteDialogOpen(false);
      toast.success("Item deleted.");
      onOpenChange(false);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const Icon = item ? getIcon(item.type.icon || "file") : null;
  const typeName = item?.type.name.toLowerCase() ?? "";
  const showContent = CONTENT_TYPES.includes(typeName);
  const showLanguage = LANGUAGE_TYPES.includes(typeName);
  const showUrl = URL_TYPES.includes(typeName);
  const showCodeEditor = LANGUAGE_TYPES.includes(typeName);

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

            {mode === "edit" ? (
              <div className="mt-4 flex items-center justify-end gap-2 border-y py-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving || !form?.title.trim()}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
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
                  onClick={() => setDeleteDialogOpen(true)}
                  className="ml-auto text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  aria-label="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {mode === "edit" && form ? (
              <div className="mt-4 space-y-4 flex-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Title"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                  />
                </div>

                {showContent && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Content</label>
                    {showCodeEditor ? (
                      <CodeEditor
                        value={form.content}
                        onChange={(next) => setForm({ ...form, content: next })}
                        language={form.language}
                      />
                    ) : (
                      <Textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        placeholder="Content"
                        rows={8}
                        className="font-mono text-xs"
                      />
                    )}
                  </div>
                )}

                {showLanguage && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Language</label>
                    <Input
                      value={form.language}
                      onChange={(e) => setForm({ ...form, language: e.target.value })}
                      placeholder="e.g. javascript"
                    />
                  </div>
                )}

                {showUrl && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">URL</label>
                    <Input
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tags</label>
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <Separator />

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="capitalize">{item.type.name}</span>
                  </div>
                  {item.collection && (
                    <div className="flex justify-between">
                      <span>Collection</span>
                      <Badge variant="secondary" className="font-normal">{item.collection.name}</Badge>
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
            ) : (
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
                showCodeEditor ? (
                  <CodeEditor value={item.content} language={item.language} readOnly />
                ) : (
                  <pre className="rounded-lg bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap break-words">
                    {item.content}
                  </pre>
                )
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
            )}
          </div>
        )}
      </SheetContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-popover text-popover-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{item?.title}&quot;. This action cannot be undone.
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
    </Sheet>
  );
}
