// Form data structure for Clinical Pathway Stroke Non Perdarahan
// RSUD Dr. Soedarso

export interface DaySubItem {
  title: string;
  desc?: string;
}

export interface DayItem {
  no: string;
  title: string;
  desc?: string;
  sub: DaySubItem[];
}

export const DAY_ITEMS: DayItem[] = [
  {
    no: "1",
    title: "Asesmen Awal",
    desc: "Asesmen awal medis oleh DPJP dan keperawatan. Minimal 1 dari gejala terpenuhi.",
    sub: [
      {
        title: "Asesmen Awal Medis (DPJP)",
        desc: "Pemeriksaan dokter & neurologis (tingkat kesadaran, kejang, kaku kuduk, refleks batang otak, nervus cranialis, gangguan sensorik, refleks babinsky, MMSE <26, pemeriksaan fisik umum).",
      },
      {
        title: "Gejala Waktu Serangan",
        desc: "Kelemahan anggota gerak sesisi mendadak; Nyeri kepala; Muntah proyektil; Penurunan kesadaran mendadak; Gangguan bicara mendadak.",
      },
      {
        title: "Faktor Risiko",
        desc: "Hipertensi; TIA; Diabetes mellitus; Serangan jantung; Hiperkolesterolemia; Merokok; Stroke sebelumnya.",
      },
      {
        title: "Konsultasi",
        desc: "Rehabilitasi Medik / Penyakit Dalam / Jantung / Rawat bersama.",
      },
      {
        title: "Asesmen Awal Keperawatan",
        desc: "Asesmen sesuai format keperawatan, termasuk asesmen khusus stroke: gangguan menelan, komunikasi, mobilisasi, perilaku/kognitif.",
      },
    ],
  },
  {
    no: "2",
    title: "Laboratorium",
    desc: "Hb, AL, AT, diftell, AE, urin rutin, AGD, PT, APTT, INR, albumin, elektrolit, creatinin, ureum. Faktor risiko vaskular: HbA1C, GDP, Profil lipid, Asam Urat.",
    sub: [],
  },
  {
    no: "3",
    title: "Radiologi / Imaging",
    desc: "HCTS non kontras; Rontgen Thorax.",
    sub: [],
  },
  {
    no: "4",
    title: "Penunjang Lain",
    desc: "EKG; TCD.",
    sub: [],
  },
  {
    no: "5",
    title: "Asesmen Lanjutan",
    desc: "Asesmen lanjutan medis, keperawatan, gizi, dan farmasi.",
    sub: [
      {
        title: "A. Asesmen Medis (DPJP)",
        desc: "SOAP, evaluasi defisit neurologis, visite harian / follow up.",
      },
      {
        title: "A. Asesmen Medis (Non-DPJP)",
        desc: "SOAP, atas indikasi / emergency.",
      },
      {
        title: "B. Asesmen Keperawatan",
        desc: "Barthel index; Resiko jatuh (3 shift); Gerak & kekuatan otot (3 shift); GCS & tanda vital (3 shift); Nyeri; Gangguan menelan; Gangguan komunikasi; Gangguan eliminasi.",
      },
      {
        title: "C. Asesmen Gizi",
        desc: "Antropometri; Biokimia; Fisik/klinis; Riwayat makan.",
      },
      {
        title: "D. Asesmen Farmasi",
        desc: "Rekonsiliasi obat (wajib hari 1 dan hari 6, serta saat pindah ruang); Telaah resep (komunikasi ke dokter jika ada permasalahan).",
      },
    ],
  },
  {
    no: "7",
    title: "Discharge Planning",
    desc: "Identifikasi kebutuhan edukasi & latihan selama perawatan; Identifikasi kebutuhan di rumah; Penjelasan diet pasien.",
    sub: [],
  },
  {
    no: "8",
    title: "Edukasi Terintegrasi",
    desc: "Edukasi kolaborasi multidisiplin kepada pasien & keluarga.",
    sub: [
      {
        title: "A. Edukasi / Informasi Medis",
        desc: "Penjelasan diagnosis; Rencana terapi; Informed consent.",
      },
      {
        title: "B. Edukasi & Konseling Gizi",
        desc: "Edukasi & konseling gizi terkait diet (Hipertensi/Rendah Kolesterol/DM, dll).",
      },
      {
        title: "C. Edukasi Keperawatan",
        desc: "Pencegahan jatuh; Pemenuhan ADL; Prinsip merawat pasien stroke di rumah; Pencegahan luka tekan.",
      },
      {
        title: "D. Edukasi Farmasi",
        desc: "Konseling & informasi obat (saat dapat obat pertama & saat pulang); Kepatuhan minum obat.",
      },
      {
        title: "Pengisian Formulir Edukasi Terintegrasi",
        desc: "Lembar Edukasi Terintegrasi.",
      },
    ],
  },
  {
    no: "9",
    title: "Terapi Medikamentosa",
    desc: "Terapi obat sesuai kondisi pasien.",
    sub: [
      {
        title: "a. Antiplatelet (salah satu: Aspilet / Clopidogrel / DAPT)",
        desc: "Kecuali ada kontraindikasi.",
      },
      {
        title: "b. Cairan Infus",
        desc: "Sesuai kondisi pasien.",
      },
      {
        title: "c. Obat Oral Lain",
        desc: "Sesuai kondisi pasien.",
      },
    ],
  },
  {
    no: "10",
    title: "Tatalaksana Intervensi (TLI)",
    desc: "Manajemen intervensi multidisiplin.",
    sub: [
      {
        title: "a. TLI Medis",
        desc: "Trombolisis; ...",
      },
      {
        title: "b. TLI Keperawatan",
        desc: "Manajemen risiko perfusi cerebral; gangguan menelan; gangguan mobilitas fisik; kerusakan komunikasi verbal; dukungan perawatan diri; risiko jatuh; risiko luka tekan; pencegahan aspirasi; konstipasi.",
      },
      {
        title: "c. TLI Gizi",
        desc: "Energi 25-45 kkal/kgBB; Protein 0,8-1,2 g/kgBB; Lemak 20-25% energi total; Karbohidrat 60-70% energi total; Kolesterol <300 mg; Purin 120-150 mg; Natrium 1500-2300 mg; Bentuk cair/lunak/tim/nasi.",
      },
      {
        title: "d. TLI Farmasi",
        desc: "Mengkaji Drug Related Problems (interaksi obat via software); Rekomendasi pada DPJP.",
      },
    ],
  },
  {
    no: "11",
    title: "Monitoring dan Evaluasi",
    desc: "Monitor perkembangan pasien oleh masing-masing disiplin.",
    sub: [
      {
        title: "a. Dokter DPJP",
        desc: "SSGM; GCS; Tanda vital; Skala nyeri; Barthel index; MMSE.",
      },
      {
        title: "b. Keperawatan",
        desc: "Tanda vital, GCS, gerak & kekuatan otot; Kemampuan menelan; Kemampuan komunikasi; Pemenuhan ADL; Pencegahan jatuh; Keutuhan kulit & luka tekan; Frekuensi BAB.",
      },
      {
        title: "c. Gizi",
        desc: "Monitoring asupan makan; antropometri; biokimia; fisik/klinis terkait gizi.",
      },
      {
        title: "d. Farmasi",
        desc: "Monitoring interaksi obat (jika ada); efek samping obat; pemantauan terapi obat melalui instruksi pemberian obat.",
      },
      {
        title: "Rehabilitasi Medis",
        desc: "Fisioterapi; Terapi wicara; Okupasi terapi (sesuai indikasi).",
      },
    ],
  },
  {
    no: "12",
    title: "Mobilisasi / Rehabilitasi",
    desc: "Tahapan mobilisasi sesuai kondisi pasien.",
    sub: [
      {
        title: "b. Keperawatan - Mandiri",
        desc: "Pasien melakukan aktivitas tanpa bantuan.",
      },
      {
        title: "b. Keperawatan - Dibantu Sebagian",
        desc: "Pasien melakukan aktivitas dengan bantuan sebagian.",
      },
      {
        title: "b. Keperawatan - Dibantu Total",
        desc: "Pasien membutuhkan bantuan total.",
      },
    ],
  },
  {
    no: "13",
    title: "Outcome / Hasil",
    desc: "Luaran klinis & fungsional yang diukur.",
    sub: [
      {
        title: "a. Medis",
        desc: "Perbaikan luaran klinis & fungsional diukur dari NIHSS, SSGM, ADL, IADL, BI.",
      },
      {
        title: "b. Keperawatan",
        desc: "Perfusi jaringan serebral membaik; disfagia membaik; mobilitas fisik membaik; komunikasi membaik; kebutuhan perawatan diri terpenuhi; pasien aman tidak jatuh; tidak terjadi luka tekan; tidak terjadi aspirasi; tidak terjadi konstipasi.",
      },
      {
        title: "c. Gizi",
        desc: "Tidak terjadi penurunan status gizi.",
      },
      {
        title: "d. Farmasi",
        desc: "Terapi obat sesuai indikasi (rasional); Kepatuhan minum obat.",
      },
    ],
  },
];

export const DX_KEPERAWATAN_OPTIONS = [
  { value: "perfusi", label: "Resiko perfusi serebral tidak efektif" },
  { value: "jatuh", label: "Resiko jatuh" },
  { value: "adl", label: "Kurang perawatan diri" },
  { value: "komunikasi", label: "Hambatan komunikasi verbal" },
  { value: "mobilitas", label: "Gangguan mobilitas fisik" },
  { value: "menelan", label: "Gangguan menelan" },
  { value: "lukatekan", label: "Resiko luka tekan" },
  { value: "aspirasi", label: "Resiko aspirasi" },
  { value: "konstipasi", label: "Konstipasi" },
];

export const DX_GIZI_OPTIONS = [
  { value: "NI21", label: "NI-2.1 Asupan oral tidak adekuat" },
  { value: "NI53", label: "NI-5.3 Penurunan kebutuhan zat gizi spesifik" },
  { value: "NC11", label: "NC-1.1 Kesulitan menelan" },
];

// Admin PIN for viewing submissions (default: 1234)
// Override with ADMIN_PIN env variable
export const ADMIN_PIN = process.env.ADMIN_PIN || "1234";
