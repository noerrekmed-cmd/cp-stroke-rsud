# CP Stroke Non Perdarahan — RSUD Dr. Soedarso

Aplikasi web fullstack untuk pencatatan **Clinical Pathway (CP) Stroke Non Perdarahan** di RSUD Dr. Soedarso. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, dan Prisma ORM.

## ✨ Fitur

- **Form multi-section Google Forms style** (4 bagian, multi-step navigation)
- **Checkbox per Hari Rawat (H1-H6)** untuk setiap kegiatan (13 kegiatan × sub-item = 38 baris)
- **Penyimpanan data** ke database PostgreSQL via Prisma
- **Panel admin** dengan PIN gate untuk melihat data tersimpan
- **Export CSV** untuk analisis data
- **Detail view per submission** dengan tombol Cetak/PDF
- **Responsive mobile** (H1-H6 tetap 1 baris di layar 400px)

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL (Neon untuk production, SQLite untuk dev lokal) |
| ORM | Prisma 6 |
| Package Manager | Bun |

## 📂 Struktur Project

```
src/
├── app/
│   ├── api/cp-stroke/
│   │   ├── route.ts          # POST submit + GET list
│   │   ├── [id]/route.ts     # GET detail submission
│   │   └── export/route.ts   # GET CSV export
│   ├── icon.svg              # Favicon (medical cross)
│   ├── layout.tsx            # Root layout + metadata
│   ├── page.tsx              # Main page (form / admin / detail)
│   └── globals.css
├── components/cp-stroke/
│   ├── form-view.tsx         # Halaman form (4 sections)
│   ├── submissions-list.tsx  # List admin
│   ├── submission-detail.tsx # Detail view
│   └── day-checkbox-grid.tsx # Reusable H1-H6 grid
└── lib/
    ├── cp-stroke-data.ts     # Form structure (DAY_ITEMS, options, ADMIN_PIN)
    └── db.ts                 # Prisma client

prisma/
└── schema.prisma             # Model StrokeFormSubmission

scripts/
└── vercel-build.sh           # Auto-switch sqlite→postgres untuk Vercel deploy

vercel.json                   # Vercel build config
DEPLOY.md                     # 📖 Panduan deployment lengkap
.env.example                  # Template env vars
```

## 🚀 Quick Start (Dev Lokal)

```bash
# Install dependencies
bun install

# Setup database (SQLite lokal)
bun run db:push

# Run dev server
bun run dev
# → buka http://localhost:3000
```

PIN admin default: `1234` (lihat `ADMIN_PIN` di `.env`)

## 📖 Deployment ke Production

Untuk deploy ke Vercel dengan custom subdomain (`*.vercel.app`, tanpa "z.ai"):

**Baca: [`DEPLOY.md`](./DEPLOY.md)** — panduan step-by-step lengkap dari setup database Neon Postgres sampai deploy ke Vercel.

## 🔒 Catatan Keamanan

- **Ganti PIN admin default** (`1234`) sebelum production via env `ADMIN_PIN`
- Data pasien sensitif (No. RM, nama, diagnosa) — pastikan akses admin terbatas
- Untuk production RS, pertimbangkan:
  - HTTPS only (default di Vercel)
  - Backup database Neon (auto di free tier)
  - Audit log akses admin (fitur tambahan)

## 📜 Lisensi

Internal use — RSUD Dr. Soedarso.
