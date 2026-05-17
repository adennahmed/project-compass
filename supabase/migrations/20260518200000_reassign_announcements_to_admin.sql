-- ════════════════════════════════════════════════════════════════════════
-- Reassign two seeded announcements from Mira Sato → Aden Ahmed (admin)
-- ════════════════════════════════════════════════════════════════════════
-- The original seed gave Mira authorship on two of the three announcements
-- ("Kozai Community is open" and "Office hours, every other Wednesday").
-- These read more naturally coming from the founder. This migration
-- rewrites their author_id to the bootstrap admin (adenah04@outlook.com).
--
-- Idempotent and safe to re-run. If the admin user can't be found, it
-- emits a notice and exits without raising.
-- ════════════════════════════════════════════════════════════════════════

do $$
declare
  v_admin uuid;
  v_count int;
begin
  select id into v_admin from auth.users where email = 'adenah04@outlook.com';
  if v_admin is null then
    raise notice 'Admin user adenah04@outlook.com not found — skipping reassignment.';
    return;
  end if;

  update public.posts
     set author_id = v_admin
   where id in (
     '22222222-2222-2222-2222-222222222201', -- "Kozai Community is open"
     '22222222-2222-2222-2222-222222222203'  -- "Office hours, every other Wednesday"
   );

  get diagnostics v_count = row_count;
  raise notice 'Reassigned % announcement(s) to admin.', v_count;
end $$;
