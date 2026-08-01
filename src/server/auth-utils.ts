import { auth } from "@/auth";

export async function requireUserId(): Promise<
  { userId: string; error?: undefined } | { userId?: undefined; error: string }
> {
  const session = await auth();
  const userId = session?.user?.id;
  return userId ? { userId } : { error: "Unauthorized" };
}
