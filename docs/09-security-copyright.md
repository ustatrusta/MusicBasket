# Müzik Sepeti — Security & Copyright Strategy

> Version 1.0 — Phase 0 deliverable. Security by design, layered; copyright by provenance, enforced in the data model.

## 1. Security Architecture

### 1.1 Authentication & Session Strategy

- **JWT access tokens** (short-lived, 15 min) + **refresh tokens** (rotating, 30 days, hashed at rest, device-bound) stored in `RefreshTokens`.
- Providers: email+password (argon2id hashing), **Google** (ID-token verification server-side), **Apple** (identity token + authorization code verification; email-relay support).
- Mobile secure storage: Keychain (iOS) / Keystore-backed EncryptedSharedPreferences (Android) via `expo-secure-store`; tokens never in AsyncStorage.
- Rate limiting: per-IP (login 5/min), per-user (API 120/min), per-endpoint tiers; Redis-backed sliding window.
- Device/session management endpoints for logout-everywhere.

### 1.2 Authorization (RBAC)

| Role | Capabilities |
|---|---|
| GUEST | browse public content, basic tuner (local), activity events (session-scoped) |
| USER | favorites, collections, presets, recordings (own), submissions |
| EDITOR | create/edit content in DRAFT/REVIEW, upload assets, manage sources |
| REVIEWER | approve/reject submissions, publish |
| ADMIN | everything incl. users, analytics, featured content, audit access |

- Guards on every route (`@Roles(...)`, `@Public()`); DTO validation (class-validator) with strict whitelist; `ValidationPipe` global.

### 1.3 Input & Payload Security

- Zod/class-validator validation on all DTOs; `prune` unknown keys.
- Uploads: allow-list MIME + magic-byte check, size caps, random filenames, virus scan hook, private object storage with signed URLs.
- NoSQL/SQL injection prevented by Prisma parameterized queries.
- SSRF guard on YouTube/proxy fetch targets; allow-listed hosts.

### 1.4 Secrets & Configuration

- 12-factor: every secret in environment variables / secret vault; `.env.example` documents names and purposes with placeholders — no real values, ever.
- Server-side YouTube Data API key only (never shipped to the device).
- RevenueCat webhook HMAC secret server-side only.
- Docker images built without build-time secrets; runtime secrets injected per environment.

### 1.5 Data Protection

- TLS 1.2+ everywhere; HSTS.
- PII minimization: email/phone encrypted at rest (AES-256-GCM application-layer envelope where needed) — at minimum, hashed indexes for lookups.
- KVKK/GDPR: explicit consent records, data export endpoint, deletion flows (right to erasure → cascade by policy).
- Backups: daily pg_dump encrypted (age/gpg), 30-day retention; object storage versioning.
- Observability: structured JSON logs (no PII/secrets), traceId propagation, error monitoring, slow-query logging, uptime checks.

### 1.6 Abuse & Trending Integrity

- Activity events validated server-side: session uniqueness per device, per-song dedup windows (same user/song/event > 1 per N minutes ignored), velocity caps (e.g., > 60 events/user/hour flagged), anomaly scoring; admin visibility of flagged accounts (see §7 of 04-api-endpoints.md).

## 2. Copyright & Content Strategy

### 2.1 Content Provenance Model (enforced in schema)

| Concept | Enforcement |
|---|---|
| `ContentSources` | every song/lyric/story/notation row links a source row: type (TRT archive, method book, field research, licensed publisher, user submission), name, url/ISBN, date |
| `ContentLicenses` | type: PUBLIC_DOMAIN / LICENSED / USER_SUBMITTED / EDITORIAL; owner, terms, territory, expiry |
| Verification status | `DRAFT → REVIEW → APPROVED → PUBLISHED` + `REJECTED/ARCHIVED`; `isVerified` flag + reviewer + reviewedAt |
| Revision history | `ContentChangeLogs` on every important change (who/what/when/why) |

### 2.2 Content Rules (product-level policy)

- **No fabrication**: lyrics, notes, chords, stories and tuning configs always carry source + verification. Unverified editorial claims are labeled.
- Stories distinguish **verified historical facts** from **oral tradition/legends** (separate fields in `SongStories`).
- Regional attributions that are disputed are stored as multiple `SongRegions` rows with `disputed=true` + confidence — the app shows "alternatif kaynaklar" instead of asserting one.
- User-submitted content enters the moderation queue; published only after REVIEWER approval; submissions merge preserved with editor notes.

### 2.3 Takedown Mechanism

- `POST /v1/content/takedown-request` (public, no auth) — reporter, content reference, grounds (copyright/KVKK).
- Admin queue → decision → action: unpublish + archive (default), notify submitter, log `ContentChangeLogs`; SLA tracked.
- Right-of-reply for the content owner.

### 2.4 YouTube Integration Compliance

- Server-side YouTube Data API v3 search only (key held server-side), terms-compliant; results displayed as official embeds/links — **no downloading or redistribution of videos** (explicit product constraint).
- Solfege-query builder (`title + solfej`, `title + nota`, `title + bağlama solfej`, `title + gitar dersi`…) stored per song as `SongVideoSearches`, provider-parameterized (`VideoProviders`), cache with TTL and quota budgeting (YouTube API quota-aware caching).
- No scraping of websites (product constraint) — all external content via documented APIs.

### 2.5 Offline / Caching Policy

- Public-domain/editorial content may be cached locally where license permits; licensed content cached only with license terms covering offline use.
- Tuner/metronome/recording operate 100% offline (local only, nothing uploaded without explicit consent).

## 3. Testing & Verification

| Layer | Approach |
|---|---|
| Unit | auth crypto, validation, trending scoring, search normalization |
| Integration | e2e API suites (supertest + test DB), auth flows incl. refresh rotation |
| Security | dependency audit (pnpm audit in CI), SAST scan, secrets scan (gitleaks) |
| Load | k6 smoke: search + trending cache-hit paths |
| Device | managed testing matrix per release (see 10-roadmap.md) |
