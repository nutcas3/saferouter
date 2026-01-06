FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json bun.lock* ./

RUN npm install -g bun && bun install --frozen-lockfile

COPY . .

RUN NODE_ENV=production bun run build

FROM caddy:2-alpine

COPY --from=builder /app/dist /srv

COPY Caddyfile /etc/caddy/Caddyfile

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000
