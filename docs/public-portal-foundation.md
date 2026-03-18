# Fondasi Informasi Portal SIKOPLING

## 1. Definisi informasi publik dari spreadsheet

Data internal spreadsheet harus diterjemahkan menjadi atribut publik berikut:

1. `nama_perusahaan`
2. `wilayah_lokasi`
3. `jenis_usaha_kegiatan`
4. `jenis_pengajuan_dokumen`
5. `status_saat_ini`
6. `tahap_aktif`
7. `tanggal_pembaruan_terakhir`
8. `ringkasan_progres`
9. `riwayat_tahapan`

Aturan publikasi:

- Fokus utama adalah `status_saat_ini` dan `tahap_aktif`.
- Istilah teknis ditampilkan dalam bahasa publik yang sederhana.
- Riwayat tetap transparan, namun ringkas.

## 2. Mapping status internal ke status publik

| Internal                   | Publik             | Warna         |
| -------------------------- | ------------------ | ------------- |
| Draft belum diproses       | Belum diproses     | Abu           |
| Verifikasi administrasi    | Pemeriksaan awal   | Kuning        |
| Penilaian substansi teknis | Penilaian teknis   | Kuning/Oranye |
| Perbaikan dokumen diminta  | Perlu perbaikan    | Merah         |
| Menunggu penetapan         | Menunggu keputusan | Kuning        |
| Persetujuan terbit         | Disetujui          | Hijau         |
| Pengajuan ditolak          | Ditolak            | Merah         |
| Pengajuan ditarik          | Dibatalkan         | Abu           |

Kamus istilah:

- Pemrakarsa -> Perusahaan pengaju
- Substansi teknis -> Isi dokumen teknis
- RKL-RPL -> Rencana pengelolaan dan pemantauan lingkungan
- Berita acara -> Catatan hasil pemeriksaan

## 3. Sitemap

1. `/` Beranda
2. `/pengajuan` Daftar pengajuan/perusahaan
3. `/pengajuan/[id]` Detail pengajuan/perusahaan
4. `/proses-persetujuan` Penjelasan proses
5. `/tentang-data` Transparansi data

## 4. Struktur halaman

### Beranda (`/`)

- Hero informasi + pencarian utama
- Statistik ringkas
- Penjelasan alur tahapan
- Daftar progres terbaru
- FAQ singkat

### Daftar pengajuan (`/pengajuan`)

- Search
- Filter status, wilayah, jenis usaha
- List/card hasil dengan badge status

### Detail pengajuan (`/pengajuan/[id]`)

- Identitas perusahaan/pengajuan
- Status utama
- Timeline tahapan
- Update terakhir
- Ringkasan publik
- Riwayat progres

## 5. Komponen reusable

1. `StatusBadge` untuk visual status konsisten lintas halaman.
2. `SectionHeading` untuk heading section standar.
3. `HeroSearch` untuk form pencarian utama + quick filter.
4. `StatTile` untuk statistik ringkas.
5. `ProcessStepper` untuk tahapan persetujuan.
6. `SubmissionCard` untuk item pengajuan publik.
7. `LatestProgressSection` untuk state `loading/empty/error/ready`.
8. `FaqSection` untuk konten bantuan.
9. `MainHeader` untuk navigasi utama portal.

## 6. Wireframe teks homepage

```
Header: logo + menu utama.

Hero:
- Judul singkat, deskripsi portal, search bar utama.
- Quick filter status.
- Metadata pembaruan data terakhir.
- 1 ilustrasi dekoratif di sisi kanan (desktop).

Statistik:
- 4 tile ringkas (aktif, penilaian teknis, perlu perbaikan, disetujui bulan ini).

Alur:
- Stepper 5 tahap: Pendaftaran -> Pemeriksaan Awal -> Penilaian Teknis -> Keputusan -> Selesai.

Progres terbaru:
- Daftar card pengajuan (tanpa tabel spreadsheet mentah).
- Badge status, tahap aktif, tanggal update, ringkasan publik.

FAQ:
- Pertanyaan dasar terkait arti status, pembaruan data, dan akses dokumen.

Footer:
- Identitas dinas + kontak layanan.
```
