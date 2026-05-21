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
  ) in ('admin', 'super_admin');
$$;

drop policy if exists "admin can read monitoring perling" on public.monitoring_perling;
drop policy if exists "admin can insert monitoring perling" on public.monitoring_perling;
drop policy if exists "admin can update monitoring perling" on public.monitoring_perling;
drop policy if exists "admin can delete monitoring perling" on public.monitoring_perling;

create policy "admin can read monitoring perling"
on public.monitoring_perling
for select to authenticated
using (public.is_admin_or_super_admin_role());

create policy "admin can insert monitoring perling"
on public.monitoring_perling
for insert to authenticated
with check (public.is_admin_or_super_admin_role());

create policy "admin can update monitoring perling"
on public.monitoring_perling
for update to authenticated
using (public.is_admin_or_super_admin_role())
with check (public.is_admin_or_super_admin_role());

create policy "admin can delete monitoring perling"
on public.monitoring_perling
for delete to authenticated
using (public.is_admin_or_super_admin_role());

drop policy if exists "admin can read monitoring pertek" on public.monitoring_pertek;
drop policy if exists "admin can insert monitoring pertek" on public.monitoring_pertek;
drop policy if exists "admin can update monitoring pertek" on public.monitoring_pertek;
drop policy if exists "admin can delete monitoring pertek" on public.monitoring_pertek;

create policy "admin can read monitoring pertek"
on public.monitoring_pertek
for select to authenticated
using (public.is_admin_or_super_admin_role());

create policy "admin can insert monitoring pertek"
on public.monitoring_pertek
for insert to authenticated
with check (public.is_admin_or_super_admin_role());

create policy "admin can update monitoring pertek"
on public.monitoring_pertek
for update to authenticated
using (public.is_admin_or_super_admin_role())
with check (public.is_admin_or_super_admin_role());

create policy "admin can delete monitoring pertek"
on public.monitoring_pertek
for delete to authenticated
using (public.is_admin_or_super_admin_role());

drop policy if exists "admin can read monitoring integrasi" on public.monitoring_integrasi;
drop policy if exists "admin can insert monitoring integrasi" on public.monitoring_integrasi;
drop policy if exists "admin can update monitoring integrasi" on public.monitoring_integrasi;
drop policy if exists "admin can delete monitoring integrasi" on public.monitoring_integrasi;

create policy "admin can read monitoring integrasi"
on public.monitoring_integrasi
for select to authenticated
using (public.is_admin_or_super_admin_role());

create policy "admin can insert monitoring integrasi"
on public.monitoring_integrasi
for insert to authenticated
with check (public.is_admin_or_super_admin_role());

create policy "admin can update monitoring integrasi"
on public.monitoring_integrasi
for update to authenticated
using (public.is_admin_or_super_admin_role())
with check (public.is_admin_or_super_admin_role());

create policy "admin can delete monitoring integrasi"
on public.monitoring_integrasi
for delete to authenticated
using (public.is_admin_or_super_admin_role());

drop policy if exists "admin can read pengumuman perling" on public.pengumuman_perling;
drop policy if exists "admin can insert pengumuman perling" on public.pengumuman_perling;
drop policy if exists "admin can update pengumuman perling" on public.pengumuman_perling;
drop policy if exists "admin can delete pengumuman perling" on public.pengumuman_perling;

create policy "admin can read pengumuman perling"
on public.pengumuman_perling
for select to authenticated
using (public.is_admin_or_super_admin_role());

create policy "admin can insert pengumuman perling"
on public.pengumuman_perling
for insert to authenticated
with check (public.is_admin_or_super_admin_role());

create policy "admin can update pengumuman perling"
on public.pengumuman_perling
for update to authenticated
using (public.is_admin_or_super_admin_role())
with check (public.is_admin_or_super_admin_role());

create policy "admin can delete pengumuman perling"
on public.pengumuman_perling
for delete to authenticated
using (public.is_admin_or_super_admin_role());

drop policy if exists "admin can read pengumuman pertek" on public.pengumuman_pertek;
drop policy if exists "admin can insert pengumuman pertek" on public.pengumuman_pertek;
drop policy if exists "admin can update pengumuman pertek" on public.pengumuman_pertek;
drop policy if exists "admin can delete pengumuman pertek" on public.pengumuman_pertek;

create policy "admin can read pengumuman pertek"
on public.pengumuman_pertek
for select to authenticated
using (public.is_admin_or_super_admin_role());

create policy "admin can insert pengumuman pertek"
on public.pengumuman_pertek
for insert to authenticated
with check (public.is_admin_or_super_admin_role());

create policy "admin can update pengumuman pertek"
on public.pengumuman_pertek
for update to authenticated
using (public.is_admin_or_super_admin_role())
with check (public.is_admin_or_super_admin_role());

create policy "admin can delete pengumuman pertek"
on public.pengumuman_pertek
for delete to authenticated
using (public.is_admin_or_super_admin_role());

drop policy if exists "admin can read pengumuman integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can insert pengumuman integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can update pengumuman integrasi" on public.pengumuman_integrasi;
drop policy if exists "admin can delete pengumuman integrasi" on public.pengumuman_integrasi;

create policy "admin can read pengumuman integrasi"
on public.pengumuman_integrasi
for select to authenticated
using (public.is_admin_or_super_admin_role());

create policy "admin can insert pengumuman integrasi"
on public.pengumuman_integrasi
for insert to authenticated
with check (public.is_admin_or_super_admin_role());

create policy "admin can update pengumuman integrasi"
on public.pengumuman_integrasi
for update to authenticated
using (public.is_admin_or_super_admin_role())
with check (public.is_admin_or_super_admin_role());

create policy "admin can delete pengumuman integrasi"
on public.pengumuman_integrasi
for delete to authenticated
using (public.is_admin_or_super_admin_role());
