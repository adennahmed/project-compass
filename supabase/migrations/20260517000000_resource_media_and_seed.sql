-- ════════════════════════════════════════════════════════════════════════
-- Kozai Community — Resource media bucket, rules-accepted column, seed data
-- ════════════════════════════════════════════════════════════════════════
-- Idempotent migration. Safe to re-run.
--
-- To remove the seed data (placeholder members + everything they own via
-- cascade), run:
--   delete from auth.users where email like '%@placeholder.kozai';
-- ════════════════════════════════════════════════════════════════════════

-- ─── COMMUNITY RULES ACCEPTANCE ────────────────────────────────────────
alter table public.profiles
  add column if not exists community_rules_accepted_at timestamptz;

-- ─── RESOURCE MEDIA STORAGE BUCKET ─────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('resource-media', 'resource-media', true)
on conflict (id) do nothing;

drop policy if exists "resource-media: public read" on storage.objects;
create policy "resource-media: public read" on storage.objects for select
  using (bucket_id = 'resource-media');

drop policy if exists "resource-media: staff insert" on storage.objects;
create policy "resource-media: staff insert" on storage.objects for insert
  with check (bucket_id = 'resource-media' and public.is_staff());

drop policy if exists "resource-media: staff update" on storage.objects;
create policy "resource-media: staff update" on storage.objects for update
  using (bucket_id = 'resource-media' and public.is_staff());

drop policy if exists "resource-media: staff delete" on storage.objects;
create policy "resource-media: staff delete" on storage.objects for delete
  using (bucket_id = 'resource-media' and public.is_staff());

-- ─── SEED PLACEHOLDER MEMBERS ───────────────────────────────────────────
-- Inserts into auth.users fire the handle_new_user trigger which creates
-- corresponding profiles rows automatically. We then UPDATE those profiles
-- to set display_name / bio / avatar / role.

do $$
declare
  v_mira  uuid := '11111111-1111-1111-1111-111111111101';
  v_dev   uuid := '11111111-1111-1111-1111-111111111102';
  v_jules uuid := '11111111-1111-1111-1111-111111111103';
  v_theo  uuid := '11111111-1111-1111-1111-111111111104';
  v_sana  uuid := '11111111-1111-1111-1111-111111111105';
  v_kai   uuid := '11111111-1111-1111-1111-111111111106';
