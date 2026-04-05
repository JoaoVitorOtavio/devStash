import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentCollections } from "@/components/dashboard/recent-collections";
import { PinnedItems } from "@/components/dashboard/pinned-items";
import { RecentItems } from "@/components/dashboard/recent-items";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, John!</h2>
        <p className="text-muted-foreground">
          Here is what's happening with your stashed knowledge today.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <PinnedItems />
          <RecentItems />
        </div>
        <div className="space-y-8">
          <RecentCollections />
          
          <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
            <h4 className="font-semibold mb-2">Pro Tip</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use <kbd className="px-1.5 py-0.5 rounded border bg-background font-mono text-[10px]">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded border bg-background font-mono text-[10px]">K</kbd> anywhere to search through all your stashed items and commands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
