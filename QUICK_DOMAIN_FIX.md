# 🚀 Quick Fix: Connect suistudio.live to Backend

## The Problem
Your frontend at `suistudio.live` can't reach your backend at `sui-studio.onrender.com` because:
1. Missing environment variables in Vercel
2. CORS not configured for your domain in backend
3. WebSocket URL not configured

## The Solution (5 Minutes)

### Step 1: Add Environment Variables to Vercel

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Copy-paste these ONE BY ONE:

```
VITE_API_URL=https://sui-studio.onrender.com
VITE_WS_URL=wss://sui-studio.onrender.com
VITE_GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_SUBSCRIPTION_PACKAGE_ID=0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4
VITE_SUBSCRIPTION_TREASURY_ID=0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24
VITE_SUBSCRIPTION_PRICING_ID=0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274
VITE_SUBSCRIPTION_CLOCK_ID=0x6
VITE_ENABLE_COLLABORATION=true
VITE_ENABLE_AI=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_VIDEO_CHAT=true
VITE_ENABLE_WALRUS=true
VITE_ENABLE_SUBSCRIPTIONS=true
VITE_ENABLE_EXTENSIONS=true
VITE_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
VITE_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
VITE_WALRUS_NETWORK=testnet
VITE_APP_VERSION=1.0.0
```

**Important:** For each variable, select **Production**, **Preview**, AND **Development**

### Step 2: Add Environment Variables to Render

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Go to **Environment** tab
4. Add these variables (or update if they exist):

```
CORS_ORIGIN=https://suistudio.live,https://www.suistudio.live
FRONTEND_URL=https://suistudio.live
JWT_SECRET=sui-studio-jwt-secret-2024-change-this-to-random-string
```

### Step 3: Redeploy Both Services

**Vercel:**
1. Go to **Deployments** tab
2. Click "..." on latest deployment
3. Click **Redeploy**
4. UNCHECK "Use existing Build Cache"
5. Click **Redeploy**

**Render:**
- Will auto-redeploy after you save environment variables
- Or click **Manual Deploy** → **Deploy latest commit**

### Step 4: Wait & Test

**Wait:** 3-5 minutes for both deployments to complete

**Test:**
1. Open: https://suistudio.live
2. Open browser console (F12)
3. You should see no CORS errors
4. Try using the IDE features

---

## ✅ How to Verify It's Working

### Test 1: Backend Health Check
Open this URL in browser:
```
https://sui-studio.onrender.com/health
```

Should see:
```json
{"status":"ok","timestamp":"2024-12-09T..."}
```

### Test 2: Frontend Console
1. Open https://suistudio.live
2. Press F12 (open DevTools)
3. Go to Console tab
4. Should see NO red errors about CORS or "Failed to fetch"

### Test 3: Network Tab
1. Open https://suistudio.live
2. Press F12
3. Go to Network tab
4. Refresh page
5. Look for calls to `sui-studio.onrender.com`
6. They should show status 200 (green)

---

## 🔴 If Still Not Working

### Check 1: Verify Environment Variables

**Vercel:**
```bash
# Go to Vercel dashboard → Settings → Environment Variables
# Make sure ALL variables are there
# Make sure they're enabled for Production
```

**Render:**
```bash
# Go to Render dashboard → Environment
# Make sure CORS_ORIGIN includes your domain
# Make sure FRONTEND_URL is set
```

### Check 2: Check Logs

**Render Logs:**
1. Go to Render dashboard
2. Click your service
3. Click **Logs** tab
4. Look for errors mentioning CORS or your domain

**Vercel Logs:**
1. Go to Vercel dashboard
2. Click **Deployments**
3. Click latest deployment
4. Click **View Function Logs**

### Check 3: Clear Cache

1. Open https://suistudio.live
2. Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
3. Select "Cached images and files"
4. Click "Clear data"
5. Refresh page

### Check 4: Try Incognito Mode

1. Open incognito/private window
2. Go to https://suistudio.live
3. If it works here, it's a caching issue

---

## 📝 What I Fixed in Your Code

1. **Updated backend CORS** to accept requests from suistudio.live
2. **Created .env.production** files with correct URLs
3. **Added domain support** in backend/src/index.ts
4. **Added WebSocket support** for wss:// protocol

---

## 🎯 Next Steps After It's Working

1. **Test all features:**
   - Create a new project
   - Compile Move code
   - Use AI assistant
   - Try collaboration features

2. **Monitor performance:**
   - Check Render dashboard for backend metrics
   - Check Vercel analytics for frontend metrics

3. **Set up monitoring:**
   - Add error tracking (Sentry)
   - Add analytics (Google Analytics)
   - Set up uptime monitoring

---

## 💡 Pro Tips

1. **Always redeploy without cache** when changing environment variables
2. **Wait 2-3 minutes** after deployment before testing
3. **Use incognito mode** to test without cache
4. **Check browser console** first when debugging
5. **Verify backend is running** before blaming frontend

---

**Need Help?** Check the full guide: `VERCEL_RENDER_SETUP_CHECKLIST.md`
