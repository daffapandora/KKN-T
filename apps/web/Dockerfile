# ==============================================================================
# Dockerfile for @kemitir/web
# Multi-stage build producing static assets served by Nginx
# ==============================================================================

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Dependencies Stage
FROM base AS dependencies
COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/web/package.json ./apps/web/
COPY db/package.json ./db/

RUN pnpm install --frozen-lockfile || pnpm install

# Build Stage
FROM dependencies AS builder
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
COPY apps/web ./apps/web

RUN pnpm --filter @kemitir/shared run build
RUN pnpm --filter @kemitir/ui run build
RUN pnpm --filter @kemitir/web run build

# Web Serving Stage
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
