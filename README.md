# Task Board — D-TSK-01

Dark, mobile-friendly task management board for ClickyTour.

## Stack
- Next.js (App Router)
- Tailwind CSS
- Supabase (Postgres + REST)
- Vercel (deployment target)

## Implemented
- `/` board page grouped by: Todo / In Progress / Pending / Done
- Filters: agent, priority, project
- `/tasks/[id]` detail page with full task data + external links
- Dark theme using:
  - Navy `#0F2B46`
  - Cyan `#00B7D7`
- Supabase SQL schema: `supabase/schema.sql`
- Seed script from Herald tasks JSON: `scripts/seed-supabase.mjs`
- Mock fallback if Supabase env vars are missing
- Herald bot integration for task details links in:
  - `herald-bot/kanban.js`
  - `herald-bot/progresslog.js`

## Environment
Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Optional (required only for seeding):
# SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase setup
Because account credentials are not available in this run, the app is fully implemented with mock fallback and ready to connect.

### 1) Create project in Supabase
1. Go to https://supabase.com
2. Create/select project
3. Copy:
   - Project URL
   - anon public key
   - service role key (for seed script only)

### 2) Create table schema
Run SQL from `supabase/schema.sql` in SQL Editor.

### 3) Seed tasks
This imports from `data/tasks.mock.json` (copied from Herald tasks source):

```bash
npm run seed
```

## Local run
```bash
npm install
npm run dev
```

## Build verification
```bash
npm run build
```

## Vercel deployment steps (manual, not executed)
1. Push `task-board` to GitHub repo.
2. In Vercel: **New Project** → import repo.
3. Set env vars in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Add custom domain `tasks.clickytour.com` in Vercel domain settings.
6. Set `TASKS_BASE_URL=https://tasks.clickytour.com` in Herald bot environment.

## Herald integration format
Messages now include:

```md
[📋 Details](https://tasks.clickytour.com/tasks/[task-id])
```

(Uses `TASKS_BASE_URL` env var if set; defaults to `https://tasks.clickytour.com`.)
