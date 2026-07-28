import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleCollectionFavorite } from "@/server/db/collections";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await toggleCollectionFavorite(session.user.id, id);

  if (!result) {
    return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: result });
}
