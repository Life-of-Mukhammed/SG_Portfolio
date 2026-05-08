import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { syncResidentsFromMongo } from "@/lib/sync";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncResidentsFromMongo();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("Sync failed:", e);
    return NextResponse.json(
      { error: "Sync failed", message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
