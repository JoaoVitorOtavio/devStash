import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/server/db/user";
import { getUserStats } from "@/server/db/stats";
import { UserAvatar } from "@/components/user-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordSection } from "@/components/profile/change-password-section";
import { DeleteAccountButton } from "@/components/profile/delete-account-button";
import DashboardLayout from "../dashboard/layout";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

function getIcon(iconName?: string, fallbackColor = "text-muted-foreground"): React.ReactNode {
  if (!iconName) return <Icons.Circle className="w-4 h-4 opacity-50" />;
  const IconComponent = (Icons as any)[iconName];
  if (!IconComponent) return <Icons.Circle className="w-4 h-4 opacity-50" />;
  return <IconComponent className={`w-4 h-4 ${fallbackColor}`} />;
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await getUserProfile(session.user.email!);
  const stats = await getUserStats(user.id);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
            <UserAvatar name={user.name} image={user.image} className="w-16 h-16" />
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Joined: {user.createdAt.toLocaleDateString()}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <p className="text-3xl font-bold">{stats.totalItems}</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="text-sm font-medium text-muted-foreground">Collections</p>
                  <p className="text-3xl font-bold">{stats.totalCollections}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Items by Type</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stats.itemTypeBreakdown.map(type => (
                    <div key={type.name} className="flex items-center gap-2 p-2 rounded-md border bg-muted/10">
                      <span style={{ color: type.color }}>
                        {getIcon(type.icon, type.color ? '' : 'text-muted-foreground')}
                      </span>
                      <span className="text-sm flex-1 truncate">{type.name}</span>
                      <span className="text-sm font-semibold">{type.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {user.hasPassword && (
            <ChangePasswordSection />
          )}

          <div className="rounded-xl border bg-card p-6 border-destructive/20">
            <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all your stashed data. This action cannot be undone.
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
