create table if not exists public.workflow_history (
  id uuid primary key default gen_random_uuid(),
  pengajuan_id uuid not null references public.antrian_pengajuan(id) on delete cascade,
  old_status text,
  new_status text not null check (
    new_status in ('Masuk', 'Verifikasi', 'Perbaikan', 'Penjadwalan', 'Pasca Sidang', 'Selesai')
  ),
  old_posisi text,
  new_posisi text,
  changed_by uuid,
  note text,
  changed_at timestamptz not null default timezone('utc', now())
);

create index if not exists workflow_history_pengajuan_id_idx
  on public.workflow_history (pengajuan_id);

create index if not exists workflow_history_changed_at_idx
  on public.workflow_history (changed_at desc);

alter table public.workflow_history enable row level security;

revoke all on public.workflow_history from anon;
revoke all on public.workflow_history from authenticated;
grant select, insert on public.workflow_history to authenticated;

create policy "admin can read workflow history"
on public.workflow_history
for select
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'operator', 'reviewer'));

create policy "admin can insert workflow history"
on public.workflow_history
for insert
to authenticated
with check (public.current_app_role() in ('super_admin', 'admin', 'operator'));

create or replace function public.log_antrian_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.status is distinct from old.status) or (new.posisi is distinct from old.posisi) then
    insert into public.workflow_history (
      pengajuan_id,
      old_status,
      new_status,
      old_posisi,
      new_posisi,
      changed_by,
      note
    )
    values (
      new.id,
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

drop trigger if exists trg_antrian_pengajuan_workflow_history on public.antrian_pengajuan;

create trigger trg_antrian_pengajuan_workflow_history
after update on public.antrian_pengajuan
for each row
execute procedure public.log_antrian_status_change();
