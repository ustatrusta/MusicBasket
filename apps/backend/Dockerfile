FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --filter @muzik-sepeti/backend... --frozen-lockfile=false
COPY . .
RUN pnpm --filter @muzik-sepeti/backend prisma:generate && pnpm --filter @muzik-sepeti/backend build
EXPOSE 3001
CMD ["node", "apps/backend/dist/main.js"]
