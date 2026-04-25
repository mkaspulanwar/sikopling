drop policy if exists "admin can delete antrian pengajuan"
on public.antrian_pengajuan;

drop policy if exists "super admin can delete antrian pengajuan"
on public.antrian_pengajuan;

create policy "super admin can delete antrian pengajuan"
on public.antrian_pengajuan
for delete
to authenticated
using (public.current_app_role() = 'super_admin');
