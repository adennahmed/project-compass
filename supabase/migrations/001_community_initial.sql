-- Kozai Community — Initial Schema
-- ─────────────────────────────────────────────────────────────────────────
-- Apply via Supabase SQL editor or `supabase db push`. Idempotent where
-- practical so re-running on a fresh project is safe.
-- Everything public-readable per design decision (no gating).
-- Writes guarded by Row-Level Security.

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- ─── ENUMS ───────────────────────────────────────────────────────────────
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

-- ─── PROFILES ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle citext unique not null check (char_length(handle) between 2 and 32 and handle ~ '^[a-z0-9_]+$'),
  display_name text not null check (char_length(display_name) between 1 and 64),
  avatar_url text,
  bio text check (char_length(bio) <= 280),
  role user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_handle_idx on public.profiles(handle);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_handle text;
  candidate text;
  suffix int := 0;
begin
  base_handle := lower(regexp_replace(split_part(coalesce(new.email,'user'),'@',1), '[^a-z0-9_]', '', 'g'));
  if length(base_handle) < 2 then base_handle := 'member'; end if;
  candidate := base_handle;
  while exists (select 1 from public.profiles where handle = candidate) loop
    suffix := suffix + 1;
    candidate := base_handle || suffix::text;
  end loop;

  insert into public.profiles (id, handle, display_name)
  values (new.id, candidate, coalesce(new.raw_user_meta_data->>'name', candidate));

  -- Bootstrap admin: first matching email gets admin role.
  if new.email = 'adenah04@outlook.com' then
    update public.profiles set role = 'admin' where id = new.id;
  end if;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── CHANNELS ────────────────────────────────────────────────────────────
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

-- ─── POSTS ───────────────────────────────────────────────────────────────
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

-- ─── COMMENTS ────────────────────────────────────────────────────────────
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

-- ─── REACTIONS ───────────────────────────────────────────────────────────
create table if not exists public.reactions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment')),
  target_id uuid not null,
  kind reaction_kind not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id, kind)
);

create index if not exists reactions_target_idx on public.reactions(target_type, target_id);

-- ─── RESOURCES ───────────────────────────────────────────────────────────
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

create index if not exists resources_published_idx on public.resources(published_at desc) where published_at is not null;
create index if not exists resources_kind_idx on public.resources(kind);

-- ─── EVENTS (Phase 6, schema reserved) ───────────────────────────────────
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  body_md text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  recording_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.event_rsvps (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('going','interested','declined')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- ─── REPORTS ─────────────────────────────────────────────────────────────
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

-- ─── AUDIT LOG ───────────────────────────────────────────────────────────
create table if not exists public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ─── HELPER: role lookup for current user (used in RLS) ──────────────────
create or replace function public.current_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() in ('staff','admin'), false)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() = 'admin', false)
$$;

-- ─── ROW-LEVEL SECURITY ──────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.channels    enable row level security;
alter table public.posts       enable row level security;
alter table public.comments    enable row level security;
alter table public.reactions   enable row level security;
alter table public.resources   enable row level security;
alter table public.events      enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.reports     enable row level security;
alter table public.audit_log   enable row level security;

-- profiles: world-readable; users edit own row; admins edit anyone (role changes)
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (true);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update
  using (public.is_admin());

-- channels: world-readable; admins manage
drop policy if exists channels_read on public.channels;
create policy channels_read on public.channels for select using (true);

drop policy if exists channels_admin_write on public.channels;
create policy channels_admin_write on public.channels for all
  using (public.is_admin()) with check (public.is_admin());

-- posts: world-readable (except soft-deleted unless author/staff)
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select
  using (deleted_at is null or author_id = auth.uid() or public.is_staff());

drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert
  with check (
    auth.uid() = author_id
    and (
      -- staff_only channels require staff
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

-- comments
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

-- reactions
drop policy if exists reactions_read on public.reactions;
create policy reactions_read on public.reactions for select using (true);

drop policy if exists reactions_insert on public.reactions;
create policy reactions_insert on public.reactions for insert with check (user_id = auth.uid());

drop policy if exists reactions_delete on public.reactions;
create policy reactions_delete on public.reactions for delete using (user_id = auth.uid());

-- resources: world-readable when published; staff publish
drop policy if exists resources_read on public.resources;
create policy resources_read on public.resources for select
  using (published_at is not null or author_id = auth.uid() or public.is_staff());

drop policy if exists resources_staff_write on public.resources;
create policy resources_staff_write on public.resources for all
  using (public.is_staff()) with check (public.is_staff());

-- events
drop policy if exists events_read on public.events;
create policy events_read on public.events for select using (true);

drop policy if exists events_staff_write on public.events;
create policy events_staff_write on public.events for all
  using (public.is_staff()) with check (public.is_staff());

-- event_rsvps
drop policy if exists rsvps_read on public.event_rsvps;
create policy rsvps_read on public.event_rsvps for select using (true);

drop policy if exists rsvps_own_write on public.event_rsvps;
create policy rsvps_own_write on public.event_rsvps for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reports: reporter can insert; staff/admin can read+update
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert with check (auth.uid() = reporter_id);

drop policy if exists reports_staff_read on public.reports;
create policy reports_staff_read on public.reports for select using (public.is_staff());

drop policy if exists reports_staff_update on public.reports;
create policy reports_staff_update on public.reports for update
  using (public.is_staff()) with check (public.is_staff());

-- audit_log: admins read-only; inserts only via service role
drop policy if exists audit_admin_read on public.audit_log;
create policy audit_admin_read on public.audit_log for select using (public.is_admin());

-- ─── REALTIME ────────────────────────────────────────────────────────────
-- Add tables to the supabase_realtime publication so the client can
-- subscribe to live thread / comment / reaction updates.
do $$ begin
  perform 1 from pg_publication where pubname = 'supabase_realtime';
  if found then
    alter publication supabase_realtime add table public.posts;
    alter publication supabase_realtime add table public.comments;
    alter publication supabase_realtime add table public.reactions;
  end if;
exception when others then null;
end $$;

-- ─── SEEDS ───────────────────────────────────────────────────────────────
insert into public.channels (slug, name, description, kind, staff_only_post, sort_order) values
  ('announcements', 'Announcements',  'Updates and releases from the Kozai team', 'announcements', true,  10),
  ('general',       'General',        'Open conversation — say hello, share what you''re working on', 'discussion', false, 20),
  ('show-and-tell', 'Show & Tell',    'Share something you built. Demos welcome.', 'discussion', false, 30),
  ('hiring',        'Hiring',         'Who''s hiring, who''s looking, how to think about it', 'discussion', false, 40),
  ('ops-talk',      'Ops Talk',       'Operational software, internal tools, the messy middle', 'discussion', false, 50),
  ('ask-kozai',     'Ask Kozai',      'Ask the Kozai team anything. Engineering, business, process.', 'discussion', false, 60)
on conflict (slug) do nothing;
