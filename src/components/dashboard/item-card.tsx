"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Copy, Pin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/server/utils"; // Assuming cn is available in utils
import { useItemDrawer } from "@/components/dashboard/item-drawer-context";
import { toggleItemFavorite, toggleItemPin } from "@/actions/items";

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description?: string | null;
    content?: string | null;
    url?: string | null;
    type: {
      name: string;
      color?: string | null;
    };
    tags: string[];
    isFavorite: boolean;
    isPinned: boolean;
  };
}

export function ItemCard({ item }: ItemCardProps) {
  const { openItem } = useItemDrawer();
  const router = useRouter();
  const accentColor = item.type.color || 'var(--border)';
  const gradient = `linear-gradient(to bottom, ${accentColor}, ${accentColor}aa)`;
  const copyValue = item.content || item.url;
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(item.isFavorite);
  const [pinned, setPinned] = useState(item.isPinned);

  async function handleCopy(e: MouseEvent) {
    e.stopPropagation();
    if (!copyValue) return;
    await navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleToggleFavorite(e: MouseEvent) {
    e.stopPropagation();
    const previous = favorite;
    setFavorite(!previous);

    const result = await toggleItemFavorite(item.id);

    if (!result.success) {
      setFavorite(previous);
      toast.error(result.error ?? "Failed to update favorite.");
      return;
    }

    router.refresh();
  }

  async function handleTogglePin(e: MouseEvent) {
    e.stopPropagation();
    const previous = pinned;
    setPinned(!previous);

    const result = await toggleItemPin(item.id);

    if (!result.success) {
      setPinned(previous);
      toast.error(result.error ?? "Failed to update pin.");
      return;
    }

    router.refresh();
  }

  return (
    <Card
      onClick={() => openItem(item.id)}
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-md border-transparent cursor-pointer",
      )}
    >
      {/* Full Border Gradient Overlay on Hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ 
          padding: '1px',
          background: gradient,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }} 
      />

      {/* Custom Left Border Gradient */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 z-10" 
        style={{ background: gradient }}
      />
      
      <div className="p-4 pl-5 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-none tracking-tight">{item.title}</h3>
          <div className="flex items-center gap-1">
             <Button
               variant="ghost"
               size="icon"
               className={cn(
                 "h-6 w-6 transition-opacity",
                 pinned ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
               )}
               onClick={handleTogglePin}
               aria-label="Toggle pin"
             >
               <Pin className={cn("h-3.5 w-3.5", pinned && "fill-amber-500 text-amber-500")} />
             </Button>
             <Button
               variant="ghost"
               size="icon"
               className={cn(
                 "h-6 w-6 transition-opacity",
                 favorite ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
               )}
               onClick={handleToggleFavorite}
               aria-label="Toggle favorite"
             >
               <Star className={cn("h-3.5 w-3.5", favorite && "fill-yellow-400 text-yellow-400")} />
             </Button>
             {copyValue && (
               <Button
                 variant="ghost"
                 size="icon"
                 className={cn(
                   "h-6 w-6 transition-opacity",
                   copied ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                 )}
                 onClick={handleCopy}
                 aria-label="Copy content"
               >
                 {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
               </Button>
             )}
          </div>
        </div>
        
        {item.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
