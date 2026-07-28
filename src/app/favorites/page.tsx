import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFavoriteItems } from "@/server/db/items";
import { getFavoriteCollections } from "@/server/db/collections";
import { FavoritesList } from "@/components/dashboard/favorites-list";
import DashboardLayout from "../dashboard/layout";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const [items, collections] = await Promise.all([
    getFavoriteItems(session.user.id),
    getFavoriteCollections(session.user.id),
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Favorites</h2>
          <p className="text-muted-foreground">
            Everything you&apos;ve starred, in one place.
          </p>
        </div>

        <FavoritesList items={items} collections={collections} />
      </div>
    </DashboardLayout>
  );
}
