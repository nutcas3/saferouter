# SafeRoute Dashboard

Modern, production-ready React dashboard for SafeRoute - Zero-knowledge privacy proxy for LLMs.

## Tech Stack

- **React 19** with TypeScript
- **Vite** (Rolldown) for blazing-fast builds
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Lucide React** icons
- **React Compiler** for optimized performance

## Features

- Royal Gold Palette (Jewel Tones aesthetic)
- Fully responsive design
- Error boundaries for graceful error handling
- SEO optimized with meta tags
- Production-ready Docker setup
- Analytics integration ready
- Code splitting and lazy loading
- Security headers configured

## Quick Start

### Development

```bash
bun install
bun run dev
```

### Production Build

```bash
bun run type-check
bun run lint
bun run build:prod
bun run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:8080  # SafeRoute API endpoint
VITE_ENV=production
VITE_GA_TRACKING_ID=               # Optional: Google Analytics
VITE_POSTHOG_KEY=                  # Optional: PostHog analytics
```

## Docker Deployment

```bash
docker build -t saferoute-dashboard:latest .

# Run container
docker run -d -p 3000:3000 --name saferoute-dashboard saferoute-dashboard:latest

# Health check
curl http://localhost:3000/health
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Hero.tsx         # Landing page hero
│   ├── Features.tsx     # Feature showcase
│   ├── Stats.tsx        # Trust metrics
│   ├── Demo.tsx         # Interactive PII demo
│   ├── Pricing.tsx      # Pricing tiers
│   ├── Testimonials.tsx # Customer quotes
│   ├── CTA.tsx          # Call to action
│   ├── Footer.tsx       # Footer links
│   ├── ErrorBoundary.tsx # Error handling
│   └── LoadingSpinner.tsx # Loading state
├── utils/
│   └── analytics.ts     # Analytics tracking
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles + Royal Gold Palette
```

## Color Palette

The dashboard uses a sophisticated **Royal Gold Palette** with jewel tones:

- **Voodoo** (#422b42) - Deep backgrounds
- **Royal Lilac** (#7f549f) - Primary brand color
- **Elysium Gold** (#d19502) - High-end accents/CTAs
- **Viola** (#9271b8) - Secondary accents
- **Night White** (#e2e0de) - Main background
- **Cookie Dough** (#a57001) - Muted accents/borders

## Performance

- Code splitting with React vendor chunks
- Lazy loading for analytics
- Optimized font loading
- Gzip compression enabled
- Static asset caching (1 year)
- Sub-second initial load time

## Security

- CSP headers configured
- XSS protection enabled
- Frame options set to SAMEORIGIN
- No source maps in production
- Environment variables not exposed

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Main README](../../README.md) - Full project documentation

## Support

- GitHub: https://github.com/saferoute/saferoute
- Email: support@saferoute.io
- Docs: https://docs.saferoute.io
