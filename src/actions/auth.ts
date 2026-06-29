"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/prisma";
import { generatePasswordResetToken, getPasswordResetTokenByToken } from "@/server/tokens";
import { sendPasswordResetEmail } from "@/server/mail";

export async function loginWithEmail(prevState: { error?: string } | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard?login=true",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        case "CallbackRouteError":
          return { error: error.cause?.err?.message || "Something went wrong." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function loginWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard?login=true" });
}

export async function logout() {
  await signOut({ redirectTo: "/sign-in?logout=true" });
}

export async function forgotPassword(prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    // We return success to prevent user enumeration
    return { success: "If an account exists, a reset email has been sent." };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.identifier, passwordResetToken.token);

  return { success: "If an account exists, a reset email has been sent." };
}

export async function resetPassword(
  token: string,
  prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Passwords are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.identifier },
  });

  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.verificationToken.delete({
    where: { token: existingToken.token },
  });

  return { success: "Password updated successfully." };
}
