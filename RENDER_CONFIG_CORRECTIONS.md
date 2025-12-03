# ✅ Render Configuration Corrections

Based on your current Render setup, here's what needs to be corrected:

## Current Configuration

```
✅ Repository: Connected
✅ Branch: main
✅ Root Directory: backend/
✅ Dockerfile Path: backend/Dockerfile
✅ Docker Build Context: backend/
✅ URL: https://sui-studio.onrender.com
```

## Required Corrections

### 1. Health Check Path ⚠️

**Current:** Not set or incorrect

**Should be:**
```
/health
```

**How to set:**
1. Scroll to **"Health Checks"** section
2. Click **"Edit"** next to "Health Check Path"
3. Enter: `/health`
4. Save

**Why:** Render needs this to monitor if your service is running properly.

---

### 2. Environment Variables ⚠️

**Go to:** Environment tab (not shown in your screenshot)

**Required variables:**

```bash
# Database (CRITICAL)
DATABASE_URL=postgresql://neondb_owner:password@ep-name.region.aws.neon.tech/neondb?sslmode=require

# OpenAI (CRITICAL)
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000

# JWT Secret (CRITICAL)
JWT_SECRET=your-generated-secret-here

# Frontend URL (CRITICAL for CORS)
FRONTEND_URL=https://your-app.vercel.app

# Google OAuth (CRITICAL)
GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com

# Sui Network
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Server Config
NODE_ENV=production
PORT=3001
```

**How to add:**
1. Go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add each variable above
4. Click **"Save Changes"**

---

### 3. Pre-Deploy Command ⚠️

**Current:** Shows `backend/ $` (incomplete)

**Should be:**
```bash
npx prisma db push
```

**Or if you want migrations:**
```bash
npx prisma migrate deploy
```

**How to set:**
1. Find **"Pre-Deploy Command"** section
2. Click **"Edit"**
3. Enter: `npx prisma db push`
4. Save

**Why:** This ensures your database schema is up to date before deployment.

---

### 4. Docker Command (Optional)

**Current:** Not set (using Dockerfile's CMD)

**Recommended:** Leave empty (use Dockerfile's CMD)

Your Dockerfile already has:
```dockerfile
CMD ["npm", "start"]
```

This is correct, no changes needed here.

---

### 5. Auto-Deploy ✅

**Current:** On Commit

**Status:** ✅ Correct - No changes needed

---

### 6. Custom Domain (Optional)

**Current:** Using `sui-studio.onrender.com`

**Optional:** Add your own domain if you have one

**How to add:**
1. Click **"Add Custom Domain"**
2. Enter your domain
3. Follow DNS configuration instructions

---

## Step-by-Step Setup

### Step 1: Add Environment Variables

1. Click **"Environment"** tab (top of page)
2. Add these variables one by one:

```bash
DATABASE_URL=<your-neon-connection-string>
OPENAI_API_KEY=<your-openai-key>
JWT_SECRET=<generate-with-openssl-rand-base64-64>
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NODE_ENV=production
PORT=3001
```

3. Click **"Save Changes"**

### Step 2: Set Health Check

1. Scroll to **"Health Checks"** section
2. Click **"Edit"** next to "Health Check Path"
3. Enter: `/health`
4. Save

### Step 3: Set Pre-Deploy Command

1. Find **"Pre-Deploy Command"** section
2. Click **"Edit"**
3. Enter: `npx prisma db push`
4. Save

### Step 4: Deploy

1. Click **"Manual Deploy"** button (top right)
2. Select **"Deploy latest commit"**
3. Wait 5-10 minutes for deployment

### Step 5: Verify

```bash
# Test health endpoint
curl https://sui-studio.onrender.com/health

# Should return:
{"status":"ok","timestamp":"..."}
```

---

## Critical Environment Variables Explained

### DATABASE_URL
```bash
DATABASE_URL=postgresql://neondb_owner:password@ep-name.region.aws.neon.tech/neondb?sslmode=require
```
- Get from Neon dashboard
- Must include `?sslmode=require`
- Without this, backend can't store data

### OPENAI_API_KEY
```bash
OPENAI_API_KEY=sk-proj-J7Ozqxpp...
```
- Get from https://platform.openai.com/api-keys
- Without this, NEXI AI won't work
- Keep this secret!

### JWT_SECRET
```bash
JWT_SECRET=<64-character-random-string>
```
- Generate with: `openssl rand -base64 64`
- Used to sign authentication tokens
- Must be same across all deployments

### FRONTEND_URL
```bash
FRONTEND_URL=https://your-app.vercel.app
```
- Your actual Vercel URL
- Used for CORS configuration
- Without this, frontend can't connect

---

## Verification Checklist

After making changes:

### Backend Health
```bash
curl https://sui-studio.onrender.com/health
```
✅ Should return: `{"status":"ok"}`

### Environment Variables
1. Go to Environment tab
2. Verify all variables are set
3. No values should be "undefined"

### Logs
1. Go to Logs tab
2. Look for:
```
🚀 Sui Studio Backend running on port 3001
📝 Environment: production
🌐 Frontend URL: https://your-app.vercel.app
⛓️  Sui Network: testnet
```

### No Errors
Check logs for:
- ❌ Database connection errors
- ❌ OpenAI API errors
- ❌ Port binding errors
- ❌ Missing environment variable errors

---

## Common Mistakes to Avoid

### ❌ Wrong: Forgetting sslmode in DATABASE_URL
```bash
DATABASE_URL=postgresql://...neon.tech/neondb
```

### ✅ Correct: Include sslmode=require
```bash
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
```

---

### ❌ Wrong: Using localhost in FRONTEND_URL
```bash
FRONTEND_URL=http://localhost:3000
```

### ✅ Correct: Use actual Vercel URL
```bash
FRONTEND_URL=https://your-app.vercel.app
```

---

### ❌ Wrong: Not setting health check path
```
Health Check Path: (empty)
```

### ✅ Correct: Set to /health
```
Health Check Path: /health
```

---

## After Configuration

### 1. Redeploy
Click **"Manual Deploy"** → **"Deploy latest commit"**

### 2. Wait
Deployment takes 5-10 minutes (Docker build is slow)

### 3. Check Logs
Watch the logs for successful startup

### 4. Test
```bash
curl https://sui-studio.onrender.com/health
```

### 5. Update Vercel
Make sure Vercel has:
```bash
VITE_API_URL=https://sui-studio.onrender.com
```

---

## Quick Reference

### Your URLs
- **Backend:** https://sui-studio.onrender.com
- **Frontend:** https://your-app.vercel.app (update this)

### Required in Render
- ✅ Health Check Path: `/health`
- ✅ Pre-Deploy Command: `npx prisma db push`
- ✅ All environment variables set
- ✅ Docker configuration correct

### Required in Vercel
- ✅ `VITE_API_URL=https://sui-studio.onrender.com`
- ✅ `VITE_GOOGLE_CLIENT_ID=...`
- ✅ Redeployed after changes

---

**Next Step:** Add the environment variables in the Environment tab! 🚀
