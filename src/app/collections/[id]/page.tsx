import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getCollectionWithItems } from "@/server/db/collections";
import { ItemCard } from "@/components/dashboard/item-card";
import { CollectionDetailActions } from "@/components/dashboard/collection-detail-actions";
import { PaginationControls } from "@/components/dashboard/pagination-controls";
import { ITEMS_PER_PAGE } from "@/server/constants";
import DashboardLayout from "../../dashboard/layout";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const collection = await getCollectionWithItems(session.user.id, id, page);

  if (!collection) {
    notFound();
  }

  const totalPages = Math.ceil(collection.totalItemCount / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-3xl font-bold tracking-tight">{collection.name}</h2>
            {collection.description && (
              <p className="text-muted-foreground">{collection.description}</p>
            )}
          </div>
          <CollectionDetailActions
            collectionId={collection.id}
            name={collection.name}
            description={collection.description}
            isFavorite={collection.isFavorite}
          />
        </div>

        {collection.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">No items in this collection yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collection.items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              basePath={`/collections/${id}`}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
