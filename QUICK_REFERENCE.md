# 🚀 Quick Reference Guide

## Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:5000)
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Build for production (Note: Use Vercel for Windows)
npm run start        # Start production server
```

### Package Management
```bash
npm install          # Install dependencies
npm update          # Update dependencies
npm audit           # Security audit
```

---

## File Structure Quick Map

```
Key Files:
├── app/page.tsx                 → Main UI
├── app/actions/convert.ts       → Server-side conversion
├── components/FileUpload.tsx    → Upload component
├── lib/converter.ts             → Sharp conversion logic
├── lib/validation.ts            → Security validation
└── lib/constants.ts             → Configuration

Documentation:
├── README.md                    → Start here
├── ARCHITECTURE.md              → Deep dive
├── DEPLOYMENT.md                → Deploy guide
├── KNOWN_ISSUES.md              → Troubleshooting
└── IMPLEMENTATION_SUMMARY.md    → What's built
```

---

## Configuration Quick Reference

### File Upload Limits
```typescript
// lib/constants.ts
MAX_FILE_SIZE = 10 * 1024 * 1024  // 10MB
MAX_FILENAME_LENGTH = 255
DEFAULT_QUALITY = 90
```

### Supported Formats
- JPEG/JPG (lossy, photos)
- PNG (lossless, transparency)
- WebP (modern, best compression)
- AVIF (next-gen, excellent compression)
- TIFF (high-quality, professional)
- GIF (256 colors, animation)

### Security Headers
```typescript
// next.config.ts
- Strict-Transport-Security
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection
```

---

## Common Tasks

### Add New Format
1. Update `SupportedFormat` type in `lib/types.ts`
2. Add format to `SUPPORTED_FORMATS` in `lib/constants.ts`
3. Add case in `convertImage()` in `lib/converter.ts`
4. Update MIME types in `lib/validation.ts`

### Change Upload Limit
```typescript
// lib/constants.ts
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// next.config.ts
experimental: {
  serverActions: {
    bodySizeLimit: '20mb',
  },
},
```

### Add Validation Rule
```typescript
// lib/validation.ts
export function validateFile(file: File): ValidationResult {
  // Add your validation here
  if (yourCondition) {
    return { isValid: false, error: 'Your error message' };
  }
  return { isValid: true };
}
```

---

## Testing Checklist

### Local Testing
- [ ] Upload PNG file
- [ ] Convert to different formats
- [ ] Test file size limit (>10MB should fail)
- [ ] Test invalid file type
- [ ] Test drag & drop
- [ ] Test quality slider
- [ ] Check mobile responsiveness
- [ ] Test dark mode

### Pre-Deployment
- [ ] All files committed to Git
- [ ] README updated with correct URLs
- [ ] Environment variables documented
- [ ] Dependencies up to date
- [ ] No console errors in browser
- [ ] No TypeScript errors

---

## Deployment Checklist

### Vercel Deployment
1. [ ] Code pushed to GitHub
2. [ ] Import project in Vercel
3. [ ] Environment variables set (if any)
4. [ ] Deploy
5. [ ] Test live URL
6. [ ] Check Vercel logs for errors
7. [ ] Monitor analytics

### Post-Deployment
- [ ] Test file upload
- [ ] Test all format conversions
- [ ] Check download functionality
- [ ] Verify security headers
- [ ] Test error handling
- [ ] Monitor performance
- [ ] Set up error tracking

---

## Troubleshooting Quick Guide

### Dev server won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### TypeScript errors
```bash
npm run lint
# Check tsconfig.json paths
```

### Sharp errors
```bash
npm uninstall sharp
npm install sharp
npm rebuild sharp
```

### Build fails on Windows
→ Deploy to Vercel (Linux build works)
→ Or use WSL for local builds
→ See KNOWN_ISSUES.md

---

## Performance Tips

### Optimize Images
- Use WebP for web (best balance)
- Use AVIF for modern browsers (best compression)
- Keep quality at 90% for most uses
- Progressive encoding enabled by default

### Reduce Bundle Size
- Only import what you need
- Use dynamic imports for heavy components
- Optimize images in /public folder

### Improve Load Time
- Enable compression (already configured)
- Use CDN for static assets
- Monitor with Vercel Analytics

---

## Security Checklist

- [x] File size validation
- [x] MIME type validation
- [x] Filename sanitization
- [x] Server-side validation
- [x] No file storage
- [x] Security headers
- [ ] Rate limiting (add if needed)
- [ ] Authentication (add if needed)

---

## Useful Links

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Sharp Docs](https://sharp.pixelplumbing.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Can I Use](https://caniuse.com/) - Browser support
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Vercel Discussions](https://github.com/vercel/next.js/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

---

## Code Snippets

### Get File Info
```typescript
import { getFileInfo } from '@/app/actions/convert';

const formData = new FormData();
formData.append('file', file);
const info = await getFileInfo(formData);
```

### Custom Quality Settings
```typescript
// In your component
const [quality, setQuality] = useState(80); // Custom default

// When converting
formData.append('quality', quality.toString());
```

### Add Loading State
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleConvert = async () => {
  setIsLoading(true);
  try {
    await convertFile(formData);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Environment Variables

### Development (.env.local)
```env
# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Production (Vercel Dashboard)
```env
NODE_ENV=production
```

---

## Git Commands

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/file-converter.git
git push -u origin main
```

### Regular Updates
```bash
git add .
git commit -m "Your message"
git push
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature
git push -u origin feature/your-feature
```

---

## Quick Fixes

### Clear Cache
```bash
rm -rf .next
npm run dev
```

### Reset Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Fix Port in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

## Monitoring

### Check Logs
- Vercel: Dashboard → Deployments → Logs
- Local: Terminal output

### Performance Metrics
- Vercel Analytics (built-in)
- Chrome DevTools Lighthouse
- Web Vitals

### Error Tracking
- Vercel Logs
- Sentry (if configured)
- Browser Console

---

**Keep this guide handy for quick reference!** 📌
