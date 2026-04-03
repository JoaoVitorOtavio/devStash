import { Search, Plus, Menu, FolderPlus, Sidebar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar Placeholder */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center border-b px-6 gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
             <span className="text-primary-foreground font-bold">D</span>
          </div>
          <span className="text-lg font-bold">DevStash</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Sidebar Placeholder
          </h2>
          {/* Sidebar items will go here */}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b px-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon">
              <Sidebar className="h-5 w-5" />
            </Button>
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-9 bg-background/50 focus:bg-background"
              />
              <div className="absolute right-2 top-1.5 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex">
              <FolderPlus className="h-4 w-4 mr-2" />
              <span>New Collection</span>
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <span>New Item</span>
            </Button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
