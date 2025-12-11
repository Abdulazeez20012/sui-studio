# 🔧 Frontend Errors - Quick Fix

## Issues Detected

From your browser console:

1. ❌ **Tailwind CDN Warning** - Using CDN in production (not critical but should fix)
2. ❌ **WebSocket Failed** - Trying to connect to `wss://sui-studio.onrender.com/yjs`
3. ❌ **401 Unauthorized** - API calls failing with authentication error
4. ❌ **404 Not Found** - `/ide` route not found

## Root Causes

### 1. Wrong Backend URL
Your `.env.production` and `.env.local` point to:
```
VITE_API_URL=https://sui-studio.onrender.com
```

But you deployed to **Railway**, not Render!

### 2. Authentication Issue
The backend is returning 401, which means:
- JWT authentication is failing
- Or the auth middleware is blocking requests

### 3. Tailwind CDN
You're using Tailwind CDN in production (from `index.html`)

---

## ✅ Quick Fixes

### Fix 1: Update Backend URL

You need to get your Railway URL and update your environment variables.

**Step 1: Get Railway URL**
1. Go to https://railway.app/dashboard
2. Click your `sui-studio-backend` service
3. Go to **Settings** tab
4. Look for **Domains** section
5. Copy the URL (like: `https://sui-studio-backend-production-xxxx.up.railway.app`)

**Step 2: Update Local Environment**

Update `.env.local`:
```env
VITE_API_URL=https://your-railway-url.up.railway.app
VITE_WS_URL=wss://your-railway-url.up.railway.app
```

**Step 3: Update Production Environment on Vercel**

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Update/Add:
```env
VITE_API_URL=https://your-railway-url.up.railway.app
VITE_WS_URL=wss://your-railway-url.up.railway.app
```
5. Redeploy

### Fix 2: Fix Authentication

The 401 error suggests the backend auth middleware is blocking requests.

**Check if you need authentication:**

Look at your backend routes - if they require JWT tokens, you need to either:

**Option A: Disable auth for testing**
Temporarily comment out auth middleware in backend

**Option B: Implement proper auth flow**
Make sure frontend sends JWT tokens with requests

**Quick Test:**
```bash
# Test backend health (should work without auth)
curl https://your-railway-url.up.railway.app/health

# Test project-init (check if it needs auth)
curl https://your-railway-url.up.railway.app/api/project-init/create
```

### Fix 3: Remove Tailwind CDN

**Update `index.html`:**

Remove this line:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

Tailwind is already built into your project via PostCSS.

---

## 🧪 Test After Fixes

### 1. Test Backend
```bash
curl https://your-railway-url.up.railway.app/health
```
Should return: `{"status":"ok"}`

### 2. Test WebSocket
Open browser console and check for WebSocket connection

### 3. Test API Calls
Check browser Network tab - API calls should go to Railway URL

---

## 📝 Complete Fix Commands

```bash
# 1. Update local env file
# Edit .env.local with Railway URL

# 2. Test locally
npm run dev

# 3. If works locally, update Vercel
# Go to Vercel dashboard → Settings → Environment Variables
# Update VITE_API_URL and VITE_WS_URL

# 4. Redeploy on Vercel
# Deployments tab → Redeploy
```

---

## 🔍 Debugging Steps

### Check Railway Backend Logs
1. Go to Railway dashboard
2. Click your service
3. View **Logs** tab
4. Look for:
   - Server started message
   - Environment variables loaded
   - Any errors

### Check Railway Environment Variables
Make sure these are set:
```env
NODE_ENV=production
PORT=8080
DATABASE_URL=your-neon-url
JWT_SECRET=your-secret
ANTHROPIC_API_KEY=your-key
FRONTEND_URL=https://suistudio.live
SUI_NETWORK=testnet
```

### Check CORS Settings
Your backend needs to allow requests from `suistudio.live`

In `backend/src/index.ts`, verify CORS config:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://suistudio.live',
    'https://your-vercel-url.vercel.app'
  ],
  credentials: true
}));
```

---

## 🎯 Expected Results After Fix

✅ No Tailwind CDN warning
✅ WebSocket connects successfully
✅ API calls return 200 (not 401)
✅ No 404 errors
✅ App loads and works properly

---

## 🆘 Still Having Issues?

### If 401 Persists:
Check `backend/src/middleware/auth.ts` - might need to make some routes public

### If WebSocket Fails:
- Verify Railway supports WebSockets (it does)
- Check if Railway URL is correct
- Look at Railway logs for WebSocket errors

### If 404 on /ide:
This might be a routing issue - check your Vercel configuration

---

## 📚 Files to Update

1. `.env.local` - Update with Railway URL
2. `index.html` - Remove Tailwind CDN
3. Vercel Environment Variables - Update with Railway URL
4. `backend/src/index.ts` - Verify CORS settings (if needed)

---

**Priority: Get your Railway URL first, then update all environment variables!**
