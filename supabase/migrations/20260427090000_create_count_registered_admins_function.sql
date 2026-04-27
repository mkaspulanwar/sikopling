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
  ) in ('super_admin', 'admin', 'operator', 'reviewer');
$$;

revoke all on function public.count_registered_admins() from public;
grant execute on function public.count_registered_admins() to authenticated;
