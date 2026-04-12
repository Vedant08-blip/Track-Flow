# Vercel Deployment Guide - TrackFlow

## ✅ Issue Fixed: 404 Error on Page Refresh

The 404 error occurs because TrackFlow is a Single Page Application (SPA) and needs proper routing configuration on Vercel.

### What Was Added

#### 1. `vercel.json` Configuration
**Location:** `/vercel.json`

This file configures Vercel to:
- Catch all routes and redirect to `/index.html` (SPA behavior)
- Serve `/dist` directory (Vite build output)
- Cache static assets with long-term cache headers
- Ensure dynamic content uses must-revalidate

**Key Features:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2. `public/_redirects` File
**Location:** `/public/_redirects`

Backup redirect configuration for compatibility with other hosting providers.

```
/* /index.html 200
```

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix: Add Vercel SPA routing configuration"
git push origin main
```

### Step 2: Redeploy on Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your TrackFlow project
3. Click "Deployments" tab
4. Select the latest deployment
5. Click "Redeploy" button
6. Wait for build to complete (usually 1-2 minutes)

**Or trigger redeploy via CLI:**
```bash
npm install -g vercel
vercel --prod
```

### Step 3: Test the Fix
1. Open your Vercel deployment URL
2. Navigate to different pages (Dashboard, Board, Backlog, etc.)
3. **Refresh the page** (Cmd+R or Ctrl+R)
4. ✅ Should now work without 404 error

---

## 📋 How It Works

### Before (Broken)
```
URL: https://trackflow.vercel.app/dashboard
Action: User refreshes page
Result: Vercel tries to find `/dashboard` as a file
Error: 404 - File not found
```

### After (Fixed)
```
URL: https://trackflow.vercel.app/dashboard
Action: User refreshes page
Result: vercel.json rewrites to /index.html
Result: React Router handles the routing
Success: Dashboard page loads correctly ✅
```

---

## 🔧 What Each File Does

### `vercel.json`
- **Rewrites:** All requests → `/index.html` (React Router handles routes)
- **Headers:** Cache static assets for 1 year, dynamic content must revalidate
- **Framework:** Tells Vercel it's a Vite+React project

### `package.json` Scripts
- **build:** `vite build` - Creates optimized production build in `/dist`
- **dev:** Starts dev server with hot reload
- **preview:** Preview production build locally

### `vite.config.js`
- **outDir:** `dist` - Where build files go
- **server:** Dev server configuration
- **preview:** Production preview configuration

---

## ✅ Verification Checklist

After redeployment, verify:

- [ ] Homepage loads without 404
- [ ] Click on "Dashboard" - page loads
- [ ] Refresh page - still shows Dashboard (no 404)
- [ ] Click on "Board" - page loads
- [ ] Refresh page - still shows Board (no 404)
- [ ] All other pages work (Backlog, Planning, Reports, etc.)
- [ ] Dark/Light mode toggle works
- [ ] Login page loads
- [ ] Avatar selector works
- [ ] Chat Assistant opens without errors

---

## 🐛 Troubleshooting

### Still Getting 404?

1. **Clear browser cache:**
   ```bash
   # Hard refresh in browser
   Mac: Cmd + Shift + R
   Windows: Ctrl + Shift + R
   ```

2. **Check Vercel build:**
   - Go to Vercel Dashboard
   - Click "Deployments"
   - Check build logs for errors
   - Look for "vercel.json" configuration applied

3. **Verify files exist:**
   - Push `vercel.json` to GitHub
   - Ensure `public/_redirects` is in repo
   - Run `git status` to see all changes

4. **Rebuild on Vercel:**
   - Go to Vercel Dashboard
   - Click your project
   - Click "Deployments"
   - Click "Redeploy" on latest deployment

### Build Fails?

1. Check Node version: `node --version` (should be 18+)
2. Install dependencies: `npm install`
3. Test build locally: `npm run build`
4. Fix any errors before pushing to GitHub

---

## 📊 Build Information

**Current Setup:**
- Build Tool: Vite
- Framework: React 18+
- Styling: Tailwind CSS
- Hosting: Vercel
- Build Output: `/dist`

**Build Metrics:**
- Build Time: ~726ms
- CSS Size: 163 KB (gzip: 19.5 KB)
- JS Size: 151 KB (gzip: 48.8 KB)
- Total: 1.8 MB (gzip: ~515 KB)

---

## 🔒 Environment Variables

If you use environment variables, create `.env.production`:

```bash
VITE_API_URL=https://your-backend-api.com
VITE_GITHUB_CLIENT_ID=your_github_id
VITE_GOOGLE_CLIENT_ID=your_google_id
```

Add these in Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add each variable
3. Redeploy

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Vite Production Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Router in SPA](https://reactrouter.com/)
- [Vercel SPA Configuration](https://vercel.com/docs/projects/project-configuration)

---

## ✨ Summary

✅ **Fix Applied:** `vercel.json` + `public/_redirects`  
✅ **What It Does:** Redirects all routes to `/index.html` for SPA routing  
✅ **Result:** Page refresh works on all routes without 404  
✅ **Next Step:** Redeploy on Vercel dashboard  

**Expected Outcome:** All pages work with refresh without 404 errors! 🚀

---

*Updated: April 12, 2026*
