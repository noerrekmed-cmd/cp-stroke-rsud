#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generator Form HTML bergaya Google Forms untuk
Clinical Pathway (CP) Stroke Non Perdarahan RSUD Dr. Soedarso.
Output: single self-contained HTML file dengan multi-section,
checkbox per Hari Rawat (H1-H6), dan tema Google Forms asli.
"""

from pathlib import Path
import html

OUT = Path("/home/z/my-project/download/CP_Stroke_GForm.html")

# ============================================================================
# DATA DEFINITION
# ============================================================================

DAY_ITEMS = [
    {
        "no": "1",
        "title": "Asesmen Awal",
        "desc": "Asesmen awal medis oleh DPJP dan keperawatan. Minimal 1 dari gejala terpenuhi.",
        "sub": [
            {
                "title": "Asesmen Awal Medis (DPJP)",
                "desc": "Pemeriksaan dokter & neurologis (tingkat kesadaran, kejang, kaku kuduk, refleks batang otak, nervus cranialis, gangguan sensorik, refleks babinsky, MMSE <26, pemeriksaan fisik umum).",
            },
            {
                "title": "Gejala Waktu Serangan",
                "desc": "Kelemahan anggota gerak sesisi mendadak; Nyeri kepala; Muntah proyektil; Penurunan kesadaran mendadak; Gangguan bicara mendadak.",
            },
            {
                "title": "Faktor Risiko",
                "desc": "Hipertensi; TIA; Diabetes mellitus; Serangan jantung; Hiperkolesterolemia; Merokok; Stroke sebelumnya.",
            },
            {
                "title": "Konsultasi",
                "desc": "Rehabilitasi Medik / Penyakit Dalam / Jantung / Rawat bersama.",
            },
            {
                "title": "Asesmen Awal Keperawatan",
                "desc": "Asesmen sesuai format keperawatan, termasuk asesmen khusus stroke: gangguan menelan, komunikasi, mobilisasi, perilaku/kognitif.",
            },
        ],
    },
    {
        "no": "2",
        "title": "Laboratorium",
        "desc": "Hb, AL, AT, diftell, AE, urin rutin, AGD, PT, APTT, INR, albumin, elektrolit, creatinin, ureum. Faktor risiko vaskular: HbA1C, GDP, Profil lipid, Asam Urat.",
        "sub": [],
    },
    {
        "no": "3",
        "title": "Radiologi / Imaging",
        "desc": "HCTS non kontras; Rontgen Thorax.",
        "sub": [],
    },
    {
        "no": "4",
        "title": "Penunjang Lain",
        "desc": "EKG; TCD.",
        "sub": [],
    },
    {
        "no": "5",
        "title": "Asesmen Lanjutan",
        "desc": "Asesmen lanjutan medis, keperawatan, gizi, dan farmasi.",
        "sub": [
            {
                "title": "A. Asesmen Medis (DPJP)",
                "desc": "SOAP, evaluasi defisit neurologis, visite harian / follow up.",
            },
            {
                "title": "A. Asesmen Medis (Non-DPJP)",
                "desc": "SOAP, atas indikasi / emergency.",
            },
            {
                "title": "B. Asesmen Keperawatan",
                "desc": "Barthel index; Resiko jatuh (3 shift); Gerak & kekuatan otot (3 shift); GCS & tanda vital (3 shift); Nyeri; Gangguan menelan; Gangguan komunikasi; Gangguan eliminasi.",
            },
            {
                "title": "C. Asesmen Gizi",
                "desc": "Antropometri; Biokimia; Fisik/klinis; Riwayat makan.",
            },
            {
                "title": "D. Asesmen Farmasi",
                "desc": "Rekonsiliasi obat (wajib hari 1 dan hari 6, serta saat pindah ruang); Telaah resep (komunikasi ke dokter jika ada permasalahan).",
            },
        ],
    },
    {
        "no": "7",
        "title": "Discharge Planning",
        "desc": "Identifikasi kebutuhan edukasi & latihan selama perawatan; Identifikasi kebutuhan di rumah; Penjelasan diet pasien.",
        "sub": [],
    },
    {
        "no": "8",
        "title": "Edukasi Terintegrasi",
        "desc": "Edukasi kolaborasi multidisiplin kepada pasien & keluarga.",
        "sub": [
            {
                "title": "A. Edukasi / Informasi Medis",
                "desc": "Penjelasan diagnosis; Rencana terapi; Informed consent.",
            },
            {
                "title": "B. Edukasi & Konseling Gizi",
                "desc": "Edukasi & konseling gizi terkait diet (Hipertensi/Rendah Kolesterol/DM, dll).",
            },
            {
                "title": "C. Edukasi Keperawatan",
                "desc": "Pencegahan jatuh; Pemenuhan ADL; Prinsip merawat pasien stroke di rumah; Pencegahan luka tekan.",
            },
            {
                "title": "D. Edukasi Farmasi",
                "desc": "Konseling & informasi obat (saat dapat obat pertama & saat pulang); Kepatuhan minum obat.",
            },
            {
                "title": "Pengisian Formulir Edukasi Terintegrasi",
                "desc": "Lembar Edukasi Terintegrasi.",
            },
        ],
    },
    {
        "no": "9",
        "title": "Terapi Medikamentosa",
        "desc": "Terapi obat sesuai kondisi pasien.",
        "sub": [
            {
                "title": "a. Antiplatelet (salah satu: Aspilet / Clopidogrel / DAPT)",
                "desc": "Kecuali ada kontraindikasi.",
            },
            {
                "title": "b. Cairan Infus",
                "desc": "Sesuai kondisi pasien.",
            },
            {
                "title": "c. Obat Oral Lain",
                "desc": "Sesuai kondisi pasien.",
            },
        ],
    },
    {
        "no": "10",
        "title": "Tatalaksana Intervensi (TLI)",
        "desc": "Manajemen intervensi multidisiplin.",
        "sub": [
            {
                "title": "a. TLI Medis",
                "desc": "Trombolisis; ...",
            },
            {
                "title": "b. TLI Keperawatan",
                "desc": "Manajemen risiko perfusi cerebral; gangguan menelan; gangguan mobilitas fisik; kerusakan komunikasi verbal; dukungan perawatan diri; risiko jatuh; risiko luka tekan; pencegahan aspirasi; konstipasi.",
            },
            {
                "title": "c. TLI Gizi",
                "desc": "Energi 25-45 kkal/kgBB; Protein 0,8-1,2 g/kgBB; Lemak 20-25% energi total; Karbohidrat 60-70% energi total; Kolesterol <300 mg; Purin 120-150 mg; Natrium 1500-2300 mg; Bentuk cair/lunak/tim/nasi.",
            },
            {
                "title": "d. TLI Farmasi",
                "desc": "Mengkaji Drug Related Problems (interaksi obat via software); Rekomendasi pada DPJP.",
            },
        ],
    },
    {
        "no": "11",
        "title": "Monitoring dan Evaluasi",
        "desc": "Monitor perkembangan pasien oleh masing-masing disiplin.",
        "sub": [
            {
                "title": "a. Dokter DPJP",
                "desc": "SSGM; GCS; Tanda vital; Skala nyeri; Barthel index; MMSE.",
            },
            {
                "title": "b. Keperawatan",
                "desc": "Tanda vital, GCS, gerak & kekuatan otot; Kemampuan menelan; Kemampuan komunikasi; Pemenuhan ADL; Pencegahan jatuh; Keutuhan kulit & luka tekan; Frekuensi BAB.",
            },
            {
                "title": "c. Gizi",
                "desc": "Monitoring asupan makan; antropometri; biokimia; fisik/klinis terkait gizi.",
            },
            {
                "title": "d. Farmasi",
                "desc": "Monitoring interaksi obat (jika ada); efek samping obat; pemantauan terapi obat melalui instruksi pemberian obat.",
            },
            {
                "title": "Rehabilitasi Medis",
                "desc": "Fisioterapi; Terapi wicara; Okupasi terapi (sesuai indikasi).",
            },
        ],
    },
    {
        "no": "12",
        "title": "Mobilisasi / Rehabilitasi",
        "desc": "Tahapan mobilisasi sesuai kondisi pasien.",
        "sub": [
            {
                "title": "b. Keperawatan - Mandiri",
                "desc": "Pasien melakukan aktivitas tanpa bantuan.",
            },
            {
                "title": "b. Keperawatan - Dibantu Sebagian",
                "desc": "Pasien melakukan aktivitas dengan bantuan sebagian.",
            },
            {
                "title": "b. Keperawatan - Dibantu Total",
                "desc": "Pasien membutuhkan bantuan total.",
            },
        ],
    },
    {
        "no": "13",
        "title": "Outcome / Hasil",
        "desc": "Luaran klinis & fungsional yang diukur.",
        "sub": [
            {
                "title": "a. Medis",
                "desc": "Perbaikan luaran klinis & fungsional diukur dari NIHSS, SSGM, ADL, IADL, BI.",
            },
            {
                "title": "b. Keperawatan",
                "desc": "Perfusi jaringan serebral membaik; disfagia membaik; mobilitas fisik membaik; komunikasi membaik; kebutuhan perawatan diri terpenuhi; pasien aman tidak jatuh; tidak terjadi luka tekan; tidak terjadi aspirasi; tidak terjadi konstipasi.",
            },
            {
                "title": "c. Gizi",
                "desc": "Tidak terjadi penurunan status gizi.",
            },
            {
                "title": "d. Farmasi",
                "desc": "Terapi obat sesuai indikasi (rasional); Kepatuhan minum obat.",
            },
        ],
    },
]

# ============================================================================

def esc(s: str) -> str:
    return html.escape(s, quote=True)


def day_checkboxes(prefix: str) -> str:
    cells = []
    for d in range(1, 7):
        cid = f"{prefix}_h{d}"
        cells.append(
            f'<label class="day-cell">'
            f'<input type="checkbox" id="{cid}" name="{cid}" value="1">'
            f'<span>H{d}</span>'
            f'</label>'
        )
    return '<div class="day-grid">' + "".join(cells) + '</div>'


def render_day_item(item, idx_prefix: str) -> str:
    parts = []
    title = f'{item["no"]}. {esc(item["title"])}'
    parts.append(f'<div class="question-block" data-qid="{idx_prefix}">')
    parts.append(f'<div class="q-title">{title}</div>')
    if item.get("desc"):
        parts.append(f'<div class="q-desc">{esc(item["desc"])}</div>')

    if not item.get("sub"):
        parts.append(day_checkboxes(idx_prefix))
        parts.append(
            f'<input type="text" class="ket-input" '
            f'name="{idx_prefix}_ket" placeholder="Keterangan">'
        )
    else:
        parts.append('<div class="sub-list">')
        for j, sub in enumerate(item["sub"], start=1):
            sub_id = f"{idx_prefix}_s{j}"
            parts.append('<div class="sub-item">')
            parts.append(f'<div class="sub-title">{esc(sub["title"])}</div>')
            if sub.get("desc"):
                parts.append(f'<div class="sub-desc">{esc(sub["desc"])}</div>')
            parts.append(day_checkboxes(sub_id))
            parts.append(
                f'<input type="text" class="ket-input" '
                f'name="{sub_id}_ket" placeholder="Keterangan">'
            )
            parts.append('</div>')
        parts.append('</div>')

    parts.append('</div>')
    return "".join(parts)


# ============================================================================
# SECTION DEFINITIONS
# ============================================================================

SECTION_IDENTITAS = """
<div class="question-block" data-qid="norm">
  <div class="q-title">No. RM <span class="req">*</span></div>
  <input type="text" name="norm" required placeholder="Nomor Rekam Medis">
