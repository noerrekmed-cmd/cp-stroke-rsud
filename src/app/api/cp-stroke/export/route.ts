import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_PIN, DAY_ITEMS } from "@/lib/cp-stroke-data";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function arrToCsv(arr: unknown[]): string {
  return arr.map(csvEscape).join(",");
}

// Build CSV header columns and rows from submissions
function buildCsv(submissions: Array<{
  id: string;
  refId: string;
  createdAt: Date;
  data: string;
}>): string {
  // Collect all day-checkbox keys (each kegiatan sub-item has H1-H6 + ket)
  const dayKeys: string[] = [];
  DAY_ITEMS.forEach((item, i) => {
    const prefix = `d${i + 1}`;
    if (item.sub.length === 0) {
      for (let d = 1; d <= 6; d++) dayKeys.push(`${prefix}_h${d}`);
      dayKeys.push(`${prefix}_ket`);
    } else {
      item.sub.forEach((_, j) => {
        const subId = `${prefix}_s${j + 1}`;
        for (let d = 1; d <= 6; d++) dayKeys.push(`${subId}_h${d}`);
        dayKeys.push(`${subId}_ket`);
      });
    }
  });

  const baseHeaders = [
    "refId",
    "createdAt",
    "norm",
    "nama",
    "jk",
    "bb",
    "tb",
    "tgllahir",
    "tempattgllahir",
    "umur",
    "alamat",
    "onset",
    "tglmasuk",
    "jammasuk",
    "tglkeluar",
    "jamkeluar",
    "dietcouns",
    "icd",
    "dxmasuk",
    "penyakitutama",
    "penyakitpenyerta",
    "komplikasi",
    "tindakan",
    "dxmedis",
    "dxkep",
    "dxgizi",
    "kritumum",
    "kritkhusus",
    "rencana",
    "varian",
    "tempattanggal",
    "dpjp_nama",
    "dpjp_ttd",
    "perawat_nama",
    "perawat_ttd",
    "verifikator_nama",
    "verifikator_ttd",
  ];

  const headers = [...baseHeaders, ...dayKeys];
  const rows: string[][] = [headers];

  for (const s of submissions) {
    let d: Record<string, unknown> = {};
    try {
      d = JSON.parse(s.data);
    } catch {
      // ignore
    }
    const row: unknown[] = [
      s.refId,
      s.createdAt.toISOString(),
      d.norm || "",
      d.nama || "",
      d.jk || "",
      d.bb || "",
      d.tb || "",
      d.tgllahir || "",
      d.tempattgllahir || "",
      d.umur || "",
      d.alamat || "",
      d.onset || "",
      d.tglmasuk || "",
      d.jammasuk || "",
      d.tglkeluar || "",
      d.jamkeluar || "",
      d.dietcouns || "",
      d.icd || "",
      d.dxmasuk || "",
      d.penyakitutama || "",
      d.penyakitpenyerta || "",
      d.komplikasi || "",
      d.tindakan || "",
      d.dxmedis || "",
      Array.isArray(d.dxkep) ? (d.dxkep as string[]).join("|") : "",
      Array.isArray(d.dxgizi) ? (d.dxgizi as string[]).join("|") : "",
      Array.isArray(d.kritumum) ? (d.kritumum as string[]).join("|") : "",
      Array.isArray(d.kritkhusus) ? (d.kritkhusus as string[]).join("|") : "",
      Array.isArray(d.rencana) ? (d.rencana as string[]).join("|") : "",
      d.varian || "",
      d.tempattanggal || "",
      d.dpjp_nama || "",
      d.dpjp_ttd || "",
      d.perawat_nama || "",
      d.perawat_ttd || "",
      d.verifikator_nama || "",
      d.verifikator_ttd || "",
    ];
    for (const k of dayKeys) {
      const v = d[k];
      if (typeof v === "number") row.push(v === 1 ? "Y" : "");
      else row.push(v ?? "");
    }
    rows.push(row);
  }

  return rows.map(arrToCsv).join("\n");
}

// GET /api/cp-stroke/export -> CSV export (requires PIN)
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

    const csv = buildCsv(submissions);
    const filename = `cp_stroke_submissions_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse("\uFEFF" + csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("GET /api/cp-stroke/export error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
