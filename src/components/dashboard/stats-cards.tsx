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

interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
  pinnedItems: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const actualStats = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: FileText,
      description: "Across all types",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Collections",
      value: stats.totalCollections,
      icon: Folder,
      description: "Organized groups",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Favorite Items",
      value: stats.favoriteItems,
      icon: Heart,
      description: "Quick access favorites",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Pinned Items",
      value: stats.pinnedItems,
      icon: Pin,
      description: "Top items pinned",
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
