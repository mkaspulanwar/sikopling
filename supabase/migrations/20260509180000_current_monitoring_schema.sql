create extension if not exists "pgcrypto";

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(lower(trim(auth.jwt() -> 'app_metadata' ->> 'role')), ''),
    nullif(lower(trim(auth.jwt() -> 'app_metadata' ->> 'user_role')), ''),
    nullif(lower(trim(auth.jwt() -> 'user_metadata' ->> 'role')), ''),
    nullif(lower(trim(auth.jwt() -> 'user_metadata' ->> 'user_role')), ''),
    'anonymous'
  );
$$;

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

create table if not exists public.monitoring_perling (
  id uuid primary key default gen_random_uuid(),
  no_registrasi text,
  tanggal_masuk date,
  instansi text,
  kegiatan text,
  jenis_dokumen text,
  posisi text,
  status text not null default 'Submit / Masuk',
  tanggal_update date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.monitoring_pertek (
  id uuid primary key default gen_random_uuid(),
  no_registrasi text,
  tanggal_masuk date,
  instansi text,
  kegiatan text,
  jenis_dokumen text,
  posisi text,
  status text not null default 'Submit / Masuk',
  tanggal_update date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.monitoring_integrasi (
  id uuid primary key default gen_random_uuid(),
  instansi text,
  kegiatan text,
  jenis_integrasi text,
  posisi text,
  status text not null default 'Submit',
  keterangan text,
  tanggal_update date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.monitoring_perling
  drop constraint if exists monitoring_perling_status_check;
alter table public.monitoring_perling
  add constraint monitoring_perling_status_check
  check (
    status in (
      'Submit / Masuk',
      'Perbaikan Uji Administrasi',
      'Penjadwalan Rapat',
      'Drafting SK',
      'SK Terbit',
      'Belum Submit Perbaikan',
      'Uji Administrasi',
      'Ditolak',
      'Pasca Sidang',
      'Evaluasi Dokumen',
      'Hold',
      'Dikembalikan',
      'Penilaian KA'
    )
  );

alter table public.monitoring_pertek
  drop constraint if exists monitoring_pertek_status_check;
alter table public.monitoring_pertek
  add constraint monitoring_pertek_status_check
  check (
    status in (
      'Submit / Masuk',
      'Perbaikan Uji Administrasi',
      'Penjadwalan Rapat',
      'Drafting SK',
      'SK Terbit',
      'Belum Submit Perbaikan',
      'Uji Administrasi',
      'Ditolak',
      'Pasca Sidang',
      'Evaluasi Dokumen',
      'Hold',
      'Dikembalikan',
      'Penilaian KA'
    )
  );

alter table public.monitoring_integrasi
  drop constraint if exists monitoring_integrasi_status_check;
alter table public.monitoring_integrasi
  add constraint monitoring_integrasi_status_check
  check (
    status in (
      'Submit',
      'Uji Admin',
      'Uji Substansi',
      'Drafting SK/Rekom',
      'SK/Rekom Terbit',
      'Ditolak',
      'Lainnya'
    )
  );

create index if not exists monitoring_perling_no_registrasi_idx
  on public.monitoring_perling (no_registrasi);
create index if not exists monitoring_perling_status_idx
  on public.monitoring_perling (status);
create index if not exists monitoring_perling_tanggal_update_idx
  on public.monitoring_perling (tanggal_update desc);

create index if not exists monitoring_pertek_no_registrasi_idx
  on public.monitoring_pertek (no_registrasi);
create index if not exists monitoring_pertek_status_idx
  on public.monitoring_pertek (status);
create index if not exists monitoring_pertek_tanggal_update_idx
  on public.monitoring_pertek (tanggal_update desc);

create index if not exists monitoring_integrasi_status_idx
  on public.monitoring_integrasi (status);
create index if not exists monitoring_integrasi_tanggal_update_idx
  on public.monitoring_integrasi (tanggal_update desc);

alter table public.monitoring_perling enable row level security;
alter table public.monitoring_pertek enable row level security;
alter table public.monitoring_integrasi enable row level security;

revoke all on public.monitoring_perling from anon;
revoke all on public.monitoring_pertek from anon;
revoke all on public.monitoring_integrasi from anon;

revoke all on public.monitoring_perling from authenticated;
revoke all on public.monitoring_pertek from authenticated;
revoke all on public.monitoring_integrasi from authenticated;

grant select, insert, update, delete on public.monitoring_perling to authenticated;
grant select, insert, update, delete on public.monitoring_pertek to authenticated;
grant select, insert, update, delete on public.monitoring_integrasi to authenticated;

drop policy if exists "admin can read monitoring perling" on public.monitoring_perling;
drop policy if exists "admin can insert monitoring perling" on public.monitoring_perling;
drop policy if exists "admin can update monitoring perling" on public.monitoring_perling;
drop policy if exists "admin can delete monitoring perling" on public.monitoring_perling;

create policy "admin can read monitoring perling"
on public.monitoring_perling
for select to authenticated
using (public.current_app_role() = 'admin');

create policy "admin can insert monitoring perling"
on public.monitoring_perling
for insert to authenticated
with check (public.current_app_role() = 'admin');

create policy "admin can update monitoring perling"
on public.monitoring_perling
for update to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin can delete monitoring perling"
on public.monitoring_perling
for delete to authenticated
using (public.current_app_role() = 'admin');

drop policy if exists "admin can read monitoring pertek" on public.monitoring_pertek;
drop policy if exists "admin can insert monitoring pertek" on public.monitoring_pertek;
drop policy if exists "admin can update monitoring pertek" on public.monitoring_pertek;
drop policy if exists "admin can delete monitoring pertek" on public.monitoring_pertek;

create policy "admin can read monitoring pertek"
on public.monitoring_pertek
for select to authenticated
using (public.current_app_role() = 'admin');

create policy "admin can insert monitoring pertek"
on public.monitoring_pertek
for insert to authenticated
with check (public.current_app_role() = 'admin');

create policy "admin can update monitoring pertek"
on public.monitoring_pertek
for update to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin can delete monitoring pertek"
on public.monitoring_pertek
for delete to authenticated
using (public.current_app_role() = 'admin');

drop policy if exists "admin can read monitoring integrasi" on public.monitoring_integrasi;
drop policy if exists "admin can insert monitoring integrasi" on public.monitoring_integrasi;
drop policy if exists "admin can update monitoring integrasi" on public.monitoring_integrasi;
drop policy if exists "admin can delete monitoring integrasi" on public.monitoring_integrasi;

create policy "admin can read monitoring integrasi"
on public.monitoring_integrasi
for select to authenticated
using (public.current_app_role() = 'admin');

create policy "admin can insert monitoring integrasi"
on public.monitoring_integrasi
for insert to authenticated
with check (public.current_app_role() = 'admin');

create policy "admin can update monitoring integrasi"
on public.monitoring_integrasi
for update to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin can delete monitoring integrasi"
on public.monitoring_integrasi
for delete to authenticated
using (public.current_app_role() = 'admin');

drop trigger if exists trg_monitoring_perling_set_updated_at on public.monitoring_perling;
create trigger trg_monitoring_perling_set_updated_at
before update on public.monitoring_perling
for each row
execute procedure public.set_updated_at_timestamp();

drop trigger if exists trg_monitoring_pertek_set_updated_at on public.monitoring_pertek;
create trigger trg_monitoring_pertek_set_updated_at
before update on public.monitoring_pertek
for each row
execute procedure public.set_updated_at_timestamp();

drop trigger if exists trg_monitoring_integrasi_set_updated_at on public.monitoring_integrasi;
create trigger trg_monitoring_integrasi_set_updated_at
before update on public.monitoring_integrasi
for each row
execute procedure public.set_updated_at_timestamp();

create or replace function public.count_registered_admins()
returns bigint
language sql
stable
security definer
set search_path = public, auth
as $$
  select count(*)
  from auth.users as u
  where coalesce(
    nullif(lower(trim(u.raw_app_meta_data ->> 'role')), ''),
    nullif(lower(trim(u.raw_app_meta_data ->> 'user_role')), ''),
    nullif(lower(trim(u.raw_user_meta_data ->> 'role')), ''),
    nullif(lower(trim(u.raw_user_meta_data ->> 'user_role')), '')
  ) = 'admin';
$$;

revoke all on function public.count_registered_admins() from public;
grant execute on function public.count_registered_admins() to authenticated;
