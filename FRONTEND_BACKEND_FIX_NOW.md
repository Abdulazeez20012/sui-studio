# 🔧 Frontend-Backend Connection Fix

## Current Issues

Your frontend is showing these errors:
1. ❌ Tailwind CDN warning (FIXED ✅)
2. ❌ WebSocket connection failed to `wss://sui-studio.onrender.com/yjs`
3. ❌ 401 Unauthorized on `/api/project-init/create`
4. ❌ 404 on `/ide` route

## Root Cause

**Your frontend is pointing to the WRONG backend!**

- Frontend expects: `https://sui-studio.onrender.com` (Render)
- But you deployed to: **Railway** (different URL)

---

## ✅ Step-by-Step Fix

### Step 1: Get Your Railway Backend URL

1. Open https://railway.app/dashboard
2. Click on your `sui-studio-backend` service
3. Go to **Settings** tab
4. Find **Domains** section
5. **Copy the URL** - it looks like:
   ```
   https://sui-studio-backend-production-xxxx.up.railway.app
   ```

### Step 2: Update Local Environment

Edit `.env.local` file:

```env
# Replace the old Render URL with your Railway URL
VITE_API_URL=https://your-railway-url.up.railway.app
VITE_WS_URL=wss://your-railway-url.up.railway.app

# Keep everything else the same
VITE_GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_SUBSCRIPTION_PACKAGE_ID=0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4
VITE_SUBSCRIPTION_TREASURY_ID=0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24
VITE_SUBSCRIPTION_PRICING_ID=0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274
VITE_SUBSCRIPTION_CLOCK_ID=0x6
```

### Step 3: Test Locally

```bash
# Stop your dev server if running (Ctrl+C)

# Start again
npm run dev

# Open http://localhost:5173
# Check browser console - errors should be gone!
```

### Step 4: Update Vercel (Production)

1. Go to https://vercel.com/dashboard
2. Click your `sui-studio` project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` and click **Edit**
5. Change value to: `https://your-railway-url.up.railway.app`
6. Find `VITE_WS_URL` and click **Edit** (or Add if not exists)
7. Change value to: `wss://your-railway-url.up.railway.app`
8. Click **Save**

### Step 5: Redeploy on Vercel

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## 🧪 Verify Everything Works

### Test 1: Backend Health

```bash
# Replace with your actual Railway URL
curl https://your-railway-url.up.railway.app/health
```

**Expected:** `{"status":"ok"}`

### Test 2: Frontend Locally

```bash
npm run dev
```

Open http://localhost:5173 and check:
- ✅ No Tailwind CDN warning
- ✅ No WebSocket errors
- ✅ No 401 errors
- ✅ App loads properly

### Test 3: Production Site

Open https://suistudio.live and check:
- ✅ Site loads
- ✅ No console errors
- ✅ Backend connection works

---

## 🔍 If Still Having Issues

### Issue: 401 Unauthorized

**Cause:** Backend auth middleware is blocking requests

**Fix:** Check if Railway environment variables are set:

```env
JWT_SECRET=your-secret-here
FRONTEND_URL=https://suistudio.live
```

### Issue: WebSocket Connection Failed

**Cause:** WebSocket URL might be wrong or Railway not configured

**Fix:** 
1. Verify `VITE_WS_URL` uses `wss://` (not `ws://`)
2. Check Railway logs for WebSocket errors
3. Ensure Railway supports WebSockets (it does)

### Issue: CORS Errors

**Cause:** Backend not allowing requests from your domain

**Fix:** Check `backend/src/index.ts` CORS configuration:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://suistudio.live',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

---

## 📝 Files Changed

✅ `index.html` - Removed Tailwind CDN
⏳ `.env.local` - Update with Railway URL (you need to do this)
⏳ Vercel Environment Variables - Update with Railway URL (you need to do this)

---

## 🎯 Summary

**What you need to do:**

1. ✅ Get Railway backend URL from dashboard
2. ✅ Update `.env.local` with Railway URL
3. ✅ Test locally (`npm run dev`)
4. ✅ Update Vercel environment variables
5. ✅ Redeploy on Vercel
6. ✅ Test production site

**Total time: 5 minutes**

---

## 💡 Quick Commands

```bash
# 1. Get Railway URL (from dashboard)

# 2. Update .env.local
# Edit the file manually with your Railway URL

# 3. Test locally
npm run dev

# 4. If works, update Vercel
# Go to Vercel dashboard → Settings → Environment Variables

# 5. Redeploy
# Vercel dashboard → Deployments → Redeploy

# 6. Test production
# Open https://suistudio.live
```

---

**The main issue is just the wrong backend URL. Fix that and everything will work!** 🚀
