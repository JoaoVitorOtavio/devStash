"use client";

import { useState, type MouseEvent } from "react";
import { ChevronRight, Check, Copy, Pin, Star } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "@/server/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/server/utils";
import { useItemDrawer } from "@/components/dashboard/item-drawer-context";

interface PinnedItem {
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
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
}

interface PinnedItemsProps {
  items: PinnedItem[];
}

export function PinnedItems({ items }: PinnedItemsProps) {
  const { openItem } = useItemDrawer();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(e: MouseEvent, id: string, value: string) {
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Pin className="h-5 w-5 fill-amber-500 text-amber-500" />
          Pinned Items
        </h3>
        {items.length > 0 && (
          <button className="text-sm text-muted-foreground hover:text-primary flex items-center cursor-pointer">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardHeader className="p-8 flex flex-col items-start text-left">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Pin className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-base font-medium text-muted-foreground">No pinned items yet</CardTitle>
            <p className="text-sm text-muted-foreground max-w-[400px] mt-1">
              Pin your most important code snippets or commands for quick access.
            </p>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => {
            const Icon = getIcon(item.type.icon || 'file');
            const borderColor = item.type.color || 'var(--color-primary)';
            const copyValue = item.content || item.url;

            return (
              <Card
                key={item.id}
                onClick={() => openItem(item.id)}
                className="group cursor-pointer transition-all duration-200 relative overflow-hidden border-transparent"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: borderColor }} />
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    padding: '1px',
                    background: borderColor,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5" style={{ color: item.type.color || undefined }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-bold">{item.title}</CardTitle>
                        {item.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex gap-1.5">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="hidden sm:inline w-12 text-right">
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
                        {copiedId === item.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
