-- ════════════════════════════════════════════════════════════════════════
-- Kozai Community — Expanded community seed (18 more members + posts/etc)
-- ════════════════════════════════════════════════════════════════════════
-- Idempotent. Safe to re-run. Adds realistic-handle members and more
-- social activity across all channels. Uses the new emoji reactions
-- schema (post 20260518000000_reactions_and_moderation.sql).
--
-- To wipe later:
--   delete from auth.users where email like '%@placeholder2.kozai';
-- ════════════════════════════════════════════════════════════════════════

-- ─── 1. Seed members ──────────────────────────────────────────────────
do $$
declare
  v_marcus uuid := '44444444-4444-4444-4444-444444444401';
  v_lara   uuid := '44444444-4444-4444-4444-444444444402';
  v_reagan uuid := '44444444-4444-4444-4444-444444444403';
  v_theob  uuid := '44444444-4444-4444-4444-444444444404';
  v_kaitlin uuid := '44444444-4444-4444-4444-444444444405';
  v_sam    uuid := '44444444-4444-4444-4444-444444444406';
  v_nora   uuid := '44444444-4444-4444-4444-444444444407';
  v_daniel uuid := '44444444-4444-4444-4444-444444444408';
  v_quinn  uuid := '44444444-4444-4444-4444-444444444409';
  v_evelyn uuid := '44444444-4444-4444-4444-44444444440a';
  v_masashi uuid := '44444444-4444-4444-4444-44444444440b';
  v_pranesh uuid := '44444444-4444-4444-4444-44444444440c';
  v_alice  uuid := '44444444-4444-4444-4444-44444444440d';
  v_gus    uuid := '44444444-4444-4444-4444-44444444440e';
  v_tomk   uuid := '44444444-4444-4444-4444-44444444440f';
  v_winnie uuid := '44444444-4444-4444-4444-444444444410';
  v_benji  uuid := '44444444-4444-4444-4444-444444444411';
  v_noah   uuid := '44444444-4444-4444-4444-444444444412';
