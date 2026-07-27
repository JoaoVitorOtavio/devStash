import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/server/db/user";
import { ChangePasswordSection } from "@/components/profile/change-password-section";
import { DeleteAccountButton } from "@/components/profile/delete-account-button";
import { EditorPreferencesSection } from "@/components/dashboard/editor-preferences-section";
import DashboardLayout from "../dashboard/layout";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await getUserProfile(session.user.email!);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account security and data.
          </p>
        </div>

        <div className="grid gap-6">
          <EditorPreferencesSection />

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