</div>
<div class="question-block" data-qid="nama">
  <div class="q-title">Nama Pasien <span class="req">*</span></div>
  <input type="text" name="nama" required placeholder="Nama lengkap pasien">
</div>
<div class="question-block" data-qid="jk">
  <div class="q-title">Jenis Kelamin <span class="req">*</span></div>
  <div class="radio-row">
    <label><input type="radio" name="jk" value="L" required> Laki-laki</label>
    <label><input type="radio" name="jk" value="P"> Perempuan</label>
  </div>
</div>
<div class="grid-2col">
  <div class="question-block" data-qid="bb">
    <div class="q-title">BB (kg)</div>
    <input type="number" name="bb" min="0" step="0.1" placeholder="Berat badan">
  </div>
  <div class="question-block" data-qid="tb">
    <div class="q-title">TB (cm)</div>
    <input type="number" name="tb" min="0" step="0.1" placeholder="Tinggi badan">
  </div>
</div>
<div class="question-block" data-qid="tgllahir">
  <div class="q-title">Tanggal Lahir</div>
  <input type="date" name="tgllahir">
</div>
<div class="question-block" data-qid="tempattgllahir">
  <div class="q-title">Tempat, Tanggal Lahir</div>
  <input type="text" name="tempattgllahir" placeholder="Tempat, tanggal lahir lengkap">
