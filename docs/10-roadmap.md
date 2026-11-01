# Müzik Sepeti — Development Roadmap, Complexity & Risks

> Version 1.0 — Phase 0 deliverable. Phasing per the master prompt (§14/§22), mapped to releases, with acceptance criteria.

## 1. Phase Plan & Releases

| Phase | Scope | Release | Acceptance criteria (sample) |
|---|---|---|---|
| **1** | Architecture, DB schema, API design, mobile skeleton, design system, navigation, monorepo, CI | foundations | Prisma migrate clean; Swagger up; 5-tab navigation; dark/light tokens; lint/typecheck/tests green |
| **2** | Song library, search, song detail, lyrics, stories, favorites | **1.0 core** | search normalizes ı/i…; lyrics verses separated; favorites CRUD; guest browse works |
| **3** | Notation, chords, tabs, YouTube + solfege search | **1.0 content** | notation viewer zoom; transpose chords; YouTube results in-app; provider abstractions |
| **3.5** | Admin panel full: content workflow, submissions, audit, analytics | **1.0 admin** | editor adds song → reviewer approves → mobile shows published |
| **4** | Tuner (chromatic, guitar, short+long-neck bağlama, tuning systems, custom) | **2.0** | real mic detection ±1 cent; offline; string diagrams; presets saved/synced |
| **4.5** | Regional discovery map | 1.5 | region → songs/traditions/instruments; disputed origins handled |
| **5** | Trending engine, analytics, subscriptions/ads | 1.5/2.0 | 7-day weighted trending; webhook-entitlements; ad placements; no ads in tuner |
| **5.5** | Metronome + TR rhythm presets, bağlama learning mode | 2.5 | offline metronome ±0.1% timing; Düyek/Sofyan/Aksak… presets; fretboard+notation sync |
| **6** | Recording studio, practice dashboard | 3.0 | record/pause/rename/compare; local storage; premium cloud backup |
| **7** | i18n (en), performance, security testing, device testing, store prep | GA | App Store + Play review ready; KVKK/GDPR flows; perf budgets met |

## 2. Delivery Order (immediate next steps)

1. `Phase 1` in this run → monorepo scaffold + schema + API contracts + mobile skeleton.
2. `Phase 2` → songs/search/lyrics/stories/favorites end-to-end with a first verified, sourced Turkish folk repertoire dataset (seeded via the content workflow, no fabricated data).
3. `Phase 3` → notation/chords/tabs/video search.
4. `Phase 3.5` → full admin panel.
5. `Phase 4` → native tuner (the flagship module).

## 3. Estimated Complexity

| Module | Size (relative) | Complexity | Notes |
|---|---|---|---|
| Monorepo base + CI | M | Low | well-trodden scaffolding |
| Prisma schema + migrations | L | Medium | 26+ entities with versioning semantics |
| Auth (JWT/refresh, Google/Apple) | M | Medium | Apple/Google verification stubs until accounts |
| Search (Turkish normalization) | M | Medium | custom normalization + indexes |
| Content workflow + admin | XL | High | state machines, audit, uploads |
| Notations/chords/tabs | M+ | Medium-high | transposition math; future MusicXML |
| Video search (YouTube) | S-M | Medium | quota management, provider abstraction |
| Trending engine | M | Medium | weighted scoring + anti-inflation + cron |
| **Native tuner** | L | **High** | multi-algorithm DSP, low latency, per-instrument configs |
| Bağlama subsystem | M | Medium-high | domain accuracy critical (sources, variations) |
| Metronome/learning/recording | L | High | audio clock precision, cross-session state |
| Subscriptions + ads | M | High | RevenueCat webhooks, entitlement integrity, ad safety |
| Map module | M | Medium | geo data model + visual map (offline tiles or service) |
| i18n + theming infra | M | Medium | locale files from day one |

Rough effort estimate (senior engineers, parallelizable): **foundations ~2–3 weeks · content phases ~6–8 weeks · audio modules ~6–8 weeks · store hardening ~3–4 weeks** → ~4–5 months to GA with 2–3 engineers + 1 music-domain editor.

## 4. Top Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | **Tuner accuracy/perf on device** (flagship vs mid-range Android latency) | High (flagship feature) | C++ DSP unit tests w/ synthetic + real recordings; device matrix; Oboe fallback paths |
| R2 | Bağlama tuning domain errors (wrong/universal frequencies) | High (credibility) | DB-driven configs + editorial verification + references; never hardcoded |
| R3 | Copyright exposure (lyrics, notation, stories) | High (legal) | Provenance model, take-down flow, licensing checks before seed; public-domain-first dataset |
| R4 | YouTube API quota exhaustion | Medium | caching + TTL + provider abstraction; quota budgets; dedupe searches per song |
| R5 | Apple/Google accounts missing | Medium (store) | EAS profiles stubbed; dev-build/EAS preview until accounts ready |
| R6 | Trending inflation/bot activity | Medium | server-side dedup, velocity caps, anomaly flags, admin visibility |
| R7 | RevenueCat/AdMob key timing | Medium | env-var placeholders, sandbox mode; integration after keys |
| R8 | Scope creep across 7 future genres | Medium | modular-monolith discipline; genre = data, not code |
| R9 | Audio engine iOS/Android divergence | Medium | shared C++ DSP layer (XCFramework/NDK) with thin platform capture |
| R10 | Turkish-text search edge cases | Low-Medium | dedicated normalization lib + fixtures/tests (ı, dotted/dotless quirks) |

## 5. Definition of Done (applies to every phase)

- Feature works end-to-end with real data flow (no mock substitutes).
- Backend endpoints documented in Swagger; mobile screens wired to real API (or local-only where offline by design).
- Unit + integration tests green; CI pipeline passing.
- Turkish UI, English docs; secrets in env; audit log where content changes.
- Performance budget: API p95 < 300 ms (cached) / 800 ms (uncached); tuner update ≤ 60 ms; app cold start < 3 s.
