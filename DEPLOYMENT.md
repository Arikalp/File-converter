# 🚀 Deployment Guide

This guide covers deployment of the File Converter application to Vercel and other platforms.

## Table of Contents
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Other Platforms](#other-platforms)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

---

## Vercel Deployment (Recommended)

Vercel is the recommended deployment platform as it's built by the creators of Next.js and provides zero-configuration deployment.

### Method 1: Deploy with Git (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/file-converter.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration
   - Click "Deploy"

3. **Done!** 🎉
   - Your app is live at `https://your-project.vercel.app`
   - Automatic deployments on every git push
   - Preview deployments for pull requests

### Method 2: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

Create a `vercel.json` file (optional, for custom configuration):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "functions": {
    "app/actions/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### Vercel Plan Recommendations

| Plan | Memory | Timeout | File Size | Price |
|------|--------|---------|-----------|-------|
| Hobby | 1024MB | 10s | ~5MB | Free |
| Pro | 3008MB | 60s | ~10MB | $20/mo |
| Enterprise | Custom | Custom | Custom | Custom |

**Recommendation:** 
- Hobby plan works for most use cases
- Upgrade to Pro for larger files or higher traffic

---

## Other Platforms

### Deploy to Railway

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

### Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the Project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

**Note:** Netlify requires the `@netlify/plugin-nextjs` plugin for full Next.js support.

### Deploy to AWS (Advanced)

For AWS deployment, consider:
- **AWS Amplify** - Simplest option for Next.js
- **AWS App Runner** - Container-based deployment
- **ECS/Fargate** - Full control with Docker

### Deploy with Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app

   COPY package*.json ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 5000

   ENV PORT 5000

   CMD ["node", "server.js"]
   ```

2. **Build and Run:**
   ```bash
   docker build -t file-converter .
   docker run -p 5000:5000 file-converter
   ```

---

## Environment Configuration

### Required Configuration

No environment variables are required for basic functionality. The app works out of the box.

### Optional Configuration

Create a `.env.local` file for optional settings:

```env
# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error Tracking (optional)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Rate Limiting (optional)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# File Upload Limits (optional - overrides defaults)
MAX_FILE_SIZE_MB=10
```

### Production Environment Variables

For production, set these in your hosting platform:

```env
NODE_ENV=production
```

---

## Troubleshooting

### Issue: Sharp not working in production

**Symptom:** `Error: Cannot find module 'sharp'`

**Solution:**
```bash
# Ensure sharp is in dependencies, not devDependencies
npm install --save sharp

# Rebuild for the correct platform
npm rebuild sharp
```

### Issue: Serverless function timeout

**Symptom:** `Function execution timed out`

**Solutions:**
1. Increase timeout limit in Vercel dashboard (Pro plan)
2. Reduce max file size limit
3. Optimize Sharp processing options
4. Use streaming for large files

### Issue: Memory limit exceeded

**Symptom:** `JavaScript heap out of memory`

**Solutions:**
1. Upgrade Vercel plan for more memory
2. Reduce max file size
3. Process files in chunks
4. Use Sharp's streaming API

### Issue: CORS errors

**Symptom:** `Access-Control-Allow-Origin` errors

**Solution:** Add CORS headers in `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
      ],
    },
  ];
}
```

### Issue: Build fails

**Common causes:**
- TypeScript errors → Run `npm run build` locally
- Missing dependencies → Check `package.json`
- Node version mismatch → Use Node 18+

---

## Performance Optimization

### 1. Enable Compression

Already configured in `next.config.ts`:
```typescript
compress: true
```

### 2. Optimize Images

Use Next.js Image component for static images:
```typescript
import Image from 'next/image';
```

### 3. Enable Caching

Add caching headers for static assets:
```typescript
// In next.config.ts
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### 4. Monitor Performance

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// In app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 5. Error Tracking

**Install Sentry:**
```bash
npm install @sentry/nextjs
```

**Configure:**
```bash
npx @sentry/wizard@latest -i nextjs
```

---

## Production Checklist

Before deploying to production:

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without errors
- [ ] All tests passing (if applicable)
- [ ] No console.logs in production code
- [ ] Error handling implemented everywhere

### Security
- [ ] File upload limits configured
- [ ] MIME type validation enabled
- [ ] Filename sanitization working
- [ ] Security headers configured
- [ ] HTTPS enabled (automatic on Vercel)

### Performance
- [ ] Sharp optimizations enabled
- [ ] Compression enabled
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Loading states implemented

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics setup (Vercel/GA)
- [ ] Performance monitoring
- [ ] Uptime monitoring

### Documentation
- [ ] README updated
- [ ] API documentation
- [ ] Deployment guide
- [ ] Environment variables documented

---

## Scaling Considerations

### When to Scale

Monitor these metrics:
- **Response time** > 3 seconds
- **Error rate** > 1%
- **Memory usage** > 80%
- **CPU usage** > 80%

### Scaling Strategies

1. **Vertical Scaling:**
   - Upgrade Vercel plan
   - Increase memory/timeout limits

2. **Horizontal Scaling:**
   - Add CDN (Cloudflare, AWS CloudFront)
   - Use Redis for caching
   - Implement queue system

3. **Architecture Changes:**
   - Move to containerized deployment
   - Use dedicated image processing service
   - Implement microservices architecture

---

## Support

For deployment issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Open an issue on GitHub
4. Contact Vercel support (for Pro/Enterprise users)

---

**Happy Deploying! 🚀**
