create or replace function public.collect_changed_fields(previous_row jsonb, next_row jsonb)
returns jsonb
language sql
immutable
as $$
  select coalesce(
    (
      select jsonb_agg(key order by key)
      from (
        select coalesce(previous_item.key, next_item.key) as key
        from jsonb_each(coalesce(previous_row, '{}'::jsonb)) as previous_item
        full outer join jsonb_each(coalesce(next_row, '{}'::jsonb)) as next_item
          on previous_item.key = next_item.key
        where previous_item.value is distinct from next_item.value
      ) changed
    ),
    '[]'::jsonb
  );
$$;

create or replace function public.write_admin_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  actor_role text := public.current_app_role();
  actor_id uuid := auth.uid();
  actor_email text := nullif(trim(auth.jwt() ->> 'email'), '');
  previous_row jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else '{}'::jsonb end;
  next_row jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else '{}'::jsonb end;
  resource_id text := coalesce(next_row ->> 'id', previous_row ->> 'id');
  changed_fields jsonb := public.collect_changed_fields(previous_row, next_row);
begin
  if actor_role not in ('admin', 'super_admin') or actor_id is null then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  insert into public.admin_audit_logs (
    actor_id,
    actor_email,
    actor_role,
    action,
    resource_type,
    resource_id,
    summary,
    before_data,
    after_data,
    metadata
  )
  values (
    actor_id,
    actor_email,
    actor_role,
    lower(tg_op),
    tg_table_name,
    resource_id,
    format(
      '%s melakukan %s pada %s%s',
      coalesce(actor_email, actor_id::text),
      lower(tg_op),
      tg_table_name,
      case when resource_id is null then '' else format(' (%s)', resource_id) end
    ),
    previous_row,
    next_row,
    jsonb_build_object(
      'schema', tg_table_schema,
      'table', tg_table_name,
      'changed_fields', changed_fields
    )
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_audit_admin_profiles on public.admin_profiles;
create trigger trg_audit_admin_profiles
after insert or update or delete on public.admin_profiles
for each row
execute procedure public.write_admin_audit_log();

drop trigger if exists trg_audit_monitoring_perling on public.monitoring_perling;
create trigger trg_audit_monitoring_perling
after insert or update or delete on public.monitoring_perling
for each row
execute procedure public.write_admin_audit_log();

drop trigger if exists trg_audit_monitoring_pertek on public.monitoring_pertek;
create trigger trg_audit_monitoring_pertek
after insert or update or delete on public.monitoring_pertek
for each row
execute procedure public.write_admin_audit_log();

drop trigger if exists trg_audit_monitoring_integrasi on public.monitoring_integrasi;
create trigger trg_audit_monitoring_integrasi
after insert or update or delete on public.monitoring_integrasi
for each row
execute procedure public.write_admin_audit_log();

drop trigger if exists trg_audit_pengumuman_perling on public.pengumuman_perling;
create trigger trg_audit_pengumuman_perling
after insert or update or delete on public.pengumuman_perling
for each row
execute procedure public.write_admin_audit_log();

drop trigger if exists trg_audit_pengumuman_pertek on public.pengumuman_pertek;
create trigger trg_audit_pengumuman_pertek
after insert or update or delete on public.pengumuman_pertek
for each row
execute procedure public.write_admin_audit_log();

drop trigger if exists trg_audit_pengumuman_integrasi on public.pengumuman_integrasi;
create trigger trg_audit_pengumuman_integrasi
after insert or update or delete on public.pengumuman_integrasi
for each row
execute procedure public.write_admin_audit_log();
