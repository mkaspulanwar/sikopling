create extension if not exists "pgcrypto";

create table if not exists public.monitoring_perling (
  id uuid primary key default gen_random_uuid(),
  no_registrasi text,
  tanggal_masuk date,
  instansi text,
  kegiatan text,
  jenis_dokumen text,
  posisi text,
  status text not null default 'Submit / Masuk' check (
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
  ),
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
  status text not null default 'Submit / Masuk' check (
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
  ),
  tanggal_update date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.monitoring_integrasi (
  id uuid primary key default gen_random_uuid(),
  no_registrasi text,
  tanggal_masuk date,
  instansi text,
  kegiatan text,
  jenis_dokumen text,
  posisi text,
  status text not null default 'Submit' check (
    status in (
      'Submit',
      'Uji admin',
      'Ditolak',
      'SK/Rekomendasi',
      'Evaluasi Dokumen',
      'Verifikasi Integrasi',
      'Dikembalikan',
      'Selesai'
    )
  ),
  keterangan text,
  tanggal_update date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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

create index if not exists monitoring_integrasi_no_registrasi_idx
  on public.monitoring_integrasi (no_registrasi);

create index if not exists monitoring_integrasi_status_idx
  on public.monitoring_integrasi (status);

create index if not exists monitoring_integrasi_tanggal_update_idx
  on public.monitoring_integrasi (tanggal_update desc);

insert into public.monitoring_perling (
  id,
  no_registrasi,
  tanggal_masuk,
  instansi,
  kegiatan,
  jenis_dokumen,
  posisi,
  status,
  tanggal_update,
  created_at,
  updated_at
)
select
  id,
  no_registrasi,
  tanggal_masuk,
  instansi,
  kegiatan,
  jenis_dokumen,
  posisi,
  status,
  tanggal_update,
  created_at,
  updated_at
from public.antrian_pengajuan
where layanan in ('dokling', 'perling')
on conflict (id) do nothing;

insert into public.monitoring_pertek (
  id,
  no_registrasi,
  tanggal_masuk,
  instansi,
  kegiatan,
  jenis_dokumen,
  posisi,
  status,
  tanggal_update,
  created_at,
  updated_at
)
select
  id,
  no_registrasi,
  tanggal_masuk,
  instansi,
  kegiatan,
  jenis_dokumen,
  posisi,
  status,
  tanggal_update,
  created_at,
  updated_at
from public.antrian_pengajuan
where layanan = 'pertek'
on conflict (id) do nothing;

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

create policy "admin can read monitoring perling"
on public.monitoring_perling
for select
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "admin can insert monitoring perling"
on public.monitoring_perling
for insert
to authenticated
with check (public.current_app_role() in ('super_admin', 'admin', 'operator'));

create policy "admin can update monitoring perling"
on public.monitoring_perling
for update
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'))
with check (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "super admin can delete monitoring perling"
on public.monitoring_perling
for delete
to authenticated
using (public.current_app_role() = 'super_admin');

create policy "admin can read monitoring pertek"
on public.monitoring_pertek
for select
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "admin can insert monitoring pertek"
on public.monitoring_pertek
for insert
to authenticated
with check (public.current_app_role() in ('super_admin', 'admin', 'operator'));

create policy "admin can update monitoring pertek"
on public.monitoring_pertek
for update
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'))
with check (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "super admin can delete monitoring pertek"
on public.monitoring_pertek
for delete
to authenticated
using (public.current_app_role() = 'super_admin');

create policy "admin can read monitoring integrasi"
on public.monitoring_integrasi
for select
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "admin can insert monitoring integrasi"
on public.monitoring_integrasi
for insert
to authenticated
with check (public.current_app_role() in ('super_admin', 'admin', 'operator'));

create policy "admin can update monitoring integrasi"
on public.monitoring_integrasi
for update
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'))
with check (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "super admin can delete monitoring integrasi"
on public.monitoring_integrasi
for delete
to authenticated
using (public.current_app_role() = 'super_admin');

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

alter table public.workflow_history
  add column if not exists layanan text;

update public.workflow_history wh
set layanan = case
  when ap.layanan = 'pertek' then 'pertek'
  else 'perling'
end
from public.antrian_pengajuan ap
where wh.pengajuan_id = ap.id
  and (wh.layanan is null or wh.layanan = '');

update public.workflow_history
set layanan = 'perling'
where layanan is null or layanan = '';

alter table public.workflow_history
  alter column layanan set not null;

alter table public.workflow_history
  drop constraint if exists workflow_history_pengajuan_id_fkey;

alter table public.workflow_history
  drop constraint if exists workflow_history_layanan_check;

alter table public.workflow_history
  add constraint workflow_history_layanan_check
  check (layanan in ('perling', 'pertek', 'integrasi'));

alter table public.workflow_history
  drop constraint if exists workflow_history_new_status_check;

alter table public.workflow_history
  add constraint workflow_history_new_status_check
  check (
    new_status in (
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
      'Penilaian KA',
      'Submit',
      'Uji admin',
      'SK/Rekomendasi',
      'Verifikasi Integrasi',
      'Selesai'
    )
  );

create index if not exists workflow_history_layanan_pengajuan_idx
  on public.workflow_history (layanan, pengajuan_id, changed_at desc);

create or replace function public.log_monitoring_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  layanan_value text := tg_argv[0];
begin
  if (new.status is distinct from old.status) or (new.posisi is distinct from old.posisi) then
    insert into public.workflow_history (
      pengajuan_id,
      layanan,
      old_status,
      new_status,
      old_posisi,
      new_posisi,
      changed_by,
      note
    )
    values (
      new.id,
      layanan_value,
      old.status,
      new.status,
      old.posisi,
      new.posisi,
      auth.uid(),
      null
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_monitoring_perling_workflow_history on public.monitoring_perling;
create trigger trg_monitoring_perling_workflow_history
after update on public.monitoring_perling
for each row
execute procedure public.log_monitoring_status_change('perling');

drop trigger if exists trg_monitoring_pertek_workflow_history on public.monitoring_pertek;
create trigger trg_monitoring_pertek_workflow_history
after update on public.monitoring_pertek
for each row
execute procedure public.log_monitoring_status_change('pertek');

drop trigger if exists trg_monitoring_integrasi_workflow_history on public.monitoring_integrasi;
create trigger trg_monitoring_integrasi_workflow_history
after update on public.monitoring_integrasi
for each row
execute procedure public.log_monitoring_status_change('integrasi');
