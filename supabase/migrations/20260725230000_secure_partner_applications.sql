-- Protect partner applications while allowing public submissions.

alter table public.partner_applications
enable row level security;

revoke all privileges
on table public.partner_applications
from anon, authenticated;

grant insert
on table public.partner_applications
to anon, authenticated;

grant select, update, delete
on table public.partner_applications
to authenticated;

drop policy if exists "Allow partner application inserts"
on public.partner_applications;

drop policy if exists partner_applications_public_insert
on public.partner_applications;

drop policy if exists partner_applications_admin_all
on public.partner_applications;

create policy partner_applications_public_insert
on public.partner_applications
for insert
to anon, authenticated
with check (true);

create policy partner_applications_admin_all
on public.partner_applications
for all
to authenticated
using (is_admin())
with check (is_admin());

-- Lock old backup tables if they exist.

do $$
begin
  if to_regclass(
    'public.quote_partners_duplicate_backup_20260714'
  ) is not null then
    execute '
      alter table public.quote_partners_duplicate_backup_20260714
      enable row level security
    ';

    execute '
      revoke all privileges
      on table public.quote_partners_duplicate_backup_20260714
      from anon, authenticated
    ';
  end if;

  if to_regclass(
    'public.quote_partners_orphan_backup_20260714'
  ) is not null then
    execute '
      alter table public.quote_partners_orphan_backup_20260714
      enable row level security
    ';

    execute '
      revoke all privileges
      on table public.quote_partners_orphan_backup_20260714
      from anon, authenticated
    ';
  end if;
end
$$;