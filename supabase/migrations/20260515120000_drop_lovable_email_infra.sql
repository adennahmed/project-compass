-- ════════════════════════════════════════════════════════════════════════
-- Drop Lovable email infrastructure
-- ════════════════════════════════════════════════════════════════════════
-- Tears down the email queue / log / state tables and pgmq queues that
-- were originally wired to route auth + transactional emails through
-- Lovable's @lovable.dev/email-js Edge Functions. With those functions
-- removed from the project, this infrastructure is dead weight — and
-- any pg_cron job that's still firing them would error every interval.
--
-- After applying this migration:
--   • Auth emails go through whatever SMTP you've configured in
--     Supabase → Auth → SMTP Settings (custom Resend recommended).
--   • The contact form continues to work — it uses Vercel's serverless
--     /api/contact.ts which calls Resend directly, totally bypassing
--     Supabase email infrastructure.
-- ════════════════════════════════════════════════════════════════════════

-- 1. Remove any pg_cron jobs that were polling the email queues. Names
--    follow the convention used by the Lovable scaffold; if yours differ
--    you can list them with `select jobname from cron.job;` and unschedule
--    by name.
do $$ begin
  perform cron.unschedule('process-auth-emails');
exception when others then null; end $$;

do $$ begin
  perform cron.unschedule('process-transactional-emails');
exception when others then null; end $$;

do $$ begin
  perform cron.unschedule('process-email-queue');
exception when others then null; end $$;

-- 2. Drop the helper RPCs that the (now-deleted) Edge Functions used.
drop function if exists public.enqueue_email(text, jsonb) cascade;
drop function if exists public.read_email_batch(text, int, int) cascade;
drop function if exists public.delete_email(text, bigint) cascade;
drop function if exists public.move_to_dlq(text, bigint, text) cascade;

-- 3. Drop the email pgmq queues.
do $$ begin perform pgmq.drop_queue('auth_emails');               exception when others then null; end $$;
do $$ begin perform pgmq.drop_queue('auth_emails_dlq');           exception when others then null; end $$;
do $$ begin perform pgmq.drop_queue('transactional_emails');      exception when others then null; end $$;
do $$ begin perform pgmq.drop_queue('transactional_emails_dlq');  exception when others then null; end $$;

-- 4. Drop the tracking tables. The contact form's existing
--    contact_submissions table is preserved.
drop table if exists public.email_send_log cascade;
drop table if exists public.email_send_state cascade;
drop table if exists public.email_unsubscribe_tokens cascade;
drop table if exists public.suppressed_emails cascade;
drop table if exists public.email_templates cascade;

-- 5. Drop the email-assets storage bucket (was holding template images).
do $$ begin
  delete from storage.objects where bucket_id = 'email-assets';
  delete from storage.buckets where id = 'email-assets';
exception when others then null;
end $$;
