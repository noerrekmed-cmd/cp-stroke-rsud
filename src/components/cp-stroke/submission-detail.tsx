"use client";

import { Fragment, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DAY_ITEMS, DX_KEPERAWATAN_OPTIONS, DX_GIZI_OPTIONS } from "@/lib/cp-stroke-data";
import { ArrowLeft, FileText, Printer } from "lucide-react";

interface SubmissionDetailProps {
  id: string;
  pin: string;
  onBack: () => void;
}

interface DetailData {
  id: string;
  refId: string;
  createdAt: string;
  data: Record<string, unknown>;
}

export function SubmissionDetail({ id, pin, onBack }: SubmissionDetailProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/cp-stroke/${id}?pin=${encodeURIComponent(pin)}`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error || "Gagal memuat detail");
          return;
        }
        setDetail(json.submission);
      } catch (e) {
        if (!cancelled) setError("Network error: " + (e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id, pin]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-slate-800 text-white px-6 py-5">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Button onClick={onBack} variant="secondary" className="bg-slate-700 text-white hover:bg-slate-600">
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <h1 className="text-lg font-medium">Detail Submission</h1>
          </div>
        </header>
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <p className="text-red-600 mb-4">{error || "Data tidak ditemukan"}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
          </Button>
        </Card>
      </div>
    );
  }

  const d = detail.data;

  const getArr = (key: string): string[] => {
    const v = d[key];
    return Array.isArray(v) ? (v as string[]) : [];
  };

  const dxMedisLabel: Record<string, string> = {
    a: "Stroke Iskemik",
    b: "Stroke Infark",
    c: "Stroke Infark Rekuren",
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-800 text-white px-6 py-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="secondary" className="bg-slate-700 text-white hover:bg-slate-600">
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <div>
              <h1 className="text-base font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {detail.refId}
              </h1>
              <p className="text-xs opacity-80">
                Disubmit: {new Date(detail.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <Button onClick={handlePrint} variant="secondary" className="bg-white text-slate-800 hover:bg-slate-100">
            <Printer className="w-4 h-4 mr-1" /> Cetak / PDF
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-6 py-6 print:py-0">
        <Card className="p-6 md:p-8 shadow-md border-slate-200 print:shadow-none print:border-0">
          {/* Title */}
          <div className="text-center mb-6 pb-4 border-b border-slate-200">
            <h1 className="text-xl font-medium text-slate-900">
              Clinical Pathway Stroke Non Perdarahan
            </h1>
            <p className="text-sm text-slate-600">RSUD Dr. Soedarso</p>
            <div className="mt-2 inline-block px-3 py-0.5 bg-slate-100 rounded font-mono text-xs text-slate-600">
              {detail.refId}
            </div>
          </div>

          {/* Section 1: Identitas */}
          <DetailSection title="Identitas Pasien">
            <DetailRow label="No. RM" value={d.norm as string} />
            <DetailRow label="Nama Pasien" value={d.nama as string} />
            <DetailRow
              label="Jenis Kelamin"
              value={d.jk === "L" ? "Laki-laki" : d.jk === "P" ? "Perempuan" : ""}
            />
            <DetailRow label="BB / TB" value={`${d.bb || "-"} kg / ${d.tb || "-"} cm`} />
            <DetailRow label="Tanggal Lahir" value={d.tgllahir as string} />
            <DetailRow label="Tempat, Tanggal Lahir" value={d.tempattgllahir as string} />
            <DetailRow label="Umur" value={d.umur ? `${d.umur} th` : ""} />
            <DetailRow label="Alamat" value={d.alamat as string} />
            <DetailRow label="Onset" value={d.onset as string} />
            <DetailRow
              label="Masuk RS"
              value={`${d.tglmasuk || ""} ${d.jammasuk || ""}`.trim()}
            />
            <DetailRow
              label="Keluar RS"
              value={`${d.tglkeluar || ""} ${d.jamkeluar || ""}`.trim()}
            />
            <DetailRow label="Dietary Counseling" value={d.dietcouns as string} />
            <DetailRow label="Kode ICD" value={d.icd as string} />
          </DetailSection>

          {/* Section 2: Diagnosis */}
          <DetailSection title="Diagnosis & Asesmen Masuk">
            <DetailRow label="Diagnosa Masuk RS" value={d.dxmasuk as string} />
            <DetailRow label="Penyakit Utama" value={d.penyakitutama as string} />
            <DetailRow label="Penyakit Penyerta" value={d.penyakitpenyerta as string} />
            <DetailRow label="Komplikasi" value={d.komplikasi as string} />
            <DetailRow label="Tindakan" value={d.tindakan as string} />
            <DetailRow
              label="Diagnosis Medis"
              value={dxMedisLabel[d.dxmedis as string] || (d.dxmedis as string)}
            />
            <div className="py-2 border-b border-slate-100 last:border-b-0">
              <div className="text-xs text-slate-500 mb-1">Diagnosis Keperawatan</div>
              <div className="flex flex-wrap gap-1.5">
                {getArr("dxkep").length === 0 ? (
                  <span className="text-xs text-slate-400">-</span>
                ) : (
                  getArr("dxkep").map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs">
                      {DX_KEPERAWATAN_OPTIONS.find((o) => o.value === v)?.label || v}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="py-2 border-b border-slate-100 last:border-b-0">
              <div className="text-xs text-slate-500 mb-1">Diagnosis Gizi</div>
              <div className="flex flex-wrap gap-1.5">
                {getArr("dxgizi").length === 0 ? (
                  <span className="text-xs text-slate-400">-</span>
                ) : (
                  getArr("dxgizi").map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs">
                      {DX_GIZI_OPTIONS.find((o) => o.value === v)?.label || v}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </DetailSection>

          {/* Section 3: Kegiatan Hari Rawat */}
          <DetailSection title="Kegiatan per Hari Rawat (1-6)">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left py-2 px-2 font-medium text-slate-700">Kegiatan</th>
                    {[1, 2, 3, 4, 5, 6].map((day) => (
                      <th key={day} className="py-2 px-1 text-center font-medium text-slate-700 w-8">
                        H{day}
                      </th>
                    ))}
                    <th className="text-left py-2 px-2 font-medium text-slate-700">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {DAY_ITEMS.map((item, i) => {
                    const prefix = `d${i + 1}`;
                    if (item.sub.length === 0) {
                      return (
                        <DayRow
                          key={prefix}
                          label={`${item.no}. ${item.title}`}
                          prefix={prefix}
                          data={d}
                        />
                      );
                    }
                    return (
                      <Fragment key={prefix}>
                        <tr className="bg-slate-100/50">
                          <td colSpan={8} className="py-1.5 px-2 font-medium text-slate-800">
                            {item.no}. {item.title}
                          </td>
                        </tr>
                        {item.sub.map((sub, j) => {
                          const subId = `${prefix}_s${j + 1}`;
                          return (
                            <DayRow
                              key={subId}
                              label={sub.title}
                              prefix={subId}
                              data={d}
                              indent
                            />
                          );
                        })}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DetailSection>

          {/* Section 4: Pulang */}
          <DetailSection title="Kriteria Pulang & Tanda Tangan">
            <div className="py-2 border-b border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Kriteria Pulang Umum</div>
              <div className="flex flex-wrap gap-1.5">
                {getArr("kritumum").length === 0 ? (
                  <span className="text-xs text-slate-400">-</span>
                ) : (
                  getArr("kritumum").map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs">
                      {v === "tandavital" ? "Tanda vital normal" : v}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="py-2 border-b border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Kriteria Pulang Khusus</div>
              <div className="flex flex-wrap gap-1.5">
                {getArr("kritkhusus").length === 0 ? (
                  <span className="text-xs text-slate-400">-</span>
                ) : (
                  getArr("kritkhusus").map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs">
                      {v === "fr" ? "Faktor risiko terkontrol" : v === "komorbid" ? "Penyakit penyerta teratasi" : v}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="py-2 border-b border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Rencana Pulang</div>
              <div className="flex flex-wrap gap-1.5">
                {getArr("rencana").length === 0 ? (
                  <span className="text-xs text-slate-400">-</span>
                ) : (
                  getArr("rencana").map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs">
                      {v === "perkembangan"
                        ? "Edukasi perkembangan penyakit"
                        : v === "diet"
                        ? "Edukasi diet"
                        : v === "kontrol"
                        ? "Surat pengantar kontrol"
                        : v}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <DetailRow label="Varian" value={d.varian as string} />
            <DetailRow label="Tempat & Tanggal" value={d.tempattanggal as string} />
            <DetailRow label="DPJP" value={d.dpjp_nama as string} />
            <DetailRow label="Perawat PJ" value={d.perawat_nama as string} />
            <DetailRow label="Verifikator" value={d.verifikator_nama as string} />
          </DetailSection>
        </Card>
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-slate-400 print:hidden">
        Detail Submission &middot; {detail.refId}
      </footer>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6 print:break-inside-avoid">
      <h2 className="text-base font-medium text-slate-900 pb-2 mb-3 border-b border-slate-200">
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="py-2 border-b border-slate-100 last:border-b-0 flex gap-3 text-sm">
      <div className="text-xs text-slate-500 w-40 flex-shrink-0 pt-0.5">{label}</div>
      <div className="flex-1 text-slate-900">
        {value && value.trim() ? value : <span className="text-slate-400">-</span>}
      </div>
    </div>
  );
}

function DayRow({
  label,
  prefix,
  data,
  indent,
}: {
  label: string;
  prefix: string;
  data: Record<string, unknown>;
  indent?: boolean;
}) {
  return (
    <tr className="border-b border-slate-100">
      <td className={`py-1.5 px-2 text-slate-800 ${indent ? "pl-6" : ""}`}>{label}</td>
      {[1, 2, 3, 4, 5, 6].map((day) => {
        const key = `${prefix}_h${day}`;
        const checked = data[key] === 1;
        return (
          <td key={day} className="text-center py-1.5 px-1">
            {checked ? (
              <span className="inline-block w-4 h-4 leading-4 bg-green-600 text-white rounded-sm text-[10px]">
                ✓
              </span>
            ) : (
              <span className="inline-block w-4 h-4 border border-slate-300 rounded-sm"></span>
            )}
          </td>
        );
      })}
      <td className="py-1.5 px-2 text-xs text-slate-600">
        {(data[`${prefix}_ket`] as string) || ""}
      </td>
    </tr>
  );
}
