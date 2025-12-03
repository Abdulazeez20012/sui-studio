# 🔧 Fix: API URL and Authentication Issues

## Problems Identified

### 1. Wrong API URL ❌
```
Frontend is calling: https://sui-studio.onrender.com (production)
Should be calling: http://localhost:3001 (local backend)
```

### 2. Not Authenticated ❌
```
Error: Access token required (401)
You need to log in first
```

## Solutions

### Fix 1: Update API URL ✅

**Already Fixed!** Updated `.env.local`:

```bash
# Before (Wrong)
VITE_API_URL=https://sui-studio.onrender.com

# After (Correct)
VITE_API_URL=http://localhost:3001
```

### Fix 2: Restart Frontend

**IMPORTANT:** Environment variables only load on startup!

```bash
# Stop frontend (Ctrl+C in terminal)
# Then restart:
npm run dev
```

Or if using Vite:
```bash
# Stop (Ctrl+C)
# Restart:
npm run dev
```

### Fix 3: Log In to the IDE

1. **Open the IDE** in browser
2. **Click "Sign In"** button (top right)
3. **Sign in with Google** OAuth
4. **Now try NEXI AI** again

## Step-by-Step Fix

### Step 1: Verify Backend is Running ✅

```bash
# Check backend
curl http://localhost:3001/health

# Should return:
{"status":"ok"}
```

**Status:** ✅ Backend is already running (Process ID: 4)

### Step 2: Update Frontend Environment ✅

**Status:** ✅ Already updated `.env.local`

### Step 3: Restart Frontend 🔄

**You need to do this:**

```bash
# In your frontend terminal:
# Press Ctrl+C to stop

# Then restart:
npm run dev
```

### Step 4: Log In 🔐

1. Open http://localhost:3000 (or your dev port)
2. Click "Sign In" button
3. Sign in with Google
4. You'll get an auth token

### Step 5: Test NEXI AI 🎯

1. Click "NEXI AI" panel
2. Send message: "Hello"
3. Should work now! ✅

## Why This Happened

### Wrong API URL
Your `.env.local` had:
```bash
VITE_API_URL=https://sui-studio.onrender.com
```

This points to production Render backend, not your local backend.

### Authentication Required
The AI endpoint requires authentication:
```typescript
router.use(authenticateToken); // Requires JWT token
```

You need to log in to get a token.

## Verification

### Check API URL
```bash
# In browser console (F12):
console.log(import.meta.env.VITE_API_URL)

# Should show:
http://localhost:3001
```

### Check Auth Token
```bash
# In browser console (F12):
console.log(localStorage.getItem('auth_token'))

# Should show a JWT token after login
```

### Check Backend Connection
```bash
# In browser console (F12):
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(console.log)

# Should show:
{status: "ok", timestamp: "..."}
```

## Common Issues

### ❌ Still Getting 404

**Cause:** Frontend not restarted

**Fix:**
```bash
# Stop frontend (Ctrl+C)
# Restart:
npm run dev
```

### ❌ Still Getting 401

**Cause:** Not logged in

**Fix:**
1. Click "Sign In" in IDE
2. Sign in with Google
3. Try NEXI AI again

### ❌ CORS Error

**Cause:** Backend CORS not configured for localhost

**Fix:** Backend already configured for localhost:
```typescript
allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  // ...
]
```

### ❌ Can't Sign In

**Cause:** Google OAuth not configured

**Fix:** Check `VITE_GOOGLE_CLIENT_ID` in `.env.local`

## Environment Variables Reference

### Frontend (.env.local)
```bash
# API URL (IMPORTANT!)
VITE_API_URL=http://localhost:3001

# Google OAuth
VITE_GOOGLE_CLIENT_ID=46096349629-...

# Sui Network
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

### Backend (backend/.env.local)
```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret"

# OpenAI
OPENAI_API_KEY="sk-proj-..."
OPENAI_MODEL="gpt-4-turbo-preview"
```

## Quick Commands

### Check Backend
```bash
curl http://localhost:3001/health
```

### Check Frontend Port
```bash
# Usually shown when you run npm run dev
# Look for: Local: http://localhost:5173
```

### Restart Frontend
```bash
# Stop: Ctrl+C
# Start: npm run dev
```

### Restart Backend
```bash
# Stop: Ctrl+C in backend terminal
# Start: cd backend && npm run dev
```

## Testing After Fix

### 1. Check API URL
```javascript
// In browser console (F12)
console.log(import.meta.env.VITE_API_URL)
// Should be: http://localhost:3001
```

### 2. Log In
- Click "Sign In"
- Use Google OAuth
- Should redirect back to IDE

### 3. Check Auth Token
```javascript
// In browser console (F12)
console.log(localStorage.getItem('auth_token'))
// Should show JWT token
```

### 4. Test NEXI AI
- Open NEXI AI panel
- Send: "Hello"
- Should get AI response ✅

## Summary

### What Was Wrong
1. ❌ Frontend calling production URL (Render)
2. ❌ Not authenticated (no login)

### What Was Fixed
1. ✅ Updated `VITE_API_URL` to `http://localhost:3001`
2. ✅ Backend already running on port 3001

### What You Need to Do
1. 🔄 **Restart frontend** (Ctrl+C, then `npm run dev`)
2. 🔐 **Log in** with Google OAuth
3. 🎯 **Test NEXI AI** - should work now!

## Next Steps

1. **Stop frontend** (Ctrl+C in terminal)
2. **Restart frontend** (`npm run dev`)
3. **Open browser** (http://localhost:5173 or shown port)
4. **Sign in** with Google
5. **Test NEXI AI** - send a message
6. **Success!** 🎉

---

**Status:** Configuration fixed! Restart frontend and log in to use NEXI AI! 🚀
