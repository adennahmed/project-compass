-- ════════════════════════════════════════════════════════════════════════
-- Kozai Community — Initial Schema
-- ════════════════════════════════════════════════════════════════════════
-- One-shot, idempotent migration. Safe to run on a fresh project. Defines
-- the full social-network shape (profiles, channels, posts, comments,
-- reactions, resources, reports, audit log) plus a hard bootstrap admin
-- and RLS policies for every table.
--
-- Run order:
--   1. Run this file in the Supabase SQL editor.
--   2. Deploy the `delete-account` Edge Function (see /supabase/functions/).
--   3. Set the auth provider config + redirect URLs (see SETUP.md).
-- ════════════════════════════════════════════════════════════════════════

-- ─── EXTENSIONS ─────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- ─── ENUMS ──────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('member', 'staff', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type channel_kind as enum ('announcements', 'discussion', 'resources');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_type as enum ('announcement', 'thread', 'question');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reaction_kind as enum ('like', 'insightful', 'fire');
exception when duplicate_object then null; end $$;

do $$ begin
  create type resource_kind as enum ('guide', 'deep_dive', 'case_study', 'glossary');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_status as enum ('open', 'dismissed', 'resolved');
exception when duplicate_object then null; end $$;

-- ─── PROFILES ───────────────────────────────────────────────────────────
-- One row per auth.users entry. Created automatically by trigger below.
-- Handle is case-insensitive and unique. Display name is what shows up
-- in the UI. `onboarded_at` is NULL until the user completes onboarding;
-- the frontend uses that signal to send first-time visitors through the
-- onboarding flow.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle citext unique not null
    check (char_length(handle) between 2 and 32 and handle ~ '^[a-z0-9_]+$'),
  display_name text not null check (char_length(display_name) between 1 and 64),
  avatar_url text,
  bio text check (char_length(bio) <= 280),
  role user_role not null default 'member',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_created_idx on public.profiles(created_at desc);

-- Keep updated_at fresh on any update.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ─── PROFILE BOOTSTRAP (trigger on auth signup) ─────────────────────────
-- When a new auth.users row appears, create a matching profiles row.
-- Generates a unique handle from the email local part, falling back to
-- "member" if the email yields nothing usable. Suffix-disambiguates
-- collisions ("alice", then "alice1", "alice2", …).
--
-- BOOTSTRAP ADMIN: the first user whose email matches
-- `adenah04@outlook.com` is promoted to admin immediately. Change that
-- email in this trigger if you want a different bootstrap address.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_handle text;
  candidate text;
  suffix int := 0;
  initial_display text;
begin
  base_handle := lower(
    regexp_replace(
      coalesce(split_part(new.email, '@', 1), 'user'),
      '[^a-z0-9_]',
      '',
      'g'
    )
  );
  if length(base_handle) < 2 then
    base_handle := 'member';
  end if;

  candidate := base_handle;
  while exists (select 1 from public.profiles where handle = candidate) loop
    suffix := suffix + 1;
    candidate := base_handle || suffix::text;
  end loop;

  -- Prefer OAuth `name` / `full_name` if present, otherwise use the handle.
  initial_display := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    candidate
  );

  insert into public.profiles (id, handle, display_name)
  values (new.id, candidate, initial_display);

  if new.email = 'adenah04@outlook.com' then
    update public.profiles set role = 'admin' where id = new.id;
  end if;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── CHANNELS ───────────────────────────────────────────────────────────
create table if not exists public.channels (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  kind channel_kind not null,
  staff_only_post boolean not null default false,
  sort_order int not null default 100,
  created_at timestamptz not null default now()
);

-- Seed the canonical channels. Channel names are not "content" — they're
-- structural metadata, so this seed is appropriate even though we're
-- otherwise shipping with no demo data.
insert into public.channels (slug, name, description, kind, staff_only_post, sort_order) values
  ('announcements', 'Announcements',  'Updates and releases from the Kozai team',                                'announcements', true,  10),
  ('general',       'General',        'Open conversation — say hello, share what you''re working on',           'discussion',    false, 20),
  ('show-and-tell', 'Show & Tell',    'Share something you built. Demos welcome.',                               'discussion',    false, 30),
  ('hiring',        'Hiring',         'Who''s hiring, who''s looking, how to think about it',                    'discussion',    false, 40),
  ('ops-talk',      'Ops Talk',       'Operational software, internal tools, the messy middle',                  'discussion',    false, 50),
  ('ask-kozai',     'Ask Kozai',      'Ask the Kozai team anything. Engineering, business, process.',            'discussion',    false, 60)
on conflict (slug) do nothing;

-- ─── POSTS / COMMENTS / REACTIONS ───────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  type post_type not null,
  title text not null check (char_length(title) between 3 and 180),
  body_md text not null check (char_length(body_md) <= 20000),
  pinned boolean not null default false,
  locked boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_channel_created_idx on public.posts(channel_id, created_at desc);
create index if not exists posts_author_idx on public.posts(author_id);
create index if not exists posts_pinned_idx on public.posts(pinned) where pinned;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.posts(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body_md text not null check (char_length(body_md) between 1 and 8000),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments(post_id, created_at);
create index if not exists comments_author_idx on public.comments(author_id);

drop trigger if exists comments_touch on public.comments;
create trigger comments_touch before update on public.comments
  for each row execute function public.touch_updated_at();

create table if not exists public.reactions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment')),
  target_id uuid not null,
  kind reaction_kind not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id, kind)
);

