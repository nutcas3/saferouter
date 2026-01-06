FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN npm install -g bun && bun install --frozen-lockfile

# Copy source code
COPY . .

# Build for production
RUN NODE_ENV=production bun run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
