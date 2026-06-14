# Secangkir

Platform dua sisi yang menghubungkan **warung kopi lokal Indonesia** dengan konsumen yang mencari tempat ngopi berdasarkan mood dan vibe mereka.

**SDG 8 — Decent Work and Economic Growth:** membantu UMKM warung kopi lokal tampil lebih profesional secara digital.

## Alur utama

**Owner:** register → isi profil warung + pin lokasi → AI generate bio, tagline, 5 caption Instagram → kelola dari dashboard.

**Konsumen:** tulis mood bebas ("mau nugas, tenang, budget 20rb") → AI cocokkan dengan warung terbaik + alasan → tampil sebagai card + pin di peta.

## Tech stack

| Layer | Pilihan |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Auth + DB | Supabase (Auth + PostgreSQL + RLS) via `@supabase/ssr` |
| AI | Gemini 2.5 Flash via Gemini REST API (server-side only) |
| Maps | Leaflet + OpenStreetMap via `react-leaflet` (tanpa API key) |
| Validasi | Zod — semua input API route |
| Rate limit | `@upstash/ratelimit` + Upstash Redis (fallback in-memory) |
| Styling | Tailwind CSS dengan kopi color palette |
| Deploy | Vercel |

## Setup lokal

### 1. Clone dan install

```bash
git clone https://github.com/<username>/secangkir.git
cd secangkir
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```bash
# Supabase — dari Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Gemini — dari Google AI Studio (aistudio.google.com)
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.5-flash   # opsional, ini default-nya

# Upstash Redis — opsional, kalau tidak diisi pakai in-memory fallback
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

> `GEMINI_API_KEY` tidak boleh diawali `NEXT_PUBLIC_` — harus server-side only.

### 3. Jalankan schema database

Buka [Supabase SQL Editor](https://supabase.com/dashboard) lalu jalankan isi file `supabase/schema.sql`.

Schema membuat:
- Tabel `warung` dengan semua kolom yang dibutuhkan
- Index pada `owner_id`, `created_at`, dan `vibe_tags` (GIN)
- RLS: owner hanya bisa manage warung sendiri, publik bisa read semua
- Trigger `updated_at` otomatis

### 4. Nonaktifkan konfirmasi email Supabase

Untuk demo: **Authentication > Providers > Email** → matikan "Confirm email". Tanpa ini, registrasi tidak langsung membuat sesi aktif.

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Struktur folder

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── auth/page.tsx             # Login / Register owner
│   ├── dashboard/page.tsx        # Dashboard owner
│   ├── onboard/page.tsx          # Form onboarding warung
│   ├── explore/page.tsx          # Pencarian mood konsumen
│   ├── warung/[id]/page.tsx      # Detail warung (publik)
│   └── api/v1/
│       ├── generate/route.ts     # POST: generate konten AI
│       └── match/route.ts        # POST: cocokkan mood ke warung
├── components/
│   ├── AuthForm.tsx
│   ├── OnboardForm.tsx
│   ├── AiContentPanel.tsx
│   ├── MoodInput.tsx
│   ├── WarungCard.tsx
│   ├── WarungDetailClient.tsx    # Copy buttons untuk caption
│   ├── WarungDetailMap.tsx
│   └── MapView.tsx
└── lib/
    ├── types.ts                  # Warung, GeneratedContent, MatchResult
    ├── schemas.ts                # Zod schemas
    ├── gemini.ts                 # generateWarungContent + matchMoodToWarung
    ├── ratelimit.ts              # Rate limiter (Upstash / in-memory)
    └── supabase/
        ├── client.ts             # Browser client
        ├── server.ts             # Server client
        └── middleware.ts         # Session refresh + auth guard
```

## API routes

Semua route di bawah `/api/v1/` dengan rate limit 20 req/menit per IP.

| Method | Route | Auth | Keterangan |
|---|---|---|---|
| `POST` | `/api/v1/generate` | Owner | Generate bio/tagline/caption untuk warung |
| `POST` | `/api/v1/match` | Publik | Cocokkan mood ke warung (maks 3 hasil) |

## Deploy ke Vercel

```bash
vercel --prod
```

Set environment variables yang sama di Vercel Dashboard > Settings > Environment Variables.

## ADR singkat

**PostgreSQL (Supabase) bukan MongoDB** — data warung relasional (owner → warung → vibe_tags array). PostgreSQL array type + RLS + Auth integration lebih cocok; Supabase juga menghilangkan kebutuhan auth service terpisah.

**Leaflet bukan Google Maps** — Google Maps perlu billing setup. Leaflet + OpenStreetMap zero-config, gratis, cukup untuk menampilkan pin dan picker lokasi.

**Gemini REST bukan SDK** — hanya dua server-side call. Pakai raw `fetch` ke REST API menghindari dependency tambahan; `responseMimeType: application/json` + `responseSchema` menjamin output JSON yang bisa di-parse tanpa parsing fragile.

**Rate limit in-memory fallback** — Upstash opsional. Kalau tidak dikonfigurasi, rate limiter pakai Map in-memory per-process. Cukup untuk demo; production pakai Upstash Redis.
