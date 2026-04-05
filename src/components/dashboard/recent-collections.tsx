import { ChevronRight, Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_COLLECTIONS, MOCK_ITEM_TYPES } from "@/lib/mock-data";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

export function RecentCollections() {
  // Take first 4 collections as "recent" for this prototype
  const recentCollections = MOCK_COLLECTIONS.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Recent Collections</h3>
        <button className="text-sm text-muted-foreground hover:text-primary flex items-center">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {recentCollections.map((collection) => {
          const firstType = MOCK_ITEM_TYPES.find(t => t.id === collection.types[0]);
          const borderColor = firstType?.color || 'var(--color-primary)';

          return (
            <Card 
              key={collection.id} 
              className="group cursor-pointer hover:border-primary/50 transition-colors border-l-4"
              style={{ borderLeftColor: borderColor }}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{collection.name}</CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-1">{collection.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-normal shrink-0">
                  {collection.itemCount}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mt-2">
                  {collection.types.slice(0, 4).map((typeId) => {
                    const type = MOCK_ITEM_TYPES.find(t => t.id === typeId);
                    if (!type) return null;
                    const Icon = getIcon(type.icon);
                    return (
                      <div 
                        key={typeId} 
                        className="h-6 w-6 rounded-md flex items-center justify-center bg-muted"
                        title={type.name}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
                      </div>
                    );
                  })}
                  {collection.types.length > 4 && (
                    <span className="text-[10px] text-muted-foreground">+{collection.types.length - 4}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
