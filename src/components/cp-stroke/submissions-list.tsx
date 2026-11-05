"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, Download, ArrowLeft, Lock, RefreshCw } from "lucide-react";

interface SubmissionSummary {
  id: string;
  refId: string;
  createdAt: string;
  norm: string;
  nama: string;
  jk: string;
  dxmasuk: string;
  penyakitutama: string;
  dxmedis: string;
}

interface SubmissionsListProps {
  onSelectDetail: (id: string) => void;
  onBack: () => void;
  initialPin?: string;
  onPinChange?: (pin: string) => void;
}

export function SubmissionsList({
  onSelectDetail,
  onBack,
  initialPin = "",
  onPinChange,
}: SubmissionsListProps) {
  const [pin, setPin] = useState(initialPin);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<SubmissionSummary[]>([]);

  const updatePin = (v: string) => {
    setPin(v);
    if (onPinChange) onPinChange(v);
  };

  const loadList = async (pinValue: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cp-stroke?pin=${encodeURIComponent(pinValue)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal memuat data");
        return;
      }
      setList(json.submissions as SubmissionSummary[]);
      setVerified(true);
    } catch (e) {
      setError("Network error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!pin) {
      setError("Masukkan PIN admin");
      return;
    }
    loadList(pin);
  };

  const handleRefresh = () => {
    if (verified) loadList(pin);
  };

  const handleExport = () => {
    if (!pin) return;
    window.location.href = `/api/cp-stroke/export?pin=${encodeURIComponent(pin)}`;
  };

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full p-8 shadow-lg border-slate-200">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-medium text-slate-900 mb-2 text-center">
            Akses Data Terkumpul
          </h2>
          <p className="text-sm text-slate-600 mb-5 text-center">
            Masukkan PIN admin untuk melihat data formulir yang telah disubmit.
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <Label htmlFor="pin" className="block mb-2 text-sm font-medium">
                PIN Admin
              </Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => updatePin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify();
                }}
                placeholder="Masukkan PIN"
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              {loading ? "Memverifikasi..." : "Buka Data"}
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Form
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-5 text-center">
            Default PIN: <code className="bg-slate-100 px-1 py-0.5 rounded">1234</code> (dapat
            diubah via env <code className="bg-slate-100 px-1 py-0.5 rounded">ADMIN_PIN</code>)
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-medium">Data Formulir CP Stroke</h1>
              <p className="text-xs opacity-80">
                {list.length} record tersimpan
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="secondary"
              className="bg-slate-700 hover:bg-slate-600 text-white"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={handleExport}
              variant="secondary"
              className="bg-green-700 hover:bg-green-600 text-white"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export CSV
            </Button>
            <Button onClick={onBack} variant="secondary" className="bg-white text-slate-800 hover:bg-slate-100">
              <ArrowLeft className="w-4 h-4 mr-1" /> Form
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-6">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Card className="shadow-md border-slate-200 overflow-hidden">
          {list.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada data tersimpan.</p>
              <p className="text-xs mt-1">Submit form terlebih dahulu untuk melihat data di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[160px]">Ref ID</TableHead>
                    <TableHead className="w-[140px]">Tanggal Submit</TableHead>
                    <TableHead className="w-[100px]">No. RM</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead className="w-[60px]">JK</TableHead>
                    <TableHead>Diagnosa Masuk</TableHead>
                    <TableHead>Dx Medis</TableHead>
                    <TableHead className="w-[80px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onSelectDetail(s.id)}>
                      <TableCell className="font-mono text-xs">{s.refId}</TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {new Date(s.createdAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-xs">{s.norm}</TableCell>
                      <TableCell className="font-medium">{s.nama}</TableCell>
                      <TableCell className="text-center text-xs">{s.jk}</TableCell>
                      <TableCell className="text-xs">{s.dxmasuk}</TableCell>
                      <TableCell className="text-xs">{s.dxmedis}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDetail(s.id);
                          }}
                          className="h-7 text-xs"
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-slate-400">
        Admin Panel &middot; CP Stroke Non Perdarahan RSUD Dr. Soedarso
      </footer>
    </div>
  );
}
