import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllCollectionsWithStats } from "@/server/db/collections";
import { CollectionCard } from "@/components/dashboard/collection-card";
import DashboardLayout from "../dashboard/layout";

export default async function CollectionsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const collections = await getAllCollectionsWithStats(session.user.id);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Collections</h2>
          <p className="text-muted-foreground">
            All of your collections in one place.
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">No collections yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} {...collection} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
