-- ════════════════════════════════════════════════════════════════════════
-- Kozai Community — Reactions redesign, Moderation system, Bookmarks,
-- Notifications. Idempotent: safe to run multiple times.
-- ════════════════════════════════════════════════════════════════════════

-- ─── REACTIONS: switch from kind enum → free-form emoji column ─────────
alter table public.reactions add column if not exists emoji text;

-- Backfill from the existing enum kind, if it's still present.
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='reactions' and column_name='kind'
  ) then
    update public.reactions
       set emoji = case kind::text
         when 'like' then '👍'
         when 'insightful' then '💡'
         when 'fire' then '🔥'
         else '👍'
       end
     where emoji is null;
  end if;
end $$;

alter table public.reactions alter column emoji set not null;
alter table public.reactions add constraint reactions_emoji_len
  check (char_length(emoji) between 1 and 16) not valid;
do $$ begin
  alter table public.reactions validate constraint reactions_emoji_len;
exception when others then null; end $$;

-- Drop old PK + kind column. Re-key on (user, target, emoji).
do $$ begin
  alter table public.reactions drop constraint reactions_pkey;
exception when others then null; end $$;

do $$ begin
  alter table public.reactions drop column kind;
exception when others then null; end $$;

do $$ begin
  alter table public.reactions
    add constraint reactions_pkey primary key (user_id, target_type, target_id, emoji);
exception when others then null; end $$;

-- We no longer need the reaction_kind enum. Keep it in case other things
-- reference it; safe to leave behind.

-- ─── REPORTS: add category + self-report guard ─────────────────────────
alter table public.reports add column if not exists reason_category text;
do $$ begin
  alter table public.reports add constraint reports_reason_category_check
    check (reason_category in ('spam','harassment','off-topic','illegal','other'));
exception when duplicate_object then null; when others then null; end $$;

-- Backfill any existing rows then enforce NOT NULL.
update public.reports set reason_category = 'other' where reason_category is null;
do $$ begin
  alter table public.reports alter column reason_category set not null;
exception when others then null; end $$;

-- Replace reports_insert so self-reports are blocked.
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert
  with check (
    auth.uid() = reporter_id
    and not (
      target_type = 'profile' and target_id = auth.uid()
    )
    and not (
      target_type = 'post'
      and exists (select 1 from public.posts p where p.id = target_id and p.author_id = auth.uid())
    )
    and not (
      target_type = 'comment'
      and exists (select 1 from public.comments c where c.id = target_id and c.author_id = auth.uid())
    )
  );

-- ─── MODERATION ACTIONS ─────────────────────────────────────────────────
do $$ begin
  create type moderation_action_kind as enum ('warn','mute','ban','unban','unmute');
exception when duplicate_object then null; end $$;

create table if not exists public.moderation_actions (
  id uuid primary key default uuid_generate_v4(),
  target_user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  kind moderation_action_kind not null,
  note text,
  expires_at timestamptz,
  related_report_id uuid references public.reports(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists moderation_actions_target_idx on public.moderation_actions(target_user_id, created_at desc);

alter table public.profiles add column if not exists mute_until timestamptz;
alter table public.profiles add column if not exists banned_at timestamptz;
alter table public.profiles add column if not exists warning_count int not null default 0;

alter table public.moderation_actions enable row level security;
drop policy if exists moderation_actions_staff_read on public.moderation_actions;
create policy moderation_actions_staff_read on public.moderation_actions for select
  using (public.is_staff());
drop policy if exists moderation_actions_staff_insert on public.moderation_actions;
create policy moderation_actions_staff_insert on public.moderation_actions for insert
  with check (public.is_staff() and auth.uid() = actor_id);

-- Audit log mirror trigger
create or replace function public.moderation_to_audit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log(actor_id, action, target_type, target_id, meta)
  values (
    new.actor_id,
    'moderation.' || new.kind::text,
    'profile',
    new.target_user_id,
    jsonb_build_object(
      'note', new.note,
      'expires_at', new.expires_at,
      'related_report_id', new.related_report_id
    )
  );
  return new;
end $$;

drop trigger if exists moderation_actions_audit on public.moderation_actions;
create trigger moderation_actions_audit after insert on public.moderation_actions
  for each row execute function public.moderation_to_audit();

-- ─── ENFORCEMENT in posts / comments insert RLS ─────────────────────────
drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert
  with check (
    auth.uid() = author_id
    and (
      not exists (select 1 from public.channels c where c.id = channel_id and c.staff_only_post)
      or public.is_staff()
    )
    and not exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.banned_at is not null or (p.mute_until is not null and p.mute_until > now()))
    )
  );

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from public.posts p where p.id = post_id and not p.locked)
    and not exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.banned_at is not null or (p.mute_until is not null and p.mute_until > now()))
    )
  );

