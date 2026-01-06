# SafeRoute Dashboard - Production Deployment Guide

## Prerequisites

- Docker 24.0+
- Node.js 18+ (for local development)
- Bun (for package management)

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure environment variables:
```env
VITE_API_URL=https://api.saferoute.io  # Your production API URL
VITE_ENV=production
```

## Local Production Build

```bash
# Install dependencies
bun install

# Type check
bun run type-check

# Lint
bun run lint

# Build for production
bun run build:prod

# Preview production build
bun run preview
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t saferoute-dashboard:latest .
```

### Run Container

```bash
docker run -d \
  --name saferoute-dashboard \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  saferoute-dashboard:latest
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Kubernetes Deployment

Update the existing `infrastructure/kubernetes/dashboard-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dashboard
  namespace: saferoute
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dashboard
  template:
    metadata:
      labels:
        app: dashboard
    spec:
      containers:
      - name: dashboard
        image: saferoute-dashboard:latest
        ports:
        - containerPort: 3000
        env:
        - name: VITE_API_URL
          value: "http://proxy:8080"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

## Performance Optimizations

### Implemented Features

1. **Code Splitting**: React vendor and UI components separated
2. **Minification**: Terser with console.log removal
3. **Compression**: Gzip enabled in nginx
4. **Caching**: Static assets cached for 1 year
5. **Security Headers**: CSP, X-Frame-Options, etc.
6. **Error Boundaries**: Graceful error handling
7. **Health Checks**: `/health` endpoint for monitoring

### Build Output

Expected build size:
- Vendor chunk: ~150KB (gzipped)
- UI components: ~30KB (gzipped)
- Main bundle: ~50KB (gzipped)

## Monitoring

### Nginx Access Logs

```bash
docker logs saferoute-dashboard
```

### Application Errors

Check browser console or integrate with error tracking:
- Sentry
- LogRocket
- Datadog RUM

## CDN Integration

For optimal performance, serve static assets via CDN:

1. Build the application
2. Upload `dist/assets/*` to CDN
3. Update `index.html` asset paths
4. Configure CDN caching headers

## Security Checklist

- ✅ CSP headers configured
- ✅ XSS protection enabled
- ✅ Frame options set
- ✅ HTTPS enforced (configure at load balancer)
- ✅ Environment variables not exposed
- ✅ Source maps disabled in production
- ✅ Console logs removed

## Rollback Strategy

```bash
# Tag previous version
docker tag saferoute-dashboard:latest saferoute-dashboard:v1.0.0

# Deploy new version
docker build -t saferoute-dashboard:latest .

# If issues occur, rollback
docker tag saferoute-dashboard:v1.0.0 saferoute-dashboard:latest
docker restart saferoute-dashboard
```

## Support

For deployment issues:
- GitHub Issues: https://github.com/saferoute/saferoute/issues
- Email: support@saferoute.io
- Documentation: https://docs.saferoute.io
