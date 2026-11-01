# Müzik Sepeti — System Architecture

> Version 1.0 — Phase 0 deliverable. Architecture documentation is in English; the product UI language is Turkish.

## 1. Architectural Style

**Modular Monolith** backend with an independent, embeddable **Audio Engine**, per the approved decisions (Section F).

- One deployable NestJS application with clear module boundaries (not microservices).
- The Audio Engine is a separate native component (Swift / Kotlin-Oboe / shared C++ DSP) that does not depend on the business backend and works fully offline.
- A single codebase monorepo keeps mobile, backend, admin and shared contracts versioned together.

## 2. System Context Diagram

```mermaid
flowchart LR
    subgraph Users
        M[App User - iOS / Android]
        A[Admin / Editor]
    end

    M -->|HTTPS REST + JWT| API[NestJS Backend API]
    M -->|Mic input| T[Tuner / Recording - on device]
    T -->|No network needed| M

    A -->|HTTPS + JWT (role=ADMIN)| NX[Next.js Admin Panel]
    NX -->|HTTPS REST| API

    API --> PG[(PostgreSQL)]
    API --> RD[(Redis)]
    API --> S3[(S3-compatible Object Storage)]
    API --> YT[YouTube Data API]
    API --> RC[RevenueCat Webhook]
    API --> ADM[Google AdMob SDK - in app]
    API --> BC[Apple IAP / Play Billing - in app]

    OBS[Observability: structured logs, metrics] -.-> API
```

## 3. Logical Architecture

```mermaid
flowchart TB
    subgraph Mobile "React Native / Expo App (iOS + Android)"
        NAV[Expo Router Navigation]
        UI[Design System / Theme]
        ST[Zustand Stores]
        API2[API Client + Auth Token Manager]
        AUD[AUDIO ENGINE - native Swift / Kotlin / C++]
        AUD --> PITCH[YIN / Autocorrelation / FFT pitch detection]
        AUD --> MET[Metronome scheduler]
        AUD --> REC[Recording engine]
    end

    subgraph Backend "NestJS Modular Monolith"
        GW[Global: config, logging, rate-limit, validation]
        MOD[Modules: Genres, Songs, Lyrics, Notation, Chords, Stories, Regions, Instruments, Tuning, Favorites, Collections, Search, Trending, VideoSearch, Users, Auth, Admin, Analytics, Content, Subscriptions]
        MOD --> PR[Prisma ORM]
        PR --> PG[(PostgreSQL)]
        CACHE[Redis: cache + trending + rate limiting]
    end

    subgraph Admin "Next.js Admin Panel"
        LOGIN[Login / RBAC]
        CMS[Content Management workflows]
        STATS[Analytics dashboards]
    end

    API2 --> GW
    ADMIN --> GW
```

## 4. Data Flow Highlights

| Flow | Path |
|---|---|
| Browse songs | Mobile → API → (Redis cache) → PostgreSQL → JSON (paginated, Turkish-normalized search) |
| Song detail events | Mobile → POST /v1/events (activity) → Redis buffer → batch write → Trending engine |
| Trending (7-day) | Cron job → aggregate weighted events → TrendingScores table → Redis hot cache |
| Tuning | Mic → native AUDIO ENGINE (pitch detection) → UI (no network) |
| YouTube search | Mobile → API → YouTube Data API (server-side key) → filtered results |
| Subscription | RevenueCat webhook → API → entitlement check → premium access flags |
| Content publish | Admin → API → draft/review/approved workflow → published content |

## 5. Key Architecture Decisions (ADR Summary)

| # | Decision | Rationale |
|---|---|---|
| ADR-01 | Modular monolith, no microservices | Faster development, single deployment, acceptable scale for launch |
| ADR-02 | Genre-agnostic core | Genres are database records; no genre hardcoded in shared modules |
| ADR-03 | Audio Engine isolated from backend | Tuner/metronome/recording must work offline with µs-level scheduling |
| ADR-04 | Prisma + PostgreSQL | Strong typing, migrations, normalized relational data for music metadata |
| ADR-05 | Redis for cache + trending + rate limit | Sub-millisecond reads for hot paths; event buffering |
| ADR-06 | Server-side YouTube API keys | Secrets never on the device; policy-compliant search |
| ADR-07 | RevenueCat for entitlement truth + backend verification | Cross-platform subscription integrity; webhook authoritative |
| ADR-08 | i18n from day one | Locale files, Turkish default; no Turkish-specific business logic in shared code |
| ADR-09 | Content provenance mandatory | Every content row carries source, license, verification and publication status |
| ADR-10 | CI/CD from start | pnpm + Turborepo + GitHub Actions: lint, typecheck, unit, integration, build |

## 6. Deployment Topology (target)

- **Backend**: containerized NestJS (Docker), PostgreSQL + Redis managed or containerized, S3-compatible object storage.
- **Admin**: static Next.js build served behind the API gateway; admin at `/admin` subdomain.
- **Mobile**: Expo Development Build → TestFlight / Play internal track → App Store / Google Play (accounts to be created by owner later).

## 7. Environments

| Env | Purpose |
|---|---|
| `local` | docker-compose: backend + postgres + redis; Expo dev |
| `staging` | pre-release testing, seeded from sandbox content |
| `production` | live data; secrets in env vars / vault; automated backups |

## 8. Module Dependency Rules

- `shared` package (packages/shared) is imported by mobile, backend and admin — it holds contracts, DTOs and enums only (no business logic).
- Backend modules communicate via NestJS services; no cross-module direct DB access.
- Video providers, instruments, tuning systems and rhythms are **config-driven** (database records), so new genres never require core rewrites.
