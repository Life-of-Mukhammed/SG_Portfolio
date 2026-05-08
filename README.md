# Startup Garage

A production-grade startup ecosystem platform — premium UI, full admin, real backend.

## Stack

- **Framework:** Next.js 14 (App Router) · TypeScript · React 18
- **Styling:** TailwindCSS 3 with HSL design-token theming, Framer Motion, lucide-react
- **Backend:** Next.js Route Handlers (REST), Prisma + SQLite (swap to Postgres in prod)
- **Auth:** JWT in HttpOnly cookies (jose) + middleware-protected `/admin`
- **Data:** TanStack React Query — caching + optimistic updates
- **Charts:** Recharts (admin dashboard)

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env (defaults are fine for local)
cp .env.example .env

# 3. Apply schema + seed (admin user + sample portfolio)
npm run db:push
npm run db:seed

# 4. Run dev server
npm run dev
```

Visit:
- Public: <http://localhost:3000>
- Portfolio: <http://localhost:3000/projects>
- Admin: <http://localhost:3000/admin>
  - Email: `admin@startupgarage.io`
  - Password: `garage2026`

## Architecture

```
app/
  page.tsx                  # Home (featured + standard + minimal cards)
  projects/                 # Public portfolio
    page.tsx                # Filterable grid
    [id]/page.tsx           # Detail page (id or slug)
  admin/                    # Auth-gated dashboard
    login/page.tsx
    page.tsx                # Stats + charts
    projects/...            # CRUD UI
    media/page.tsx          # Drag-drop uploader
  api/                      # REST endpoints (route handlers)
    auth/{login,logout,me}/
    projects/[id]/
    upload/

components/
  ui/                       # Button, Card, Input, Avatar, ThemeToggle
  layout/                   # Navbar, Footer, Logo
  project/                  # Featured + Standard + Minimal cards, Grid, Sparkline
  admin/                    # Shell, Dashboard, ProjectsList, ProjectForm, Dropzone

lib/
  db.ts                     # Prisma client singleton
  auth.ts                   # JWT session (jose)
  api.ts                    # Typed client wrapper
  serialize.ts              # DB ↔ DTO mapper (JSON-encoded arrays for SQLite)
  types.ts utils.ts         # Shared types & helpers

middleware.ts               # Verifies session for /admin/*
prisma/
  schema.prisma             # Project + User models
  seed.ts                   # Admin user + 9 sample projects
```

## API

| Method | Path                  | Auth   | Purpose                       |
| ------ | --------------------- | ------ | ----------------------------- |
| GET    | `/api/projects`       | public | list (filters: category, status, q) |
| GET    | `/api/projects/:id`   | public | by id or slug                 |
| POST   | `/api/projects`       | admin  | create                        |
| PUT    | `/api/projects/:id`   | admin  | update                        |
| DELETE | `/api/projects/:id`   | admin  | remove                        |
| POST   | `/api/upload`         | admin  | image upload (max 6MB)        |
| POST   | `/api/auth/login`     | public | sets httpOnly session cookie  |
| POST   | `/api/auth/logout`    | public | clears cookie                 |
| GET    | `/api/auth/me`        | public | current session info          |

## Design system

The visual hierarchy is the point. Three card variants fix the "everything looks the same" problem:

1. **Featured** (`ProjectCardFeatured`) — full-width, gradient halo, metrics + sparkline
2. **Standard** (`ProjectCardStandard`) — 1/3-width grid card, hover-lift + accent glow
3. **Minimal** (`ProjectCardMinimal`) — single-row dense list, used for early-stage / list view

Theming uses HSL design tokens (`app/globals.css`) so dark/light flip cleanly. Toggle adds a `theme-transition` class for ~350ms to animate background and color only — never transforms — so layout never jitters.

## Switching to Postgres

1. Change `prisma/schema.prisma`:
   ```prisma
   datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
   ```
2. The `tags`, `screenshots`, `techStack` fields are `String` (JSON-encoded) for SQLite compat — change them to `String[]` and update `lib/serialize.ts` accordingly.
3. `npm run db:push && npm run db:seed`.

## Production checklist

- [ ] Rotate `JWT_SECRET` to a cryptographically random 32+ byte string
- [ ] Change `ADMIN_PASSWORD` (re-seed after change)
- [ ] Set `NEXT_PUBLIC_BASE_URL`
- [ ] Move uploads from `/public/uploads` to S3/R2/Cloudflare Images
- [ ] Add rate limiting on `/api/auth/login`
