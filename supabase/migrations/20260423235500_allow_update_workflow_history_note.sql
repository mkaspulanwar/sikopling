grant update on public.workflow_history to authenticated;

create policy "admin can update workflow history"
on public.workflow_history
for update
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator'))
with check (public.current_app_role() in ('super_admin', 'admin', 'operator'));
