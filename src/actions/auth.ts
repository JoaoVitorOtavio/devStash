"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

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
