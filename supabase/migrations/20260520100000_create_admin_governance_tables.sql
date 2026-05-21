create or replace function public.set_generic_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_super_admin_role()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'super_admin';
$$;

create or replace function public.is_admin_or_super_admin_role()
returns boolean
language sql
stable
as $$
  select public.current_app_role() in ('admin', 'super_admin');
$$;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint admin_profiles_email_not_blank check (char_length(btrim(email)) > 0),
  constraint admin_profiles_role_check check (role in ('admin', 'super_admin'))
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null default auth.uid() references auth.users (id) on delete restrict,
  actor_email text,
  actor_role text,
  action text not null,
  resource_type text not null,
  resource_id text,
  summary text,
  before_data jsonb not null default '{}'::jsonb,
  after_data jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  constraint admin_audit_logs_action_not_blank check (char_length(btrim(action)) > 0),
  constraint admin_audit_logs_resource_type_not_blank check (char_length(btrim(resource_type)) > 0)
);

create unique index if not exists admin_profiles_email_lower_idx
  on public.admin_profiles (lower(email));
create index if not exists admin_profiles_role_idx
  on public.admin_profiles (role);
create index if not exists admin_profiles_is_active_idx
  on public.admin_profiles (is_active);

create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs (created_at desc);
create index if not exists admin_audit_logs_actor_id_created_at_idx
  on public.admin_audit_logs (actor_id, created_at desc);
create index if not exists admin_audit_logs_resource_idx
  on public.admin_audit_logs (resource_type, resource_id, created_at desc);

drop trigger if exists trg_admin_profiles_set_updated_at on public.admin_profiles;
create trigger trg_admin_profiles_set_updated_at
before update on public.admin_profiles
for each row
execute procedure public.set_generic_updated_at_timestamp();

with admin_candidates as (
  select
    u.id,
    u.email,
    coalesce(
      nullif(btrim(u.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(u.raw_user_meta_data ->> 'name'), ''),
      nullif(btrim(u.raw_user_meta_data ->> 'display_name'), ''),
      split_part(u.email, '@', 1)
    ) as full_name,
    case
      when coalesce(
        nullif(lower(btrim(u.raw_app_meta_data ->> 'role')), ''),
        nullif(lower(btrim(u.raw_app_meta_data ->> 'user_role')), ''),
        nullif(lower(btrim(u.raw_user_meta_data ->> 'role')), ''),
        nullif(lower(btrim(u.raw_user_meta_data ->> 'user_role')), '')
      ) = 'super_admin' then 'super_admin'
      else 'admin'
    end as role,
    u.last_sign_in_at,
    coalesce(u.created_at, timezone('utc', now())) as source_created_at
  from auth.users u
  where u.email is not null
    and coalesce(
      nullif(lower(btrim(u.raw_app_meta_data ->> 'role')), ''),
      nullif(lower(btrim(u.raw_app_meta_data ->> 'user_role')), ''),
      nullif(lower(btrim(u.raw_user_meta_data ->> 'role')), ''),
      nullif(lower(btrim(u.raw_user_meta_data ->> 'user_role')), '')
    ) in ('admin', 'super_admin')
)
insert into public.admin_profiles (
  id,
  email,
  full_name,
  role,
  last_login_at,
  created_at,
  updated_at
)
select
  id,
  email,
  full_name,
  role,
  last_sign_in_at,
  source_created_at,
  timezone('utc', now())
from admin_candidates
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  last_login_at = excluded.last_login_at,
  updated_at = timezone('utc', now());

alter table public.admin_profiles enable row level security;
alter table public.admin_audit_logs enable row level security;

revoke all on public.admin_profiles from anon;
revoke all on public.admin_audit_logs from anon;

revoke all on public.admin_profiles from authenticated;
revoke all on public.admin_audit_logs from authenticated;

grant select, insert, update on public.admin_profiles to authenticated;
grant select, insert on public.admin_audit_logs to authenticated;

drop policy if exists "super admin can read admin profiles" on public.admin_profiles;
drop policy if exists "super admin can insert admin profiles" on public.admin_profiles;
drop policy if exists "super admin can update admin profiles" on public.admin_profiles;
drop policy if exists "admin can read own profile" on public.admin_profiles;

create policy "admin can read own profile"
on public.admin_profiles
for select to authenticated
using (auth.uid() = id or public.is_super_admin_role());

create policy "super admin can insert admin profiles"
on public.admin_profiles
for insert to authenticated
with check (public.is_super_admin_role());

create policy "super admin can update admin profiles"
on public.admin_profiles
for update to authenticated
using (public.is_super_admin_role())
with check (public.is_super_admin_role());

drop policy if exists "super admin can read admin audit logs" on public.admin_audit_logs;
drop policy if exists "admin can insert admin audit logs" on public.admin_audit_logs;

create policy "super admin can read admin audit logs"
on public.admin_audit_logs
for select to authenticated
using (public.is_super_admin_role());

create policy "admin can insert admin audit logs"
on public.admin_audit_logs
for insert to authenticated
with check (
  public.is_admin_or_super_admin_role()
  and actor_id = auth.uid()
);
