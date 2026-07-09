"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChangePasswordFormProps {
  onCancel?: () => void;
}

export function ChangePasswordForm({ onCancel }: ChangePasswordFormProps) {
  const [state, action, isPending] = useActionState(changePassword, undefined);

  if (state?.success) {
    toast.success(state.success);
  }
  if (state?.error) {
    toast.error(state.error);
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
        <Input id="newPassword" name="newPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      
      <div className="flex justify-between items-center gap-4 pt-2">
        <Button 
          type="button" 
          variant="destructive" 
          className="flex-1"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
