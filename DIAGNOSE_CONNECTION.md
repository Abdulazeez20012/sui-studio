# 🔍 Diagnose Frontend-Backend Connection

Run these tests to identify exactly what's wrong.

## Quick Diagnosis

### Test 1: Backend Health

```bash
curl https://sui-studio-backend.onrender.com/health
```

**Expected:**
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

**If fails:**
- ❌ Backend is not running
- ❌ Wrong URL
- ❌ Docker container crashed

**Fix:** Check Render logs, redeploy backend

---

### Test 2: Frontend Environment

**Open your Vercel app, press F12, run:**

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

**Expected:**
```
API URL: https://sui-studio-backend.onrender.com
```

**If shows localhost:**
- ❌ Wrong environment variable in Vercel
- ❌ Didn't redeploy after changing

**Fix:** Update `VITE_API_URL` in Vercel, redeploy

---

### Test 3: CORS

**In browser console (F12):**

```javascript
fetch('https://sui-studio-backend.onrender.com/health')
  .then(r => r.json())
  .then(data => console.log('✅ CORS works:', data))
  .catch(err => console.error('❌ CORS error:', err))
```

**Expected:**
```
✅ CORS works: {status: "ok", timestamp: "..."}
```

**If CORS error:**
- ❌ Backend doesn't allow Vercel domain
- ❌ `FRONTEND_URL` not set in Render

**Fix:** Update backend CORS, set `FRONTEND_URL`, redeploy

---

### Test 4: Authentication

**After signing in, in console:**

```javascript
const token = localStorage.getItem('auth_token')
console.log('Token exists:', !!token)
console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'none')
```

**Expected:**
```
Token exists: true
Token preview: eyJhbGciOiJIUzI1NiI...
```

**If no token:**
- ❌ Not signed in
- ❌ Google OAuth not configured
- ❌ Sign in failed

**Fix:** Sign in with Google, check Google Console settings

---

### Test 5: API Call

**After signing in, in console:**

```javascript
const token = localStorage.getItem('auth_token')
fetch('https://sui-studio-backend.onrender.com/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ message: 'test' })
})
  .then(r => r.json())
  .then(data => console.log('✅ API works:', data))
  .catch(err => console.error('❌ API error:', err))
```

**Expected:**
```
✅ API works: {conversationId: "...", message: {...}}
```

**If 401 error:**
- ❌ Token invalid or expired
- ❌ JWT_SECRET mismatch

**If 404 error:**
- ❌ Route doesn't exist
- ❌ Backend not deployed properly

**Fix:** Check backend logs, verify JWT_SECRET

---

## Detailed Diagnosis

### Check 1: Vercel Environment Variables

**Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Verify:**
```
VITE_API_URL = https://sui-studio-backend.onrender.com
VITE_GOOGLE_CLIENT_ID = 46096349629-...
VITE_SUI_NETWORK = testnet
VITE_SUI_RPC_URL = https://fullnode.testnet.sui.io:443
```

**Environment:** Production ✅

**After changes:** Redeploy!

---

### Check 2: Render Environment Variables

**Go to:** https://dashboard.render.com → Your Service → Environment

**Verify:**
```
DATABASE_URL = postgresql://...
OPENAI_API_KEY = sk-proj-...
JWT_SECRET = your-secret
FRONTEND_URL = https://your-app.vercel.app
GOOGLE_CLIENT_ID = 46096349629-...
NODE_ENV = production
PORT = 3001
```

**After changes:** Manual Deploy!

---

### Check 3: Google OAuth Configuration

**Go to:** https://console.cloud.google.com/apis/credentials

**Select your OAuth 2.0 Client ID**

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:3000
https://your-app.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://localhost:3000
https://your-app.vercel.app
https://your-app.vercel.app/
```

**After changes:** Wait 5 minutes!

---

### Check 4: Backend CORS Configuration

**File:** `backend/src/index.ts`

**Should have:**
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-app.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
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

**After changes:** Commit, push, redeploy!

---

## Error Patterns

### Pattern 1: 404 on all API calls

**Symptoms:**
```
GET https://sui-studio-backend.onrender.com/api/ai/chat 404
```

**Diagnosis:**
- Backend not running
- Wrong URL
- Routes not registered

**Check:**
```bash
curl https://sui-studio-backend.onrender.com/health
```

**Fix:**
- Check Render logs
- Verify Docker container is running
- Redeploy backend

---

### Pattern 2: CORS errors

**Symptoms:**
```
Access to fetch at 'https://sui-studio-backend.onrender.com/api/ai/chat' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Diagnosis:**
- Backend doesn't allow Vercel domain
- CORS not configured

