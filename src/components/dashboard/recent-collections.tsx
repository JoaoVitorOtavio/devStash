import Link from "next/link";
import { ChevronRight, Folder } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CollectionCard, type CollectionCardProps } from "@/components/dashboard/collection-card";

interface RecentCollectionsProps {
  collections: CollectionCardProps[];
}

export function RecentCollections({ collections }: RecentCollectionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Recent Collections</h3>
        {collections.length > 0 && (
          <Link href="/collections" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
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
          {collections.map((collection) => (
            <CollectionCard key={collection.id} {...collection} />
          ))}
        </div>
      )}
    </div>
  );
}
