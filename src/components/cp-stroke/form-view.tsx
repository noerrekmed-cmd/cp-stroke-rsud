"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DayCheckboxGrid } from "./day-checkbox-grid";
import {
  DAY_ITEMS,
  DX_KEPERAWATAN_OPTIONS,
  DX_GIZI_OPTIONS,
} from "@/lib/cp-stroke-data";
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Database } from "lucide-react";

const TOTAL_SECTIONS = 4;

interface FormViewProps {
  onSubmitted?: (refId: string) => void;
  onViewSubmissions?: () => void;
}

export function FormView({ onSubmitted, onViewSubmissions }: FormViewProps) {
  const [section, setSection] = useState(1);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ refId: string } | null>(null);

  const setField = (key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: string, value: string) => {
    setData((prev) => {
      const arr = (prev[key] as string[]) || [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const validateSection = (n: number): boolean => {
    if (n === 1) {
      const req = ["norm", "nama", "jk"];
      for (const k of req) {
        const v = data[k];
        if (!v || (typeof v === "string" && v.trim() === "")) {
          setError(`Field wajib '${k}' belum diisi`);
          return false;
        }
      }
    } else if (n === 2) {
      const req = ["dxmasuk", "penyakitutama", "dxmedis"];
      for (const k of req) {
        const v = data[k];
        if (!v || (typeof v === "string" && v.trim() === "")) {
          setError(`Field wajib '${k}' belum diisi`);
          return false;
        }
      }
    }
    setError(null);
    return true;
  };

  const nextSection = () => {
    if (!validateSection(section)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (section < TOTAL_SECTIONS) {
      setSection(section + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevSection = () => {
    if (section > 1) {
      setSection(section - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateSection(2)) {
      setSection(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cp-stroke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal submit");
        return;
      }
      setSuccess({ refId: json.refId });
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (onSubmitted) onSubmitted(json.refId);
    } catch (e) {
      setError("Network error: " + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setData({});
    setSection(1);
    setSuccess(null);
    setError(null);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full p-8 text-center shadow-lg border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-medium text-slate-900 mb-2">Formulir Terekam</h2>
          <p className="text-sm text-slate-600 mb-2">
            Data Clinical Pathway Stroke Non Perdarahan telah disimpan ke database.
          </p>
          <p className="text-xs text-slate-500 mb-3">Simpan nomor referensi berikut untuk arsip:</p>
          <div className="inline-block px-4 py-1.5 bg-slate-100 rounded font-mono text-xs text-slate-700 mb-6">
            {success.refId}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={resetForm} variant="outline" className="w-full">
              Isi Form Baru
            </Button>
            {onViewSubmissions && (
              <Button
                onClick={onViewSubmissions}
                variant="secondary"
                className="w-full bg-slate-800 text-white hover:bg-slate-700"
              >
                <Database className="w-4 h-4 mr-2" /> Lihat Data Terkumpul
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const progressPct = Math.round((section / TOTAL_SECTIONS) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-500 via-purple-700 to-purple-500 text-white px-6 py-8 relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-1">
            Clinical Pathway Stroke Non Perdarahan
          </h1>
          <p className="text-sm md:text-base opacity-90">
            RSUD Dr. Soedarso &middot; Formulir Pencatatan Kegiatan Perawatan Pasien
          </p>
          <span className="inline-block mt-3 px-3 py-1 bg-white/20 border border-white/40 rounded-full text-xs tracking-wide">
            RSUD Dr. SOEDARSO
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 py-2.5">
        <div className="max-w-3xl mx-auto px-6 flex items-center gap-4">
          <Progress value={progressPct} className="flex-1 h-1.5" />
          <span className="text-xs text-slate-500 whitespace-nowrap">
            Bagian {section} dari {TOTAL_SECTIONS}
          </span>
        </div>
      </div>

      {/* Form body */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-6 py-6">
        <Card className="p-6 md:p-8 shadow-md border-slate-200">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {section === 1 && (
            <Section1 data={data} setField={setField} />
          )}
          {section === 2 && (
            <Section2
              data={data}
              setField={setField}
              toggleArrayValue={toggleArrayValue}
            />
          )}
          {section === 3 && (
            <Section3 data={data} setField={setField} />
          )}
          {section === 4 && (
            <Section4
              data={data}
              setField={setField}
              toggleArrayValue={toggleArrayValue}
            />
          )}

          {/* Buttons */}
          <div className="flex justify-between items-center mt-8 pt-5 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={prevSection}
              disabled={section === 1}
              className="text-blue-600 border-slate-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            {section < TOTAL_SECTIONS ? (
              <Button
                onClick={nextSection}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Berikutnya <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {submitting ? "Mengirim..." : "Kirim Formulir"}
              </Button>
            )}
          </div>
        </Card>
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-slate-400">
        CP Stroke Non Perdarahan &middot; RSUD Dr. Soedarso
      </footer>
    </div>
  );
}

// ============================================================================
// SECTION 1: Identitas Pasien
// ============================================================================
interface SectionProps {
  data: Record<string, unknown>;
  setField: (k: string, v: unknown) => void;
}

function SectionTitle({ num, title }: { num: number; title: string }) {
  return (
    <>
      <h2 className="text-lg md:text-xl font-medium text-slate-900 pb-3 mb-5 border-b border-slate-200">
        Bagian {num} dari {TOTAL_SECTIONS} &middot; {title}
      </h2>
    </>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-slate-500 italic -mt-3 mb-5">{children}</p>;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Label className="block mb-2 text-sm font-medium text-slate-900">
      {children}
      {required && <span className="text-red-600 font-semibold ml-0.5">*</span>}
    </Label>
  );
}

function Section1({ data, setField }: SectionProps) {
  return (
    <div>
      <SectionTitle num={1} title="Identitas Pasien" />
      <SectionDesc>Data demografi dan administratif pasien rawat inap.</SectionDesc>

      <div className="space-y-5">
        <div>
          <FieldLabel required>No. RM</FieldLabel>
          <Input
            value={(data.norm as string) || ""}
            onChange={(e) => setField("norm", e.target.value)}
            placeholder="Nomor Rekam Medis"
          />
        </div>
        <div>
          <FieldLabel required>Nama Pasien</FieldLabel>
          <Input
            value={(data.nama as string) || ""}
            onChange={(e) => setField("nama", e.target.value)}
            placeholder="Nama lengkap pasien"
          />
        </div>
        <div>
          <FieldLabel required>Jenis Kelamin</FieldLabel>
          <RadioGroup
            value={(data.jk as string) || ""}
            onValueChange={(v) => setField("jk", v)}
            className="flex gap-8"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="jk-l" value="L" />
              <Label htmlFor="jk-l">Laki-laki</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="jk-p" value="P" />
              <Label htmlFor="jk-p">Perempuan</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel>BB (kg)</FieldLabel>
            <Input
              type="number"
              value={(data.bb as string) || ""}
              onChange={(e) => setField("bb", e.target.value)}
              placeholder="Berat badan"
              min={0}
              step={0.1}
            />
          </div>
          <div>
            <FieldLabel>TB (cm)</FieldLabel>
            <Input
              type="number"
              value={(data.tb as string) || ""}
              onChange={(e) => setField("tb", e.target.value)}
              placeholder="Tinggi badan"
              min={0}
              step={0.1}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Tanggal Lahir</FieldLabel>
          <Input
            type="date"
            value={(data.tgllahir as string) || ""}
            onChange={(e) => setField("tgllahir", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Tempat, Tanggal Lahir</FieldLabel>
          <Input
            value={(data.tempattgllahir as string) || ""}
            onChange={(e) => setField("tempattgllahir", e.target.value)}
            placeholder="Tempat, tanggal lahir lengkap"
          />
        </div>
        <div>
          <FieldLabel>Umur</FieldLabel>
          <Input
            type="number"
            value={(data.umur as string) || ""}
            onChange={(e) => setField("umur", e.target.value)}
            placeholder="Umur (tahun)"
            min={0}
          />
        </div>
        <div>
          <FieldLabel>Alamat</FieldLabel>
          <Textarea
            value={(data.alamat as string) || ""}
            onChange={(e) => setField("alamat", e.target.value)}
            placeholder="Alamat pasien"
            rows={2}
          />
        </div>
        <div>
          <FieldLabel>Onset</FieldLabel>
          <Input
            value={(data.onset as string) || ""}
            onChange={(e) => setField("onset", e.target.value)}
            placeholder="Waktu/keterangan onset"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Tanggal Masuk</FieldLabel>
            <Input
              type="date"
              value={(data.tglmasuk as string) || ""}
              onChange={(e) => setField("tglmasuk", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Jam Masuk</FieldLabel>
            <Input
              type="time"
              value={(data.jammasuk as string) || ""}
              onChange={(e) => setField("jammasuk", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Tanggal Keluar</FieldLabel>
            <Input
              type="date"
              value={(data.tglkeluar as string) || ""}
              onChange={(e) => setField("tglkeluar", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Jam Keluar</FieldLabel>
            <Input
              type="time"
              value={(data.jamkeluar as string) || ""}
              onChange={(e) => setField("jamkeluar", e.target.value)}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Dietary Counseling and Surveilance</FieldLabel>
          <Input
            value={(data.dietcouns as string) || ""}
            onChange={(e) => setField("dietcouns", e.target.value)}
            placeholder="Keterangan dietary"
          />
        </div>
        <div>
          <FieldLabel>Kode ICD</FieldLabel>
          <Input
            value={(data.icd as string) || ""}
            onChange={(e) => setField("icd", e.target.value)}
            placeholder="Kode ICD-10 (cth: I63.9)"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 2: Diagnosis & Asesmen Masuk
// ============================================================================
interface Section2Props extends SectionProps {
  toggleArrayValue: (k: string, v: string) => void;
}

function Section2({ data, setField, toggleArrayValue }: Section2Props) {
  const dxkep = (data.dxkep as string[]) || [];
  const dxgizi = (data.dxgizi as string[]) || [];

  return (
    <div>
      <SectionTitle num={2} title="Diagnosis & Asesmen Masuk" />
      <SectionDesc>Diagnosis medis, keperawatan, dan gizi saat pasien masuk.</SectionDesc>

      <div className="space-y-5">
        <div>
          <FieldLabel required>Diagnosa Masuk RS</FieldLabel>
          <Input
            value={(data.dxmasuk as string) || ""}
            onChange={(e) => setField("dxmasuk", e.target.value)}
            placeholder="Diagnosa saat masuk RS"
          />
        </div>
        <div>
          <FieldLabel required>Penyakit Utama</FieldLabel>
          <Input
            value={(data.penyakitutama as string) || ""}
            onChange={(e) => setField("penyakitutama", e.target.value)}
            placeholder="Penyakit utama"
          />
        </div>
        <div>
          <FieldLabel>Penyakit Penyerta</FieldLabel>
          <Textarea
            value={(data.penyakitpenyerta as string) || ""}
            onChange={(e) => setField("penyakitpenyerta", e.target.value)}
            placeholder="Komorbid (pisahkan dengan koma)"
            rows={2}
          />
        </div>
        <div>
          <FieldLabel>Komplikasi</FieldLabel>
          <Input
            value={(data.komplikasi as string) || ""}
            onChange={(e) => setField("komplikasi", e.target.value)}
            placeholder="Komplikasi bila ada"
          />
        </div>
        <div>
          <FieldLabel>Tindakan</FieldLabel>
          <Input
            value={(data.tindakan as string) || ""}
            onChange={(e) => setField("tindakan", e.target.value)}
            placeholder="Tindakan yang dilakukan"
          />
        </div>

        <div>
          <FieldLabel required>Diagnosis Medis (pilih salah satu)</FieldLabel>
          <RadioGroup
            value={(data.dxmedis as string) || ""}
            onValueChange={(v) => setField("dxmedis", v)}
            className="space-y-2"
          >
            <div className="flex items-start gap-2.5">
              <RadioGroupItem id="dx-a" value="a" className="mt-0.5" />
              <Label htmlFor="dx-a">a. Stroke Iskemik</Label>
            </div>
            <div className="flex items-start gap-2.5">
              <RadioGroupItem id="dx-b" value="b" className="mt-0.5" />
              <Label htmlFor="dx-b">b. Stroke Infark</Label>
            </div>
            <div className="flex items-start gap-2.5">
              <RadioGroupItem id="dx-c" value="c" className="mt-0.5" />
              <Label htmlFor="dx-c">c. Stroke Infark Rekuren</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <FieldLabel>Diagnosis Keperawatan (pilih yang sesuai)</FieldLabel>
          <div className="space-y-1">
            {DX_KEPERAWATAN_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
              >
                <Checkbox
                  checked={dxkep.includes(opt.value)}
                  onCheckedChange={() => toggleArrayValue("dxkep", opt.value)}
                  className="mt-0.5"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Diagnosis Gizi (pilih yang sesuai)</FieldLabel>
          <div className="space-y-1">
            {DX_GIZI_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
              >
                <Checkbox
                  checked={dxgizi.includes(opt.value)}
                  onCheckedChange={() => toggleArrayValue("dxgizi", opt.value)}
                  className="mt-0.5"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 3: Kegiatan per Hari Rawat (1-6)
// ============================================================================
interface Section3Props {
  data: Record<string, unknown>;
  setField: (k: string, v: unknown) => void;
}

function Section3({ data, setField }: Section3Props) {
  return (
    <div>
      <SectionTitle num={3} title="Kegiatan per Hari Rawat (1-6)" />
      <SectionDesc>
        Centang hari rawat (H1-H6) saat setiap kegiatan dilakukan. Tambahkan keterangan bila perlu.
      </SectionDesc>

      {/* Legend */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 mb-5">
        <span className="text-[12.5px] text-slate-500 italic">
          Centang hari rawat (H1-H6) saat kegiatan dilakukan:
        </span>
        <div className="grid grid-cols-6 gap-1.5 min-w-[240px]">
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <span
              key={d}
              className="text-center text-[11px] font-semibold text-purple-700 bg-purple-100 rounded px-1.5 py-0.5"
            >
              H{d}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {DAY_ITEMS.map((item, i) => {
          const prefix = `d${i + 1}`;
          return (
            <div key={prefix} className="border-b border-slate-100 pb-5 last:border-b-0">
              <div className="text-sm font-medium text-slate-900 mb-1">
                {item.no}. {item.title}
              </div>
              {item.desc && (
                <div className="text-[12.5px] text-slate-500 mb-2.5 leading-relaxed">
                  {item.desc}
                </div>
              )}

              {item.sub.length === 0 ? (
                <>
                  <DayCheckboxGrid
                    prefix={prefix}
                    values={data as Record<string, number>}
                    onChange={setField}
                  />
                  <Input
                    value={(data[`${prefix}_ket`] as string) || ""}
                    onChange={(e) => setField(`${prefix}_ket`, e.target.value)}
                    placeholder="Keterangan"
                    className="text-xs h-8 mt-1.5"
                  />
                </>
              ) : (
                <div className="ml-3.5 pl-3.5 border-l-[3px] border-indigo-100 space-y-3.5">
                  {item.sub.map((sub, j) => {
                    const subId = `${prefix}_s${j + 1}`;
                    return (
                      <div key={subId} className="py-2">
                        <div className="text-[13.5px] font-medium text-slate-900 mb-1">
                          {sub.title}
                        </div>
                        {sub.desc && (
                          <div className="text-xs text-slate-500 mb-1.5 leading-relaxed">
                            {sub.desc}
                          </div>
                        )}
                        <DayCheckboxGrid
                          prefix={subId}
                          values={data as Record<string, number>}
                          onChange={setField}
                        />
                        <Input
                          value={(data[`${subId}_ket`] as string) || ""}
                          onChange={(e) => setField(`${subId}_ket`, e.target.value)}
                          placeholder="Keterangan"
                          className="text-xs h-8 mt-1.5"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 4: Kriteria Pulang & Tanda Tangan
// ============================================================================
function Section4({ data, setField, toggleArrayValue }: Section2Props) {
  const kritumum = (data.kritumum as string[]) || [];
  const kritkhusus = (data.kritkhusus as string[]) || [];
  const rencana = (data.rencana as string[]) || [];

  return (
    <div>
      <SectionTitle num={4} title="Kriteria Pulang & Tanda Tangan" />
      <SectionDesc>Kriteria dan rencana pulang, serta penanggung jawab.</SectionDesc>

      <div className="space-y-5">
        <div>
          <FieldLabel>Kriteria Pulang - Umum</FieldLabel>
          <div className="space-y-1">
            <label className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <Checkbox
                checked={kritumum.includes("tandavital")}
                onCheckedChange={() => toggleArrayValue("kritumum", "tandavital")}
                className="mt-0.5"
              />
              <span className="text-sm">Tanda vital normal</span>
            </label>
          </div>
        </div>

        <div>
          <FieldLabel>Kriteria Pulang - Khusus</FieldLabel>
          <div className="space-y-1">
            <label className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <Checkbox
                checked={kritkhusus.includes("fr")}
                onCheckedChange={() => toggleArrayValue("kritkhusus", "fr")}
                className="mt-0.5"
              />
              <span className="text-sm">Faktor risiko terkontrol</span>
            </label>
            <label className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <Checkbox
                checked={kritkhusus.includes("komorbid")}
                onCheckedChange={() => toggleArrayValue("kritkhusus", "komorbid")}
                className="mt-0.5"
              />
              <span className="text-sm">Problem penyakit penyerta teratasi</span>
            </label>
          </div>
        </div>

        <div>
          <FieldLabel>Rencana Pulang / Edukasi Pelayanan Lanjutan</FieldLabel>
          <div className="space-y-1">
            <label className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <Checkbox
                checked={rencana.includes("perkembangan")}
                onCheckedChange={() => toggleArrayValue("rencana", "perkembangan")}
                className="mt-0.5"
              />
              <span className="text-sm">
                Penjelasan perkembangan penyakit & terapi/tindakan yang mudah dilakukan sesuai
                kemampuan fungsional
              </span>
            </label>
            <label className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <Checkbox
                checked={rencana.includes("diet")}
                onCheckedChange={() => toggleArrayValue("rencana", "diet")}
                className="mt-0.5"
              />
              <span className="text-sm">
                Penjelasan diet sesuai keadaan umum pasien & komorbid
              </span>
            </label>
            <label className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <Checkbox
                checked={rencana.includes("kontrol")}
                onCheckedChange={() => toggleArrayValue("rencana", "kontrol")}
                className="mt-0.5"
              />
              <span className="text-sm">Surat pengantar kontrol</span>
            </label>
          </div>
        </div>

        <div>
          <FieldLabel>Varian</FieldLabel>
          <Input
            value={(data.varian as string) || ""}
            onChange={(e) => setField("varian", e.target.value)}
            placeholder="Varian (jika ada)"
          />
        </div>

        <div>
          <FieldLabel>Tempat & Tanggal</FieldLabel>
          <Input
            value={(data.tempattanggal as string) || ""}
            onChange={(e) => setField("tempattanggal", e.target.value)}
            placeholder="cth: Pontianak, 5 November 2026"
          />
        </div>

        <div>
          <FieldLabel>Dokter Penanggung Jawab Pelayanan (DPJP)</FieldLabel>
          <Input
            value={(data.dpjp_nama as string) || ""}
            onChange={(e) => setField("dpjp_nama", e.target.value)}
            placeholder="Nama DPJP"
          />
          <Input
            value={(data.dpjp_ttd as string) || ""}
            onChange={(e) => setField("dpjp_ttd", e.target.value)}
            placeholder="Tanda tangan (paraf)"
            className="mt-2"
          />
        </div>

        <div>
          <FieldLabel>Perawat Penanggung Jawab</FieldLabel>
          <Input
            value={(data.perawat_nama as string) || ""}
            onChange={(e) => setField("perawat_nama", e.target.value)}
            placeholder="Nama perawat PJ"
          />
          <Input
            value={(data.perawat_ttd as string) || ""}
            onChange={(e) => setField("perawat_ttd", e.target.value)}
            placeholder="Tanda tangan (paraf)"
            className="mt-2"
          />
        </div>

        <div>
          <FieldLabel>Pelaksana Verifikasi</FieldLabel>
          <Input
            value={(data.verifikator_nama as string) || ""}
            onChange={(e) => setField("verifikator_nama", e.target.value)}
            placeholder="Nama pelaksana verifikasi"
          />
          <Input
            value={(data.verifikator_ttd as string) || ""}
            onChange={(e) => setField("verifikator_ttd", e.target.value)}
            placeholder="Tanda tangan (paraf)"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