**Check:**
```javascript
fetch('https://sui-studio-backend.onrender.com/health')
```

**Fix:**
- Set `FRONTEND_URL` in Render
- Update CORS config
- Redeploy backend

---

### Pattern 3: 401 Unauthorized

**Symptoms:**
```
POST https://sui-studio-backend.onrender.com/api/ai/chat 401
Error: Access token required
```

**Diagnosis:**
- Not signed in
- Token expired
- JWT_SECRET mismatch

**Check:**
```javascript
console.log(localStorage.getItem('auth_token'))
```

**Fix:**
- Sign in with Google
- Clear storage and sign in again
- Verify JWT_SECRET matches

---

### Pattern 4: Wrong API URL

**Symptoms:**
```
GET http://localhost:3001/api/ai/chat (failed)
```

**Diagnosis:**
- Frontend using localhost
- Environment variable not set
- Didn't redeploy after change

**Check:**
```javascript
console.log(import.meta.env.VITE_API_URL)
```

**Fix:**
- Update `VITE_API_URL` in Vercel
- Redeploy frontend
- Hard refresh browser

---

## Complete Test Script

**Run this in browser console (F12) after signing in:**

```javascript
async function diagnose() {
  console.log('🔍 Starting diagnosis...\n');
  
  // Test 1: Check API URL
  console.log('1️⃣ API URL:', import.meta.env.VITE_API_URL);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // Test 2: Check token
  const token = localStorage.getItem('auth_token');
  console.log('2️⃣ Token exists:', !!token);
  
  // Test 3: Test health endpoint
  try {
    const health = await fetch(`${apiUrl}/health`);
    const healthData = await health.json();
    console.log('3️⃣ Backend health:', healthData);
  } catch (err) {
    console.error('3️⃣ Backend health failed:', err.message);
  }
  
  // Test 4: Test CORS
  try {
    const cors = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      credentials: 'include'
    });
    console.log('4️⃣ CORS:', cors.ok ? '✅ Working' : '❌ Failed');
  } catch (err) {
    console.error('4️⃣ CORS failed:', err.message);
  }
  
  // Test 5: Test authenticated endpoint
  if (token) {
    try {
      const api = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (api.ok) {
        const user = await api.json();
        console.log('5️⃣ Authentication:', '✅ Working', user);
      } else {
        console.error('5️⃣ Authentication:', '❌ Failed', api.status);
      }
    } catch (err) {
      console.error('5️⃣ Authentication failed:', err.message);
    }
  } else {
    console.log('5️⃣ Authentication: ⚠️ Not signed in');
  }
  
  console.log('\n✅ Diagnosis complete!');
}

diagnose();
```

**Expected output:**
```
🔍 Starting diagnosis...

1️⃣ API URL: https://sui-studio-backend.onrender.com
2️⃣ Token exists: true
3️⃣ Backend health: {status: "ok", timestamp: "..."}
4️⃣ CORS: ✅ Working
5️⃣ Authentication: ✅ Working {id: "...", email: "..."}

✅ Diagnosis complete!
```

---

## Quick Fixes

### Fix 1: Update Vercel API URL

```bash
# In Vercel dashboard:
# Settings → Environment Variables
# Update: VITE_API_URL = https://sui-studio-backend.onrender.com
# Then: Deployments → Redeploy
```

### Fix 2: Update Render FRONTEND_URL

```bash
# In Render dashboard:
# Environment → Add/Update
# FRONTEND_URL = https://your-app.vercel.app
# Then: Manual Deploy → Deploy latest commit
```

### Fix 3: Clear Browser Cache

```bash
# Hard refresh
Ctrl + Shift + R

# Or clear storage
F12 → Application → Clear storage → Clear site data
```

### Fix 4: Sign In Again

```bash
# In your app:
# 1. Sign out (if signed in)
# 2. Clear browser storage (F12 → Application → Clear)
# 3. Sign in with Google again
```

---

**Run the diagnosis script above to identify your exact issue!** 🔍
