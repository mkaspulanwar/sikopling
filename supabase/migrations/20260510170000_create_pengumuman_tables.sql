create table if not exists public.pengumuman_perling (
  id uuid primary key default gen_random_uuid(),
  instansi text,
  kegiatan text,
  no_sk text,
  tanggal date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pengumuman_pertek (
  id uuid primary key default gen_random_uuid(),
  instansi text,
  kegiatan text,
  no_sk text,
  tanggal date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pengumuman_integrasi (
  id uuid primary key default gen_random_uuid(),
  instansi text,
  kegiatan text,
  no_sk text,
  tanggal date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_pengumuman_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create index if not exists pengumuman_perling_tanggal_idx
  on public.pengumuman_perling (tanggal desc);
create index if not exists pengumuman_perling_instansi_idx
  on public.pengumuman_perling (instansi);
create index if not exists pengumuman_perling_no_sk_idx
  on public.pengumuman_perling (no_sk);

create index if not exists pengumuman_pertek_tanggal_idx
  on public.pengumuman_pertek (tanggal desc);
create index if not exists pengumuman_pertek_instansi_idx
  on public.pengumuman_pertek (instansi);
create index if not exists pengumuman_pertek_no_sk_idx
  on public.pengumuman_pertek (no_sk);

create index if not exists pengumuman_integrasi_tanggal_idx
  on public.pengumuman_integrasi (tanggal desc);
create index if not exists pengumuman_integrasi_instansi_idx
  on public.pengumuman_integrasi (instansi);
create index if not exists pengumuman_integrasi_no_sk_idx
  on public.pengumuman_integrasi (no_sk);

alter table public.pengumuman_perling enable row level security;
alter table public.pengumuman_pertek enable row level security;
alter table public.pengumuman_integrasi enable row level security;

revoke all on public.pengumuman_perling from anon;
revoke all on public.pengumuman_pertek from anon;
revoke all on public.pengumuman_integrasi from anon;

revoke all on public.pengumuman_perling from authenticated;
revoke all on public.pengumuman_pertek from authenticated;
revoke all on public.pengumuman_integrasi from authenticated;

grant select, insert, update, delete on public.pengumuman_perling to authenticated;
grant select, insert, update, delete on public.pengumuman_pertek to authenticated;
grant select, insert, update, delete on public.pengumuman_integrasi to authenticated;

drop policy if exists "admin can read pengumuman perling" on public.pengumuman_perling;
drop policy if exists "admin can insert pengumuman perling" on public.pengumuman_perling;
drop policy if exists "admin can update pengumuman perling" on public.pengumuman_perling;
drop policy if exists "admin can delete pengumuman perling" on public.pengumuman_perling;

create policy "admin can read pengumuman perling"
on public.pengumuman_perling
for select to authenticated
using (public.current_app_role() = 'admin');

create policy "admin can insert pengumuman perling"
on public.pengumuman_perling
for insert to authenticated
with check (public.current_app_role() = 'admin');

create policy "admin can update pengumuman perling"
on public.pengumuman_perling
for update to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin can delete pengumuman perling"
on public.pengumuman_perling
for delete to authenticated
using (public.current_app_role() = 'admin');

drop policy if exists "admin can read pengumuman pertek" on public.pengumuman_pertek;
drop policy if exists "admin can insert pengumuman pertek" on public.pengumuman_pertek;
drop policy if exists "admin can update pengumuman pertek" on public.pengumuman_pertek;
drop policy if exists "admin can delete pengumuman pertek" on public.pengumuman_pertek;

create policy "admin can read pengumuman pertek"
on public.pengumuman_pertek
for select to authenticated
using (public.current_app_role() = 'admin');

create policy "admin can insert pengumuman pertek"
on public.pengumuman_pertek
for insert to authenticated
with check (public.current_app_role() = 'admin');

create policy "admin can update pengumuman pertek"
on public.pengumuman_pertek
for update to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin can delete pengumuman pertek"
on public.pengumuman_pertek
for delete to authenticated
using (public.current_app_role() = 'admin');

drop policy if exists "admin can read pengumuman integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can insert pengumuman integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can update pengumuman integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can delete pengumuman integrasi" on public.pengumuman_integrasi;

create policy "admin can read pengumuman integrasi"
on public.pengumuman_integrasi
for select to authenticated
using (public.current_app_role() = 'admin');

create policy "admin can insert pengumuman integrasi"
on public.pengumuman_integrasi
for insert to authenticated
with check (public.current_app_role() = 'admin');

create policy "admin can update pengumuman integrasi"
on public.pengumuman_integrasi
for update to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin can delete pengumuman integrasi"
on public.pengumuman_integrasi
for delete to authenticated
using (public.current_app_role() = 'admin');

drop trigger if exists trg_pengumuman_perling_set_updated_at on public.pengumuman_perling;
create trigger trg_pengumuman_perling_set_updated_at
before update on public.pengumuman_perling
for each row
execute procedure public.set_pengumuman_updated_at_timestamp();

drop trigger if exists trg_pengumuman_pertek_set_updated_at on public.pengumuman_pertek;
create trigger trg_pengumuman_pertek_set_updated_at
before update on public.pengumuman_pertek
for each row
execute procedure public.set_pengumuman_updated_at_timestamp();

drop trigger if exists trg_pengumuman_integrasi_set_updated_at on public.pengumuman_integrasi;
create trigger trg_pengumuman_integrasi_set_updated_at
before update on public.pengumuman_integrasi
for each row
execute procedure public.set_pengumuman_updated_at_timestamp();
