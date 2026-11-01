# Müzik Sepeti — API Endpoint Specification

> Version 1.0 — Phase 0 deliverable. Implemented as NestJS controllers in `apps/backend/src`; Swagger/OpenAPI auto-generated at `/docs`.

## 1. Conventions

- Base path: `/api/v1` (versioned from day one).
- JSON everywhere; `Content-Type: application/json`; UTF-8.
- Pagination: `?page=1&limit=20` (default 20, max 100) → `{ data, meta: { page, limit, total, totalPages } }`.
- Errors: `{ statusCode, message, error, traceId }`; HTTP codes standard.
- Idempotency: write endpoints accept `Idempotency-Key` header where beneficial.
- Rate limiting: per-IP and per-user tiers (see 09-security-copyright.md).
- Auth: `Authorization: Bearer <accessToken>`; refresh via `POST /auth/refresh`.

## 2. Search Normalization (shared helper)

Turkish-aware NFC normalization for queries and indexed columns:

| Source char | Normalized |
|---|---|
| ı → i | i |
| ş → s | s |
| ç → c | c |
| ö → o | o |
| ü → u | u |
| ğ → g | g |
| â/î/û | a/i/u |

Also case folding and diacritic stripping; a derived `searchKey` column on Songs/Lyrics/Artists enables fast partial matching with proper indexes.

## 3. Endpoint Map

### 3.1 Auth (`/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Email+password registration (verify email) |
| POST | `/auth/login` | — | Email login → access + refresh tokens |
| POST | `/auth/google` | — | Google ID-token login (device → server) |
| POST | `/auth/apple` | — | Apple identity-token login |
| POST | `/auth/refresh` | refresh | Rotate refresh token |
| POST | `/auth/logout` | ✓ | Revoke refresh token |
| POST | `/auth/password/reset-request` | — | Send reset email |
| POST | `/auth/password/reset` | — | Set new password with token |
| GET | `/auth/me` | ✓ | Current user profile + entitlements |
| PATCH | `/auth/me` | ✓ | Update profile/preferences |
| DELETE | `/auth/me` | ✓ | Deactivate account |

### 3.2 Genres (`/genres`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/genres` | — | Active genres (Turkish Folk Music first) |
| GET | `/genres/:slug` | — | Genre detail |
| POST | `/genres` | admin | Create genre |
| PATCH | `/genres/:id` | admin | Update genre |
| DELETE | `/genres/:id` | admin | Archive genre |

### 3.3 Songs (`/songs`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/songs` | — | List; filters: `genreSlug, q, region, province, instrument, sort(newest\|views\|alphabetical)`, pagination |
| GET | `/songs/:id` | — | Detail; records view event; includes metadata, performers, region |
| GET | `/songs/:slug` | — | Detail by slug |
| GET | `/songs/:id/lyrics` | — | Primary + alternate lyric versions |
| GET | `/songs/:id/notations` | — | Notation assets list |
| GET | `/songs/:id/chords` | — | Chord-over-lyrics data (+ transpose param) |
| GET | `/songs/:id/tabs` | — | Tablature entries |
| GET | `/songs/:id/story` | — | Story with verified/oral separation |
| GET | `/songs/:id/videos?type=video\|solfege` | — | Provider-parameterized video results |
| POST | `/songs` | admin | Create (draft) |
| PUT | `/songs/:id` | admin | Update / move through workflow |
| PATCH | `/songs/:id/status` | admin | publish/unpublish/archive |
| DELETE | `/songs/:id` | admin | Archive |
| POST | `/songs/:id/aliases` | admin | Add alias |
| POST | `/songs/:id/consume` | ✓ | Favorites/collections (see 3.9) |

### 3.4 Artists & Composers (`/artists`, `/composers`)

| Method | Path | Description |
|---|---|---|
| GET | `/artists?q=&region=` | List with pagination |
| GET | `/artists/:id/songs` | Songs by artist |
| POST/PATCH/DELETE | `/artists` | admin CRUD (same pattern for composers) |

### 3.5 Geography (`/regions` — independent module)

| Method | Path | Description |
|---|---|---|
| GET | `/regions` | 7 TR regions |
| GET | `/regions/:id` | Region detail + local traditions, instruments, rhythms |
| GET | `/regions/:id/songs` | Songs originating there |
| POST/PATCH/DELETE | `/regions`, `/provinces`, `/districts` | admin CRUD |

