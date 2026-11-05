import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_PIN } from "@/lib/cp-stroke-data";

// GET /api/cp-stroke/[id] -> single submission detail (requires PIN)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const url = new URL(req.url);
    const pin = url.searchParams.get("pin") || req.headers.get("x-admin-pin") || "";
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 });
    }

    const { id } = await params;
    const submission = await db.strokeFormSubmission.findUnique({ where: { id } });
    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(submission.data);
    } catch {
      // ignore parse error
    }

    return NextResponse.json({
      ok: true,
      submission: {
        id: submission.id,
        refId: submission.refId,
        createdAt: submission.createdAt,
        data,
      },
    });
  } catch (err) {
    console.error("GET /api/cp-stroke/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
