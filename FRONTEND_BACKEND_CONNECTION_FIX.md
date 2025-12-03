# 🔧 Frontend-Backend Connection Fix

Your backend is deployed on Render (Docker), but frontend on Vercel isn't connecting properly.

## Current Setup

```
Frontend (Vercel)
https://your-app.vercel.app
         ↓
    ❌ Not connecting properly
         ↓
Backend (Render + Docker)
https://sui-studio-backend.onrender.com
```

## Common Issues & Fixes

### Issue 1: Wrong API URL in Vercel

**Check Vercel Environment Variables:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Check `VITE_API_URL`

**Should be:**
```bash
VITE_API_URL=https://sui-studio-backend.onrender.com
```

**NOT:**
```bash
VITE_API_URL=http://localhost:3001  ❌
VITE_API_URL=https://sui-studio.onrender.com  ❌ (wrong URL)
```

**Fix:**
1. Update `VITE_API_URL` in Vercel
2. Redeploy frontend

### Issue 2: CORS Not Configured

**Check Backend CORS Settings:**

Your backend (`backend/src/index.ts`) should allow Vercel domain:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://sui-studio.vercel.app',
  'https://your-app.vercel.app',  // Your actual Vercel URL
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
```

**Fix:**
1. Ensure `FRONTEND_URL` is set in Render environment variables
2. Redeploy backend Docker container

### Issue 3: Backend Environment Variables Missing

**Check Render Environment Variables:**

1. Go to https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Verify these are set:

```bash
# Required
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
JWT_SECRET=your-secret
FRONTEND_URL=https://your-app.vercel.app

# Optional but recommended
NODE_ENV=production
PORT=3001
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
```

**Fix:**
1. Add missing variables
2. Click **Manual Deploy** → **Deploy latest commit**

### Issue 4: Backend Not Running

**Check Backend Health:**

```bash
curl https://sui-studio-backend.onrender.com/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

**If 404 or timeout:**
- Backend is not running
- Check Render logs
- Redeploy if needed

**Fix:**
1. Go to Render dashboard
2. Check **Logs** tab for errors
3. Click **Manual Deploy** if needed

### Issue 5: Authentication Issues

**Symptoms:**
- 401 Unauthorized errors
- "Access token required"

**Causes:**
1. Not logged in
2. JWT_SECRET mismatch
3. Token expired

**Fix:**

**A. Ensure User is Logged In:**
1. Visit your Vercel app
2. Click "Sign In"
3. Sign in with Google
4. Try NEXI AI again

**B. Check JWT_SECRET:**
- Same secret in both environments?
- Not changed recently?

**C. Clear Browser Storage:**
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
// Then sign in again
```

### Issue 6: Google OAuth Not Configured

**Check Google Console:**

1. Go to https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Verify **Authorized JavaScript origins** includes:
   ```
   https://your-app.vercel.app
   ```
4. Verify **Authorized redirect URIs** includes:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/
   ```

**Fix:**
1. Add your Vercel URL
2. Save
3. Wait 5 minutes for changes to propagate
4. Try again

## Step-by-Step Debugging

### Step 1: Verify Backend is Running

```bash
# Test health endpoint
curl https://sui-studio-backend.onrender.com/health

# Should return:
{"status":"ok","timestamp":"..."}
```

**If fails:**
- Check Render logs
- Ensure Docker container is running
- Check environment variables

### Step 2: Verify Frontend Environment

**In Vercel Dashboard:**
1. Settings → Environment Variables
2. Check `VITE_API_URL` points to Render backend
3. Ensure it's set for "Production" environment

**After changes:**
- Redeploy frontend
- Clear browser cache

### Step 3: Test API Connection

**In browser console (F12):**

```javascript
// Test health endpoint
fetch('https://sui-studio-backend.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Should log: {status: "ok", timestamp: "..."}
```

**If CORS error:**
- Backend CORS not configured
- Update backend CORS settings
- Redeploy backend

### Step 4: Test Authentication

**After signing in:**

```javascript
// Check if token exists
console.log(localStorage.getItem('auth_token'))

// Should show JWT token
// If null, sign in didn't work
```

**If no token:**
- Google OAuth not configured
- Check Google Console settings
- Check browser console for errors

### Step 5: Test NEXI AI

1. Sign in to your app
2. Open NEXI AI panel
3. Send message: "Hello"
4. Check browser console (F12) for errors

**Common errors:**

