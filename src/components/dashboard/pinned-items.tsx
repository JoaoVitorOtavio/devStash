import { ChevronRight, Pin, Star } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

interface PinnedItem {
  id: string;
  title: string;
  description: string | null;
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
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Pin className="h-5 w-5 fill-amber-500 text-amber-500" />
          Pinned Items
        </h3>
        <button className="text-sm text-muted-foreground hover:text-primary flex items-center">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="grid gap-4">
        {items.map((item) => {
          const Icon = getIcon(item.type.icon || 'file');
          const borderColor = item.type.color || 'var(--color-primary)';
          
          return (
            <Card 
              key={item.id} 
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
                      {item.isFavorite && <Star className="h-3 w-3 fill-rose-500 text-rose-500" />}
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
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
