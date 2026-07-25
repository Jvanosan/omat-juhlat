-- Secure the automatic profile creation trigger.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    role
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      'Uusi Käyttäjä'
    ),
    'asiakas'
  );

  return new;
end;
$$;

revoke all
on function public.handle_new_user()
from public, anon, authenticated;

grant execute
on function public.handle_new_user()
to supabase_auth_admin;