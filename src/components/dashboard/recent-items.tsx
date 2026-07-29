"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, Clock, Check, Copy, Star, Pin, MoreVertical, Plus } from "lucide-react";
import { getIcon } from "@/server/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/server/utils";
import { useItemDrawer } from "@/components/dashboard/item-drawer-context";
import { toggleItemFavorite, toggleItemPin } from "@/actions/items";

interface RecentItem {
  id: string;
  title: string;
  description: string | null;
  content?: string | null;
  url?: string | null;
  type: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
  collections: {
    id: string;
    name: string;
  }[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
}

interface RecentItemsProps {
  items: RecentItem[];
}

export function RecentItems({ items }: RecentItemsProps) {
  const { openItem } = useItemDrawer();
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(e: MouseEvent, id: string, value: string) {
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleToggleFavorite(id: string) {
    const result = await toggleItemFavorite(id);
    if (!result.success) {
      toast.error(result.error ?? "Failed to update favorite.");
      return;
    }
    router.refresh();
  }

  async function handleTogglePin(id: string) {
    const result = await toggleItemPin(id);
    if (!result.success) {
      toast.error(result.error ?? "Failed to update pin.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Items
        </h3>
        {items.length > 0 && (
          <button className="text-sm text-muted-foreground hover:text-primary flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 p-12 flex flex-col items-start text-left">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h4 className="text-base font-medium text-muted-foreground">Your stash is empty</h4>
          <p className="text-sm text-muted-foreground max-w-[500px] mt-1">
            Start by adding your first code snippet, prompt, or command to see it here.
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <div className="p-0">
            <div className="hidden md:grid grid-cols-[1fr_200px_150px_100px] gap-4 p-4 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div>Title</div>
              <div>Collection</div>
              <div>Tags</div>
              <div className="text-right">Added</div>
            </div>
            <div className="divide-y">
              {items.map((item) => {
                const Icon = getIcon(item.type.icon || 'file');
                const borderColor = item.type.color || 'var(--color-primary)';
                const copyValue = item.content || item.url;

                return (
                  <div
                    key={item.id}
                    onClick={() => openItem(item.id)}
                    className="group relative overflow-hidden grid grid-cols-[1fr_auto] md:grid-cols-[1fr_200px_150px_100px] gap-4 p-4 items-center hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: borderColor }} />
                    <div
                      className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      style={{
                        padding: '1px',
                        background: borderColor,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }}
                    />
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                        <Icon className="h-4 w-4" style={{ color: item.type.color || undefined }} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{item.title}</span>
                          {item.isFavorite && (
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate md:hidden">
                          {item.collections.length > 0
                            ? item.collections.map((c) => c.name).join(", ")
                            : "No collection"}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-1 overflow-hidden">
                      {item.collections.length > 0 ? (
                        <>
                          <Badge variant="outline" className="font-normal text-[11px] h-5 px-2 shrink-0">
                            {item.collections[0].name}
                          </Badge>
                          {item.collections.length > 1 && (
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              +{item.collections.length - 1}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None</span>
                      )}
                    </div>
                    
                    <div className="hidden md:flex items-center gap-1 overflow-hidden">
                      {item.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal text-[10px] h-5 px-2">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{item.tags.length - 2}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground hidden md:inline">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      {copyValue && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 transition-opacity",
                            copiedId === item.id ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          )}
                          onClick={(e) => handleCopy(e, item.id, copyValue)}
                          aria-label="Copy content"
                        >
                          {copiedId === item.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      )}
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onSelect={() => handleToggleFavorite(item.id)} className="cursor-pointer">
                            <Star className={item.isFavorite ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                            {item.isFavorite ? "Unfavorite" : "Favorite"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleTogglePin(item.id)} className="cursor-pointer">
                            <Pin className={item.isPinned ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                            {item.isPinned ? "Unpin" : "Pin"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
