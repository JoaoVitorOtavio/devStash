import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { updateCollection, deleteCollection } from "@/server/db/collections";

const updateCollectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().nullable().optional().default(null),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateCollectionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const collection = await updateCollection(session.user.id, id, parsed.data);

  if (!collection) {
    return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: collection });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteCollection(session.user.id, id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
