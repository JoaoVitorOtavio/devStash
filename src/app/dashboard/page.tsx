export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h2 className="text-sm font-medium">Main Area Placeholder</h2>
            <p className="text-xs text-muted-foreground mt-1">Your stashed items will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
