# Parent Companion — frontend (mock data) build

A frontend-only preview of the GenExcel Parent Companion web app, with two
distinct interfaces sharing one app: a **parent dashboard** for monitoring
and assigning tasks, and a **child view** for completing them. All data is
mocked in `src/data/mockData.ts` and served through `src/lib/mockApi.ts`, an
in-memory layer that simulates network delay so the app behaves like a
connected product without a real database or backend.

## Two roles, one login screen

`/login` has a Parent / Child toggle:

- **Parent** signs in with email + password (demo build — any values work).
  Routes to `/dashboard`.
- **Child** signs in with their name + a 4-digit PIN. Try **Riya** with PIN
  **1234**. Routes to `/child`.

Both roles share the same mock reminders data, so actions sync both ways —
if the child marks a study task done, the parent's "needs attention" panel
clears it immediately.

Session is kept in `sessionStorage` via `src/lib/session.tsx` (clears on tab
close, or on Logout). `src/components/RequireRole.tsx` guards each route and
bounces to `/login` if the wrong role (or no session) is present.

## Parent interface

- **Dashboard** — summary cards (meals, supplements, study, next
  appointment, pending assessments), a "needs your attention" panel that
  surfaces anything overdue — including child study tasks phrased as
  *"Riya hasn't completed Math — Fractions"* — a "Today's rhythm" timeline,
  and a recent activity feed.
- **Reminders** — full create / edit / complete / delete for all task types
  (meal, supplement, appointment, assessment, study), with Today / Upcoming
  / Overdue / Completed tabs.
- **Assign study** — pick a subject from a fixed list (Math, Science,
  English, Social Studies, Computer Science), set a topic and schedule, and
  assign it to the child. Shows everything currently assigned.
- **Settings** — parent name and notification preference toggles (UI only).
- **Logout** — in the sidebar (desktop) and the mobile menu.

## Child interface

- A single playful "My tasks today" view at `/child` — big tap-to-complete
  cards grouped into **To do** and **Done**, a progress bar, and a star
  counter for completed tasks.
- Tasks that are overdue are visually flagged but the tone stays
  encouraging, not punitive.
- No access to settings or editing — the child can only mark tasks done.
- **Logout** button top-right.

## What's intentionally not built yet

This stage is frontend-only, per the original brief. Not included:

- Real authentication (Auth.js / NextAuth) — `loginParent` / `loginChild` in
  `lib/mockApi.ts` are demo stand-ins.
- A real database (PostgreSQL / Prisma) — `lib/mockApi.ts` keeps an
  in-memory array that resets on page reload.
- Real GenExcel API integration — the mock functions mirror the 4 contracted
  endpoints (`/children/{id}/summary`, `/children/{id}/activity`,
  `/notifications/send`, `/parents/{id}/children`) in the expected shape.
- Email sending (Resend) and the scheduled job (Vercel Cron) —
  `sendNotification` just logs to the console.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/login` if no session exists,
or straight into the right interface if one does.

## Project structure

```
src/
  app/
    login/                          role toggle, parent + child sign-in
    signup/, link-child/            UI-only auth-adjacent pages
    dashboard/                      parent dashboard
    reminders/                      parent reminders CRUD + tabs
    assign/                         parent: assign study subject/topic
    settings/                       parent profile + notification prefs
    child/                          child's task view
  components/
    AppShell.tsx, ChildShell.tsx    the two distinct interface shells
    RequireRole.tsx                 route guard based on session role
    AttentionPanel.tsx              parent-facing missed-task alerts
    ChildTaskCard.tsx               playful tap-to-complete card
    ...                             cards, forms, nav, icons
  data/mockData.ts                  hard-coded sample data (incl. child PIN)
  lib/
    mockApi.ts                     simulated async API + CRUD + login
    session.tsx                    sessionStorage-backed role/session context
    utils.ts                       date formatting, tab-bucketing, overdue logic
  types/index.ts                   shared TypeScript types
```

## Next steps (per the original brief)

1. Swap `lib/mockApi.ts` calls for real Prisma + PostgreSQL queries.
2. Add Auth.js for real parent/child authentication and protect routes
   server-side instead of via client-side `RequireRole`.
3. Replace the mock GenExcel responses with real fetches once available.
4. Wire up Resend + Vercel Cron for real email reminders when a task is
   missed.
