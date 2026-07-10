import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getItemsByType, getItemTypes } from "@/server/db/items";
import { ItemCard } from "@/components/dashboard/item-card";
import DashboardLayout from "../../dashboard/layout";
import { notFound } from "next/navigation";

async function getTypeName(typeSlug: string, types: any[]) {
  const type = types.find(t => t.name.toLowerCase() === typeSlug.toLowerCase());
  return type ? type.name : null;
}

export default async function ItemsTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: typeSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const types = await getItemTypes(userId);
  const typeName = await getTypeName(typeSlug, types);

  if (!typeName) {
    notFound();
  }

  const items = await getItemsByType(userId, typeName);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight capitalize">
            {typeSlug} Items
          </h2>
          <p className="text-muted-foreground">
            Viewing all items of type {typeSlug}.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">No items found for this type.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
