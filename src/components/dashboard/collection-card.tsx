import Link from "next/link";
import { Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "@/server/icons";

interface CollectionType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CollectionCardProps {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
  types: CollectionType[];
}

export function CollectionCard({ id, name, description, itemCount, types }: CollectionCardProps) {
  // Generate gradient string from type colors
  const typeColors = types.map(t => t.color);
  const gradient = typeColors.length > 1
    ? `linear-gradient(to bottom, ${typeColors.join(', ')})`
    : typeColors[0] || 'var(--color-primary)';

  return (
    <Link href={`/collections/${id}`}>
      <Card className="group cursor-pointer transition-all duration-300 relative overflow-hidden border-transparent hover:shadow-md">
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
          items: {itemCount}
        </div>

        <CardHeader className="flex flex-row items-start space-y-0 pb-2 pl-6 pr-6">
          <div className="flex items-center gap-3 w-full min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate">{name}</CardTitle>
              <p
                className="text-xs text-muted-foreground line-clamp-1"
                title={description || ""}
              >
                {description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-6">
          <div className="flex items-center gap-2 mt-2 min-h-6">
            {types.slice(0, 4).map((type) => {
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
            {types.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{types.length - 4}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
