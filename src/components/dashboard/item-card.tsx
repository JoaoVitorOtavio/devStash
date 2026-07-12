"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/server/utils"; // Assuming cn is available in utils
import { useItemDrawer } from "@/components/dashboard/item-drawer-context";

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description?: string | null;
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
  const accentColor = item.type.color || 'var(--border)';
  const gradient = `linear-gradient(to bottom, ${accentColor}, ${accentColor}aa)`;

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
          <div className="flex gap-1">
             {item.isPinned && (
               <Badge variant="secondary" className="h-5 px-1 text-[10px]">Pinned</Badge>
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
