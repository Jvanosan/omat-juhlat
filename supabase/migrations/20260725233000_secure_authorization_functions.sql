-- Restrict authorization helper functions to authenticated users.

alter function public.current_partner_id()
set search_path = '';

alter function public.is_admin()
set search_path = '';

revoke execute
on function public.current_partner_id()
from public, anon;

revoke execute
on function public.is_admin()
from public, anon;

grant execute
on function public.current_partner_id()
to authenticated, service_role;

grant execute
on function public.is_admin()
to authenticated, service_role;