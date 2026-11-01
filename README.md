# Müzik Sepeti — Phase 1 Foundation

This repository contains the Phase 1 monorepo foundation for **Müzik Sepeti**.

## Prerequisites

- Node.js **>= 20**
- pnpm **>= 9**
- Docker + Docker Compose

## Architecture docs

All approved architecture/design documents are under [`docs/`](./docs):

- `01-system-architecture.md`
- `02-database-er-diagram.md`
- `04-api-endpoints.md`
- `05-repo-structure.md`
- `07-baglama-tuning-model.md`

## Workspace apps/packages

- `apps/backend` — NestJS + Prisma API
- `apps/mobile` — Expo (React Native) app skeleton
- `apps/admin` — Next.js admin panel skeleton
- `packages/shared` — shared domain contracts/helpers

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Start local infrastructure:

```bash
docker compose up -d
```

3. Run all apps in dev mode:

```bash
pnpm dev
```

4. Validate workspace:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Notes

- Turkish UI text is used for user-facing strings.
- No production secrets are committed. Use `.env.example` as a template.
- Structural seed data includes only factual reference entities (no fabricated songs/lyrics/stories).
