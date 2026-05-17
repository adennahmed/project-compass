# Kozai Community — Supabase Setup

End-to-end guide for spinning up the backend that powers `/community`.
Walk through it in order — each step depends on the one before it.

---

## ⚠️ If your Supabase project was originally scaffolded by Lovable

You may have `process-email-queue` / `send-transactional-email` /
`handle-email-suppression` Edge Functions deployed in Supabase. These
route auth emails through `@lovable.dev/email-js`, which is why
verification emails were arriving with `auth.lovable-app.email` as the
sender — they bypass your SMTP entirely. **Clean these up first or
auth emails will keep going through Lovable.**

### One-time cleanup steps (do this before anything else):

1. **Supabase dashboard → Edge Functions**. Delete every function
   except `delete-account`. Specifically: `process-email-queue`,
   `send-transactional-email`, `preview-transactional-email`,
   `handle-email-suppression`, `handle-email-unsubscribe`,
   `send-contact-email`. They're all stale Lovable scaffolding.
2. **Supabase → Database → Webhooks**. Delete any webhook firing on
   `auth.users` or pointing to one of the functions above.
3. **Supabase → Database → Cron Jobs** (under Integrations or the
   `cron.job` table in SQL Editor: `select * from cron.job;`). Unschedule
   anything named like `process-auth-emails` / `process-transactional-emails`.
4. **Supabase → SQL Editor**. Run the contents of
   `supabase/migrations/20260515120000_drop_lovable_email_infra.sql`
   to drop the orphaned tables (`email_send_log`, `email_send_state`,
   `email_unsubscribe_tokens`, `suppressed_emails`, etc.) and pgmq queues
   (`auth_emails`, `transactional_emails`, etc.).
5. **Supabase → Authentication → Hooks**. Confirm no "Send Email Hook" is
   active. If one is, disable it.
6. After steps 1–5, retest: delete your unverified user from
   Authentication → Users, sign up again, and the verification email
   should now come from `hello@kozai.ca` via Resend.

If problems persist, the project itself may still be linked to Lovable's
org. In that case skip to **Step 0 below**.

---

## Step 0 — (Optional) Create a fresh Supabase project under your own org

Only do this if the cleanup above didn't work — meaning Lovable's
automation is overriding your changes. Lovable can provision Supabase
projects under their own org, which gives them write access to settings
you can't override from the dashboard.

1. supabase.com → top-left org dropdown → **New organization** if you
   don't already have one outside any Lovable-managed org.
2. New project under that org → name `kozai-community`.
3. Run the schema migration + the drop-lovable migration in order.
4. Update Vercel env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)
   to point at the new project (Settings → API).
5. Redeploy without cache.
6. Delete the old Lovable-tied Supabase project.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. **Name**: `kozai-community` (anything works).
3. **Database password**: generate a strong one and **save it to 1Password** —
   you'll need it later for direct DB access. The dashboard never shows it again.
4. **Region**: pick the one closest to Toronto (US East / Canada Central).
5. **Plan**: Free is fine to start.
6. Hit **Create new project** and wait ~2 min for provisioning.

---

## 2. Run the schema migration

1. In your Supabase project sidebar → **SQL Editor** → **New query**.
2. Open `supabase/migrations/20260515000000_community_initial.sql` in the repo.
3. Copy its **entire contents** (or run `cat supabase/migrations/20260515000000_community_initial.sql | pbcopy` from your Mac).
4. Paste into the SQL Editor → **Run**.
5. Wait for "Success. No rows returned" or similar. Any warning about "destructive operation" is expected (`drop policy if exists`).
6. Verify: sidebar → **Table Editor** → you should see `profiles`, `channels`,
   `posts`, `comments`, `reactions`, `resources`, `reports`, `audit_log`.
   The `channels` table should have 6 rows (announcements, general, etc.) — no other table has data yet, which is correct.

---

## 3. Configure email auth

1. Sidebar → **Authentication → Providers**.
2. Find **Email**, click it, ensure:
   - **Enable Email provider** is ON.
   - **Confirm email** is ON (this is what sends the verification link).
3. Save.

### Optional but recommended — set up custom SMTP

Supabase's default email sender is rate-limited (≈3 emails/hour) and lands in spam half the time. For production you'll want your own SMTP:

1. Sidebar → **Project Settings → Authentication → SMTP Settings**.
2. You can use **Resend** (which you already have configured for the contact form), **Postmark**, **AWS SES**, etc.
3. For Resend specifically:
   - Host: `smtp.resend.com`
   - Port: `587`
   - User: `resend`
   - Password: your Resend API key
   - Sender email: `hello@kozai.ca` (must be on your verified Resend domain)
   - Sender name: `Kozai`
