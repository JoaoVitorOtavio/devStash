import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllCollectionsWithStats } from "@/server/db/collections";
import { CollectionCard } from "@/components/dashboard/collection-card";
import { PaginationControls } from "@/components/dashboard/pagination-controls";
import { COLLECTIONS_PER_PAGE } from "@/server/constants";
import DashboardLayout from "../dashboard/layout";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { collections, totalCount } = await getAllCollectionsWithStats(session.user.id, page);
  const totalPages = Math.ceil(totalCount / COLLECTIONS_PER_PAGE);

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} {...collection} />
              ))}
            </div>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              basePath="/collections"
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
