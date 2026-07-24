import { Suspense } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { LoginToast } from "@/components/auth/login-toast";
import { ItemDrawerProvider } from "@/components/dashboard/item-drawer-context";
import { CommandPaletteProvider } from "@/components/dashboard/command-palette-context";
import { SearchTrigger } from "@/components/dashboard/search-trigger";
import { ItemCreateButton } from "@/components/dashboard/item-create-button";
import { CollectionCreateButton } from "@/components/dashboard/collection-create-button";
import { getItemTypes, getAllItemsForSearch } from "@/server/db/items";
import { getAllCollections, getAllCollectionsForSearch, getRecentCollections } from "@/server/db/collections";
import { DASHBOARD_COLLECTIONS_LIMIT } from "@/server/constants";
import { getUserProfile } from "@/server/db/user";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await getUserProfile(session.user.email!);

  const [itemTypes, collections, recentCollections, searchItems, searchCollections] = await Promise.all([
    getItemTypes(user.id),
    getAllCollections(user.id),
    getRecentCollections(user.id, DASHBOARD_COLLECTIONS_LIMIT),
    getAllItemsForSearch(user.id),
    getAllCollectionsForSearch(user.id),
  ]);

  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <LoginToast />
      </Suspense>
      <AppSidebar itemTypes={itemTypes} collections={collections} recentCollections={recentCollections} user={user} />
      <SidebarInset>
        <ItemDrawerProvider collections={collections}>
          <CommandPaletteProvider items={searchItems} collections={searchCollections}>
            <div className="flex flex-col w-full">
              <header className="fixed top-0 right-0 left-0 h-16 flex items-center gap-2 border-b border-sidebar-border px-4 bg-card/50 backdrop-blur-sm z-40 md:peer-data-[state=expanded]:left-[var(--sidebar-width)] md:peer-data-[collapsible=icon]:left-[var(--sidebar-width-icon)]">
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <SearchTrigger />
                </div>
                <div className="flex items-center gap-3">
                  <CollectionCreateButton />
                  <ItemCreateButton collections={collections} />
                </div>
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4 pt-20 overflow-y-auto">
                <div className="min-h-full flex-1">{children}</div>
              </main>
            </div>
          </CommandPaletteProvider>
        </ItemDrawerProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
