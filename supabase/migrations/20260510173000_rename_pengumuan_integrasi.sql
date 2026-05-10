alter table if exists public.pengumuan_integrasi
  rename to pengumuman_integrasi;

alter index if exists public.pengumuan_integrasi_tanggal_idx
  rename to pengumuman_integrasi_tanggal_idx;
alter index if exists public.pengumuan_integrasi_instansi_idx
  rename to pengumuman_integrasi_instansi_idx;
alter index if exists public.pengumuan_integrasi_no_sk_idx
  rename to pengumuman_integrasi_no_sk_idx;

do $$
begin
  if exists (
    select 1
    from pg_trigger
    where tgname = 'trg_pengumuan_integrasi_set_updated_at'
      and tgrelid = 'public.pengumuman_integrasi'::regclass
  ) then
    alter trigger trg_pengumuan_integrasi_set_updated_at
      on public.pengumuman_integrasi
      rename to trg_pengumuman_integrasi_set_updated_at;
  end if;
end;
$$;

drop policy if exists "admin can read pengumuan integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can insert pengumuan integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can update pengumuan integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can delete pengumuan integrasi" on public.pengumuman_integrasi;

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
