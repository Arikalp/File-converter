# 🔧 Known Issues & Solutions

## Windows Build Issue with Sharp

### Issue
When building on Windows with Next.js 16.x and Turbopack, you may encounter:
```
Error [TurbopackInternalError]: create symlink to ../../Desktop/file-converter/node_modules/sharp
Caused by: A required privilege is not held by the client. (os error 1314)
```

### Root Cause
This is a known issue with Turbopack's symlink handling on Windows when Sharp is installed.

### Solutions

#### Solution 1: Deploy to Vercel (Recommended)
The build issue is **Windows-specific** and does **not occur** on Vercel's Linux-based build servers.

**Deploy directly to Vercel:**
1. Push your code to GitHub
2. Import to Vercel
3. Build will succeed automatically

✅ **This is the recommended approach for production deployment.**

#### Solution 2: Use WSL (Windows Subsystem for Linux)
Build inside WSL to avoid Windows symlink issues:

```bash
# In WSL terminal
cd /mnt/c/Users/sanka/Desktop/file-converter
npm run build
```

#### Solution 3: Run in Development Mode
For local development, use the dev server (no build needed):

```bash
npm run dev
```

The app works perfectly in development mode and will build successfully on Vercel.

#### Solution 4: Downgrade to Next.js 14
If you must build locally on Windows:

```bash
npm install next@14 --save
```

Then rebuild. Next.js 14 uses webpack by default which doesn't have this issue.

### Status
- ✅ **Development**: Works perfectly
- ✅ **Vercel Deployment**: Works perfectly
- ❌ **Windows Local Build**: Known issue (workarounds above)
- ✅ **Linux/Mac Local Build**: Works fine

### Tracking
This is a known Next.js/Turbopack issue. Track progress:
- [Vercel Discussion](https://github.com/vercel/next.js/discussions)
- Expected fix in future Next.js release

---

## Other Common Issues

### TypeScript Errors
**Error:** Cannot find module '@/lib/...'

**Solution:**
Ensure tsconfig.json has the path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Sharp Not Found
**Error:** Cannot find module 'sharp'

**Solution:**
```bash
npm install --save sharp
npm rebuild sharp
```

### File Upload Not Working
**Issue:** Files not uploading

**Check:**
1. File size < 10MB
2. File is an image type
3. Browser supports FormData API
4. Server Actions are enabled

### Dark Mode Issues
**Issue:** Dark mode styles not applying

**Solution:**
Ensure your system/browser is set to dark mode, or modify layout.tsx to force dark mode:
```typescript
<html lang="en" className="dark">
```

---

## Getting Help

1. **Check Documentation:**
   - [README.md](README.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)
   - [DEPLOYMENT.md](DEPLOYMENT.md)

2. **Development Server:**
   ```bash
   npm run dev
   ```
   Then open http://localhost:5000

3. **Test Build on Vercel:**
   Deploy to Vercel for a production build test

4. **Community Support:**
   - Next.js Discord
   - Stack Overflow
   - GitHub Issues

---

**Note:** Despite the Windows build issue, the application is fully functional in development mode and production deployment. This is purely a local Windows build environment limitation.
