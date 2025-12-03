# 🚀 Render Backend Deployment Guide

Complete guide to deploy your Sui Studio backend to Render.

## Prerequisites

- [ ] Render account (https://render.com)
- [ ] GitHub repository with your code
- [ ] OpenAI API key
- [ ] Database (Neon or Supabase)

## Step 1: Prepare Backend for Deployment

### 1.1 Create render.yaml

Create `render.yaml` in your **root directory**:

```yaml
services:
  - type: web
    name: sui-studio-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install && npx prisma generate && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: OPENAI_API_KEY
        sync: false
      - key: OPENAI_MODEL
        value: gpt-4-turbo-preview
      - key: OPENAI_MAX_TOKENS
        value: 2000
      - key: FRONTEND_URL
        sync: false
      - key: GOOGLE_CLIENT_ID
        sync: false
      - key: SUI_NETWORK
        value: testnet
      - key: SUI_RPC_URL
        value: https://fullnode.testnet.sui.io:443
```

### 1.2 Update package.json

Ensure `backend/package.json` has build and start scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "npm install --include=dev && tsc && npx prisma generate",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

### 1.3 Update .gitignore

Ensure these are in `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production

# Build output
backend/dist/
backend/node_modules/

# Database
backend/prisma/*.db
backend/prisma/*.db-journal
```

## Step 2: Deploy to Render

### 2.1 Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### 2.2 Configure Service

**Basic Settings:**
```
Name: sui-studio-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
```

**Build Settings:**
```
Build Command: npm install && npx prisma generate && npm run build
Start Command: npm start
```

**Instance Type:**
```
Free (or Starter $7/month for better performance)
```

### 2.3 Add Environment Variables

Click **"Environment"** tab and add:

#### Required Variables

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:password@ep-name.region.aws.neon.tech/neondb?sslmode=require

# JWT Secret (generate with: openssl rand -base64 64)
JWT_SECRET=your-generated-secret-here

# OpenAI
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000

# Frontend URL (will update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Sui Network
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Server
NODE_ENV=production
PORT=3001
```

#### How to Get Values

**DATABASE_URL:**
- Neon: https://neon.tech → Create project → Copy connection string
- Supabase: https://supabase.com → Project Settings → Database → Connection string

**JWT_SECRET:**
```bash
openssl rand -base64 64
```

**OPENAI_API_KEY:**
- https://platform.openai.com/api-keys

**GOOGLE_CLIENT_ID:**
- https://console.cloud.google.com/apis/credentials

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://sui-studio-backend.onrender.com`

## Step 3: Configure Database

### 3.1 Run Migrations

After first deployment, open Render Shell:

1. Go to your service dashboard
2. Click **"Shell"** tab
3. Run:

```bash
npx prisma db push
```

### 3.2 Seed Database (Optional)

```bash
npm run seed
```

## Step 4: Test Backend

### 4.1 Health Check

```bash
curl https://sui-studio-backend.onrender.com/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 4.2 Check Logs

In Render dashboard:
1. Go to **"Logs"** tab
2. Look for:
```
🚀 Sui Studio Backend running on port 3001
📝 Environment: production
```

## Step 5: Update CORS

Your backend already supports Vercel domains:

```typescript
// backend/src/index.ts
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://sui-studio.vercel.app',
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

## Render Configuration Checklist

### Environment Variables
- [ ] `DATABASE_URL` - Database connection string
- [ ] `JWT_SECRET` - Generated secret key
- [ ] `OPENAI_API_KEY` - OpenAI API key
- [ ] `OPENAI_MODEL` - gpt-4-turbo-preview
- [ ] `OPENAI_MAX_TOKENS` - 2000
- [ ] `FRONTEND_URL` - Your Vercel URL
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `SUI_NETWORK` - testnet
- [ ] `SUI_RPC_URL` - Sui RPC endpoint
- [ ] `NODE_ENV` - production
- [ ] `PORT` - 3001

### Build Settings
- [ ] Build Command: `npm install && npx prisma generate && npm run build`
- [ ] Start Command: `npm start`
- [ ] Root Directory: `backend`

### Database
- [ ] Database created (Neon/Supabase)
- [ ] Connection string added to `DATABASE_URL`
- [ ] Migrations run (`npx prisma db push`)
- [ ] Database seeded (optional)

## Troubleshooting

### ❌ Build Failed

**Check:**
1. `package.json` has correct scripts
2. All dependencies in `package.json`
3. TypeScript compiles locally: `npm run build`

**Fix:**
```bash
# Test build locally
cd backend
npm install
npm run build
```

### ❌ Database Connection Failed

**Check:**
1. `DATABASE_URL` is correct
2. Database allows connections from Render IPs
3. SSL mode is enabled: `?sslmode=require`

**Fix:**
```bash
# Test connection in Render Shell
npx prisma db push
```

### ❌ OpenAI API Errors

**Check:**
1. `OPENAI_API_KEY` is set
2. Key is valid (not expired)
3. Account has credits

**Fix:**
- Get new key: https://platform.openai.com/api-keys
- Add credits to account

### ❌ CORS Errors

**Check:**
1. `FRONTEND_URL` matches your Vercel URL
2. Backend CORS config includes Vercel domains

**Fix:**
Update `FRONTEND_URL` in Render environment variables

### ❌ Service Sleeps (Free Tier)

**Issue:** Render free tier sleeps after 15 minutes of inactivity

**Solutions:**
1. **Upgrade to Starter plan** ($7/month) - No sleep
2. **Use wake-up service** - Ping every 10 minutes
3. **Accept cold starts** - First request takes 30-60 seconds

## Monitoring

### Check Service Health

```bash
# Health endpoint
curl https://sui-studio-backend.onrender.com/health

# Check specific endpoint
curl https://sui-studio-backend.onrender.com/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

### View Logs

1. Go to Render dashboard
2. Select your service
3. Click **"Logs"** tab
4. Monitor real-time logs

### Set Up Alerts

1. Go to **"Settings"** → **"Notifications"**
2. Add email for deploy failures
3. Add webhook for monitoring

## Scaling

### Free Tier
- 512 MB RAM
- Shared CPU
- Sleeps after 15 min inactivity
- Good for: Development, testing

### Starter ($7/month)
- 512 MB RAM
- Shared CPU
- No sleep
- Good for: Small production apps

### Standard ($25/month)
- 2 GB RAM
- Dedicated CPU
- Auto-scaling
- Good for: Production apps

## Cost Optimization

### Use Neon Database
- Free tier: 0.5 GB storage
- Serverless (scales to zero)
- Cheaper than Supabase for database-only

### Use GPT-3.5 Turbo
```bash
OPENAI_MODEL=gpt-3.5-turbo
```
- 10x cheaper than GPT-4
- Good for development

### Monitor Usage
- Check Render metrics
- Monitor OpenAI token usage
- Set up billing alerts

## Next Steps

1. ✅ Backend deployed to Render
2. ✅ Environment variables configured
3. ✅ Database connected
4. 🎯 **Next:** Deploy frontend to Vercel

See `VERCEL_DEPLOYMENT_GUIDE.md` for frontend deployment.

---

**Backend URL:** https://sui-studio-backend.onrender.com
**Status:** Ready for frontend connection! 🚀
