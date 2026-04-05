import { ChevronRight, Clock, Star, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ITEMS, MOCK_ITEM_TYPES, MOCK_COLLECTIONS } from "@/lib/mock-data";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecentItems() {
  // Sort items by date (desc) and take top 10
  const recentItems = [...MOCK_ITEMS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Items
        </h3>
        <button className="text-sm text-muted-foreground hover:text-primary flex items-center">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="rounded-xl border bg-card">
        <div className="p-0">
          <div className="hidden md:grid grid-cols-[1fr_200px_150px_100px] gap-4 p-4 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div>Title</div>
            <div>Collection</div>
            <div>Tags</div>
            <div className="text-right">Added</div>
          </div>
          <div className="divide-y">
            {recentItems.map((item) => {
              const type = MOCK_ITEM_TYPES.find(t => t.id === item.typeId);
              const collection = MOCK_COLLECTIONS.find(c => c.id === item.collectionId);
              const Icon = getIcon(type?.icon || 'file');
              const borderColor = type?.color || 'var(--color-primary)';
              
              return (
                <div 
                  key={item.id} 
                  className="group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_200px_150px_100px] gap-4 p-4 items-center hover:bg-muted/50 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-current"
                  style={{ borderLeftColor: borderColor }}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                      <Icon className="h-4 w-4" style={{ color: type?.color }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{item.title}</span>
                        {item.isFavorite && (
                          <Star className="h-3 w-3 fill-rose-500 text-rose-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate md:hidden">
                        {collection?.name || "No collection"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center">
                    {collection ? (
                      <Badge variant="outline" className="font-normal text-[11px] h-5 px-2">
                        {collection.name}
                      </Badge>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
