import { ChevronRight, Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

interface CollectionType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CollectionProps {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
  isFavorite: boolean;
  primaryColor: string;
  types: CollectionType[];
}

interface RecentCollectionsProps {
  collections: CollectionProps[];
}

export function RecentCollections({ collections }: RecentCollectionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Recent Collections</h3>
        {collections.length > 0 && (
          <button className="text-sm text-muted-foreground hover:text-primary flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>

      {collections.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-8 flex flex-col items-start text-left">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Folder className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-base font-medium text-muted-foreground">No collections yet</CardTitle>
            <p className="text-sm text-muted-foreground max-w-[400px] mt-1">
              Create your first collection to organize your knowledge.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map((collection) => {
            // Generate gradient string from type colors
            const typeColors = collection.types.map(t => t.color);
            const gradient = typeColors.length > 1 
              ? `linear-gradient(to bottom, ${typeColors.join(', ')})`
              : typeColors[0] || 'var(--color-primary)';

            return (
              <Card 
                key={collection.id} 
                className="group cursor-pointer transition-all duration-300 relative overflow-hidden border-transparent hover:shadow-md"
              >
                {/* Hover Border Gradient/Color Overlay */}
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
                  className="absolute left-0 top-0 bottom-0 w-1" 
                  style={{ background: gradient }}
                />

                {/* Absolute Item Count Badge */}
                <div className="absolute bottom-3 right-3 text-[10px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded shadow-sm z-10">
                  items: {collection.itemCount}
                </div>
                
                <CardHeader className="flex flex-row items-start space-y-0 pb-2 pl-6 pr-6">
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Folder className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base truncate">{collection.name}</CardTitle>
                      <p 
                        className="text-xs text-muted-foreground line-clamp-1" 
                        title={collection.description || ""}
                      >
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pl-6">
                  <div className="flex items-center gap-2 mt-2">
                    {collection.types.slice(0, 4).map((type) => {
                      const Icon = getIcon(type.icon);
                      return (
                        <div 
                          key={type.id} 
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
      )}
    </div>
  );
}
