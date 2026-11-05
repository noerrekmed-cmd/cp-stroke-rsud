import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_PIN } from "@/lib/cp-stroke-data";

// POST /api/cp-stroke -> submit form data
function generateRefId(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-8);
  return `CP-STROKE-${ts}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const required = ["norm", "nama", "jk", "dxmasuk", "penyakitutama", "dxmedis"];
    for (const k of required) {
      const v = body[k];
      if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
        return NextResponse.json({ error: `Field wajib '${k}' kosong` }, { status: 422 });
      }
    }

    const refId = generateRefId();
    const submission = await db.strokeFormSubmission.create({
      data: {
        refId,
        data: JSON.stringify(body),
      },
    });

    return NextResponse.json({ ok: true, refId, id: submission.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/cp-stroke error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/cp-stroke -> list submissions (requires PIN)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pin = url.searchParams.get("pin") || req.headers.get("x-admin-pin") || "";
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 });
    }

    const submissions = await db.strokeFormSubmission.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, refId: true, createdAt: true, data: true },
    });

    const list = submissions.map((s) => {
      let d: Record<string, unknown> = {};
      try {
        d = JSON.parse(s.data);
      } catch {
        // ignore parse error
      }
      return {
        id: s.id,
        refId: s.refId,
        createdAt: s.createdAt,
        norm: (d.norm as string) || "",
        nama: (d.nama as string) || "",
        jk: (d.jk as string) || "",
        dxmasuk: (d.dxmasuk as string) || "",
        penyakitutama: (d.penyakitutama as string) || "",
        dxmedis: (d.dxmedis as string) || "",
      };
    });

    return NextResponse.json({ ok: true, count: list.length, submissions: list });
  } catch (err) {
    console.error("GET /api/cp-stroke error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
