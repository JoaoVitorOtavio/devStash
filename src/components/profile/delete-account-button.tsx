"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteAccount } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DeleteAccountButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsPending(true);
    const result = await deleteAccount();
    setIsPending(false);

    if (result.success) {
      toast.success(result.success);
      router.push("/sign-in");
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete Account"}
    </Button>
  );
}
