"use server";

import { auth } from "@/auth";
import { prisma } from "@/server/prisma";
import bcrypt from "bcryptjs";

export async function changePassword(prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) return { error: "Cannot change password for this account." };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required." };
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return { error: "Invalid current password." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: "Password updated successfully." };
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  
  await prisma.user.delete({
    where: { id: session.user.id },
  });

  return { success: "Account deleted successfully." };
}