</div>
<div class="question-block" data-qid="umur">
  <div class="q-title">Umur</div>
  <input type="number" name="umur" min="0" placeholder="Umur (tahun)">
</div>
<div class="question-block" data-qid="alamat">
  <div class="q-title">Alamat</div>
  <textarea name="alamat" rows="2" placeholder="Alamat pasien"></textarea>
</div>
<div class="question-block" data-qid="onset">
  <div class="q-title">Onset</div>
  <input type="text" name="onset" placeholder="Waktu/keterangan onset">
</div>
<div class="grid-2col">
  <div class="question-block" data-qid="tglmasuk">
    <div class="q-title">Tanggal Masuk</div>
    <input type="date" name="tglmasuk">
  </div>
  <div class="question-block" data-qid="jammasuk">
    <div class="q-title">Jam Masuk</div>
    <input type="time" name="jammasuk">
  </div>
</div>
<div class="grid-2col">
  <div class="question-block" data-qid="tglkeluar">
    <div class="q-title">Tanggal Keluar</div>
    <input type="date" name="tglkeluar">
  </div>
  <div class="question-block" data-qid="jamkeluar">
    <div class="q-title">Jam Keluar</div>
    <input type="time" name="jamkeluar">
  </div>
</div>
<div class="question-block" data-qid="dietcouns">
  <div class="q-title">Dietary Counseling and Surveilance</div>
  <input type="text" name="dietcouns" placeholder="Keterangan dietary">
