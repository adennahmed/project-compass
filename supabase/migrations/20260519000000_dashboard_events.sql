-- ════════════════════════════════════════════════════════════════════════
-- Kozai Community — Member dashboard: events, RSVPs, per-event chat
-- ════════════════════════════════════════════════════════════════════════
-- Idempotent: safe to run multiple times.
-- Adds three tables: events, event_rsvps, event_messages.
-- Adds RLS policies, realtime publication, and a small idempotent seed
-- of two upcoming events authored by the bootstrap admin.
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ─── Events ────────────────────────────────────────────────────────────
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null check (char_length(title) between 3 and 140),
  description text check (char_length(description) <= 2000),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  capacity int,
  host_id uuid not null references public.profiles(id) on delete cascade,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_starts_idx on public.events(starts_at);

drop trigger if exists events_touch on public.events;
create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();

-- ─── RSVPs ─────────────────────────────────────────────────────────────
do $$ begin
  create type rsvp_status as enum ('going','maybe','declined');
exception when duplicate_object then null; end $$;

create table if not exists public.event_rsvps (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status rsvp_status not null default 'going',
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- ─── Per-event chat ────────────────────────────────────────────────────
create table if not exists public.event_messages (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists event_messages_event_idx on public.event_messages(event_id, created_at);

-- ─── RLS ───────────────────────────────────────────────────────────────
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.event_messages enable row level security;

-- Events: world readable, staff/admin write.
drop policy if exists events_read on public.events;
create policy events_read on public.events for select using (true);

drop policy if exists events_staff_write on public.events;
create policy events_staff_write on public.events for all
  using (public.is_staff()) with check (public.is_staff());

-- RSVPs: world readable. Users insert/update/delete their own.
drop policy if exists rsvps_read on public.event_rsvps;
create policy rsvps_read on public.event_rsvps for select using (true);

drop policy if exists rsvps_self_insert on public.event_rsvps;
create policy rsvps_self_insert on public.event_rsvps for insert
  with check (
    user_id = auth.uid()
    and not exists (
      select 1 from public.profiles where id = auth.uid()
        and (banned_at is not null or (mute_until is not null and mute_until > now()))
    )
  );

drop policy if exists rsvps_self_update on public.event_rsvps;
create policy rsvps_self_update on public.event_rsvps for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists rsvps_self_delete on public.event_rsvps;
create policy rsvps_self_delete on public.event_rsvps for delete
  using (user_id = auth.uid());

-- Messages: RSVP'd attendees + staff/admin can read & write. Banned/muted blocked.
drop policy if exists event_messages_read on public.event_messages;
create policy event_messages_read on public.event_messages for select
  using (
    public.is_staff() or exists (
      select 1 from public.event_rsvps r
      where r.event_id = event_messages.event_id and r.user_id = auth.uid()
    )
  );

drop policy if exists event_messages_insert on public.event_messages;
create policy event_messages_insert on public.event_messages for insert
  with check (
    auth.uid() = author_id
    and not exists (
      select 1 from public.profiles where id = auth.uid()
        and (banned_at is not null or (mute_until is not null and mute_until > now()))
    )
    and (
      public.is_staff()
      or exists (
        select 1 from public.event_rsvps r
        where r.event_id = event_messages.event_id and r.user_id = auth.uid()
      )
    )
  );

drop policy if exists event_messages_delete on public.event_messages;
create policy event_messages_delete on public.event_messages for delete
  using (author_id = auth.uid() or public.is_staff());

-- ─── Realtime ──────────────────────────────────────────────────────────
do $$ begin
  perform 1 from pg_publication where pubname = 'supabase_realtime';
  if found then
    begin alter publication supabase_realtime add table public.event_messages; exception when others then null; end;
    begin alter publication supabase_realtime add table public.events; exception when others then null; end;
    begin alter publication supabase_realtime add table public.event_rsvps; exception when others then null; end;
  end if;
exception when others then null;
end $$;

-- ─── Seed two upcoming events authored by the bootstrap admin ──────────
do $$
declare
  v_admin uuid;
  v_office_id uuid := '44444444-4444-4444-4444-444444444401';
  v_show_id   uuid := '44444444-4444-4444-4444-444444444402';
  v_next_wed timestamptz;
  v_show_thu timestamptz;
begin
  select id into v_admin from public.profiles
   where role = 'admin'
   order by created_at asc
   limit 1;

  if v_admin is null then
    raise notice 'No admin profile found — skipping event seed.';
    return;
  end if;

  -- Pick next Wednesday 11:00 America/Toronto from now()
  v_next_wed := date_trunc('day', now())
              + ((10 - extract(dow from now())::int) % 7) * interval '1 day'
              + interval '15 hours'; -- 11am Toronto = ~15 UTC (DST-approx; close enough for seed)
  if v_next_wed <= now() then
    v_next_wed := v_next_wed + interval '7 days';
  end if;

  -- Show & tell: Thursday ~3 weeks out, 7pm Toronto (~23 UTC)
  v_show_thu := date_trunc('day', now())
              + ((11 - extract(dow from now())::int) % 7) * interval '1 day'
              + interval '21 days'
              + interval '23 hours';

  insert into public.events (id, title, description, starts_at, ends_at, location, capacity, host_id)
  values (
    v_office_id,
    'Office hours',
    '30-minute slots, anything operations-software-related. Pop in and ask anything.',
    v_next_wed,
    v_next_wed + interval '90 minutes',
    'Zoom (link sent on RSVP)',
    12,
    v_admin
  )
  on conflict (id) do nothing;

  insert into public.events (id, title, description, starts_at, ends_at, location, capacity, host_id)
  values (
    v_show_id,
    'Show & tell night',
    'Bring something you shipped this month. Casual, ~90 min.',
    v_show_thu,
    v_show_thu + interval '120 minutes',
    'Discord voice',
    null,
    v_admin
  )
  on conflict (id) do nothing;

  raise notice 'Events seeded ✓';
end $$;

-- ─── Update office-hours announcement body to point at the dashboard ───
update public.posts
   set body_md = E'Starting next week — 30-minute slots, anything operations-software-related. Hop into the [member dashboard](/community/dashboard) to RSVP. New slot every other Wednesday.'
 where id = '22222222-2222-2222-2222-222222222203';