begin
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values
    (v_marcus,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marcus@placeholder2.kozai',  '', now(), now() - interval '52 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_lara,    '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lara@placeholder2.kozai',    '', now(), now() - interval '49 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_reagan,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'reagan@placeholder2.kozai',  '', now(), now() - interval '46 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_theob,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'theob@placeholder2.kozai',   '', now(), now() - interval '43 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_kaitlin, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kaitlin@placeholder2.kozai', '', now(), now() - interval '40 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_sam,     '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam@placeholder2.kozai',     '', now(), now() - interval '37 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_nora,    '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nora@placeholder2.kozai',    '', now(), now() - interval '34 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_daniel,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'daniel@placeholder2.kozai',  '', now(), now() - interval '31 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_quinn,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'quinn@placeholder2.kozai',   '', now(), now() - interval '28 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_evelyn,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evelyn@placeholder2.kozai',  '', now(), now() - interval '25 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_masashi, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'masashi@placeholder2.kozai', '', now(), now() - interval '23 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_pranesh, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pranesh@placeholder2.kozai', '', now(), now() - interval '20 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_alice,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@placeholder2.kozai',   '', now(), now() - interval '18 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_gus,     '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'gus@placeholder2.kozai',     '', now(), now() - interval '15 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_tomk,    '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tomk@placeholder2.kozai',    '', now(), now() - interval '12 days', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_winnie,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'winnie@placeholder2.kozai',  '', now(), now() - interval '9 days',  now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_benji,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'benji@placeholder2.kozai',   '', now(), now() - interval '6 days',  now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', ''),
    (v_noah,    '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'noah@placeholder2.kozai',    '', now(), now() - interval '3 days',  now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, '', '', '', '')
  on conflict (id) do nothing;

  -- Enrich profiles (trigger created them; we overwrite handle + bio + avatar).
  update public.profiles set display_name='Marcus Park',       handle='mt_park',      bio='Ops eng at a 30-person SaaS. Mostly here for the dry humor.',                avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=MarcusPark&backgroundColor=F5803E&textColor=F1EEE5',    onboarded_at=now(), community_rules_accepted_at=now() where id=v_marcus;
  update public.profiles set display_name='Lara Hoffmann',     handle='lara99',       bio='Building tools for restaurant chains. Six concepts, one ERP.',                avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=LaraHoffmann&backgroundColor=F5803E&textColor=F1EEE5',  onboarded_at=now(), community_rules_accepted_at=now() where id=v_lara;
  update public.profiles set display_name='Reagan Jones',      handle='rj_dev',       bio='Senior platform eng. Survived 4 ''great rewrites''.',                          avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=ReaganJones&backgroundColor=F5803E&textColor=F1EEE5',   onboarded_at=now(), community_rules_accepted_at=now() where id=v_reagan;
  update public.profiles set display_name='Theo Bishara',      handle='theo_b07',     bio='Founding eng at a logistics startup. PRs welcome.',                            avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=TheoBishara&backgroundColor=F5803E&textColor=F1EEE5',   onboarded_at=now(), community_rules_accepted_at=now() where id=v_theob;
  update public.profiles set display_name='Kaitlin Vong',      handle='kai_v2',       bio='PM by day, retro UI hobbyist by night.',                                       avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=KaitlinVong&backgroundColor=F5803E&textColor=F1EEE5',   onboarded_at=now(), community_rules_accepted_at=now() where id=v_kaitlin;
  update public.profiles set display_name='Sam Wilkes',        handle='s4mwilkes',    bio='FE eng. I make checkboxes that don''t suck.',                                  avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=SamWilkes&backgroundColor=F5803E&textColor=F1EEE5',     onboarded_at=now(), community_rules_accepted_at=now() where id=v_sam;
  update public.profiles set display_name='Nora Iqbal',        handle='nora_code',    bio='Backend, mostly Rust now. Will fight you about pagination.',                   avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=NoraIqbal&backgroundColor=F5803E&textColor=F1EEE5',     onboarded_at=now(), community_rules_accepted_at=now() where id=v_nora;
  update public.profiles set display_name='Daniel Vogel',      handle='dvogel88',     bio='Internal-tools consultant. Toronto.',                                          avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=DanielVogel&backgroundColor=F5803E&textColor=F1EEE5',   onboarded_at=now(), community_rules_accepted_at=now() where id=v_daniel;
  update public.profiles set display_name='Quinn Albright',    handle='_quinn',       bio='Solo founder. Hosting management software. Two customers, growing.',           avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=QuinnAlbright&backgroundColor=F5803E&textColor=F1EEE5', onboarded_at=now(), community_rules_accepted_at=now() where id=v_quinn;
  update public.profiles set display_name='Evelyn Tan',        handle='ev3lyn',       bio='Design + a little code. Probably building a Notion clone right now.',           avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=EvelynTan&backgroundColor=F5803E&textColor=F1EEE5',     onboarded_at=now(), community_rules_accepted_at=now() where id=v_evelyn;
  update public.profiles set display_name='Masashi Ito',       handle='mr_ito',       bio='Eng manager. Read all the postmortems so you don''t have to.',                  avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=MasashiIto&backgroundColor=F5803E&textColor=F1EEE5',    onboarded_at=now(), community_rules_accepted_at=now() where id=v_masashi;
  update public.profiles set display_name='Pranesh Murugan',   handle='prsh_m',       bio='Data eng. Building dashboards nobody asked for.',                              avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=PraneshM&backgroundColor=F5803E&textColor=F1EEE5',       onboarded_at=now(), community_rules_accepted_at=now() where id=v_pranesh;
  update public.profiles set display_name='Alice Burch',       handle='aliceburch',   bio='Founder/CEO at a 12-person ops co. Hiring relentlessly.',                       avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=AliceBurch&backgroundColor=F5803E&textColor=F1EEE5',    onboarded_at=now(), community_rules_accepted_at=now() where id=v_alice;
  update public.profiles set display_name='Gus Gomez',         handle='gus_gomez',    bio='Field operations. Just learned about SQL. Game changer.',                      avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=GusGomez&backgroundColor=F5803E&textColor=F1EEE5',      onboarded_at=now(), community_rules_accepted_at=now() where id=v_gus;
  update public.profiles set display_name='Tom Kobayashi',     handle='tomk_dev',     bio='Backend. Mostly Postgres these days. Indexes are art.',                         avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=TomKobayashi&backgroundColor=F5803E&textColor=F1EEE5',  onboarded_at=now(), community_rules_accepted_at=now() where id=v_tomk;
  update public.profiles set display_name='Winnie Hu',         handle='winnie_hu',    bio='Customer success at an industrial software co. PM-adjacent.',                  avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=WinnieHu&backgroundColor=F5803E&textColor=F1EEE5',      onboarded_at=now(), community_rules_accepted_at=now() where id=v_winnie;
  update public.profiles set display_name='Benji Carmichael',  handle='b_carmichael', bio='Ops at a fulfillment company. Survived Black Friday twice.',                   avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=BenjiC&backgroundColor=F5803E&textColor=F1EEE5',        onboarded_at=now(), community_rules_accepted_at=now() where id=v_benji;
  update public.profiles set display_name='Noah Reeves',       handle='noah_07',      bio='Solo dev. Building scheduling software for plumbers.',                         avatar_url='https://api.dicebear.com/7.x/initials/svg?seed=NoahReeves&backgroundColor=F5803E&textColor=F1EEE5',    onboarded_at=now(), community_rules_accepted_at=now() where id=v_noah;

  raise notice 'New members enriched ✓';
end $$;

-- ─── 2. Seed posts ────────────────────────────────────────────────────
do $$
declare
  v_marcus uuid := '44444444-4444-4444-4444-444444444401';
  v_lara   uuid := '44444444-4444-4444-4444-444444444402';
  v_reagan uuid := '44444444-4444-4444-4444-444444444403';
  v_theob  uuid := '44444444-4444-4444-4444-444444444404';
  v_kaitlin uuid := '44444444-4444-4444-4444-444444444405';
  v_sam    uuid := '44444444-4444-4444-4444-444444444406';
  v_nora   uuid := '44444444-4444-4444-4444-444444444407';
  v_daniel uuid := '44444444-4444-4444-4444-444444444408';
  v_quinn  uuid := '44444444-4444-4444-4444-444444444409';
  v_evelyn uuid := '44444444-4444-4444-4444-44444444440a';
  v_masashi uuid := '44444444-4444-4444-4444-44444444440b';
  v_pranesh uuid := '44444444-4444-4444-4444-44444444440c';
  v_alice  uuid := '44444444-4444-4444-4444-44444444440d';
  v_gus    uuid := '44444444-4444-4444-4444-44444444440e';
  v_tomk   uuid := '44444444-4444-4444-4444-44444444440f';
  v_winnie uuid := '44444444-4444-4444-4444-444444444410';
  v_benji  uuid := '44444444-4444-4444-4444-444444444411';
  v_noah   uuid := '44444444-4444-4444-4444-444444444412';
  -- Pre-existing seed members (from 20260517020000)
  v_mira  uuid := '11111111-1111-1111-1111-111111111101';
  v_dev   uuid := '11111111-1111-1111-1111-111111111102';
  v_jules uuid := '11111111-1111-1111-1111-111111111103';
  v_theo  uuid := '11111111-1111-1111-1111-111111111104';
  v_sana  uuid := '11111111-1111-1111-1111-111111111105';
  v_kai   uuid := '11111111-1111-1111-1111-111111111106';
  c_gen  uuid; c_show uuid; c_hire uuid; c_ops uuid; c_ask uuid;
begin
  select id into c_gen  from public.channels where slug = 'general';
  select id into c_show from public.channels where slug = 'show-and-tell';
  select id into c_hire from public.channels where slug = 'hiring';
  select id into c_ops  from public.channels where slug = 'ops-talk';
  select id into c_ask  from public.channels where slug = 'ask-kozai';

  insert into public.posts (id, author_id, channel_id, type, title, body_md, created_at) values
    -- General
    ('55555555-5555-5555-5555-555555550001', v_marcus,  c_gen,  'thread',   'New here — what does everyone use for status pages?',
     E'Came over from another community. Looking for something dead simple — not Statuspage-by-Atlassian dead simple, actually dead simple. Just a webpage that says ''up'' or ''down''.\n\nWhat are folks running?', now() - interval '14 days'),
    ('55555555-5555-5555-5555-555555550002', v_lara,    c_gen,  'thread',   'Reminder that you can use Postgres for almost everything',
     E'I keep watching teams reach for Redis, then Elastic, then Kafka, then a vector DB. Half the time Postgres + a couple of indexes would have done it.\n\nNot saying never — saying default to one DB until it actually hurts.', now() - interval '11 days'),
    ('55555555-5555-5555-5555-555555550003', v_evelyn,  c_gen,  'question', 'What''s your favorite "small" design touch in a SaaS app?',
     E'Linear''s command palette is the obvious answer. I want the less obvious ones — the tiny detail you noticed and stole.', now() - interval '9 days'),
    ('55555555-5555-5555-5555-555555550004', v_quinn,   c_gen,  'thread',   'Two months in as a solo founder — small wins log',
     E'Posting this so future-me has a record.\n\n- Got first paying customer (a friend, $29/mo, but it counts)\n- Set up a real domain email\n- Learned that "ICP" is a real acronym people use unironically\n- Stopped saying "we" when I mean "I"\n\nBig things still scary. Small things adding up.', now() - interval '6 days'),

    -- Show & Tell
    ('55555555-5555-5555-5555-555555550010', v_sam,     c_show, 'thread',   'Built a really good keyboard-only modal',
     E'Spent way too long on this but I''m proud. Tab, shift-tab, esc, enter — all behave the way you''d hope. Focus stays trapped inside, focus returns to opener on close, screen reader announces the title.\n\nNo library. Vanilla React in 60 lines. Will share the snippet if anyone wants.', now() - interval '13 days'),
    ('55555555-5555-5555-5555-555555550011', v_reagan,  c_show, 'thread',   'Replaced our ETL pipeline with a 200-line Python script',
     E'Was Airflow + dbt + a bunch of yaml. Job ran once a day, took 6 minutes. Now it''s a cron + a script + Postgres COPY. Runs in 40 seconds.\n\nSometimes the answer is genuinely just "delete the platform".', now() - interval '10 days'),
    ('55555555-5555-5555-5555-555555550012', v_tomk,    c_show, 'thread',   'Postgres trigger that auto-updates `slug` on title change — finally got it right',
     E'Hardest part: making sure slugs stay stable for existing rows even if someone edits the title. New rows get auto-slug, old rows are locked unless you explicitly opt in.\n\nNo more "/posts/null" 404s in the wild.', now() - interval '7 days'),
    ('55555555-5555-5555-5555-555555550013', v_noah,    c_show, 'thread',   'Launched my scheduling app to the first real customer today',
     E'Plumber in Hamilton. Said "this is the first software thing that hasn''t made my life worse." That''s a quote I am framing.\n\nNow to keep him happy.', now() - interval '2 days'),
    ('55555555-5555-5555-5555-555555550014', v_evelyn,  c_show, 'thread',   'A tiny print-friendly invoice template (CSS, no JS)',
     E'After too many "the invoice looks weird when I print it" tickets, I rewrote ours as a static HTML page with a @media print block.\n\nNo PDF library. No headless Chrome. Browser → File → Print → Save as PDF.\n\nCustomers stopped complaining. Bug count down.', now() - interval '5 days')
  on conflict (id) do nothing;
end $$;

-- ─── 3. More posts across channels ────────────────────────────────────
do $$
declare
  v_marcus uuid := '44444444-4444-4444-4444-444444444401';
  v_lara   uuid := '44444444-4444-4444-4444-444444444402';
  v_reagan uuid := '44444444-4444-4444-4444-444444444403';
  v_theob  uuid := '44444444-4444-4444-4444-444444444404';
  v_kaitlin uuid := '44444444-4444-4444-4444-444444444405';
  v_sam    uuid := '44444444-4444-4444-4444-444444444406';
  v_nora   uuid := '44444444-4444-4444-4444-444444444407';
  v_daniel uuid := '44444444-4444-4444-4444-444444444408';
  v_quinn  uuid := '44444444-4444-4444-4444-444444444409';
  v_masashi uuid := '44444444-4444-4444-4444-44444444440b';
  v_pranesh uuid := '44444444-4444-4444-4444-44444444440c';
  v_alice  uuid := '44444444-4444-4444-4444-44444444440d';
  v_gus    uuid := '44444444-4444-4444-4444-44444444440e';
  v_winnie uuid := '44444444-4444-4444-4444-444444444410';
  v_benji  uuid := '44444444-4444-4444-4444-444444444411';
  c_hire uuid; c_ops uuid; c_ask uuid;
begin
  select id into c_hire from public.channels where slug = 'hiring';
  select id into c_ops  from public.channels where slug = 'ops-talk';
  select id into c_ask  from public.channels where slug = 'ask-kozai';

  insert into public.posts (id, author_id, channel_id, type, title, body_md, created_at) values
    -- Hiring
    ('55555555-5555-5555-5555-555555550020', v_alice,    c_hire, 'thread',   'Hiring: founding ops engineer (Toronto, hybrid)',
     E'12-person company, growing fast in the boring way. Need someone who genuinely likes building tools for non-technical users.\n\n$120-160k + equity. DM for the JD.', now() - interval '12 days'),
    ('55555555-5555-5555-5555-555555550021', v_masashi,  c_hire, 'thread',   'Hiring 2x backend (remote, NA timezones)',
     E'Building inventory software for industrial distributors. Postgres + Go. Looking for people who''ve dealt with messy real-world data, not just textbook schemas.\n\nNo whiteboard interviews. We pair on a small change to our actual codebase.', now() - interval '8 days'),
    ('55555555-5555-5555-5555-555555550022', v_quinn,    c_hire, 'thread',   'Looking: part-time designer, 5-10 hrs/wk',
     E'Solo founder. Mostly need someone to keep me from making bad UI choices when I''m tired. Not a lot of pixel-pushing — more like a sanity check.\n\nIf you''re between contracts and want a low-stakes side gig, DM.', now() - interval '4 days'),
    ('55555555-5555-5555-5555-555555550023', v_kaitlin,  c_hire, 'thread',   '[looking] PM, ops-software, NYC or remote',
     E'5 years PM, last 3 at a logistics startup. Looking for early-stage ops software companies (Series A or earlier). Strong in roadmap + customer discovery, weaker in deep analytics — happy to grow there.\n\nDM for the resume.', now() - interval '1 day'),

    -- Ops Talk
    ('55555555-5555-5555-5555-555555550030', v_daniel,   c_ops,  'thread',   'Stop building "platforms". Build features that solve one problem each',
     E'Internal "platforms" are where engineering organizations go to die. Every team rebuilds them every 3 years and they''re always slightly worse than what they replaced.\n\nIf you find yourself naming something "Foundation" or "Core", pause. You''re probably about to do 18 months of work that should have been three small features.', now() - interval '15 days'),
    ('55555555-5555-5555-5555-555555550031', v_nora,     c_ops,  'thread',   'The unsung hero of operations: a really good cron page',
     E'Every ops-heavy app should have a single page that shows every scheduled job, when it last ran, whether it succeeded, and a button to run it manually.\n\nThis page has saved my team hundreds of hours over the years. It''s the kind of thing that doesn''t make it into demos but is the difference between "this software helps me" and "this software is in my way".', now() - interval '11 days'),
    ('55555555-5555-5555-5555-555555550032', v_benji,    c_ops,  'thread',   'Black Friday postmortem (the short version)',
     E'1. Cache hit ratio matters more than CPU.\n2. Your warehouse staff are smarter than your software. Trust them.\n3. The status page is for YOU first, customers second.\n4. The thing you forgot to put in the runbook is the thing that''s going to happen.\n\nAlready writing next year''s plan.', now() - interval '5 days'),
    ('55555555-5555-5555-5555-555555550033', v_pranesh,  c_ops,  'thread',   'A defense of materialized views',
     E'I know "just use a real warehouse" is the standard answer. Materialized views in Postgres + a refresh schedule will get you most of the way for 90% of small-to-medium teams without the operational overhead.\n\nWe replaced our entire BI pipeline with 12 materialized views. Dashboards are faster. Nothing breaks. Nobody misses it.', now() - interval '3 days'),
    ('55555555-5555-5555-5555-555555550034', v_gus,      c_ops,  'thread',   'From the field: things office software people don''t know about warehouse software',
     E'Spent 8 years in distribution before learning to code. Some things that surprise devs:\n\n- Forklifts have weight limits, and those limits matter for routing.\n- "Pick path" is a real optimization problem and bad software costs hours per shift.\n- The barcode scanner is the most important piece of UI. Touch screens are a distant second.\n- Truck drivers will not log in. Make it work without them logging in.', now() - interval '2 days'),

    -- Ask Kozai
    ('55555555-5555-5555-5555-555555550040', v_winnie,   c_ask,  'question', 'How do you decide when to build vs buy for internal tools?',
     E'Our team keeps having this argument. We have ~5 internal admin needs. Some we built, some we bought (Retool), some we just have a Notion page for.\n\nIs there a heuristic I should be using?', now() - interval '10 days'),
    ('55555555-5555-5555-5555-555555550041', v_lara,     c_ask,  'question', 'Anyone use Postgres LISTEN/NOTIFY in production?',
     E'Thinking of using it for real-time updates instead of pulling in a separate pubsub. Would love to hear from anyone who''s done it past hobby-project scale.', now() - interval '7 days'),
    ('55555555-5555-5555-5555-555555550042', v_theob,    c_ask,  'question', 'How do you onboard a non-technical hire to an engineering-heavy team?',
     E'Hired our first salesperson. He''s great but everyone else on the team is engineering. The vocabulary is bouncing off him.\n\nWhat worked for you?', now() - interval '4 days'),
    ('55555555-5555-5555-5555-555555550043', v_sam,      c_ask,  'question', 'Best book about software for operators, not engineers?',
     E'Looking for something I can give to a non-technical co-founder so they understand why "we just need to add this one field" is sometimes a two-week project.\n\nDoesn''t need to be famous. Just clear and short.', now() - interval '1 day')
  on conflict (id) do nothing;

  raise notice 'Posts inserted ✓';
end $$;

-- ─── 4. Comments (with nesting on a few popular posts) ────────────────
do $$
declare
  -- New users
  v_marcus uuid := '44444444-4444-4444-4444-444444444401';
  v_lara   uuid := '44444444-4444-4444-4444-444444444402';
  v_reagan uuid := '44444444-4444-4444-4444-444444444403';
  v_theob  uuid := '44444444-4444-4444-4444-444444444404';
  v_kaitlin uuid := '44444444-4444-4444-4444-444444444405';
  v_sam    uuid := '44444444-4444-4444-4444-444444444406';
  v_nora   uuid := '44444444-4444-4444-4444-444444444407';
  v_daniel uuid := '44444444-4444-4444-4444-444444444408';
  v_quinn  uuid := '44444444-4444-4444-4444-444444444409';
  v_evelyn uuid := '44444444-4444-4444-4444-44444444440a';
  v_masashi uuid := '44444444-4444-4444-4444-44444444440b';
  v_pranesh uuid := '44444444-4444-4444-4444-44444444440c';
  v_alice  uuid := '44444444-4444-4444-4444-44444444440d';
  v_gus    uuid := '44444444-4444-4444-4444-44444444440e';
  v_tomk   uuid := '44444444-4444-4444-4444-44444444440f';
  v_winnie uuid := '44444444-4444-4444-4444-444444444410';
  v_benji  uuid := '44444444-4444-4444-4444-444444444411';
  v_noah   uuid := '44444444-4444-4444-4444-444444444412';
  -- Old users
  v_mira  uuid := '11111111-1111-1111-1111-111111111101';
  v_dev   uuid := '11111111-1111-1111-1111-111111111102';
  v_jules uuid := '11111111-1111-1111-1111-111111111103';
  v_theo  uuid := '11111111-1111-1111-1111-111111111104';
  v_sana  uuid := '11111111-1111-1111-1111-111111111105';
  v_kai   uuid := '11111111-1111-1111-1111-111111111106';
  cm_a uuid := '66666666-6666-6666-6666-666666660001';
  cm_b uuid := '66666666-6666-6666-6666-666666660002';
  cm_c uuid := '66666666-6666-6666-6666-666666660003';
begin
  insert into public.comments (id, post_id, parent_id, author_id, body_md, created_at) values
    -- on Marcus's "status pages" post
    ('66666666-6666-6666-6666-666666660010', '55555555-5555-5555-5555-555555550001', null, v_jules,   'We just have a single Vercel-hosted page that polls /healthz. 30 lines. Customers like it more than fancy ones.', now() - interval '13 days'),
    ('66666666-6666-6666-6666-666666660011', '55555555-5555-5555-5555-555555550001', null, v_nora,    'Upptime. It''s a GitHub-Actions-based status page generator. Free, zero infra, and the YAML is short.', now() - interval '13 days'),
    ('66666666-6666-6666-6666-666666660012', '55555555-5555-5555-5555-555555550001', null, v_marcus,  'Both of these are perfect, thank you. Going with the polling page route.', now() - interval '12 days'),

    -- on Lara's Postgres post — debate thread
    (cm_a, '55555555-5555-5555-5555-555555550002', null, v_pranesh, 'Hard agree. The number of teams I''ve seen add Elastic for "search" when they had like 8,000 rows.', now() - interval '11 days'),
    ('66666666-6666-6666-6666-666666660014', '55555555-5555-5555-5555-555555550002', cm_a, v_nora,    'Even past 8,000 rows, Postgres full-text search is shockingly good. We''re on a few million docs without needing to bring in Elastic.', now() - interval '10 days'),
    ('66666666-6666-6666-6666-666666660015', '55555555-5555-5555-5555-555555550002', cm_a, v_daniel,  'The "I need fuzzy matching" thing finally has a real Postgres answer too — pg_trgm + a GIN index. People reach for Algolia way too fast.', now() - interval '10 days'),
    ('66666666-6666-6666-6666-666666660016', '55555555-5555-5555-5555-555555550002', null, v_tomk,    'Counter: vector search is the one case I''d add a dependency. pgvector is fine for small, but if you''re doing anything heavy it falls over.', now() - interval '10 days'),
    ('66666666-6666-6666-6666-666666660017', '55555555-5555-5555-5555-555555550002', null, v_kai,     'The other underrated trick: just use Postgres LISTEN/NOTIFY for real-time stuff instead of Redis pubsub. Works great until it doesn''t (~10k events/sec).', now() - interval '9 days'),

    -- on Evelyn's "small design touch" question
    ('66666666-6666-6666-6666-666666660020', '55555555-5555-5555-5555-555555550003', null, v_sam,     'GitHub''s "y" shortcut to copy a permalinked URL. Saved my brain a thousand times.', now() - interval '9 days'),
    ('66666666-6666-6666-6666-666666660021', '55555555-5555-5555-5555-555555550003', null, v_kaitlin, 'Notion''s "duplicate page" preserving the URL slug. Tiny thing, huge for keeping shared links alive.', now() - interval '8 days'),
    ('66666666-6666-6666-6666-666666660022', '55555555-5555-5555-5555-555555550003', null, v_quinn,   'Linear ack-ing every action with a tiny toast that disappears in like 1.5 seconds. Long enough to register, short enough to forget.', now() - interval '8 days'),
    ('66666666-6666-6666-6666-666666660023', '55555555-5555-5555-5555-555555550003', null, v_mira,    'Stripe dashboard: cmd+k jumps to literally any object by ID. Once you know it''s there you''ll never go back.', now() - interval '8 days'),

    -- on Quinn's solo-founder log
    ('66666666-6666-6666-6666-666666660030', '55555555-5555-5555-5555-555555550004', null, v_alice,   'The "stopped saying we when I mean I" is a real milestone. Reads like calm.', now() - interval '5 days'),
    ('66666666-6666-6666-6666-666666660031', '55555555-5555-5555-5555-555555550004', null, v_noah,    'The first paying friend is undefeated. Mine bought 6 months upfront to be supportive.', now() - interval '5 days'),
    ('66666666-6666-6666-6666-666666660032', '55555555-5555-5555-5555-555555550004', null, v_jules,   'Rooting for you. Keep the log going.', now() - interval '5 days'),

    -- on Sam's keyboard-only modal
    ('66666666-6666-6666-6666-666666660040', '55555555-5555-5555-5555-555555550010', null, v_evelyn, 'Yes please share the snippet.', now() - interval '12 days')
  on conflict (id) do nothing;
end $$;

do $$
declare
  v_marcus uuid := '44444444-4444-4444-4444-444444444401';
  v_lara   uuid := '44444444-4444-4444-4444-444444444402';
  v_reagan uuid := '44444444-4444-4444-4444-444444444403';
  v_theob  uuid := '44444444-4444-4444-4444-444444444404';
  v_sam    uuid := '44444444-4444-4444-4444-444444444406';
  v_nora   uuid := '44444444-4444-4444-4444-444444444407';
  v_daniel uuid := '44444444-4444-4444-4444-444444444408';
  v_quinn  uuid := '44444444-4444-4444-4444-444444444409';
  v_evelyn uuid := '44444444-4444-4444-4444-44444444440a';
  v_masashi uuid := '44444444-4444-4444-4444-44444444440b';
  v_pranesh uuid := '44444444-4444-4444-4444-44444444440c';
  v_alice  uuid := '44444444-4444-4444-4444-44444444440d';
  v_gus    uuid := '44444444-4444-4444-4444-44444444440e';
  v_tomk   uuid := '44444444-4444-4444-4444-44444444440f';
  v_winnie uuid := '44444444-4444-4444-4444-444444444410';
  v_benji  uuid := '44444444-4444-4444-4444-444444444411';
  v_noah   uuid := '44444444-4444-4444-4444-444444444412';
  v_mira  uuid := '11111111-1111-1111-1111-111111111101';
  v_dev   uuid := '11111111-1111-1111-1111-111111111102';
  v_jules uuid := '11111111-1111-1111-1111-111111111103';
  v_theo  uuid := '11111111-1111-1111-1111-111111111104';
  v_sana  uuid := '11111111-1111-1111-1111-111111111105';
  v_kai   uuid := '11111111-1111-1111-1111-111111111106';
  cm_d uuid := '66666666-6666-6666-6666-666666660050';
begin
  insert into public.comments (id, post_id, parent_id, author_id, body_md, created_at) values
    -- on Reagan's Airflow→script
    (cm_d, '55555555-5555-5555-5555-555555550011', null, v_masashi, 'I''ve done this exact migration twice now. The dirty secret of orchestrators is that most pipelines genuinely don''t need them.', now() - interval '10 days'),
    ('66666666-6666-6666-6666-666666660051', '55555555-5555-5555-5555-555555550011', cm_d, v_reagan, 'The "I might need it later" thinking is what kills you. Just write the script. Add the orchestrator when there''s a real reason.', now() - interval '9 days'),
    ('66666666-6666-6666-6666-666666660052', '55555555-5555-5555-5555-555555550011', null, v_pranesh, 'I would still keep dbt for the SQL though. The Python script + dbt is a really lean stack.', now() - interval '9 days'),

    -- on Tom Kobayashi's slug post
    ('66666666-6666-6666-6666-666666660060', '55555555-5555-5555-5555-555555550012', null, v_nora, 'The "lock the slug" decision is the one that takes most people two attempts to figure out. Saved future-you a lot of pain.', now() - interval '7 days'),
    ('66666666-6666-6666-6666-666666660061', '55555555-5555-5555-5555-555555550012', null, v_sam, 'Adjacent tip: redirect old slugs forever. Use a tiny `slug_redirects` table. Future-you''s SEO will thank you.', now() - interval '7 days'),

    -- on Noah's first customer
    ('66666666-6666-6666-6666-666666660070', '55555555-5555-5555-5555-555555550013', null, v_mira, '🥹 frame the quote.', now() - interval '2 days'),
    ('66666666-6666-6666-6666-666666660071', '55555555-5555-5555-5555-555555550013', null, v_quinn, 'This is the milestone. Going from 0 → 1 paying customer is harder than 1 → 100.', now() - interval '2 days'),
    ('66666666-6666-6666-6666-666666660072', '55555555-5555-5555-5555-555555550013', null, v_kai, 'Hamilton plumber as your first customer is so deeply on-brand for this community.', now() - interval '1 day'),

    -- on Evelyn's print template
    ('66666666-6666-6666-6666-666666660080', '55555555-5555-5555-5555-555555550014', null, v_dev, 'Browser-print is so underused. PDF libraries are a special kind of suffering.', now() - interval '4 days'),
    ('66666666-6666-6666-6666-666666660081', '55555555-5555-5555-5555-555555550014', null, v_tomk, 'Page-break-inside: avoid is the one rule that ties the whole thing together.', now() - interval '4 days'),

    -- on Alice's hiring post
    ('66666666-6666-6666-6666-666666660090', '55555555-5555-5555-5555-555555550020', null, v_winnie, 'Sent you a DM. This is exactly the kind of role I''ve been looking for.', now() - interval '11 days'),
    ('66666666-6666-6666-6666-666666660091', '55555555-5555-5555-5555-555555550020', null, v_jules, 'Resharing to my network.', now() - interval '10 days'),

    -- on Masashi's backend roles
    ('66666666-6666-6666-6666-666666660100', '55555555-5555-5555-5555-555555550021', null, v_nora, 'The "no whiteboards, pair on real code" thing is the green flag.', now() - interval '7 days'),
    ('66666666-6666-6666-6666-666666660101', '55555555-5555-5555-5555-555555550021', null, v_tomk, 'Just emailed you.', now() - interval '6 days'),

    -- on Daniel's platforms rant
    ('66666666-6666-6666-6666-666666660110', '55555555-5555-5555-5555-555555550030', null, v_masashi, 'Counterpoint: a small "platform" of 3-4 well-chosen primitives is the difference between teams shipping and teams arguing about infra. The mistake is making it a 20-person org.', now() - interval '14 days'),
    ('66666666-6666-6666-6666-666666660111', '55555555-5555-5555-5555-555555550030', null, v_kai, 'Naming alone is a tell. "Foundation" / "Core" / "Platform" energy = budget about to blow up.', now() - interval '14 days'),
    ('66666666-6666-6666-6666-666666660112', '55555555-5555-5555-5555-555555550030', null, v_sana, 'My rule: if the engineers building it can''t name 3 specific developer tasks it makes easier this quarter, it''s not a platform, it''s a hobby.', now() - interval '13 days'),

    -- on Nora's cron page
    ('66666666-6666-6666-6666-666666660120', '55555555-5555-5555-5555-555555550031', null, v_dev, 'Add a "next scheduled run" column and you''ve got the whole game. Adding to our app this week.', now() - interval '10 days'),
    ('66666666-6666-6666-6666-666666660121', '55555555-5555-5555-5555-555555550031', null, v_benji, 'Run-history graph next to each job is the killer feature. You can see the slowdown coming before it''s a problem.', now() - interval '10 days'),

    -- on Benji's Black Friday postmortem
    ('66666666-6666-6666-6666-666666660130', '55555555-5555-5555-5555-555555550032', null, v_gus, 'Point 2 is the truest. The warehouse people figured out my software bug before I did. Embarrassing AND useful.', now() - interval '4 days'),
    ('66666666-6666-6666-6666-666666660131', '55555555-5555-5555-5555-555555550032', null, v_mira, 'Bookmarking this. The status page point especially.', now() - interval '4 days'),

    -- on Pranesh's materialized views
    ('66666666-6666-6666-6666-666666660140', '55555555-5555-5555-5555-555555550033', null, v_nora, 'And REFRESH MATERIALIZED VIEW CONCURRENTLY is one of those Postgres features that''s embarrassingly powerful.', now() - interval '3 days'),
    ('66666666-6666-6666-6666-666666660141', '55555555-5555-5555-5555-555555550033', null, v_lara, '+1. Got us off Looker for 90% of internal use cases.', now() - interval '2 days'),

    -- on Gus's warehouse field notes
    ('66666666-6666-6666-6666-666666660150', '55555555-5555-5555-5555-555555550034', null, v_alice, 'The "truck drivers will not log in" rule should be on a poster in every ops-software office.', now() - interval '1 day'),
    ('66666666-6666-6666-6666-666666660151', '55555555-5555-5555-5555-555555550034', null, v_kai, 'Saving this post forever. Every word is right.', now() - interval '1 day'),

    -- on Winnie's build vs buy
    ('66666666-6666-6666-6666-666666660160', '55555555-5555-5555-5555-555555550040', null, v_daniel, 'My rule: if the tool''s "main job" is also your company''s main job, build. Otherwise buy or Notion-page-it.', now() - interval '9 days'),
    ('66666666-6666-6666-6666-666666660161', '55555555-5555-5555-5555-555555550040', null, v_jules, 'Time-cost of building usually 3x what you''d estimate. Worth knowing going in.', now() - interval '9 days'),

    -- on Lara's LISTEN/NOTIFY
    ('66666666-6666-6666-6666-666666660170', '55555555-5555-5555-5555-555555550041', null, v_tomk, 'Used it for 4 years at last job. Works great up to ~10k events/sec. Past that you''ll need to think about it harder.', now() - interval '6 days'),
    ('66666666-6666-6666-6666-666666660171', '55555555-5555-5555-5555-555555550041', null, v_kai, 'The gotcha is reconnect logic. NOTIFY is fire-and-forget — if your subscriber dropped the connection, the message is gone. Plan for it.', now() - interval '6 days'),

    -- on Theob's non-technical onboarding
    ('66666666-6666-6666-6666-666666660180', '55555555-5555-5555-5555-555555550042', null, v_alice, 'We made a glossary doc and updated it weekly for the first 2 months. Sales hire said it was the single most useful thing.', now() - interval '3 days'),
    ('66666666-6666-6666-6666-666666660181', '55555555-5555-5555-5555-555555550042', null, v_winnie, 'Pair them with an eng for the first month — not for shadowing, for translating. They both come out better.', now() - interval '3 days'),

    -- on Sam's book question
    ('66666666-6666-6666-6666-666666660190', '55555555-5555-5555-5555-555555550043', null, v_jules, '"A Philosophy of Software Design" by Ousterhout. Short, plain language, lots of "ahh THAT''s why" moments for non-engineers.', now() - interval '1 day'),
    ('66666666-6666-6666-6666-666666660191', '55555555-5555-5555-5555-555555550043', null, v_dev, 'Adjacent rec: "The Pragmatic Programmer". Older but the chapters on estimation translate well for non-eng audiences.', now() - interval '1 day')
  on conflict (id) do nothing;

  raise notice 'Comments inserted ✓';
end $$;

-- ─── 5. Emoji reactions (varied) ──────────────────────────────────────
do $$
declare
  v_marcus uuid := '44444444-4444-4444-4444-444444444401';
  v_lara   uuid := '44444444-4444-4444-4444-444444444402';
  v_reagan uuid := '44444444-4444-4444-4444-444444444403';
  v_theob  uuid := '44444444-4444-4444-4444-444444444404';
  v_kaitlin uuid := '44444444-4444-4444-4444-444444444405';
  v_sam    uuid := '44444444-4444-4444-4444-444444444406';
  v_nora   uuid := '44444444-4444-4444-4444-444444444407';
  v_daniel uuid := '44444444-4444-4444-4444-444444444408';
  v_quinn  uuid := '44444444-4444-4444-4444-444444444409';
  v_evelyn uuid := '44444444-4444-4444-4444-44444444440a';
  v_masashi uuid := '44444444-4444-4444-4444-44444444440b';
  v_pranesh uuid := '44444444-4444-4444-4444-44444444440c';
  v_alice  uuid := '44444444-4444-4444-4444-44444444440d';
  v_gus    uuid := '44444444-4444-4444-4444-44444444440e';
  v_tomk   uuid := '44444444-4444-4444-4444-44444444440f';
  v_winnie uuid := '44444444-4444-4444-4444-444444444410';
  v_benji  uuid := '44444444-4444-4444-4444-444444444411';
  v_noah   uuid := '44444444-4444-4444-4444-444444444412';
  v_mira  uuid := '11111111-1111-1111-1111-111111111101';
  v_dev   uuid := '11111111-1111-1111-1111-111111111102';
  v_jules uuid := '11111111-1111-1111-1111-111111111103';
  v_theo  uuid := '11111111-1111-1111-1111-111111111104';
  v_sana  uuid := '11111111-1111-1111-1111-111111111105';
  v_kai   uuid := '11111111-1111-1111-1111-111111111106';
begin
  insert into public.reactions (user_id, target_type, target_id, emoji) values
    -- Marcus's status pages post — early-stage discussion
    (v_jules, 'post', '55555555-5555-5555-5555-555555550001', '👍'),
    (v_nora,  'post', '55555555-5555-5555-5555-555555550001', '👍'),
    (v_dev,   'post', '55555555-5555-5555-5555-555555550001', '🙌'),

    -- Lara's Postgres post — viral
    (v_dev,    'post', '55555555-5555-5555-5555-555555550002', '🔥'),
    (v_pranesh,'post', '55555555-5555-5555-5555-555555550002', '🔥'),
    (v_nora,   'post', '55555555-5555-5555-5555-555555550002', '💯'),
    (v_tomk,   'post', '55555555-5555-5555-5555-555555550002', '💯'),
    (v_daniel, 'post', '55555555-5555-5555-5555-555555550002', '🎯'),
    (v_kai,    'post', '55555555-5555-5555-5555-555555550002', '🙌'),
    (v_masashi,'post', '55555555-5555-5555-5555-555555550002', '👏'),
    (v_evelyn, 'post', '55555555-5555-5555-5555-555555550002', '🧠'),
    (v_jules,  'post', '55555555-5555-5555-5555-555555550002', '🧠'),
    (v_winnie, 'post', '55555555-5555-5555-5555-555555550002', '👀'),

    -- Evelyn's design question — engagement
    (v_sam,    'post', '55555555-5555-5555-5555-555555550003', '🤔'),
    (v_kaitlin,'post', '55555555-5555-5555-5555-555555550003', '✨'),
    (v_mira,   'post', '55555555-5555-5555-5555-555555550003', '✨'),
    (v_quinn,  'post', '55555555-5555-5555-5555-555555550003', '👀'),

    -- Quinn's founder log — supportive
    (v_alice,  'post', '55555555-5555-5555-5555-555555550004', '🙌'),
    (v_noah,   'post', '55555555-5555-5555-5555-555555550004', '🙌'),
    (v_jules,  'post', '55555555-5555-5555-5555-555555550004', '🚀'),
    (v_mira,   'post', '55555555-5555-5555-5555-555555550004', '🚀'),
    (v_evelyn, 'post', '55555555-5555-5555-5555-555555550004', '❤️'),
    (v_kai,    'post', '55555555-5555-5555-5555-555555550004', '❤️'),
    (v_sana,   'post', '55555555-5555-5555-5555-555555550004', '💪'),

    -- Sam's modal
    (v_evelyn, 'post', '55555555-5555-5555-5555-555555550010', '👏'),
    (v_kai,    'post', '55555555-5555-5555-5555-555555550010', '👏'),
    (v_nora,   'post', '55555555-5555-5555-5555-555555550010', '🙏'),

    -- Reagan's pipeline rewrite — controversial fire
    (v_masashi,'post', '55555555-5555-5555-5555-555555550011', '🔥'),
    (v_pranesh,'post', '55555555-5555-5555-5555-555555550011', '🔥'),
    (v_daniel, 'post', '55555555-5555-5555-5555-555555550011', '💯'),
    (v_tomk,   'post', '55555555-5555-5555-5555-555555550011', '💯'),
    (v_lara,   'post', '55555555-5555-5555-5555-555555550011', '🎯'),
    (v_dev,    'post', '55555555-5555-5555-5555-555555550011', '👀'),

    -- Tom's slug post
    (v_nora,   'post', '55555555-5555-5555-5555-555555550012', '🧠'),
    (v_sam,    'post', '55555555-5555-5555-5555-555555550012', '💡'),
    (v_evelyn, 'post', '55555555-5555-5555-5555-555555550012', '💡'),

    -- Noah's first customer — celebration
    (v_mira,   'post', '55555555-5555-5555-5555-555555550013', '🎉'),
    (v_quinn,  'post', '55555555-5555-5555-5555-555555550013', '🎉'),
    (v_kai,    'post', '55555555-5555-5555-5555-555555550013', '🎉'),
    (v_alice,  'post', '55555555-5555-5555-5555-555555550013', '❤️'),
    (v_jules,  'post', '55555555-5555-5555-5555-555555550013', '❤️'),
    (v_winnie, 'post', '55555555-5555-5555-5555-555555550013', '🙌'),
    (v_benji,  'post', '55555555-5555-5555-5555-555555550013', '🙌'),
    (v_dev,    'post', '55555555-5555-5555-5555-555555550013', '🚀'),
    (v_gus,    'post', '55555555-5555-5555-5555-555555550013', '🚀'),

    -- Evelyn's print template
    (v_dev,    'post', '55555555-5555-5555-5555-555555550014', '👏'),
    (v_tomk,   'post', '55555555-5555-5555-5555-555555550014', '👏'),
    (v_mira,   'post', '55555555-5555-5555-5555-555555550014', '💡'),

    -- Alice's hiring
    (v_winnie, 'post', '55555555-5555-5555-5555-555555550020', '🙌'),
    (v_jules,  'post', '55555555-5555-5555-5555-555555550020', '👀'),
    (v_dev,    'post', '55555555-5555-5555-5555-555555550020', '👀'),

    -- Daniel's platforms rant — big debate
    (v_mira,   'post', '55555555-5555-5555-5555-555555550030', '🎯'),
    (v_kai,    'post', '55555555-5555-5555-5555-555555550030', '🎯'),
    (v_jules,  'post', '55555555-5555-5555-5555-555555550030', '💯'),
    (v_dev,    'post', '55555555-5555-5555-5555-555555550030', '💯'),
    (v_sana,   'post', '55555555-5555-5555-5555-555555550030', '🔥'),
    (v_lara,   'post', '55555555-5555-5555-5555-555555550030', '🔥'),
    (v_nora,   'post', '55555555-5555-5555-5555-555555550030', '👀'),
    (v_masashi,'post', '55555555-5555-5555-5555-555555550030', '🤔'),
    (v_pranesh,'post', '55555555-5555-5555-5555-555555550030', '🧠'),
    (v_kaitlin,'post', '55555555-5555-5555-5555-555555550030', '💯'),

    -- Nora's cron page
    (v_dev,    'post', '55555555-5555-5555-5555-555555550031', '💯'),
    (v_benji,  'post', '55555555-5555-5555-5555-555555550031', '💯'),
    (v_mira,   'post', '55555555-5555-5555-5555-555555550031', '🙏'),
    (v_lara,   'post', '55555555-5555-5555-5555-555555550031', '🙏'),

    -- Benji's BF postmortem
    (v_gus,    'post', '55555555-5555-5555-5555-555555550032', '💪'),
    (v_mira,   'post', '55555555-5555-5555-5555-555555550032', '🧠'),
    (v_nora,   'post', '55555555-5555-5555-5555-555555550032', '🙏'),
    (v_kai,    'post', '55555555-5555-5555-5555-555555550032', '🫡'),

    -- Pranesh's mat views
    (v_nora,   'post', '55555555-5555-5555-5555-555555550033', '💯'),
    (v_lara,   'post', '55555555-5555-5555-5555-555555550033', '🎯'),
    (v_tomk,   'post', '55555555-5555-5555-5555-555555550033', '👏'),

    -- Gus's warehouse — viral on the rules
    (v_alice,  'post', '55555555-5555-5555-5555-555555550034', '🔥'),
    (v_kai,    'post', '55555555-5555-5555-5555-555555550034', '🔥'),
    (v_mira,   'post', '55555555-5555-5555-5555-555555550034', '💯'),
    (v_jules,  'post', '55555555-5555-5555-5555-555555550034', '💯'),
    (v_dev,    'post', '55555555-5555-5555-5555-555555550034', '🙌'),
    (v_winnie, 'post', '55555555-5555-5555-5555-555555550034', '🙌'),
    (v_benji,  'post', '55555555-5555-5555-5555-555555550034', '🫡'),
    (v_noah,   'post', '55555555-5555-5555-5555-555555550034', '🫡'),
    (v_lara,   'post', '55555555-5555-5555-5555-555555550034', '👏'),

    -- A few comment-level reactions
    (v_nora,   'comment', '66666666-6666-6666-6666-666666660014', '🧠'),
    (v_daniel, 'comment', '66666666-6666-6666-6666-666666660015', '💯'),
    (v_pranesh,'comment', '66666666-6666-6666-6666-666666660052', '🎯'),
    (v_mira,   'comment', '66666666-6666-6666-6666-666666660070', '🥹'),
    (v_kai,    'comment', '66666666-6666-6666-6666-666666660150', '🫡'),
    (v_alice,  'comment', '66666666-6666-6666-6666-666666660150', '👏')
  on conflict do nothing;

  raise notice 'Reactions inserted ✓';
end $$;

-- ─── Final counts ─────────────────────────────────────────────────────
do $$
begin
  raise notice '─────────────────────────────────────';
  raise notice 'TOTAL profiles:  %', (select count(*) from public.profiles);
  raise notice 'TOTAL posts:     %', (select count(*) from public.posts);
  raise notice 'TOTAL comments:  %', (select count(*) from public.comments);
  raise notice 'TOTAL reactions: %', (select count(*) from public.reactions);
end $$;