</div>
<div class="question-block" data-qid="icd">
  <div class="q-title">Kode ICD</div>
  <input type="text" name="icd" placeholder="Kode ICD-10 (cth: I63.9)">
</div>
"""

SECTION_DIAGNOSIS = """
<div class="question-block" data-qid="dxmasuk">
  <div class="q-title">Diagnosa Masuk RS <span class="req">*</span></div>
  <input type="text" name="dxmasuk" required placeholder="Diagnosa saat masuk RS">
</div>
<div class="question-block" data-qid="penyakitutama">
  <div class="q-title">Penyakit Utama <span class="req">*</span></div>
  <input type="text" name="penyakitutama" required placeholder="Penyakit utama">
</div>
<div class="question-block" data-qid="penyakitpenyerta">
  <div class="q-title">Penyakit Penyerta</div>
  <textarea name="penyakitpenyerta" rows="2" placeholder="Komorbid (pisahkan dengan koma)"></textarea>
</div>
<div class="question-block" data-qid="komplikasi">
  <div class="q-title">Komplikasi</div>
  <input type="text" name="komplikasi" placeholder="Komplikasi bila ada">
</div>
<div class="question-block" data-qid="tindakan">
  <div class="q-title">Tindakan</div>
  <input type="text" name="tindakan" placeholder="Tindakan yang dilakukan">
</div>

<div class="question-block" data-qid="dxmedis">
  <div class="q-title">Diagnosis Medis (pilih salah satu) <span class="req">*</span></div>
  <div class="radio-stack">
    <label><input type="radio" name="dxmedis" value="a" required> a. Stroke Iskemik</label>
    <label><input type="radio" name="dxmedis" value="b"> b. Stroke Infark</label>
    <label><input type="radio" name="dxmedis" value="c"> c. Stroke Infark Rekuren</label>
  </div>
</div>

<div class="question-block" data-qid="dxkep">
  <div class="q-title">Diagnosis Keperawatan (pilih yang sesuai)</div>
  <div class="check-stack">
    <label><input type="checkbox" name="dxkep" value="perfusi"> Resiko perfusi serebral tidak efektif</label>
    <label><input type="checkbox" name="dxkep" value="jatuh"> Resiko jatuh</label>
    <label><input type="checkbox" name="dxkep" value="adl"> Kurang perawatan diri</label>
    <label><input type="checkbox" name="dxkep" value="komunikasi"> Hambatan komunikasi verbal</label>
    <label><input type="checkbox" name="dxkep" value="mobilitas"> Gangguan mobilitas fisik</label>
    <label><input type="checkbox" name="dxkep" value="menelan"> Gangguan menelan</label>
    <label><input type="checkbox" name="dxkep" value="lukatekan"> Resiko luka tekan</label>
    <label><input type="checkbox" name="dxkep" value="aspirasi"> Resiko aspirasi</label>
    <label><input type="checkbox" name="dxkep" value="konstipasi"> Konstipasi</label>
  </div>
</div>

<div class="question-block" data-qid="dxgizi">
  <div class="q-title">Diagnosis Gizi (pilih yang sesuai)</div>
  <div class="check-stack">
    <label><input type="checkbox" name="dxgizi" value="NI21"> NI-2.1 Asupan oral tidak adekuat</label>
    <label><input type="checkbox" name="dxgizi" value="NI53"> NI-5.3 Penurunan kebutuhan zat gizi spesifik</label>
    <label><input type="checkbox" name="dxgizi" value="NC11"> NC-1.1 Kesulitan menelan</label>
  </div>