create index if not exists reactions_target_idx on public.reactions(target_type, target_id);

-- ─── RESOURCES ──────────────────────────────────────────────────────────
create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  summary text not null check (char_length(summary) <= 280),
  body_md text not null,
  hero_image_url text,
  tags text[] not null default '{}',
  kind resource_kind not null,
  author_id uuid not null references public.profiles(id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resources_published_idx on public.resources(published_at desc)
  where published_at is not null;
create index if not exists resources_kind_idx on public.resources(kind);

-- ─── REPORTS ────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  target_type text not null check (target_type in ('post','comment','profile')),
  target_id uuid not null,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null,
  status report_status not null default 'open',
  resolver_id uuid references public.profiles(id) on delete set null,
  resolution_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists reports_status_idx on public.reports(status);

-- ─── AUDIT LOG ──────────────────────────────────────────────────────────
create table if not exists public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ─── HELPER FUNCTIONS (for RLS) ─────────────────────────────────────────
create or replace function public.current_role_value()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_value() in ('staff','admin'), false)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_value() = 'admin', false)
$$;

-- ─── ROW-LEVEL SECURITY ─────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.channels    enable row level security;
alter table public.posts       enable row level security;
alter table public.comments    enable row level security;
alter table public.reactions   enable row level security;
alter table public.resources   enable row level security;
alter table public.reports     enable row level security;
alter table public.audit_log   enable row level security;

-- PROFILES
-- World-readable. Users edit only their own row, and cannot change their
-- own role (that's admin-only). Admins can update anyone.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (true);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
  );

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update
  using (public.is_admin());

-- Self-delete profile (auth.users deletion handled by Edge Function;
-- this lets a user explicitly delete their profile row even if they
-- choose to keep their auth.users row).
drop policy if exists profiles_self_delete on public.profiles;
create policy profiles_self_delete on public.profiles for delete
  using (id = auth.uid() or public.is_admin());

-- CHANNELS
drop policy if exists channels_read on public.channels;
create policy channels_read on public.channels for select using (true);

drop policy if exists channels_admin_write on public.channels;
create policy channels_admin_write on public.channels for all
  using (public.is_admin()) with check (public.is_admin());

-- POSTS
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select
  using (deleted_at is null or author_id = auth.uid() or public.is_staff());

drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert
  with check (
    auth.uid() = author_id
    and (
      not exists (select 1 from public.channels c where c.id = channel_id and c.staff_only_post)
      or public.is_staff()
    )
  );

drop policy if exists posts_update on public.posts;
create policy posts_update on public.posts for update
  using (author_id = auth.uid() or public.is_staff())
  with check (author_id = auth.uid() or public.is_staff());

drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts for delete
  using (author_id = auth.uid() or public.is_admin());

-- COMMENTS
drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select
  using (deleted_at is null or author_id = auth.uid() or public.is_staff());

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from public.posts p where p.id = post_id and not p.locked)
  );

drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments for update
  using (author_id = auth.uid() or public.is_staff())
  with check (author_id = auth.uid() or public.is_staff());

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete
  using (author_id = auth.uid() or public.is_admin());

-- REACTIONS
drop policy if exists reactions_read on public.reactions;
create policy reactions_read on public.reactions for select using (true);

drop policy if exists reactions_insert on public.reactions;
create policy reactions_insert on public.reactions for insert with check (user_id = auth.uid());

drop policy if exists reactions_delete on public.reactions;
create policy reactions_delete on public.reactions for delete using (user_id = auth.uid());

-- RESOURCES
drop policy if exists resources_read on public.resources;
create policy resources_read on public.resources for select
  using (published_at is not null or author_id = auth.uid() or public.is_staff());

drop policy if exists resources_staff_write on public.resources;
create policy resources_staff_write on public.resources for all
  using (public.is_staff()) with check (public.is_staff());

-- REPORTS
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert with check (auth.uid() = reporter_id);

drop policy if exists reports_staff_read on public.reports;
create policy reports_staff_read on public.reports for select using (public.is_staff());

drop policy if exists reports_staff_update on public.reports;
create policy reports_staff_update on public.reports for update
  using (public.is_staff()) with check (public.is_staff());

-- AUDIT LOG (admin read-only; service role inserts only)
drop policy if exists audit_admin_read on public.audit_log;
create policy audit_admin_read on public.audit_log for select using (public.is_admin());

-- ─── AVATAR STORAGE BUCKET ──────────────────────────────────────────────
-- Public bucket for profile photos. Each user can upload only files under
-- their own folder (auth.uid()/…); everyone can read.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read" on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars: user can upload own" on storage.objects;
create policy "avatars: user can upload own" on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: user can update own" on storage.objects;
create policy "avatars: user can update own" on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: user can delete own" on storage.objects;
create policy "avatars: user can delete own" on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─── REALTIME PUBLICATION ──────────────────────────────────────────────
-- Add tables to the realtime publication so the client can subscribe to
-- live thread / comment / reaction updates without polling.
do $$ begin
  perform 1 from pg_publication where pubname = 'supabase_realtime';
  if found then
    alter publication supabase_realtime add table public.posts;
    alter publication supabase_realtime add table public.comments;
    alter publication supabase_realtime add table public.reactions;
    alter publication supabase_realtime add table public.profiles;
  end if;
exception when others then null;
end $$;