**404 Error:**
```
Failed to load resource: 404
URL: https://sui-studio-backend.onrender.com/api/ai/chat
```
**Fix:** Backend route not found, check backend is deployed

**401 Error:**
```
Error: Access token required
```
**Fix:** Not logged in, or token expired

**CORS Error:**
```
Access to fetch blocked by CORS policy
```
**Fix:** Backend CORS not configured for Vercel domain

## Configuration Checklist

### Vercel (Frontend)

- [ ] `VITE_API_URL` = `https://sui-studio-backend.onrender.com`
- [ ] `VITE_GOOGLE_CLIENT_ID` = Your Google Client ID
- [ ] Environment set to "Production"
- [ ] Redeployed after changes

### Render (Backend)

- [ ] `FRONTEND_URL` = `https://your-app.vercel.app`
- [ ] `DATABASE_URL` = Your database connection string
- [ ] `OPENAI_API_KEY` = Your OpenAI key
- [ ] `JWT_SECRET` = Your secret key
- [ ] `GOOGLE_CLIENT_ID` = Your Google Client ID
- [ ] Docker container running
- [ ] Health endpoint responding

### Google OAuth

- [ ] Vercel URL in authorized origins
- [ ] Vercel URL in redirect URIs
- [ ] Changes saved
- [ ] Waited 5 minutes for propagation

### Backend CORS

- [ ] Vercel domain in allowed origins
- [ ] `*.vercel.app` pattern allowed
- [ ] `credentials: true` enabled
- [ ] Redeployed after changes

## Quick Fix Commands

### Redeploy Frontend (Vercel)

```bash
# Option 1: Push to main branch
git push origin main

# Option 2: In Vercel dashboard
# Deployments → Latest → Redeploy
```

### Redeploy Backend (Render)

```bash
# Option 1: Push to main branch
git push origin main

# Option 2: In Render dashboard
# Manual Deploy → Deploy latest commit
```

### Clear Browser Cache

```bash
# Hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Or clear storage
F12 → Application → Clear storage → Clear site data
```

## Testing Checklist

After making fixes:

1. **Backend Health:**
   ```bash
   curl https://sui-studio-backend.onrender.com/health
   ```
   ✅ Should return `{"status":"ok"}`

2. **Frontend Loads:**
   - Visit `https://your-app.vercel.app`
   - ✅ Landing page should load

3. **Sign In:**
   - Click "Sign In"
   - Sign in with Google
   - ✅ Should redirect to IDE

4. **Check Token:**
   ```javascript
   console.log(localStorage.getItem('auth_token'))
   ```
   ✅ Should show JWT token

5. **Test NEXI AI:**
   - Open NEXI AI panel
   - Send message: "Hello"
   - ✅ Should get AI response

6. **Check Console:**
   - Press F12
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ No 401 errors

## Common Mistakes

### ❌ Wrong: Using localhost in production
```bash
VITE_API_URL=http://localhost:3001
```

### ✅ Correct: Using Render URL
```bash
VITE_API_URL=https://sui-studio-backend.onrender.com
```

---

### ❌ Wrong: Not redeploying after env changes
```
Changed environment variables → Didn't redeploy
```

### ✅ Correct: Always redeploy
```
Changed environment variables → Redeploy immediately
```

---

### ❌ Wrong: Forgetting to add Vercel URL to Google OAuth
```
Google Console → Only has localhost
```

### ✅ Correct: Add all domains
```
Google Console → localhost + Vercel URL
```

## Still Not Working?

### Check Render Logs

1. Go to Render dashboard
2. Select your service
3. Click **Logs** tab
4. Look for errors:
   - Database connection errors
   - OpenAI API errors
   - CORS errors
   - Port binding errors

### Check Vercel Logs

1. Go to Vercel dashboard
2. Select your project
3. Click **Deployments**
4. Select latest deployment
5. Check **Build Logs** and **Function Logs**

### Check Browser Console

1. Press F12
2. Go to **Console** tab
3. Look for errors:
   - Network errors
   - CORS errors
   - Authentication errors

## Get Help

If still stuck, provide:

1. **Vercel URL:** `https://your-app.vercel.app`
2. **Render URL:** `https://sui-studio-backend.onrender.com`
3. **Error message:** From browser console
4. **Backend logs:** From Render dashboard
5. **Environment variables:** (without secrets)

---

**Most Common Fix:** Update `VITE_API_URL` in Vercel to point to your Render backend URL, then redeploy! 🚀