</div>
"""


def render_section_hari_rawat():
    parts = []
    parts.append(
        '<div class="day-legend">'
        '<span class="legend-label">Centang hari rawat (H1-H6) saat kegiatan dilakukan:</span>'
        '<div class="legend-days">'
        '<span class="legend-day">H1</span>'
        '<span class="legend-day">H2</span>'
        '<span class="legend-day">H3</span>'
        '<span class="legend-day">H4</span>'
        '<span class="legend-day">H5</span>'
        '<span class="legend-day">H6</span>'
        '</div>'
        '</div>'
    )
    for i, item in enumerate(DAY_ITEMS, start=1):
        parts.append(render_day_item(item, f"d{i}"))
    return "".join(parts)


SECTION_DISCHARGE = """
<div class="question-block" data-qid="kritpulang_umum">
  <div class="q-title">Kriteria Pulang - Umum</div>
  <div class="check-stack">
    <label><input type="checkbox" name="kritumum" value="tandavital"> Tanda vital normal</label>
  </div>
</div>

<div class="question-block" data-qid="kritpulang_khusus">
  <div class="q-title">Kriteria Pulang - Khusus</div>
  <div class="check-stack">
    <label><input type="checkbox" name="kritkhusus" value="fr"> Faktor risiko terkontrol</label>
    <label><input type="checkbox" name="kritkhusus" value="komorbid"> Problem penyakit penyerta teratasi</label>
  </div>
</div>

<div class="question-block" data-qid="rencanapulang">
  <div class="q-title">Rencana Pulang / Edukasi Pelayanan Lanjutan</div>
  <div class="check-stack">
    <label><input type="checkbox" name="rencana" value="perkembangan"> Penjelasan perkembangan penyakit & terapi/tindakan yang mudah dilakukan sesuai kemampuan fungsional</label>
    <label><input type="checkbox" name="rencana" value="diet"> Penjelasan diet sesuai keadaan umum pasien & komorbid</label>
    <label><input type="checkbox" name="rencana" value="kontrol"> Surat pengantar kontrol</label>
  </div>
</div>

<div class="question-block" data-qid="varian">
  <div class="q-title">Varian</div>
  <input type="text" name="varian" placeholder="Varian (jika ada)">
</div>

<div class="question-block" data-qid="tempattanggal">
  <div class="q-title">Tempat & Tanggal</div>
  <input type="text" name="tempattanggal" placeholder="cth: Pontianak, 5 November 2026">
</div>

<div class="question-block" data-qid="dpjp">
  <div class="q-title">Dokter Penanggung Jawab Pelayanan (DPJP)</div>
  <input type="text" name="dpjp_nama" placeholder="Nama DPJP">
  <input type="text" name="dpjp_ttd" placeholder="Tanda tangan (paraf)" style="margin-top:8px;">
</div>

<div class="question-block" data-qid="perawatpj">
  <div class="q-title">Perawat Penanggung Jawab</div>
  <input type="text" name="perawat_nama" placeholder="Nama perawat PJ">
  <input type="text" name="perawat_ttd" placeholder="Tanda tangan (paraf)" style="margin-top:8px;">
</div>

<div class="question-block" data-qid="verifikator">
  <div class="q-title">Pelaksana Verifikasi</div>
  <input type="text" name="verifikator_nama" placeholder="Nama pelaksana verifikasi">
  <input type="text" name="verifikator_ttd" placeholder="Tanda tangan (paraf)" style="margin-top:8px;">
