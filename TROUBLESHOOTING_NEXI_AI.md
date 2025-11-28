# 🔧 Troubleshooting NEXI AI

## Issue: "AI Service Unavailable"

### Root Cause
The backend server is not running on port 3001.

### Solution

## Quick Fix (Start Backend)

### Windows
```bash
cd backend
npm run dev
```

Or use the startup script:
```bash
start-backend.bat
```

### Mac/Linux
```bash
cd backend
npm run dev
```

## Verification Steps

### 1. Check Backend is Running
```bash
# Test health endpoint
curl http://localhost:3001/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### 2. Check OpenAI Configuration
```bash
# In backend/.env.local, verify:
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
```

### 3. Test NEXI AI
1. Open IDE in browser
2. Click "NEXI AI" panel
3. Type: "Hello"
4. Should get AI response

## Common Issues

### ❌ Issue 1: Backend Not Running

**Symptoms:**
- "AI Service Unavailable"
- "No response from AI service"
- "Backend server is not running"

**Fix:**
```bash
cd backend
npm run dev
```

**Verify:**
```bash
# Should see:
🚀 Sui Studio Backend running on port 3001
📝 Environment: development
```

### ❌ Issue 2: Port 3001 Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Fix:**
```bash
# Windows - Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### ❌ Issue 3: OpenAI API Key Not Set

**Symptoms:**
- "AI service not configured"
- "Please set OPENAI_API_KEY"

**Fix:**
```bash
# Edit backend/.env.local
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**Get Key:**
https://platform.openai.com/api-keys

### ❌ Issue 4: Invalid OpenAI API Key

**Symptoms:**
- "Invalid API key"
- "Authentication failed"

**Fix:**
1. Get new key from https://platform.openai.com/api-keys
2. Update `backend/.env.local`
3. Restart backend

### ❌ Issue 5: Database Connection Failed

**Symptoms:**
```
Error: Can't reach database server
```

**Fix:**
```bash
# Check DATABASE_URL in backend/.env.local
DATABASE_URL="postgresql://..."

# Test connection
cd backend
npx prisma studio
```

### ❌ Issue 6: Missing Dependencies

**Symptoms:**
```
Error: Cannot find module 'openai'
```

**Fix:**
```bash
cd backend
npm install
```

## Complete Startup Checklist

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
# Edit backend/.env.local
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-proj-..."
JWT_SECRET="your-secret"
```

### Step 3: Setup Database
```bash
npx prisma generate
npx prisma db push
```

### Step 4: Start Backend
```bash
npm run dev
```

### Step 5: Verify
```bash
# Test health
curl http://localhost:3001/health

# Should return:
{"status":"ok","timestamp":"..."}
```

### Step 6: Test NEXI AI
1. Open http://localhost:3000
2. Click NEXI AI
3. Send message
4. Get AI response ✅

## Debug Commands

### Check Backend Status
```bash
# Windows
netstat -ano | findstr :3001

# Mac/Linux
lsof -i :3001
```

### Check Environment Variables
```bash
cd backend
cat .env.local
```

### Check OpenAI Package
```bash
cd backend
npm list openai
```

### Check Logs
```bash
# Backend logs show in terminal where you ran npm run dev
# Look for errors like:
# - "OpenAI API error"
# - "Database connection failed"
# - "Port already in use"
```

## Testing Backend Manually

### Test Health Endpoint
```bash
curl http://localhost:3001/health
```

### Test AI Endpoint (with auth)
```bash
# First, get auth token by logging in
# Then:
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"Hello"}'
```

## Environment Variables Reference

### Required
```bash
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"

# OpenAI
OPENAI_API_KEY="sk-proj-..."
```

### Optional
```bash
# Server
PORT=3001
NODE_ENV=development

# OpenAI
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000

# Sui
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

## Quick Restart

If things get stuck, do a full restart:

```bash
# 1. Stop backend (Ctrl+C in terminal)

# 2. Kill any lingering processes
# Windows:
taskkill /F /IM node.exe

# Mac/Linux:
killall node

# 3. Restart backend
cd backend
npm run dev

# 4. Refresh browser
# Press F5 in browser
```

## Still Not Working?

### Check These:

1. **Backend Running?**
   ```bash
   curl http://localhost:3001/health
   ```

2. **OpenAI Key Valid?**
   - Starts with `sk-proj-` or `sk-`
   - No extra spaces
   - Not expired

3. **Database Connected?**
   ```bash
   npx prisma studio
   ```

4. **Port Available?**
   ```bash
   netstat -ano | findstr :3001
   ```

5. **Dependencies Installed?**
   ```bash
   npm list openai
   ```

## Get Help

If still stuck, check:
- Backend terminal for error messages
- Browser console (F12) for frontend errors
- `backend/.env.local` for configuration

## Success Indicators

When everything works:

**Backend Terminal:**
```
🚀 Sui Studio Backend running on port 3001
📝 Environment: development
🌐 Frontend URL: http://localhost:3000
⛓️  Sui Network: testnet
🔌 WebSocket server ready
```

**Browser:**
- NEXI AI panel loads
- Can send messages
- Gets intelligent responses
- No error messages

**Health Check:**
```bash
$ curl http://localhost:3001/health
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

---

**Most Common Fix:** Just start the backend with `cd backend && npm run dev` 🚀