-- ─── BOOKMARKS ──────────────────────────────────────────────────────────
create table if not exists public.bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post','resource')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);
create index if not exists bookmarks_user_idx on public.bookmarks(user_id, created_at desc);

alter table public.bookmarks enable row level security;
drop policy if exists bookmarks_self_read on public.bookmarks;
create policy bookmarks_self_read on public.bookmarks for select using (user_id = auth.uid());
drop policy if exists bookmarks_self_insert on public.bookmarks;
create policy bookmarks_self_insert on public.bookmarks for insert with check (user_id = auth.uid());
drop policy if exists bookmarks_self_delete on public.bookmarks;
create policy bookmarks_self_delete on public.bookmarks for delete using (user_id = auth.uid());

-- ─── NOTIFICATIONS ──────────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('comment_on_post','reply_to_comment','reaction_on_post','warning','mention')),
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_unread_idx on public.notifications(user_id, created_at desc) where read_at is null;
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;
drop policy if exists notifications_self_read on public.notifications;
create policy notifications_self_read on public.notifications for select using (user_id = auth.uid());
drop policy if exists notifications_self_update on public.notifications;
create policy notifications_self_update on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists notifications_self_delete on public.notifications;
create policy notifications_self_delete on public.notifications for delete using (user_id = auth.uid());
-- inserts happen via SECURITY DEFINER triggers; no insert policy needed.

-- Triggers that fan out notifications
create or replace function public.notify_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  post_author uuid;
  parent_author uuid;
  post_title text;
begin
  select author_id, title into post_author, post_title from public.posts where id = new.post_id;
  if new.parent_id is not null then
    select author_id into parent_author from public.comments where id = new.parent_id;
    if parent_author is not null and parent_author <> new.author_id then
      insert into public.notifications(user_id, kind, payload)
      values (parent_author, 'reply_to_comment',
        jsonb_build_object('post_id', new.post_id, 'comment_id', new.id, 'actor_id', new.author_id, 'post_title', post_title));
    end if;
  elsif post_author is not null and post_author <> new.author_id then
    insert into public.notifications(user_id, kind, payload)
    values (post_author, 'comment_on_post',
      jsonb_build_object('post_id', new.post_id, 'comment_id', new.id, 'actor_id', new.author_id, 'post_title', post_title));
  end if;
  return new;
end $$;

drop trigger if exists comments_notify on public.comments;
create trigger comments_notify after insert on public.comments
  for each row execute function public.notify_on_comment();

create or replace function public.notify_on_reaction()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  target_author uuid;
  post_title text;
begin
  if new.target_type = 'post' then
    select author_id, title into target_author, post_title from public.posts where id = new.target_id;
    if target_author is not null and target_author <> new.user_id then
      insert into public.notifications(user_id, kind, payload)
      values (target_author, 'reaction_on_post',
        jsonb_build_object('post_id', new.target_id, 'emoji', new.emoji, 'actor_id', new.user_id, 'post_title', post_title));
    end if;
  end if;
  return new;
end $$;

drop trigger if exists reactions_notify on public.reactions;
create trigger reactions_notify after insert on public.reactions
  for each row execute function public.notify_on_reaction();

-- Warning notifications: mirror warn moderation_actions to the target user.
create or replace function public.notify_on_warning()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.kind = 'warn' then
    insert into public.notifications(user_id, kind, payload)
    values (new.target_user_id, 'warning',
      jsonb_build_object('actor_id', new.actor_id, 'note', new.note));
    update public.profiles set warning_count = coalesce(warning_count,0) + 1
      where id = new.target_user_id;
  elsif new.kind = 'mute' then
    update public.profiles set mute_until = new.expires_at where id = new.target_user_id;
  elsif new.kind = 'unmute' then
    update public.profiles set mute_until = null where id = new.target_user_id;
  elsif new.kind = 'ban' then
    update public.profiles set banned_at = now() where id = new.target_user_id;
  elsif new.kind = 'unban' then
    update public.profiles set banned_at = null where id = new.target_user_id;
  end if;
  return new;
end $$;

drop trigger if exists moderation_actions_side_effects on public.moderation_actions;
create trigger moderation_actions_side_effects after insert on public.moderation_actions
  for each row execute function public.notify_on_warning();

-- Realtime
do $$ begin
  perform 1 from pg_publication where pubname = 'supabase_realtime';
  if found then
    begin alter publication supabase_realtime add table public.notifications; exception when others then null; end;
    begin alter publication supabase_realtime add table public.bookmarks; exception when others then null; end;
    begin alter publication supabase_realtime add table public.moderation_actions; exception when others then null; end;
  end if;
exception when others then null;
end $$;