begin
  -- Insert seed auth users (the trigger creates profile rows).
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token)
  values
    (v_mira,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mira@placeholder.kozai',  '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Mira Sato"}'::jsonb, false, '', '', '', ''),
    (v_dev,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dev@placeholder.kozai',   '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Devon Park"}'::jsonb, false, '', '', '', ''),
    (v_jules, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jules@placeholder.kozai', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Jules Marchetti"}'::jsonb, false, '', '', '', ''),
    (v_theo,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'theo@placeholder.kozai',  '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Theo Brandt"}'::jsonb, false, '', '', '', ''),
    (v_sana,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sana@placeholder.kozai',  '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Sana Iyer"}'::jsonb, false, '', '', '', ''),
    (v_kai,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kai@placeholder.kozai',   '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Kai Nguyen"}'::jsonb, false, '', '', '', '')
  on conflict (id) do nothing;

  -- Update profiles created by the trigger (idempotent — safe to re-run).
  update public.profiles set
    display_name = 'Mira Sato', handle = 'mira',
    bio = 'Eng lead at a logistics startup. I write the boring tools that keep dispatch from going sideways.',
    avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=Mira&backgroundColor=F5803E&textColor=F1EEE5',
    role = 'staff', onboarded_at = now(), community_rules_accepted_at = now()
  where id = v_mira;

  update public.profiles set
    display_name = 'Devon Park', handle = 'devon',
    bio = 'Building internal-tools-as-a-service. Ex-Stripe ops eng. Toronto.',
    avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=Devon&backgroundColor=F5803E&textColor=F1EEE5',
    role = 'staff', onboarded_at = now(), community_rules_accepted_at = now()
  where id = v_dev;

  update public.profiles set
    display_name = 'Jules Marchetti', handle = 'jules',
    bio = 'Operator turned operator-software person. Two part-time exits, one full-time mistake.',
    avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=Jules&backgroundColor=F5803E&textColor=F1EEE5',
    onboarded_at = now(), community_rules_accepted_at = now()
  where id = v_jules;

  update public.profiles set
    display_name = 'Theo Brandt', handle = 'theo',
    bio = 'Solo dev. Build invoicing software for trades. Mostly TypeScript, occasionally Go when I''m feeling fancy.',
    avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=Theo&backgroundColor=F5803E&textColor=F1EEE5',
    onboarded_at = now(), community_rules_accepted_at = now()
  where id = v_theo;

  update public.profiles set
    display_name = 'Sana Iyer', handle = 'sana',
    bio = 'PM at a 40-person ops company. I write internal docs nobody reads and then complain about it.',
    avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=Sana&backgroundColor=F5803E&textColor=F1EEE5',
    onboarded_at = now(), community_rules_accepted_at = now()
  where id = v_sana;

  update public.profiles set
    display_name = 'Kai Nguyen', handle = 'kai',
    bio = 'Founder, two people, one product. We replace spreadsheets for plumbing wholesalers.',
    avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=Kai&backgroundColor=F5803E&textColor=F1EEE5',
    onboarded_at = now(), community_rules_accepted_at = now()
  where id = v_kai;
end $$;

-- ─── SEED CONTENT (posts, comments, reactions, resources) ──────────────
do $$
declare
  v_mira  uuid := '11111111-1111-1111-1111-111111111101';
  v_dev   uuid := '11111111-1111-1111-1111-111111111102';
  v_jules uuid := '11111111-1111-1111-1111-111111111103';
  v_theo  uuid := '11111111-1111-1111-1111-111111111104';
  v_sana  uuid := '11111111-1111-1111-1111-111111111105';
  v_kai   uuid := '11111111-1111-1111-1111-111111111106';
  c_ann   uuid;
  c_gen   uuid;
  c_show  uuid;
  c_hire  uuid;
  c_ops   uuid;
  c_ask   uuid;
  p_ann1  uuid := '22222222-2222-2222-2222-222222222201';
  p_ann2  uuid := '22222222-2222-2222-2222-222222222202';
  p_ann3  uuid := '22222222-2222-2222-2222-222222222203';
  p_gen1  uuid := '22222222-2222-2222-2222-222222222210';
  p_show1 uuid := '22222222-2222-2222-2222-222222222211';
  p_show2 uuid := '22222222-2222-2222-2222-222222222212';
  p_hire1 uuid := '22222222-2222-2222-2222-222222222213';
  p_ops1  uuid := '22222222-2222-2222-2222-222222222214';
  p_ops2  uuid := '22222222-2222-2222-2222-222222222215';
  p_ask1  uuid := '22222222-2222-2222-2222-222222222216';
  p_ask2  uuid := '22222222-2222-2222-2222-222222222217';
  cm_root uuid := '33333333-3333-3333-3333-333333333301';
  cm_chld uuid := '33333333-3333-3333-3333-333333333302';
begin
  select id into c_ann  from public.channels where slug = 'announcements';
  select id into c_gen  from public.channels where slug = 'general';
  select id into c_show from public.channels where slug = 'show-and-tell';
  select id into c_hire from public.channels where slug = 'hiring';
  select id into c_ops  from public.channels where slug = 'ops-talk';
  select id into c_ask  from public.channels where slug = 'ask-kozai';

  insert into public.posts (id, author_id, channel_id, type, title, body_md, pinned) values
    (p_ann1, v_mira, c_ann, 'announcement', 'Kozai Community is open',
     'Welcome. This is a small, deliberately quiet room for people who build the software ops teams actually use.\n\nNo growth hacks here. Post a thread, ask a question, share something you shipped.', true),
    (p_ann2, v_dev,  c_ann, 'announcement', 'We''re hiring a founding designer',
     'Toronto-based, hybrid, ridiculous amount of taste required. The full thing is on our jobs page, but the short version: you''ll be the person who decides what every Kozai product feels like.', false),
    (p_ann3, v_mira, c_ann, 'announcement', 'Office hours, every other Wednesday',
     'Starting next week — 30-minute slots, anything operations-software-related. Book through your member dashboard.', false),
    (p_gen1, v_jules, c_gen, 'thread', 'Hello room',
     'Long-time lurker on the marketing site, first-time poster. Mostly here to read but happy to answer questions about scaling ops from 5 to 50 people. That''s the part I''ve done a few times.', false),
    (p_show1, v_theo, c_show, 'thread', 'Shipped a new invoice editor today',
     'After three weeks of fighting `contentEditable` I finally have something that doesn''t corrupt itself when you paste from Excel.\n\nKey trick: stop trying to make rich text behave. Treat the document as a JSON tree and render to DOM, never the other way around. Obvious in hindsight.', false),
    (p_show2, v_kai, c_show, 'thread', 'Killed our internal admin tool — here''s what replaced it',
     'We had a Retool app with 47 pages. Nobody used 40 of them. Replaced with a Linear-style command bar that opens 7 specific actions. Usage went up 6x.\n\nLesson: most internal tools are too generous. Cut features until people complain.', false),
    (p_hire1, v_sana, c_hire, 'thread', 'Hiring: senior backend, ops-software experience',
     'Remote-friendly (NA timezones). We build software for industrial distributors. If you''ve worked on anything where the customer has a forklift, we want to talk.\n\nDM me, no formal application.', false),
    (p_ops1, v_jules, c_ops, 'thread', 'The case for boring internal tools',
     'Spent a decade now watching teams over-engineer admin panels. The pattern: someone reads a "we built a beautiful internal tool" post, gets jealous, spends 6 weeks rebuilding their CRUD pages in a custom design system.\n\nNobody''s job got better.\n\nThe best internal tool I''ve ever used was a Django admin with three custom filters. Took an afternoon.', false),
    (p_ops2, v_dev, c_ops, 'thread', 'Naming convention: what do you call your "ops" repo',
     'Ours is just `tools/`. Heard `internal/`, `ops/`, `admin/`, `runbook/`. Curious what people land on. Bonus points for the worst one you''ve inherited.', false),
    (p_ask1, v_kai, c_ask, 'question', 'How do you handle multi-tenant data in admin tooling?',
     'Specifically — when a staff member needs to "look as" a customer to debug something. We''re doing it with a header swap right now, feels wrong but not sure of the right pattern.', false),
    (p_ask2, v_theo, c_ask, 'question', 'Best on-call rotation for a 3-person team?',
     'We''re too small for PagerDuty pricing to make sense but customers are starting to expect off-hours response. What''s the bare minimum that doesn''t suck?', false)
  on conflict (id) do nothing;

  -- A nested comment chain on the ops1 thread
  insert into public.comments (id, post_id, parent_id, author_id, body_md) values
    (cm_root, p_ops1, null, v_dev,
     'Strong agree. The over-engineering is usually a status thing — engineers want to show off, and an admin panel is a safe place to do that because no customers see it.'),
    (cm_chld, p_ops1, cm_root, v_jules,
     'Yes. And ironically the customer-facing product often gets less design attention because there''s real friction to changing it. The admin tool becomes the playground.'),
    ('33333333-3333-3333-3333-333333333303', p_ops1, cm_root, v_sana,
     'I tell my eng team: if you''re excited to build it, that''s a red flag.')
  on conflict (id) do nothing;

  insert into public.comments (id, post_id, parent_id, author_id, body_md) values
    ('33333333-3333-3333-3333-333333333310', p_show1, null, v_dev, 'How are you handling paste from Google Docs? That''s the one that broke us.'),
    ('33333333-3333-3333-3333-333333333311', p_show1, null, v_kai, 'JSON tree is the only way. Welcome to the church.'),
    ('33333333-3333-3333-3333-333333333312', p_show2, null, v_theo, 'This is the most relatable post I''ve read this month. We have 23 unused pages.'),
    ('33333333-3333-3333-3333-333333333313', p_show2, null, v_sana, 'How did you decide which 7 actions to keep?'),
    ('33333333-3333-3333-3333-333333333314', p_ask1, null, v_dev, 'Look-as / impersonation is a real pattern. Audit-log every single action and you''re fine. The header swap is OK if you can prove who did what after the fact.'),
    ('33333333-3333-3333-3333-333333333315', p_ask2, null, v_mira, 'PagerDuty has a free tier for tiny teams now. Otherwise just a shared @oncall email plus phone forwarding. The tool matters less than the rotation discipline.'),
    ('33333333-3333-3333-3333-333333333316', p_gen1, null, v_mira, 'Welcome Jules — we''ll take you up on the scaling questions.'),
    ('33333333-3333-3333-3333-333333333317', p_hire1, null, v_jules, 'Forklift-customer software is a beautiful niche. Boosting.'),
    ('33333333-3333-3333-3333-333333333318', p_ops2, null, v_kai, 'Inherited `misc/`. Eight years of accumulated nonsense.'),
    ('33333333-3333-3333-3333-333333333319', p_ann1, null, v_jules, 'Glad it''s here.')
  on conflict (id) do nothing;

  -- Scattered reactions
  insert into public.reactions (user_id, target_type, target_id, kind) values
    (v_dev,   'post', p_ops1,  'insightful'),
    (v_kai,   'post', p_ops1,  'insightful'),
    (v_sana,  'post', p_ops1,  'fire'),
    (v_theo,  'post', p_ops1,  'like'),
    (v_jules, 'post', p_show2, 'fire'),
    (v_mira,  'post', p_show2, 'insightful'),
    (v_dev,   'post', p_show2, 'like'),
    (v_kai,   'post', p_show1, 'fire'),
    (v_sana,  'post', p_show1, 'like'),
    (v_mira,  'post', p_ann1,  'like'),
    (v_dev,   'post', p_ann1,  'like'),
    (v_jules, 'post', p_ann1,  'like'),
    (v_theo,  'post', p_ann2,  'fire'),
    (v_kai,   'post', p_ask1,  'insightful'),
    (v_jules, 'comment', cm_root, 'insightful'),
    (v_kai,   'comment', cm_root, 'like')
  on conflict do nothing;

  -- ─── RESOURCES ─────────────────────────────────────────────────────────
  insert into public.resources (slug, title, summary, body_md, hero_image_url, tags, kind, author_id, published_at) values
    ('the-shape-of-good-internal-tools',
     'The shape of good internal tools',
     'Most internal tools are too generous, too pretty, and built by the wrong people. A short field guide to building ones your team actually uses.',
     E'Every team eventually ships an internal tool. Most of them are bad. Not because they''re ugly — they''re often the prettiest software in the company — but because they answer the wrong question.\n\nThe wrong question is: *what would be cool to build?*\n\nThe right one is: *what is the smallest thing that removes the pain?*\n\n## Three signs your internal tool is going wrong\n\n- It has more than one tab nobody opens.\n- The eng team is excited about the framework.\n- It needs its own onboarding doc.\n\n### Why this happens\n\nInternal tools are the only place engineers get to skip the customer. There''s no PM filtering ideas, no support tickets describing real pain. So engineering scope expands to fill the time available.\n\n> The best internal tool I''ve ever used was a Django admin with three custom filters. It took an afternoon.\n\n::divider\n\n## What good ones look like\n\nThey share four properties:\n\n1. **One screen, one job.** Not a dashboard. A button.\n2. **No optional fields.** If it''s optional, it''s a bug.\n3. **Logs every action.** You will need to know who did what.\n4. **Ugly is fine.** Speed of iteration beats polish.\n\n![A workspace with a keyboard and notebook](https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80)\n\n### A short example\n\nWe replaced a 47-page Retool app with a 7-command palette. Usage went up 6x. The pages weren''t bad — they were just *too many choices*. Internal users are operators, not explorers. They want the keystroke.\n\n::video[https://www.youtube.com/embed/u9F1KbCXKxE]\n\n## What to do tomorrow\n\nDelete the pages nobody opens. Stop building new ones for a month. Ask the actual users what they wish was one click. Build *that*.\n\nIt is genuinely that simple. The hard part is admitting you''ve been building the wrong thing.',
     'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80',
     ARRAY['internal-tools','design','operations'],
     'guide',
     v_mira,
     now() - interval '4 days')
  on conflict (slug) do nothing;

  insert into public.resources (slug, title, summary, body_md, hero_image_url, tags, kind, author_id, published_at) values
    ('cutting-the-spreadsheet',
     'Cutting the spreadsheet',
     'A case study in replacing a 14-tab Excel monster with a single-purpose web app — and what changed in the customer''s business afterward.',
     E'Our customer ran their entire wholesale operation out of one spreadsheet. Fourteen tabs. Macros that nobody remembered writing. A "do not touch" column in column AC. You know the one.\n\nThey didn''t want to replace it. They were proud of it.\n\n## The wrong sales pitch\n\nWe spent the first three meetings trying to convince them that software was better than spreadsheets. This was a mistake. Spreadsheets *are* software, and theirs worked. What we were really selling was: **fewer things to remember**.\n\n### The reframe\n\nOnce we stopped pitching "modernization" and started pitching "two fewer hours per day for your dispatch team", the conversation changed completely.\n\n![A workspace with code on a screen](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80)\n\n::divider\n\n## What we actually built\n\nNot a CRM. Not a "platform". One screen that did the four things the spreadsheet was used for daily:\n\n- Take an order\n- Print a pick-list\n- Mark items shipped\n- Send the invoice\n\nThat''s it. Three months of work, mostly spent on the print formatting (it had to look exactly like their old one — same fonts, same column widths).\n\n> The first week of launch they kept the spreadsheet open next to the app. By month two they''d closed it. Nobody mentioned it.\n\n## What changed\n\n- Order entry time dropped from 4 minutes to 50 seconds.\n- Two errors per week became roughly zero (the system enforces SKU validity).\n- One new hire onboarded in a day instead of a month.\n\n::video[https://www.youtube.com/embed/u9F1KbCXKxE]\n\n## The lesson\n\nNobody wants software. They want their problem to go away. Spreadsheets work because they are infinitely flexible — and that flexibility is also why they break. Good software trades flexibility for *certainty*. Sometimes that''s the trade your customer needs, even when they don''t ask for it.',
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80',
     ARRAY['case-study','operations','wholesale'],
     'case_study',
     v_dev,
     now() - interval '11 days')
  on conflict (slug) do nothing;
end $$;