### 3.6 Instruments & Tuning (`/instruments`, `/tuning`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/instruments` | — | All instruments (dynamic) |
| GET | `/instruments/:id/types` | — | Instrument types (e.g., short/long-neck bağlama) |
| GET | `/instruments/:id/tuning-systems` | — | Tuning system list |
| GET | `/tuning/configurations?instrumentTypeId=&systemId=` | — | Tuning configs with strings + frequencies |
| GET | `/tuning/configurations/:id` | — | Full detail incl. references/variations |
| POST | `/tuning/configurations` | admin | Add official config |
| PUT | `/tuning/configurations/:id` | admin | Edit (with audit log) |
| POST | `/tuning/presets` | ✓ | Save user custom tuning preset |
| GET | `/tuning/presets` | ✓ | My presets |
| DELETE | `/tuning/presets/:id` | ✓ | Delete preset |
| POST | `/tuning/reasonance` | — | (Optional) pitch-to-note utils (stateless) |

### 3.7 Trending (`/trending`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/trending/songs` | — | 7-day trending, Redis-cached |
| GET | `/trending/songs?range=7d\|14d&limit=` | admin | Admin view with breakdown |
| POST | `/trending/recalculate` | admin | Manual recalc trigger |

### 3.8 Events (`/events`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/events` | ✓/anon | Record activity: `{ songId, eventType }`, dedup + anti-inflation logic server-side |
| GET | `/events/my` | ✓ | My recent activity feed |

### 3.9 Favorites & Collections (`/favorites`, `/collections`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/favorites` | ✓ | My favorites |
| POST | `/favorites` | ✓ | `{ songId }` add |
| DELETE | `/favorites/:songId` | ✓ | Remove |
| GET | `/collections` | ✓ | My collections |
| POST | `/collections` | ✓ | Create |
| GET | `/collections/:id` | ✓/owner | Detail with items |
| PATCH | `/collections/:id` | ✓ | Rename/reorder |
| DELETE | `/collections/:id` | ✓ | Delete |
| POST | `/collections/:id/items` | ✓ | Add song |
| DELETE | `/collections/:id/items/:songId` | ✓ | Remove song |

### 3.10 Video Search (`/videos`)

| Method | Path | Description |
|---|---|---|
| GET | `/videos/search?q=&type=video\|solfege&provider=youtube` | Provider-parameterized search; server-side API key; cached results |
| GET | `/videos/providers` | Active providers (YouTube first; modular) |

### 3.11 Rhythm & Notation (`/rhythms`, part of metadata)

| Method | Path | Description |
|---|---|---|
| GET | `/rhythms?genreSlug=` | Usûl/time-signature presets (Düyek, Sofyan, Aksak…) |
| POST/PATCH/DELETE | `/rhythms` | admin CRUD |

### 3.12 Admin & Content Workflow (`/admin`)  — role ADMIN

| Method | Path | Description |
|---|---|---|
| GET | `/admin/dashboard/stats` | Key metrics (content, users, activity) |
| GET | `/admin/content/submissions?status=review` | Moderation queue (user submissions) |
| POST | `/admin/content/:id/approve\|reject` | Workflow transitions (log to ContentChangeLogs) |
| GET | `/admin/analytics/trending` | Trending breakdown |
| GET | `/admin/audit-log` | Content change history |
| PATCH | `/admin/content/featured` | Manage featured/trending content |

### 3.13 Subscriptions (`/subscriptions`) — RevenueCat webhook verified

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/subscriptions/webhook/revenuecat` | webhook-signature | Entitlement truth from RevenueCat |
| GET | `/subscriptions/status` | ✓ | My entitlement state |
| GET | `/subscriptions/offerings` | ✓ | Current offerings (prices/promos pulled from RevenueCat) |

## 4. Worker / Cron

| Job | Cadence | Purpose |
|---|---|---|
| Trending recalc | every 60 min | Aggregate last-7-day weighted events → TrendingScores |
| Event flush | every 5 min | Redis event buffer → PostgreSQL batch insert |
| YouTube cache refresh | on-demand | Refresh stale video searches |
| Backups | daily | pg_dump + object storage snapshot |

## 5. OpenAPI / Swagger

- Auto-generated at `/docs` (NestJS SwaggerModule) with bearer-auth UI; exported spec as CI artifact (`openapi.json`) validated on each build.

## 6. Mobile ↔ API Client

- `packages/shared` owns the typed DTOs; the mobile API client injects tokens, handles 401 → refresh queue, retries with backoff, and caches GETs via React Query (TanStack) or equivalent on top of Zustand stores.
