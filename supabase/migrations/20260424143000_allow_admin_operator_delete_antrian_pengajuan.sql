drop policy if exists "super admin can delete antrian pengajuan"
on public.antrian_pengajuan;

create policy "admin can delete antrian pengajuan"
on public.antrian_pengajuan
for delete
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator'));
