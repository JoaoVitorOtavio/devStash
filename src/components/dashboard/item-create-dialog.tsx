"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CodeEditor, LANGUAGE_OPTIONS, toMonacoLanguage } from "@/components/dashboard/code-editor";
import { MarkdownEditor } from "@/components/dashboard/markdown-editor";
import { CollectionMultiSelect } from "@/components/dashboard/collection-multi-select";
import { createItem } from "@/actions/items";
import { getIcon } from "@/server/icons";

const ITEM_TYPES = ["snippet", "prompt", "command", "note", "link"] as const;
type ItemTypeName = (typeof ITEM_TYPES)[number];

const CONTENT_TYPES: ItemTypeName[] = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES: ItemTypeName[] = ["snippet", "command"];
const URL_TYPES: ItemTypeName[] = ["link"];
const MARKDOWN_TYPES: ItemTypeName[] = ["prompt", "note"];

const TYPE_ICONS: Record<ItemTypeName, string> = {
  snippet: "code",
  prompt: "sparkles",
  command: "terminal",
  note: "sticky-note",
  link: "link",
};

const TYPE_COLORS: Record<ItemTypeName, string> = {
  snippet: "#3b82f6",
  prompt: "#8b5cf6",
  command: "#f97316",
  note: "#fde047",
  link: "#10b981",
};

interface CreateForm {
  type: ItemTypeName;
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
  collectionIds: string[];
}

const EMPTY_FORM: CreateForm = {
  type: "snippet",
  title: "",
  description: "",
  content: "",
  url: "",
  language: "",
  tags: "",
  collectionIds: [],
};

interface ItemCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collections: { id: string; name: string }[];
}

export function ItemCreateDialog({ open, onOpenChange, collections }: ItemCreateDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const showContent = CONTENT_TYPES.includes(form.type);
  const showLanguage = LANGUAGE_TYPES.includes(form.type);
  const showUrl = URL_TYPES.includes(form.type);
  const showCodeEditor = LANGUAGE_TYPES.includes(form.type);
  const showMarkdownEditor = MARKDOWN_TYPES.includes(form.type);

  function handleOpenChange(next: boolean) {
    if (!next) setForm(EMPTY_FORM);
    onOpenChange(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const result = await createItem({
      type: form.type,
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags,
      collectionIds: form.collectionIds,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error ?? "Failed to create item.");
      return;
    }

    toast.success("Item created.");
    setForm(EMPTY_FORM);
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <Select
              value={form.type}
              onValueChange={(value) => setForm({ ...form, type: value as ItemTypeName })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEM_TYPES.map((type) => {
                  const Icon = getIcon(TYPE_ICONS[type]);
                  return (
                    <SelectItem key={type} value={type} className="capitalize">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: TYPE_COLORS[type] }} />
                        {type}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              required
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

          {showLanguage && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Language</label>
              <Select
                value={toMonacoLanguage(form.language)}
                onValueChange={(value) => setForm({ ...form, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showContent && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Content</label>
              {showCodeEditor ? (
                <CodeEditor
                  value={form.content}
                  onChange={(next) => setForm({ ...form, content: next })}
                  language={form.language}
                />
              ) : showMarkdownEditor ? (
                <MarkdownEditor
                  value={form.content}
                  onChange={(next) => setForm({ ...form, content: next })}
                />
              ) : (
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Content"
                  rows={6}
                  className="font-mono text-xs"
                />
              )}
            </div>
          )}

          {showUrl && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">URL</label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                required
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

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Collections</label>
            <CollectionMultiSelect
              collections={collections}
              selectedIds={form.collectionIds}
              onChange={(collectionIds) => setForm({ ...form, collectionIds })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