</div>
"""

# ============================================================================
# HTML TEMPLATE
# ============================================================================

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CP Stroke Non Perdarahan - RSUD Dr. Soedarso</title>
<style>
:root {{
  --gf-blue: #1a73e8;
  --gf-purple: #673ab7;
  --gf-header-grad: linear-gradient(135deg, #4285f4 0%, #6a1b9a 50%, #ab47bc 100%);
  --gf-bg: #f0f4f9;
  --gf-card: #ffffff;
  --gf-text: #202124;
  --gf-sub: #5f6368;
  --gf-border: #dadce0;
  --gf-error: #d93025;
  --gf-input-border: #80868b;
  --gf-hover: #f8f9fa;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--gf-bg);
  color: var(--gf-text);
  font-size: 14px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}}

.form-header {{
  background: var(--gf-header-grad);
  min-height: 180px;
  padding: 28px 24px;
  color: #fff;
  position: relative;
}}
.form-header::after {{
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 12px;
  background: rgba(0,0,0,0.08);
}}
.form-header-inner {{
  max-width: 780px;
  margin: 0 auto;
}}
.form-header h1 {{
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: -0.2px;
}}
.form-header .subtitle {{
  font-size: 15px;
  opacity: 0.92;
  font-weight: 400;
}}
.form-header .org-badge {{
  display: inline-block;
  margin-top: 12px;
  padding: 6px 14px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 0.3px;
}}

.progress-wrap {{
  position: sticky;
  top: 0;
  background: var(--gf-bg);
  z-index: 10;
  border-bottom: 1px solid var(--gf-border);
  padding: 10px 0;
}}
.progress-inner {{
  max-width: 780px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 14px;
}}
.progress-bar {{
  flex: 1;
  height: 6px;
  background: var(--gf-border);
  border-radius: 3px;
  overflow: hidden;
}}
.progress-fill {{
  height: 100%;
  background: var(--gf-blue);
  width: 25%;
  transition: width 0.35s ease;
}}
.progress-label {{
  font-size: 12px;
  color: var(--gf-sub);
  white-space: nowrap;
}}

.form-body {{
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 0 80px;
}}
.form-section {{
  background: var(--gf-card);
  border: 1px solid var(--gf-border);
  border-radius: 12px;
  padding: 28px 32px 32px;
  margin-bottom: 18px;
  box-shadow: 0 1px 2px rgba(60,64,67,0.08), 0 2px 6px rgba(60,64,67,0.06);
  display: none;
}}
.form-section.active {{ display: block; }}

.section-title {{
  font-size: 20px;
  font-weight: 500;
  color: var(--gf-text);
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--gf-border);
}}
.section-desc {{
  font-size: 13px;
  color: var(--gf-sub);
  margin-top: -10px;
  margin-bottom: 22px;
  font-style: italic;
}}

.question-block {{
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}}
.question-block:last-child {{ border-bottom: none; }}
.q-title {{
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--gf-text);
}}
.q-desc {{
  font-size: 12.5px;
  color: var(--gf-sub);
  margin-bottom: 10px;
  line-height: 1.5;
}}
.req {{ color: var(--gf-error); font-weight: 600; }}

input[type=text],
input[type=number],
input[type=date],
input[type=time],
textarea {{
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--gf-input-border);
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  color: var(--gf-text);
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}}
input[type=text]:focus,
input[type=number]:focus,
input[type=date]:focus,
input[type=time]:focus,
textarea:focus {{
  outline: none;
  border-color: var(--gf-blue);
  border-width: 2px;
  padding: 9px 11px;
  box-shadow: 0 0 0 1px var(--gf-blue) inset;
}}
textarea {{ resize: vertical; }}

.radio-row, .radio-stack, .check-stack {{
  display: flex;
  flex-direction: column;
  gap: 8px;
}}
.radio-row {{ flex-direction: row; gap: 28px; flex-wrap: wrap; }}
.radio-stack label, .check-stack label, .radio-row label {{
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background 0.12s;
}}
.radio-stack label:hover, .check-stack label:hover, .radio-row label:hover {{
  background: var(--gf-hover);
}}
.radio-stack input, .check-stack input, .radio-row input {{
  margin-top: 3px;
  width: 16px;
  height: 16px;
  accent-color: var(--gf-blue);
  cursor: pointer;
  flex-shrink: 0;
}}

.grid-2col {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
}}

.day-legend {{
  background: #f8f9fc;
  border: 1px dashed var(--gf-border);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}}
.legend-label {{
  font-size: 12.5px;
  color: var(--gf-sub);
  font-style: italic;
}}
.legend-days {{
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  min-width: 240px;
}}
.legend-day {{
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--gf-purple);
  padding: 2px 6px;
  border-radius: 4px;
  background: #ede7f6;
}}

.day-grid {{
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin: 10px 0;
  max-width: 320px;
}}
.day-cell {{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  border: 1px solid var(--gf-border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}}
.day-cell:hover {{
  background: #e8f0fe;
  border-color: var(--gf-blue);
}}
.day-cell input[type=checkbox] {{
  margin: 0;
  width: 14px;
  height: 14px;
  accent-color: var(--gf-blue);
  cursor: pointer;
}}
.day-cell span {{
  font-size: 11px;
  font-weight: 600;
  color: var(--gf-sub);
}}
.day-cell:has(input:checked) {{
  background: #e8f0fe;
  border-color: var(--gf-blue);
}}
.day-cell:has(input:checked) span {{
  color: var(--gf-blue);
}}

.ket-input {{
  margin-top: 6px;
  font-size: 12.5px !important;
  padding: 7px 10px !important;
}}

.sub-list {{
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 12px;
  padding-left: 14px;
  border-left: 3px solid #e8eaf6;
}}
.sub-item {{
  padding: 8px 0;
}}
.sub-title {{
  font-size: 13.5px;
  font-weight: 500;
  color: var(--gf-text);
  margin-bottom: 4px;
}}
.sub-desc {{
  font-size: 12px;
  color: var(--gf-sub);
  margin-bottom: 6px;
  line-height: 1.5;
}}

.btn-row {{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--gf-border);
}}
.btn {{
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.2px;
}}
.btn-secondary {{
  background: #fff;
  color: var(--gf-blue);
  border: 1px solid var(--gf-border);
}}
.btn-secondary:hover {{
  background: #f8f9fa;
  border-color: var(--gf-blue);
}}
.btn-secondary:disabled {{
  color: #bbb;
  cursor: not-allowed;
  border-color: var(--gf-border);
  background: #fff;
}}
.btn-primary {{
  background: var(--gf-blue);
  color: #fff;
}}
.btn-primary:hover {{
  background: #1765cc;
  box-shadow: 0 1px 3px rgba(26,115,232,0.3);
}}
.btn-submit {{
  background: #188038;
  color: #fff;
  padding: 12px 36px;
  font-size: 15px;
}}
.btn-submit:hover {{
  background: #0f6d2c;
  box-shadow: 0 1px 3px rgba(15,109,44,0.4);
}}

.success-page {{
  display: none;
  background: var(--gf-card);
  border: 1px solid var(--gf-border);
  border-radius: 12px;
  padding: 48px 32px;
  text-align: center;
  margin-bottom: 18px;
  box-shadow: 0 1px 2px rgba(60,64,67,0.08);
}}
.success-page.active {{ display: block; }}
.success-icon {{
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #e6f4ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  color: #188038;
  font-weight: 600;
}}
.success-page h2 {{
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 10px;
  color: var(--gf-text);
}}
.success-page p {{
  font-size: 14px;
  color: var(--gf-sub);
  margin-bottom: 8px;
}}
.success-page .ref-id {{
  display: inline-block;
  margin-top: 12px;
  padding: 6px 14px;
  background: #f1f3f4;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: var(--gf-sub);
}}

@media (max-width: 600px) {{
  .form-header {{ padding: 22px 18px; min-height: 150px; }}
  .form-header h1 {{ font-size: 22px; }}
  .form-body {{ padding: 18px 0 60px; }}
  .form-section {{ padding: 20px 18px 22px; margin: 0 12px 14px; }}
  .section-title {{ font-size: 17px; }}
  .grid-2col {{ grid-template-columns: 1fr; gap: 0; }}
  .day-grid {{ max-width: 100%; }}
  .legend-days {{ min-width: 180px; }}
  .progress-inner {{ padding: 0 12px; }}
  .btn {{ padding: 9px 18px; font-size: 13px; }}
}}
</style>
</head>
<body>

<header class="form-header">
  <div class="form-header-inner">
    <h1>Clinical Pathway Stroke Non Perdarahan</h1>
    <div class="subtitle">RSUD Dr. Soedarso &middot; Formulir Pencatatan Kegiatan Perawatan Pasien</div>
    <div class="org-badge">RSUD Dr. SOEDARSO</div>
  </div>
</header>

<div class="progress-wrap">
  <div class="progress-inner">
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    <div class="progress-label" id="progressLabel">Bagian 1 dari 4</div>
  </div>
</div>

<form id="cpForm" class="form-body" autocomplete="off" novalidate>

  <section class="form-section active" data-section="1">
    <div class="section-title">Bagian 1 dari 4 &middot; Identitas Pasien</div>
    <div class="section-desc">Data demografi dan administratif pasien rawat inap.</div>
    {IDENTITAS}
    {BUTTONS_1}
  </section>

  <section class="form-section" data-section="2">
    <div class="section-title">Bagian 2 dari 4 &middot; Diagnosis & Asesmen Masuk</div>
    <div class="section-desc">Diagnosis medis, keperawatan, dan gizi saat pasien masuk.</div>
    {DIAGNOSIS}
    {BUTTONS_2}
  </section>

  <section class="form-section" data-section="3">
    <div class="section-title">Bagian 3 dari 4 &middot; Kegiatan per Hari Rawat (1-6)</div>
    <div class="section-desc">Centang hari rawat (H1-H6) saat setiap kegiatan dilakukan. Tambahkan keterangan bila perlu.</div>
    {HARI_RAWAT}
    {BUTTONS_3}
  </section>

  <section class="form-section" data-section="4">
    <div class="section-title">Bagian 4 dari 4 &middot; Kriteria Pulang & Tanda Tangan</div>
    <div class="section-desc">Kriteria dan rencana pulang, serta penanggung jawab.</div>
    {DISCHARGE}
    <div class="btn-row">
      <button type="button" class="btn btn-secondary" onclick="prevSection(4)">&larr; Kembali</button>
      <button type="submit" class="btn btn-submit">Kirim Formulir</button>
    </div>
  </section>

  <section class="success-page" id="successPage">
    <div class="success-icon">&#10003;</div>
    <h2>Formulir Terekam</h2>
    <p>Terima kasih, data Clinical Pathway Stroke Non Perdarahan telah disubmit.</p>
    <p>Simpan nomor referensi berikut untuk arsip Anda.</p>
    <div class="ref-id" id="refId">REF-XXXXXXXX</div>
    <div style="margin-top:24px;">
      <button type="button" class="btn btn-secondary" onclick="resetForm()">Isi Form Baru</button>
    </div>
  </section>

</form>

<script>
const TOTAL = 4;
let current = 1;

function showSection(n) {{
  document.querySelectorAll('.form-section').forEach(s => {{
    s.classList.toggle('active', s.dataset.section === String(n));
  }});
  const pct = Math.round((n / TOTAL) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = 'Bagian ' + n + ' dari ' + TOTAL;
  window.scrollTo({{ top: 0, behavior: 'smooth' }});
}}

function nextSection(n) {{
  const sec = document.querySelector('.form-section[data-section="' + n + '"]');
  const requiredFields = sec.querySelectorAll('[required]');
  let ok = true;
  requiredFields.forEach(f => {{
    if (f.type === 'radio') {{
      const group = sec.querySelectorAll('[name="' + f.name + '"]:checked');
      if (!group.length) ok = false;
    }} else if (!f.value.trim()) {{
      ok = false;
      f.style.borderColor = '#d93025';
    }}
  }});
  if (!ok) {{
    alert('Mohon lengkapi pertanyaan wajib (bertanda *) pada bagian ini.');
    return;
  }}
  if (n < TOTAL) {{
    current = n + 1;
    showSection(current);
  }}
}}

function prevSection(n) {{
  if (n > 1) {{
    current = n - 1;
    showSection(current);
  }}
}}

document.addEventListener('input', e => {{
  if (e.target.style && e.target.style.borderColor === 'rgb(217, 48, 37)') {{
    e.target.style.borderColor = '';
  }}
}});

document.getElementById('cpForm').addEventListener('submit', e => {{
  e.preventDefault();
  const sec = document.querySelector('.form-section[data-section="4"]');
  let ok = true;
  sec.querySelectorAll('[required]').forEach(f => {{
    if (f.type === 'radio') {{
      const g = sec.querySelectorAll('[name="' + f.name + '"]:checked');
      if (!g.length) ok = false;
    }} else if (!f.value.trim()) {{
      ok = false;
    }}
  }});
  if (!ok) {{
    alert('Mohon lengkapi pertanyaan wajib (bertanda *) pada bagian ini.');
    return;
  }}
  const ref = 'CP-STROKE-' + Date.now().toString(36).toUpperCase().slice(-8);
  document.getElementById('refId').textContent = ref;
  document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
  document.getElementById('successPage').classList.add('active');
  document.querySelector('.progress-wrap').style.display = 'none';
  window.scrollTo({{ top: 0, behavior: 'smooth' }});
}});

function resetForm() {{
  document.getElementById('cpForm').reset();
  document.getElementById('successPage').classList.remove('active');
  document.querySelector('.progress-wrap').style.display = '';
  current = 1;
  showSection(1);
}}

showSection(1);
</script>

</body>
</html>
"""

