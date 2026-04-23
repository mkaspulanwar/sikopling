-- Initial schema for low-cost operational dashboard backend.

create extension if not exists "pgcrypto";

create table if not exists public.antrian_pengajuan (
  id uuid primary key default gen_random_uuid(),
  layanan text not null check (layanan in ('dokling', 'pertek')),
  no_registrasi text unique not null,
  tanggal_masuk date,
  instansi text,
  kegiatan text,
  jenis_dokumen text,
  posisi text,
  status text not null default 'Masuk' check (
    status in ('Masuk', 'Verifikasi', 'Perbaikan', 'Penjadwalan', 'Pasca Sidang', 'Selesai')
  ),
  tanggal_update date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists antrian_pengajuan_no_registrasi_idx
  on public.antrian_pengajuan (no_registrasi);

create index if not exists antrian_pengajuan_status_idx
  on public.antrian_pengajuan (status);

create index if not exists antrian_pengajuan_tanggal_update_idx
  on public.antrian_pengajuan (tanggal_update desc);

create index if not exists antrian_pengajuan_layanan_idx
  on public.antrian_pengajuan (layanan);

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  new.tanggal_update = coalesce(new.tanggal_update, now()::date);
  return new;
end;
$$;

drop trigger if exists trg_antrian_pengajuan_set_updated_at on public.antrian_pengajuan;

create trigger trg_antrian_pengajuan_set_updated_at
before update on public.antrian_pengajuan
for each row
execute procedure public.set_updated_at_timestamp();

alter table public.antrian_pengajuan enable row level security;

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif((auth.jwt() -> 'app_metadata' ->> 'role'), ''),
    nullif((auth.jwt() -> 'user_metadata' ->> 'role'), ''),
    'anonymous'
  );
$$;

create policy "admin can read antrian pengajuan"
on public.antrian_pengajuan
for select
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "admin can insert antrian pengajuan"
on public.antrian_pengajuan
for insert
to authenticated
with check (public.current_app_role() in ('super_admin', 'admin', 'operator'));

create policy "admin can update antrian pengajuan"
on public.antrian_pengajuan
for update
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator'))
with check (
  public.current_app_role() in ('super_admin', 'admin', 'operator')
  and layanan in ('dokling', 'pertek')
  and status in ('Masuk', 'Verifikasi', 'Perbaikan', 'Penjadwalan', 'Pasca Sidang', 'Selesai')
);

create policy "super admin can delete antrian pengajuan"
on public.antrian_pengajuan
for delete
to authenticated
using (public.current_app_role() = 'super_admin');

revoke all on public.antrian_pengajuan from anon;
revoke all on public.antrian_pengajuan from authenticated;
grant select, insert, update, delete on public.antrian_pengajuan to authenticated;
