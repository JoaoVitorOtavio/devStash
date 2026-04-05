import { 
  FileText, 
  Folder, 
  Heart, 
  Pin 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MOCK_ITEMS, MOCK_COLLECTIONS } from "@/lib/mock-data";

export function StatsCards() {
  const totalItems = MOCK_ITEMS.length;
  const totalCollections = MOCK_COLLECTIONS.length;
  const favoriteItems = MOCK_ITEMS.filter(item => item.isFavorite).length;
  const favoriteCollections = MOCK_COLLECTIONS.filter(coll => coll.isFavorite).length;

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: FileText,
      description: "Across all collections",
      color: "text-blue-500",
    },
    {
      title: "Collections",
      value: totalCollections,
      icon: Folder,
      description: "Organized groups",
      color: "text-purple-500",
    },
    {
      title: "Favorite Items",
      value: favoriteItems,
      icon: Heart,
      description: "Marked as favorites",
      color: "text-rose-500",
    },
    {
      title: "Pinned Items",
      value: MOCK_ITEMS.filter(i => i.isPinned).length,
      icon: Pin,
      description: "Pinned for quick access",
      color: "text-amber-500",
    },
  ];

  // If the requirement specifically says "favorite collections"
  // but it usually makes more sense to show Pinned or something else.
  // I'll stick to what's most useful and fulfills the spirit of the spec.
  // The spec says: "number of items, collections, favorite items and favorite collections"
  
  const actualStats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: FileText,
      description: "Across all types",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Collections",
      value: totalCollections,
      icon: Folder,
      description: "Organized groups",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Favorite Items",
      value: favoriteItems,
      icon: Heart,
      description: "Quick access favorites",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Favorite Collections",
      value: favoriteCollections,
      icon: Heart, // Maybe use a different icon or Heart as well
      description: "Top collections",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actualStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