BUTTONS_1 = """
    <div class="btn-row">
      <button type="button" class="btn btn-secondary" disabled>&larr; Kembali</button>
      <button type="button" class="btn btn-primary" onclick="nextSection(1)">Berikutnya &rarr;</button>
    </div>
"""
BUTTONS_2 = """
    <div class="btn-row">
      <button type="button" class="btn btn-secondary" onclick="prevSection(2)">&larr; Kembali</button>
      <button type="button" class="btn btn-primary" onclick="nextSection(2)">Berikutnya &rarr;</button>
    </div>
"""
BUTTONS_3 = """
    <div class="btn-row">
      <button type="button" class="btn btn-secondary" onclick="prevSection(3)">&larr; Kembali</button>
      <button type="button" class="btn btn-primary" onclick="nextSection(3)">Berikutnya &rarr;</button>
    </div>
"""


def main():
    hari_rawat_html = render_section_hari_rawat()
    html_out = HTML_TEMPLATE.format(
        IDENTITAS=SECTION_IDENTITAS,
        DIAGNOSIS=SECTION_DIAGNOSIS,
        HARI_RAWAT=hari_rawat_html,
        DISCHARGE=SECTION_DISCHARGE,
        BUTTONS_1=BUTTONS_1,
        BUTTONS_2=BUTTONS_2,
        BUTTONS_3=BUTTONS_3,
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html_out, encoding="utf-8")
    size_kb = OUT.stat().st_size / 1024
    print(f"OK -> {OUT}  ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
