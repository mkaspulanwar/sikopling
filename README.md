# SIKOPLING

Portal antarmuka layanan informasi persetujuan lingkungan (internal project).

![Svelte](https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2-ff3e00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6e9f18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.58-2ead33?logo=playwright&logoColor=white)

## Status

`Internal / Confidential` - repo ini ditujukan untuk penggunaan internal tim.

README ini disinkronkan dengan kondisi kode pada **4 April 2026**.

## Ringkasan

SIKOPLING dibangun sebagai frontend portal informasi layanan persetujuan lingkungan DLH Provinsi Kalimantan Selatan.

Fokus implementasi saat ini:

- landing page informatif,
- halaman antrian layanan (dokling dan pertek),
- navigasi responsif desktop/mobile,
- universal search lintas halaman,
- chatbot bantuan berbasis WhatsApp,
- fondasi testing/linting untuk pengembangan lanjutan.

## Route Aktif

| Route | Status | Keterangan |
| --- | --- | --- |
| `/` | Aktif | Landing page dengan statistik, daftar layanan, dan alur percepatan |
| `/layanan/dokling` | Aktif | Tabel antrian dokumen lingkungan (mock data) |
| `/layanan/pertek` | Aktif | Tabel antrian persetujuan teknis (mock data) |
| `/tentang` | Placeholder | Halaman dummy |
| `/kontak` | Placeholder | Halaman dummy |
| `/login` | Placeholder | Halaman dummy |

## Fitur Utama

- Navbar fixed dengan mode desktop/mobile, dropdown layanan, dan state aktif route.
- Universal search modal (`Ctrl/Cmd + K`) dengan indeks dinamis dari halaman aplikasi.
- Landing page dengan hero video, statistik animasi (IntersectionObserver), jenis dokumen, dan alur layanan.
- Halaman antrian dokumen lingkungan:
  - pencarian,
  - filter lanjutan,
  - sorting,
  - pagination,
  - expandable row (mobile),
  - export CSV.
- Halaman antrian persetujuan teknis dengan fitur tabel serupa.
- Floating chatbot widget untuk memilih kanal WhatsApp (Chatbot / Customer Service).
- Footer informasi instansi, sosial media, dan kontak.
- Integrasi `@vercel/analytics` di root layout.

## Tech Stack

- `@sveltejs/kit` (SvelteKit 2)
- `svelte` (Svelte 5 + runes)
- `typescript`
- `tailwindcss` + `@tailwindcss/forms` + `@tailwindcss/vite`
- `lucide-svelte`
- `simple-icons`
- `@vercel/analytics`
- `vitest` + `vitest-browser-svelte`
- `@playwright/test`
- `eslint` + `prettier`

## Struktur Proyek

```text
src/
  app.d.ts
  app.html
  lib/
    assets/
      favicon.svg
    components/
      home/
        Navbar.svelte
        ChatbotWidget.svelte
        SiteFooter.svelte
  routes/
    +layout.svelte
    +page.svelte
    layout.css
    kontak/
      +page.svelte
    layanan/
      dokling/
        +page.svelte
      pertek/
        +page.svelte
    login/
      +page.svelte
    tentang/
      +page.svelte

static/
  home/
    heading.svg
    hero-video.webm
  layout/
    chatbot.svg
    logo_sikopling.svg
    maskot.svg
  robots.txt
```

## Prasyarat

- Node.js `20+`
- npm `10+`

## Menjalankan Proyek

```bash
npm install
npm run dev
```

Development server default: `http://localhost:5173`.

## NPM Scripts

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build produksi |
| `npm run preview` | Menjalankan preview hasil build |
| `npm run check` | Sinkronisasi SvelteKit + type check |
| `npm run check:watch` | Type check mode watch |
| `npm run lint` | Cek format + lint |
| `npm run format` | Auto format dengan Prettier |
| `npm run test:unit` | Menjalankan unit/component test (Vitest) |
| `npm run test:e2e` | Menjalankan e2e test (Playwright) |
| `npm run test` | Menjalankan unit test lalu e2e test |

## Testing Saat Ini

- Konfigurasi Vitest dan Playwright sudah tersedia.
- Saat ini belum ada file test aplikasi (`src/**/*.test.*`, `src/**/*.spec.*`, `*.e2e.*`).

## Catatan Implementasi

- Data antrian pada halaman layanan masih berupa mock data yang di-generate di sisi frontend.
- Tautan footer `/kebijakan-privasi` dan `/ketentuan-layanan` sudah dipasang, tetapi route halamannya belum tersedia.
- Halaman `tentang`, `kontak`, dan `login` masih placeholder.

## Observability (Vercel)

Analytics diaktifkan melalui `injectAnalytics()` pada layout aplikasi.

Agar data analytics masuk:

1. Aktifkan **Web Analytics** pada project Vercel.
2. Deploy ke Vercel (tracking tidak aktif pada mode development lokal).

## Kontribusi

Ikuti panduan kontribusi di [contributing.md](./contributing.md).

## Lisensi

Project ini mengikuti lisensi pada file [LICENSE](./LICENSE).
