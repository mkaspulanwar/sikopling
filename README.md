# SIKOPLING KALSEL

Portal antarmuka layanan informasi persetujuan lingkungan DLH Provinsi Kalimantan Selatan.

![Svelte](https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2-ff3e00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6e9f18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.58-2ead33?logo=playwright&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4b32c3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3-f7b93e?logo=prettier&logoColor=1a2b34)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)

## Overview

SIKOPLING dibangun sebagai frontend portal informasi layanan dengan fokus pada:

- tampilan beranda informatif dan mudah dibaca,
- navigasi responsif (desktop + mobile),
- halaman login (UI preview),
- komponen chatbot visual untuk akses cepat bantuan.

## Halaman Aktif

- `/` - landing page utama SIKOPLING.
- `/login` - halaman login (dummy UI, siap dihubungkan ke autentikasi real).

## Fitur Utama

- Navbar dinamis dan responsif dengan menu desktop/mobile.
- Hero section berbasis video (`hero-mobile.mp4` dan `hero-desktop.webm`).
- Section statistik layanan, jenis layanan dokumen, dan alur percepatan.
- Chatbot widget mengambang dengan quick suggestions.
- Site footer terintegrasi.
- Styling berbasis Tailwind CSS v4 + plugin forms.

## Asset

- Asset lokal statis ada di direktori `static/`.
- Sumber asset eksternal (Google Drive): [SIKOPLING Asset Drive](https://drive.google.com/drive/folders/100V7CrI6LjbkllF8kWAbIO6P5ze_u6x6)

## Tech Stack

- `@sveltejs/kit` (SvelteKit 2)
- `svelte` (Svelte 5 + runes)
- `typescript`
- `tailwindcss` + `@tailwindcss/forms` + `@tailwindcss/vite`
- `vite`
- `vitest` + `vitest-browser-svelte`
- `@playwright/test`
- `eslint` + `eslint-plugin-svelte`
- `prettier` + `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`

## Struktur Proyek

```text
src/
  app.html
  app.d.ts
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
    login/
      +page.svelte

static/
  logo_sikopling.svg
  logo_dlh.png
  heading.svg
  chatbot.svg
  hero-mobile.mp4
  hero-desktop.webm
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

App default berjalan di URL dev Vite (contoh: `http://localhost:5173`).

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
| `npm run test:unit` | Menjalankan test unit/component |
| `npm run test:e2e` | Menjalankan test end-to-end Playwright |
| `npm run test` | Menjalankan unit test lalu e2e test |

## Quality Gate Sebelum Rilis

```bash
npm run check
npm run lint
npm run test
```

## Catatan Pengembangan

- Halaman login saat ini masih dummy UI.
- Integrasi autentikasi backend belum diaktifkan.
- Konten statistik dan informasi masih dapat disesuaikan dengan data produksi resmi.

## Lisensi

Project ini mengikuti lisensi pada file [LICENSE](LICENSE).