4. Customize the templates under **Authentication → Email Templates** to match the Kozai voice. (Defaults work fine for now.)

---

## 4. Configure redirect URLs

This step is critical or OAuth and email-verification will fail.

1. Sidebar → **Authentication → URL Configuration**.
2. **Site URL**: `https://kozai.ca`
3. **Redirect URLs** (one per line):
   ```
   https://kozai.ca/community/auth/callback
   https://kozai.ca/community/auth/reset
   https://www.kozai.ca/community/auth/callback
   https://www.kozai.ca/community/auth/reset
   http://localhost:8080/community/auth/callback
   http://localhost:8080/community/auth/reset
   ```
4. Save.

---

## 5. Configure OAuth providers

You can enable any subset. Skipping a provider just removes its button from the
sign-in page (no errors).

### 5a. Google

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or use existing) → **APIs & Services → Credentials**.
3. **Create Credentials → OAuth client ID**.
4. If asked, configure the OAuth consent screen first:
   - User type: **External**
   - App name: `Kozai`
   - User support email: `hello@kozai.ca`
   - Authorized domain: `kozai.ca`
   - Developer contact: your email
   - Scopes: `email`, `profile`, `openid`
5. Back at Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Kozai Community`
   - Authorized JavaScript origins: `https://kozai.ca`, `https://www.kozai.ca`, `https://<your-project-ref>.supabase.co`
   - Authorized redirect URIs: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     (find your project ref under Supabase → Project Settings → API → Project URL)
6. Create. Copy the **Client ID** and **Client secret**.
7. In Supabase: **Authentication → Providers → Google** → toggle ON → paste both values → Save.

### 5b. GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → **OAuth Apps → New OAuth App**.
2. Fill in:
   - Application name: `Kozai Community`
   - Homepage URL: `https://kozai.ca`
   - Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Register application.
4. **Generate a new client secret**.
5. Copy the **Client ID** and **Client secret**.
6. In Supabase: **Authentication → Providers → GitHub** → toggle ON → paste both values → Save.

### 5c. Apple (optional, complex, requires paid Apple Developer account)

Apple Sign In requires a $99/year Apple Developer membership and a service ID, key, and team ID. If you don't have a use case yet, **skip this**. Otherwise:

1. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/) ($99/yr).
2. [Apple Developer → Certificates, Identifiers & Profiles → Identifiers](https://developer.apple.com/account/resources/identifiers/list):
   - **App ID**: register one (`ca.kozai.community`), enable **Sign In with Apple**.
   - **Services ID**: register one (`ca.kozai.community.web`), enable Sign In with Apple, configure with:
     - Primary App ID: the App ID above
     - Domain: `kozai.ca`
     - Return URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. **Keys**: register a new key, enable Sign In with Apple, pick the App ID. Download the `.p8` file (one-time download).
4. In Supabase: **Authentication → Providers → Apple** → toggle ON. Fill in:
   - **Services ID**: the Services ID you registered
   - **Team ID**: top-right corner of Apple Developer portal
   - **Key ID**: from the key you created
   - **Secret Key**: contents of the `.p8` file
5. Save.

---

## 6. Deploy the `delete-account` Edge Function

The browser cannot delete users from `auth.users` directly (security). We use
a service-role Edge Function. Already written at
`supabase/functions/delete-account/index.ts`.

### Option A — Supabase Dashboard (no CLI)

1. Sidebar → **Edge Functions → Deploy a new function**.
2. Name: `delete-account`.
3. Paste the contents of `supabase/functions/delete-account/index.ts` into the
   editor.
4. Deploy.

### Option B — Supabase CLI (recommended for repeatability)

```bash
npm i -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy delete-account
```

(`<your-project-ref>` is the random string in your Supabase project URL,
e.g. `abcdefghijklmnop`.)

No env vars need to be set on the function — Supabase auto-injects
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

---

## 7. Set Vercel env vars

1. Grab your keys from Supabase: sidebar → **Project Settings → API**.
2. Vercel dashboard → your project → **Settings → Environment Variables**.
3. Add these two (check **Production, Preview, and Development** for both):

| Key                              | Where to find the value          |
|----------------------------------|----------------------------------|
| `VITE_SUPABASE_URL`              | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY`  | Supabase → Settings → API → Project API keys → **anon** **public** |

**Do NOT** add the `service_role` key to Vercel. That stays only in
Supabase (already injected into your Edge Function).

4. Vercel → **Deployments** → top deployment → ⋯ menu → **Redeploy**
   (uncheck "use existing build cache" — env vars only inject on a
   fresh build).

---

## 8. Create your account (the founder / first admin)

1. After Vercel finishes deploying, visit `https://kozai.ca/community/auth`.
2. Click **Create account**.
3. Enter the email **`adenah04@outlook.com`** and a password (8+ chars).
4. Submit. You'll get a "check your inbox" message.
5. Check your inbox, click the verification link.
6. You'll be sent to onboarding — pick your handle, display name, avatar, bio,
   and finish setup.
7. You're now in. Because of the bootstrap trigger in the SQL, your role is
   already **admin** — the orange "KOZAI · ADMIN" chip appears next to your
   name in the header and on your profile.

> 💡 If you want a different bootstrap email, edit line ~93 of
> `supabase/migrations/20260515000000_community_initial.sql` (the `if new.email = '…'`
> line) **before** running the SQL.

---

## 9. Promote staff / other admins (post-bootstrap)

Once you're signed in as admin, you can promote anyone from the UI:

1. Visit `/community/admin` (the **Admin** tab in the sub-nav appears for
   staff/admin only).
2. Click the **Members** pane.
3. Each member row has buttons:
   - **→ Staff**: promote a regular member to Kozai team member
   - **→ Admin**: promote a staff to admin
   - **Demote** / **→ Staff**: bump someone down

The role change takes effect immediately and is enforced by RLS:
- **Members** can post in any non-restricted channel, comment, react.
- **Staff** can additionally post in `announcements`, write resources, moderate posts/comments.
- **Admins** can additionally change roles, delete any post/comment, manage channels, and view the audit log.

You can also promote directly via SQL if you ever lock yourself out:

```sql
update profiles set role = 'admin' where handle = 'yourhandle';
```

---

## 10. Regular member sign-up flow

For anyone else (not the bootstrap email):

1. Visit `/community/auth` → **Create account** → enter email + password.
2. Verify email via the link.
3. Pick handle + display name on the onboarding page.
4. They're in as a **member**. They can post (in non-staff-only channels),
   comment, react, edit their profile, and delete their account.

OAuth signups skip the password step — they hit the provider, get bounced
back, and land directly on onboarding.

---

## 11. Account deletion (user-initiated)

Any signed-in user can permanently delete their own account:

1. Click their avatar in the header → **Settings**.
2. **Danger zone** tab.
3. Type `DELETE` in the confirmation field → **Permanently delete account**.

This calls the `delete-account` Edge Function, which:
1. Validates the caller's bearer token (must be the user themselves).
2. Calls `auth.admin.deleteUser(...)` with the service role key.
3. The cascade on `public.profiles` deletes their posts, comments, reactions,
   and any uploaded avatars are orphaned (you can clean those up on a cron
   later if needed).

The user is signed out and redirected back to `/community`.

---

## 12. What's intentionally NOT wired yet

Per the current scope ("focus on account creation and database logic"):

- The **Social** page still uses empty mock data.
- The **Announcements** page still uses empty mock data.
- The **Resources** page still uses empty mock data.
- The **Home** page's "recent activity" feed is empty.

These all have working RLS policies + tables in Postgres — they just don't
have a frontend wired to read/write them yet. That's the next chunk of work
once you're happy with the auth flow.

---

## Local development

To run the community section locally against your real Supabase project:

1. Create `.env.local` in the repo root:
   ```
   VITE_SUPABASE_URL=https://<your-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
   ```
2. Add `http://localhost:8080/community/auth/callback` and
   `http://localhost:8080/community/auth/reset` to your Supabase
   redirect URLs (step 4 above).
3. `npm run dev`
4. Visit `http://localhost:8080/community`.

---

## Troubleshooting

- **"Supabase URL is required" on boot** → either env vars are missing from
  Vercel, or the URL is malformed. The client now degrades to a disabled
  state and won't crash the page — but features that need the backend will
  show empty / error states.
- **Magic links / OAuth send you to a 404** → step 4 (redirect URLs) wasn't
  done. Each URL must be added verbatim.
- **Sign-up succeeds but email never arrives** → either confirm email is OFF
  (step 3) or default SMTP rate-limit kicked in. Configure custom SMTP (step
  3 optional).
- **First-time profile is missing fields** → the trigger creates a profile
  with placeholder handle/name; user finishes setup on onboarding page.
  Confirm `on_auth_user_created` trigger exists: **Database → Triggers**.
- **"new row violates row-level security policy"** when promoting → you're
  not signed in as admin. Run the SQL upgrade query in step 9.
- **Delete account fails** → the Edge Function isn't deployed (step 6) or
  doesn't have access to the service role key. Re-deploy.
