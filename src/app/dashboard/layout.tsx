import { Search, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { getItemTypes } from "@/lib/db/items";
import { getAllCollections } from "@/lib/db/collections";
import { getUserProfile } from "@/lib/db/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get email from session after implementing auth
  const userEmail = "demo@devstash.io";

  const [itemTypes, collections, user] = await Promise.all([
    getItemTypes(userEmail),
    getAllCollections(userEmail),
    getUserProfile(userEmail),
  ]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar itemTypes={itemTypes} collections={collections} user={user} />
      <SidebarInset>
        <div className="flex flex-col w-full">
          <header className="fixed top-0 right-0 left-0 h-16 flex items-center gap-2 border-b border-sidebar-border px-4 bg-card/50 backdrop-blur-sm z-40 md:peer-data-[state=expanded]:left-[var(--sidebar-width)] md:peer-data-[collapsible=icon]:left-[var(--sidebar-width-icon)]">
            <div className="flex items-center gap-2 flex-1 justify-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="relative max-w-md w-full group">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="pl-9 h-9 bg-background/50 focus:bg-background"
                />
                <div className="absolute right-2 top-1.5 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex h-9">
                <FolderPlus className="h-4 w-4 mr-2" />
                <span>New Collection</span>
              </Button>
              <Button size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                <span>New Item</span>
              </Button>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
            <div className="min-h-full flex-1">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
