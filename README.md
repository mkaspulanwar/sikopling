# SIKOPLING

Portal Informasi Publik untuk memantau progres pengajuan dokumen persetujuan lingkungan secara ringkas, jelas, dan transparan.

## Gambaran Singkat

SIKOPLING membantu masyarakat dan perusahaan melihat:

- Status pengajuan terkini
- Tahap aktif proses persetujuan
- Ringkasan progres terbaru
- Riwayat tahapan secara publik

Aplikasi dibangun dengan SvelteKit dan menampilkan data publik dalam format yang mudah dipahami.

## Fitur Utama

- Beranda informatif dengan hero, statistik, alur proses, progres terbaru, dan FAQ
- Daftar pengajuan publik dengan ringkasan status dan metadata penting
- Halaman detail pengajuan per nomor register untuk transparansi progres
- Mapping status internal ke istilah publik yang lebih sederhana
- Komponen UI reusable untuk konsistensi tampilan

## Sitemap

- / - Beranda
- /pengajuan - Daftar pengajuan
- /pengajuan/[id] - Detail pengajuan
- /proses-persetujuan - Penjelasan alur
- /tentang-data - Transparansi data
- /reveal-example - Contoh efek reveal internal

## Tech Stack

- SvelteKit 2
- Svelte 5
- TypeScript
- Tailwind CSS 4 + plugin forms
- Vite 7
- Lenis
- ESLint + Prettier
- Vitest
- Playwright

## Struktur Proyek

```text
src/
	lib/
		components/
			layout/
			submissions/
			ui/
		data/
	routes/
		+page.svelte
		pengajuan/
		proses-persetujuan/
		tentang-data/
docs/
	public-portal-foundation.md
static/
```

## Menjalankan Proyek Secara Lokal

### Prasyarat

- Node.js 20 atau lebih baru
- npm 10 atau lebih baru

### Instalasi

```sh
npm install
```

### Development Server

```sh
npm run dev
```

## Daftar Script

- npm run dev - Menjalankan server development
- npm run build - Build produksi
- npm run preview - Preview hasil build produksi
- npm run check - Sinkronisasi SvelteKit + type check
- npm run check:watch - Type check mode watch
- npm run lint - Cek format dan lint
- npm run format - Format otomatis dengan Prettier
- npm run test:unit - Menjalankan unit/component test
- npm run test:e2e - Menjalankan test end-to-end Playwright
- npm run test - Menjalankan unit test lalu E2E test

## Model Data Publik

Data publik difokuskan pada keterbacaan dan transparansi:

- Nama perusahaan
- Wilayah/lokasi
- Jenis usaha/kegiatan
- Jenis dokumen
- Status saat ini
- Tahap aktif
- Tanggal pembaruan terakhir
- Ringkasan progres
- Riwayat tahapan

## Prinsip Informasi Publik

- Prioritas pada status dan tahap aktif
- Istilah teknis diterjemahkan ke bahasa publik
- Riwayat ditampilkan ringkas namun tetap transparan
- Visual UI dijaga harmonis dan nyaman dibaca

## Quality Check Sebelum Rilis

```sh
npm run check
npm run lint
npm run test
```

## Build Produksi

```sh
npm run build
npm run preview
```

## Catatan

Saat ini data halaman publik masih berbasis data statis atau mock di frontend. Integrasi ke sumber data produksi dapat ditambahkan pada fase berikutnya.

## Lisensi

Lihat file LICENSE.
