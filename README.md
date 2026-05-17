# Kozai

Software studio website + community. React + Vite + TypeScript + Tailwind, hosted on Vercel, with a Supabase backend for community accounts.

## Local development

```bash
npm install
npm run dev      # → http://localhost:8080
npm run build    # production build
```

## Project layout

```
src/
  components/       Reusable UI (Logo, Nav, ContactDrawer, …)
    community/      Community-specific components (Avatar, StaffBadge, etc.)
  pages/
    Index.tsx       Marketing site (/)
    community/      Community subroute (/community/*)
  integrations/
    supabase/       Supabase client (hardened against missing env)
  lib/
    community/      Auth context, types, mock fallbacks
api/
  contact.ts        Vercel serverless function for inquiry form (Resend)
supabase/
  migrations/       Database schema
  functions/        Edge functions (delete-account)
  SETUP.md          Full backend setup guide
```

## Environment variables

| Key | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Vercel | Contact form email send |
| `VITE_SUPABASE_URL` | Vercel | Community auth backend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel | Community auth anon key |

## Community backend

See [`supabase/SETUP.md`](supabase/SETUP.md) for end-to-end setup of the Supabase project, OAuth providers, edge function deploys, and Vercel env vars.
