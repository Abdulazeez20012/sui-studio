# 🚀 Vercel Frontend Deployment Guide

Complete guide to deploy your Sui Studio frontend to Vercel.

## Prerequisites

- [ ] Vercel account (https://vercel.com)
- [ ] GitHub repository with your code
- [ ] Backend deployed to Render
- [ ] Google OAuth configured

## Step 1: Prepare Frontend for Deployment

### 1.1 Create vercel.json

Create `vercel.json` in your **root directory**:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 1.2 Update package.json

Ensure your `package.json` has:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 1.3 Create .env.production

Create `.env.production` (this will be replaced by Vercel env vars):

```bash
# API Configuration
VITE_API_URL=https://sui-studio-backend.onrender.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Sui Network
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

### 1.4 Update .gitignore

Ensure these are in `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
.env.production.local

# Build output
dist/
node_modules/

# Vercel
.vercel
```

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select your repository

### 2.2 Configure Project

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
./
```

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

#### Production Variables

```bash
# API URL (Your Render backend)
VITE_API_URL=https://sui-studio-backend.onrender.com

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com

# Sui Network Configuration
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

**Important:** Select **"Production"** environment for these variables!

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://your-app.vercel.app`

## Step 3: Configure Google OAuth

### 3.1 Add Vercel Domain to Google Console

1. Go to https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to **"Authorized JavaScript origins"**:
   ```
   https://your-app.vercel.app
   ```
4. Add to **"Authorized redirect URIs"**:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/
   ```
5. Click **"Save"**

### 3.2 Update Backend FRONTEND_URL

1. Go to Render dashboard
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Save and redeploy backend

## Step 4: Test Deployment

### 4.1 Open Your App

Visit: `https://your-app.vercel.app`

### 4.2 Test Features

- [ ] Landing page loads
- [ ] Can sign in with Google
- [ ] IDE loads after login
- [ ] NEXI AI works
- [ ] Code editor works
- [ ] Terminal works
- [ ] Compilation works

### 4.3 Check Console

Press F12 and check:
- No CORS errors
- API calls go to Render backend
- No 404 errors

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your domain: `sui-studio.com`
4. Follow DNS configuration instructions

### 5.2 Update Google OAuth

Add your custom domain to Google Console:
```
https://sui-studio.com
```

### 5.3 Update Backend

Update `FRONTEND_URL` in Render:
```
FRONTEND_URL=https://sui-studio.com
```

## Vercel Configuration Checklist

### Environment Variables
- [ ] `VITE_API_URL` - Your Render backend URL
- [ ] `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `VITE_SUI_NETWORK` - testnet
- [ ] `VITE_SUI_RPC_URL` - Sui RPC endpoint

### Build Settings
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Google OAuth
- [ ] Vercel URL added to authorized origins
- [ ] Vercel URL added to redirect URIs
- [ ] Custom domain added (if using)

### Backend Connection
- [ ] `FRONTEND_URL` updated in Render
- [ ] CORS configured for Vercel domain
- [ ] Backend redeployed

## Troubleshooting

### ❌ Build Failed

**Check:**
1. `package.json` has correct scripts
2. TypeScript compiles locally: `npm run build`
3. All dependencies in `package.json`

**Fix:**
```bash
# Test build locally
npm install
npm run build
```

### ❌ Environment Variables Not Working

**Check:**
1. Variables start with `VITE_`
2. Variables set for "Production" environment
3. Redeployed after adding variables

**Fix:**
1. Go to Vercel project settings
2. Environment Variables
3. Ensure "Production" is selected
4. Redeploy

### ❌ CORS Errors

**Check:**
1. Backend `FRONTEND_URL` matches Vercel URL
2. Backend CORS includes Vercel domain

**Fix in backend:**
```typescript
// backend/src/index.ts
const allowedOrigins = [
  'https://your-app.vercel.app',
  process.env.FRONTEND_URL,
];
```

### ❌ Google OAuth Not Working

**Check:**
1. Vercel URL in Google Console authorized origins
2. Vercel URL in Google Console redirect URIs
3. `VITE_GOOGLE_CLIENT_ID` is correct

**Fix:**
1. Update Google Console
2. Wait 5 minutes for changes to propagate
3. Clear browser cache
4. Try again

### ❌ API Calls Failing

**Check:**
1. `VITE_API_URL` points to Render backend
2. Backend is running (check Render logs)
3. Backend health endpoint works

**Fix:**
```bash
# Test backend
curl https://sui-studio-backend.onrender.com/health

# Should return:
{"status":"ok"}
```

### ❌ 404 on Refresh

**Issue:** SPA routing not configured

**Fix:** Already handled by `vercel.json`:
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

## Preview Deployments

### Automatic Previews

Vercel creates preview deployments for:
- Every pull request
- Every push to non-main branches

### Preview URLs

Format: `https://your-app-git-branch-username.vercel.app`

### Environment Variables

Preview deployments use:
- Production variables by default
- Can set preview-specific variables

## Performance Optimization

### 1. Enable Edge Functions

In `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
    }
  }
}
```

### 2. Enable Compression

Already enabled by default in Vercel.

### 3. Optimize Images

Use Vercel Image Optimization:
```typescript
import Image from 'next/image'; // If using Next.js
```

### 4. Enable Caching

In `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring

### Analytics

1. Go to Vercel project
2. Click **"Analytics"** tab
3. View:
   - Page views
   - Unique visitors
   - Performance metrics

### Logs

1. Go to Vercel project
2. Click **"Deployments"**
3. Select deployment
4. View build and runtime logs

### Alerts

1. Go to project settings
2. Click **"Notifications"**
3. Add email for:
   - Deploy failures
   - Performance issues

## Deployment Workflow

### Development
```bash
# Local development
npm run dev

# Test build
npm run build
npm run preview
```

### Staging
```bash
# Push to staging branch
git push origin staging

# Vercel auto-deploys to preview URL
```

### Production
```bash
# Push to main branch
git push origin main

# Vercel auto-deploys to production
```

## Environment-Specific Configuration

### Development (.env.local)
```bash
VITE_API_URL=http://localhost:3001
```

### Production (Vercel)
```bash
VITE_API_URL=https://sui-studio-backend.onrender.com
```

### Preview (Vercel)
```bash
VITE_API_URL=https://sui-studio-backend-preview.onrender.com
```

## Cost

### Free Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Good for: Personal projects

### Pro ($20/month)
- 1 TB bandwidth/month
- Advanced analytics
- Password protection
- Good for: Production apps

## Security

### HTTPS
- Automatic SSL certificates
- Force HTTPS (enabled by default)

### Headers
Already configured in `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### Environment Variables
- Encrypted at rest
- Not exposed to client
- Only `VITE_` prefix exposed

## Next Steps

1. ✅ Frontend deployed to Vercel
2. ✅ Environment variables configured
3. ✅ Google OAuth configured
4. ✅ Backend connected
5. 🎯 **Test your app!**

## Complete Setup Summary

### Backend (Render)
```
URL: https://sui-studio-backend.onrender.com
Status: Running
Database: Connected
OpenAI: Configured
```

### Frontend (Vercel)
```
URL: https://your-app.vercel.app
Status: Deployed
API: Connected to Render
OAuth: Configured
```

### Test Checklist
- [ ] Visit frontend URL
- [ ] Sign in with Google
- [ ] Open IDE
- [ ] Test NEXI AI
- [ ] Test code editor
- [ ] Test compilation
- [ ] Test deployment

---

**Frontend URL:** https://your-app.vercel.app
**Status:** Ready to use! 🚀
