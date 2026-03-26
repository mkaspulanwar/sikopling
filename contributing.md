# Contributing Guide

Terima kasih sudah berkontribusi ke SIKOPLING.

## Scope

Dokumen ini mengatur standar kontribusi untuk repo internal. Semua kontribusi harus menjaga kerahasiaan proyek.

## Confidentiality Rules

- Jangan mempublikasikan isi kode, screenshot, credential, endpoint, atau data internal ke kanal publik.
- Jangan menyalin file/dokumen proyek ke repo, gist, atau AI tools eksternal tanpa izin.
- Gunakan placeholder untuk data sensitif saat membuat contoh/testing.

## Branching

- Buat branch dari branch utama aktif tim.
- Gunakan prefix branch: `feature/`, `fix/`, `chore/`, `docs/`.
- Nama branch singkat dan jelas, contoh: `fix/navbar-flicker`.

## Commit Message

Gunakan format sederhana dan konsisten:

- `feat: add login validation state`
- `fix: stabilize navbar initial render`
- `docs: update setup instructions`

## Coding Standards

- Gunakan TypeScript dan pola SvelteKit yang sudah ada di project.
- Pertahankan style utility Tailwind yang konsisten.
- Hindari hardcode data sensitif.
- Jangan commit file sementara atau secret (`.env`, token, key).

## Local Validation (Minimum)

Jalankan ini sebelum membuat PR:

```bash
npm run check
npm run lint
```

Jika perubahan menyentuh behavior penting, jalankan juga:

```bash
npm run test
```

## Pull Request Checklist

- Perubahan fokus pada satu tujuan.
- Tidak ada data sensitif dalam diff.
- README/dokumentasi diperbarui jika diperlukan.
- Hasil check/lint/test dicantumkan di deskripsi PR.

## Review Policy

- Minimal 1 reviewer internal.
- PR yang menyentuh auth, security, atau data flow wajib review tambahan.
- Reviewer berhak meminta split PR jika perubahan terlalu besar.

## Release Notes

Untuk perubahan yang user-facing, tambahkan ringkasan singkat di deskripsi PR:

- apa yang berubah,
- dampak ke user,
- risiko/rollback plan.
