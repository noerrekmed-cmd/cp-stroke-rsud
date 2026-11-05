# 🚀 Panduan Deployment ke Vercel

Panduan lengkap untuk deploy aplikasi **CP Stroke Non Perdarahan RSUD Dr. Soedarso** ke Vercel gratis dengan custom subdomain `*.vercel.app` (tanpa "z.ai" di URL).

---

## 📋 Prasyarat

- Akun **GitHub** (gratis) — https://github.com
- Akun **Vercel** (gratis, sign up dengan GitHub) — https://vercel.com
- Akun **Neon** (gratis, 0.5GB Postgres) — https://neon.tech

---

## 🗺️ Arsitektur Setelah Deploy

```
Browser User ──> https://cp-stroke-rsud.vercel.app
                         │
                         ├── Vercel (Next.js app, serverless)
                         │
                         └── Neon Postgres (data persistence)
                              │
                              └── StrokeFormSubmission table
```

---

## Langkah 1: Setup Database Neon (Postgres gratis)

1. Buka https://neon.tech → klik **Sign up** (pakai GitHub)
2. Setelah login, klik **New Project**
   - **Name:** `cp-stroke-rsud`
   - **Postgres version:** 16 (default)
   - **Region:** `AWS Asia Southeast (Singapore)` — terdekat dengan Indonesia
3. Klik **Create project**
4. Di dashboard project Neon, cari bagian **Connection string**
5. Copy URL dengan format:
   ```
   postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/cp_stroke?sslmode=require
   ```
   → Simpan di Notes/Notepad, akan dipakai di Langkah 4.

---

## Langkah 2: Push Kode ke GitHub

### Opsi A: Pakai GitHub CLI (paling cepat)

```bash
# Install GitHub CLI (jika belum)
# - Ubuntu: sudo apt install gh
# - Mac: brew install gh
# - Windows: https://cli.github.com

# Login
gh auth login

# Dari dalam folder project, jalankan:
gh repo create cp-stroke-rsud --public --source=. --remote=origin --push

# Cek hasil
gh repo view cp-stroke-rsud --web
```

### Opsi B: Pakai git manual

```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "Initial commit - CP Stroke Non Perdarahan RSUD Dr. Soedarso"
git branch -M main

# Buat repo kosong di https://github.com/new (jangan centang README)
# Lalu hubungkan dan push:
git remote add origin https://github.com/USERNAME_ANDA/cp-stroke-rsud.git
git push -u origin main
```

---

## Langkah 3: Import ke Vercel

1. Buka https://vercel.com → klik **Sign Up** / **Log In** pakai GitHub
2. Klik **Add New** → **Project**
3. Cari repo `cp-stroke-rsud` → klik **Import**
4. Vercel auto-detect sebagai Next.js project. **JANGAN klik Deploy dulu** — kita perlu set Environment Variables.

---

## Langkah 4: Set Environment Variables di Vercel

Di halaman import Vercel, scroll ke **Environment Variables** dan tambahkan:

| Key | Value | Environment |
|---|---|---|
| `DATABASE_URL` | (paste URL Neon dari Langkah 1) | All Environments (Production, Preview, Development) |
| `ADMIN_PIN` | (PIN baru yang kuat, mis. `Stroke2026!RSUD`) | Production |

**Penting:** Pastikan `DATABASE_URL` di-set ke URL Postgres Neon, **BUKAN** URL SQLite (`file:...`).

---

## Langkah 5: Tambahkan SECRET untuk ADMIN_PIN

Pada Vercel, untuk value sensitif seperti PIN, lebih aman pakai Vercel Secrets:

1. Buka terminal lokal (di folder project):
   ```bash
   npm i -g vercel
   vercel login
   vercel link  # link folder lokal ke project Vercel
   vercel env add ADMIN_PIN production
   # paste PIN kuat saat diminta
   ```

2. Atau cukup masukkan langsung sebagai env var di step 4 (lebih simpel).

---

## Langkah 6: Deploy!

1. Klik tombol **Deploy** di Vercel
2. Tunggu 2-3 menit. Vercel akan:
   - `bun install` (install dependencies)
   - Run `bash scripts/vercel-build.sh` yang akan:
     - Auto-detect DATABASE_URL Postgres → swap schema provider ke `postgresql`
     - `prisma generate` (generate client)
     - `prisma db push --accept-data-loss` (create tables di Neon)
     - `next build` (build Next.js)
3. Setelah selesai, Anda akan dapat URL: **`https://cp-stroke-rsud.vercel.app`** (atau nama random lain — bisa di-rename)

---

## Langkah 7: Verifikasi Deployment

Buka URL Vercel yang baru di browser:

1. ✅ Form CP Stroke tampil dengan header gradient ungu-biru
2. ✅ Isi form → submit → data tersimpan
3. ✅ Akses `https://cp-stroke-rsud.vercel.app/?view=submissions`
4. ✅ Masukkan PIN admin → lihat data yang sudah disubmit
5. ✅ Test export CSV dan detail view

---

## Langkah 8 (Opsional): Custom Subdomain

1. Di Vercel project → **Settings** → **Domains**
2. Tambah domain custom, misalnya:
   - Subdomain Vercel gratis: `cp-stroke-rsud.vercel.app` (default)
   - Atau domain sendiri: `cp-stroke.rsudsoedarso.go.id` (butuh akses DNS)
3. Untuk domain RS sendiri:
   - Beli/bawa domain `.go.id` atau `.or.id`
   - Update DNS record ke Vercel nameservers
   - Ikuti instruksi Vercel untuk verifikasi

---

## 🔧 Custom Domain RS (Opsional)

Jika RSUD Dr. Soedarso ingin hosting di server sendiri (bukan Vercel cloud):

### Opsi Self-Hosted (Docker / VM)

```bash
# Di server RS:
git clone https://github.com/USERNAME_ANDA/cp-stroke-rsud.git
cd cp-stroke-rsud

# Set env vars
cp .env.example .env
# Edit .env, set DATABASE_URL ke Postgres server RS

# Build & start
bun install
bun run db:push
bun run build
bun run start
```

Reverse proxy via nginx/Caddy dengan domain RS.

---

## ❓ Troubleshooting

### Error: `DATABASE_URL is not set` di Vercel
- Cek Environment Variables di Vercel dashboard
- Pastikan `DATABASE_URL` ada di **All Environments**

### Error: `Prisma can't reach database`
- Cek URL Neon — pastikan pakai format `?sslmode=require`
- Cek region Neon = Singapore untuk latency terbaik dari Indonesia

### Form submit gagal dengan "Server error"
- Cek Vercel logs: dashboard project → **Logs** → filter by time
- Pastikan `prisma db push` sudah di-run (lihat Langkah 6)

### Data hilang setelah deploy ulang
- **Normal** jika belum setup database Postgres — SQLite lokal tidak persistent di Vercel
- Pastikan pakai Neon Postgres (Langkah 1) untuk data persistence

### Lupa PIN admin
- Edit env var `ADMIN_PIN` di Vercel dashboard
- Redeploy aplikasi

---

## 📞 Butuh Bantuan?

Jika ada masalah deployment, cek:
1. **Vercel Build Logs** (paling detail)
2. **Vercel Runtime Logs** (saat app jalan)
3. **Neon SQL Editor** (cek data di database)
