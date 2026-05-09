<p align="center">
  <img src="./static/home/heading-full.png" alt="SIKOPLING" width="420" />
</p>

<p align="center">
  Portal layanan informasi dan pengelolaan antrian persetujuan lingkungan.
</p>

![Svelte](https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2-ff3e00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6e9f18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.58-2ead33?logo=playwright&logoColor=white)

## Link

[![Asset SIKOPLING](https://img.shields.io/badge/Drive-Sikopling-0F9D58?logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/100V7CrI6LjbkllF8kWAbIO6P5ze_u6x6)
[![Figma Workflow](https://img.shields.io/badge/Figma-Sikopling-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/design/vf54g0g6E2cwoMbY12GXpQ/Workflow-Sikopling?node-id=0-1&p=f&t=942eIymLDssYNfAi-0)

## Status

`Internal / Confidential` - repository ini untuk penggunaan internal tim.

README ini disinkronkan dengan kondisi kode pada **26 April 2026**.

## Ringkasan Sistem

SIKOPLING saat ini terdiri dari dua area utama:

1. **Area publik**
   - landing page interaktif,
   - halaman profil, kontak, kebijakan privasi, ketentuan layanan,
   - antrian publik dokling dan pertek dari data Supabase (service role).
2. **Area admin**
   - login Supabase Auth (role-based),
   - dashboard ringkasan,
   - manajemen data antrian dokling/pertek (filter, CRUD, import CSV, export CSV),
   - endpoint API admin untuk operasi data.

## Fitur Utama

- **Universal Search** lintas halaman publik (`Ctrl/Cmd + K`) dengan highlight otomatis hasil pencarian pada konten.
- **Landing page** modern dengan hero video, statistik animasi, showcase layanan, FAQ, dan CTA.
- **Antrian publik** (`/layanan/perling`, `/layanan/pertek`) dengan:
  - pencarian,
  - filter,
  - sorting,
  - pagination,
  - responsive expandable row (mobile),
  - export CSV di sisi klien.
- **Panel admin** dengan proteksi role:
  - role valid: `super_admin`, `admin`, `operator`, `reviewer`,
  - sidebar desktop + mobile drawer,
  - session keep-alive otomatis (`/admin/session`).
- **Manajemen data admin (dokling/pertek)**:
  - tambah data (modal),
  - edit data (modal),
  - hapus data tunggal/massal (dengan pembatasan role),
  - import CSV (`/admin/api/[layanan]/import`),
  - export CSV (`/admin/api/[layanan]/export`),
  - metrik ringkasan per layanan (total/selesai/diproses/ditolak).
- **Monitoring admin umum** (`/admin/monitoring`) untuk lintas layanan:
  - filter komprehensif,
  - sorting server-side,
  - update status + posisi.
- **Integrasi Supabase SSR** + manajemen cookie auth (termasuk opsi "ingat saya").
- **Vercel Analytics** di root layout.

## Struktur Project (Terkini)

```text
.
├── src/                                           # Source code utama aplikasi
│   ├── app.d.ts
│   ├── app.html
│   ├── hooks.server.ts                            # SSR hooks + Supabase session + cache header
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.png
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── PositionDropdown.svelte
│   │   │   │   └── StatusDropdown.svelte
│   │   │   ├── badges/
│   │   │   │   └── PengajuanStatusBadge.svelte
│   │   │   └── home/
│   │   │       ├── Navbar.svelte
│   │   │       ├── ChatbotWidget.svelte
│   │   │       ├── SiteFooter.svelte
│   │   │       ├── HorizontalScroll.svelte
│   │   │       └── StackedCard.svelte
│   │   ├── constants/
│   │   │   ├── universal-search.ts
│   │   │   └── universal-search.test.ts
│   │   ├── server/
│   │   │   ├── admin-route.ts
│   │   │   ├── admin-session.ts
│   │   │   ├── antrian-pengajuan.ts
│   │   │   ├── public-queue.ts
│   │   │   └── supabase-auth.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       ├── env.ts
│   │       ├── constants.ts
│   │       └── database.types.ts
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── layout.css
│       ├── layanan/
│       │   ├── dokling/
│       │   │   ├── +page.server.ts
│       │   │   └── +page.svelte
│       │   └── pertek/
│       │       ├── +page.server.ts
│       │       └── +page.svelte
│       ├── login/
│       │   ├── +page.server.ts
│       │   └── +page.svelte
│       ├── logout/
│       │   └── +server.ts
│       ├── profil/
│       │   └── +page.svelte
│       ├── tentang/
│       │   └── +page.ts                         # Redirect ke /profil
│       ├── kontak/
│       │   └── +page.svelte
│       ├── kebijakan-privasi/
│       │   └── +page.svelte
│       ├── ketentuan-layanan/
│       │   └── +page.svelte
│       └── admin/
│           ├── +layout.server.ts
│           ├── +layout.svelte
│           ├── +page.server.ts
│           ├── dashboard/
│           │   ├── +page.server.ts
│           │   └── +page.svelte
│           ├── dokling/
│           │   ├── +page.server.ts
│           │   └── +page.svelte
│           ├── pertek/
│           │   ├── +page.server.ts
│           │   └── +page.svelte
│           ├── monitoring/
│           │   ├── +page.server.ts
│           │   ├── +page.svelte
│           │   ├── +server.ts
│           │   └── [id]/
│           │       └── +server.ts
│           ├── api/
│           │   └── [layanan]/
│           │       ├── import/
│           │       │   └── +server.ts
│           │       └── export/
│           │           └── +server.ts
│           ├── profil/
│           │   └── +page.svelte
│           ├── pengaturan/
│           │   └── +page.svelte
│           └── session/
│               └── +server.ts
├── static/                                        # Asset statis (gambar, video, lottie)
│   ├── home/
│   ├── layout/
│   ├── login/
│   ├── tentang/
│   ├── kontak/
│   └── robots.txt
├── supabase/
│   ├── migrations/                                # SQL migrasi schema & policy
│   │   ├── 20260423144841_remote_schema.sql
│   │   ├── 20260423223000_create_antrian_pengajuan.sql
│   │   ├── 20260424143000_allow_admin_operator_delete_antrian_pengajuan.sql
│   │   ├── 20260424150000_restrict_delete_to_super_admin.sql
│   │   ├── 20260426103000_allow_nullable_duplicate_no_registrasi.sql
│   │   └── 20260509143000_detach_workflow_history.sql
│   └── .temp/                                     # Metadata lokal Supabase CLI
├── tests/
│   └── home.e2e.ts                                # E2E Playwright
├── .env.example
├── package.json
├── playwright.config.ts
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── contributing.md
└── LICENSE
```

## Route Aktif

### Publik

| Route | Keterangan |
| --- | --- |
| `/` | Landing page utama |
| `/layanan/perling` | Antrian dokumen lingkungan (publik) |
| `/layanan/pertek` | Antrian persetujuan teknis (publik) |
| `/profil` | Halaman profil layanan SIKOPLING |
| `/tentang` | Redirect 308 ke `/profil` |
| `/kontak` | Halaman kontak + peta + FAQ |
| `/kebijakan-privasi` | Halaman kebijakan privasi |
| `/ketentuan-layanan` | Halaman ketentuan layanan |
| `/login` | Halaman login admin |
| `/logout` | Logout sesi auth |

### Admin

| Route | Keterangan |
| --- | --- |
| `/admin` | Redirect 307 ke `/admin/dashboard` |
| `/admin/dashboard` | Ringkasan metrik dan aktivitas login |
| `/admin/perling` | Operasional data antrian perling |
| `/admin/pertek` | Operasional data antrian pertek |
| `/admin/monitoring` | Monitoring operasional lintas layanan |
| `/admin/profil` | Informasi akun admin aktif |
| `/admin/pengaturan` | Halaman preferensi UI admin (placeholder fungsional) |

### API Admin

| Endpoint | Method | Fungsi |
| --- | --- | --- |
| `/admin/session` | `GET`, `POST` | Keep-alive sesi admin |
| `/admin/monitoring` | `GET` | List data monitoring (server-side filter/sort/page) |
| `/admin/monitoring` | `POST` | Create data monitoring |
| `/admin/monitoring` | `PATCH` | Update status + posisi |
| `/admin/monitoring/[id]` | `PATCH` | Update detail data per id |
| `/admin/monitoring/[id]` | `DELETE` | Hapus data (dibatasi role) |
| `/admin/api/[layanan]/import` | `POST` | Import CSV (`dokling`/`pertek`) |
| `/admin/api/[layanan]/export` | `GET` | Export CSV (`dokling`/`pertek`) |

## Arsitektur Data (Supabase)

Tabel utama:

- `antrian_pengajuan`
  - menyimpan data antrian dokling/pertek,
  - memiliki trigger update `updated_at` dan `tanggal_update`,
  - status dibatasi oleh daftar status pada konstanta aplikasi.
Catatan policy:

- operasi baca admin: `super_admin`, `admin`, `operator`, `reviewer`,
- operasi tulis tertentu: dibatasi per policy,
- operasi hapus data saat ini diproteksi untuk `super_admin`.

## Tech Stack

- `@sveltejs/kit` (SvelteKit 2)
- `svelte` (Svelte 5 + runes)
- `typescript`
- `tailwindcss` + `@tailwindcss/forms` + `@tailwindcss/vite`
- `@supabase/ssr` + `@supabase/supabase-js`
- `lucide-svelte`
- `simple-icons`
- `@lottiefiles/dotlottie-svelte`
- `gsap`
- `lenis`
- `@vercel/analytics`
- `vitest` + `@vitest/browser-playwright`
- `playwright`

## Prasyarat

- Node.js `20+`
- npm `10+`

## Menjalankan Project

```bash
npm install
npm run dev
```

Default dev server: `http://localhost:5173`.

Build production:

```bash
npm run build
npm run preview
```

## Environment Variables

Salin template:

```bash
cp .env.example .env
```

Variable:

- `PUBLIC_SUPABASE_URL` (wajib)
- `PUBLIC_SUPABASE_ANON_KEY` (wajib)
- `SUPABASE_SERVICE_ROLE_KEY` (wajib untuk operasi server privileged, termasuk sumber data antrian publik)
- `SUPABASE_DB_PASSWORD` (opsional, helper lokal Supabase CLI)

Jika `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` tidak diisi, halaman admin akan menampilkan status `unavailable`.

## NPM Scripts

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build produksi |
| `npm run preview` | Menjalankan preview hasil build |
| `npm run check` | Sync SvelteKit + type check |
| `npm run check:watch` | Type check mode watch |
| `npm run test:unit` | Menjalankan test Vitest (client + server project) |
| `npm run test:e2e` | Menjalankan E2E Playwright |
| `npm run test` | Menjalankan unit test lalu E2E test |

## Testing Saat Ini

Test yang tersedia saat ini:

- `src/lib/constants/universal-search.test.ts` (unit test konstanta universal search)
- `tests/home.e2e.ts` (E2E render konten inti homepage)

## Kontribusi

Ikuti panduan di [contributing.md](./contributing.md).

## Lisensi

Lisensi mengikuti file [LICENSE](./LICENSE).

