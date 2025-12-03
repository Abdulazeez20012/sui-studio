# ⚡ Production Deployment - Quick Start

Deploy Sui Studio to Render (backend) + Vercel (frontend) in 30 minutes!

## Overview

```
┌─────────────────────────────────────────────┐
│         Users (Browser)                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│    Frontend (Vercel)                        │
│    https://your-app.vercel.app              │
│    - React + Vite                           │
│    - Static hosting                         │
│    - Auto HTTPS                             │
└──────────────────┬──────────────────────────┘
                   │ API Calls
                   ▼
┌─────────────────────────────────────────────┐
│    Backend (Render)                         │
│    https://sui-studio-backend.onrender.com  │
│    - Node.js + Express                      │
│    - OpenAI Integration                     │
│    - WebSocket Support                      │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   Database   │      │   OpenAI     │
│   (Neon)     │      │   API        │
└──────────────┘      └──────────────┘
```

## Prerequisites Checklist

- [ ] GitHub account with your code
- [ ] Render account (https://render.com)
- [ ] Vercel account (https://vercel.com)
- [ ] Neon database (https://neon.tech)
- [ ] OpenAI API key (https://platform.openai.com)
- [ ] Google OAuth configured

## Part 1: Backend (Render) - 15 minutes

### Step 1: Create Database (5 min)

**Neon (Recommended):**
1. Go to https://neon.tech
2. Create account
3. Create new project
4. Copy connection string:
   ```
   postgresql://neondb_owner:password@ep-name.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Deploy to Render (10 min)

1. **Go to Render:** https://dashboard.render.com
2. **New Web Service** → Connect GitHub repo
3. **Configure:**
   ```
   Name: sui-studio-backend
   Root Directory: backend
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables:**
   ```bash
   DATABASE_URL=postgresql://neondb_owner:...
   JWT_SECRET=<generate with: openssl rand -base64 64>
   OPENAI_API_KEY=sk-proj-your-key
   OPENAI_MODEL=gpt-4-turbo-preview
   OPENAI_MAX_TOKENS=2000
   FRONTEND_URL=https://your-app.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   SUI_NETWORK=testnet
   SUI_RPC_URL=https://fullnode.testnet.sui.io:443
   NODE_ENV=production
   PORT=3001
   ```

5. **Deploy** → Wait 5-10 minutes

6. **Run Migrations:**
   - Open Render Shell
   - Run: `npx prisma db push`

7. **Test:**
   ```bash
   curl https://sui-studio-backend.onrender.com/health
   ```

**Backend URL:** `https://sui-studio-backend.onrender.com`

## Part 2: Frontend (Vercel) - 15 minutes

### Step 1: Deploy to Vercel (10 min)

1. **Go to Vercel:** https://vercel.com/dashboard
2. **Import Project** → Select GitHub repo
3. **Configure:**
   ```
   Framework: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variables:**
   ```bash
   VITE_API_URL=https://sui-studio-backend.onrender.com
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_SUI_NETWORK=testnet
   VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
   ```

5. **Deploy** → Wait 2-5 minutes

**Frontend URL:** `https://your-app.vercel.app`

### Step 2: Configure Google OAuth (5 min)

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Select your OAuth Client ID**
3. **Add Authorized Origins:**
   ```
   https://your-app.vercel.app
   ```
4. **Add Redirect URIs:**
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/
   ```
5. **Save**

### Step 3: Update Backend

1. **Go to Render dashboard**
2. **Environment variables**
3. **Update FRONTEND_URL:**
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. **Save and redeploy**

## Part 3: Test Everything (5 min)

### Test Checklist

1. **Backend Health:**
   ```bash
   curl https://sui-studio-backend.onrender.com/health
   # Should return: {"status":"ok"}
   ```

2. **Frontend Loads:**
   - Visit: `https://your-app.vercel.app`
   - Landing page should load

3. **Sign In:**
   - Click "Sign In"
   - Sign in with Google
   - Should redirect to IDE

4. **Test NEXI AI:**
   - Click "NEXI AI" panel
   - Send message: "Hello"
   - Should get AI response

5. **Test Features:**
   - [ ] Code editor works
   - [ ] Terminal works
   - [ ] Compilation works
   - [ ] File explorer works

## Environment Variables Summary

### Backend (Render)
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=<generated>
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NODE_ENV=production
PORT=3001
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://sui-studio-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

## Troubleshooting

### Backend Issues

**Build Failed:**
```bash
# Check package.json has:
"build": "npm install --include=dev && tsc && npx prisma generate"
"start": "node dist/index.js"
```

**Database Connection Failed:**
```bash
# Ensure DATABASE_URL includes ?sslmode=require
postgresql://...?sslmode=require
```

**OpenAI Errors:**
```bash
# Check OPENAI_API_KEY is valid
# Check account has credits
```

### Frontend Issues

**Build Failed:**
```bash
# Test locally:
npm run build
```

**Environment Variables Not Working:**
```bash
# Ensure variables start with VITE_
# Redeploy after adding variables
```

**CORS Errors:**
```bash
# Check FRONTEND_URL in Render matches Vercel URL
# Check backend CORS config includes Vercel domain
```

**Google OAuth Not Working:**
```bash
# Check Vercel URL in Google Console
# Wait 5 minutes for changes to propagate
# Clear browser cache
```

## Cost Breakdown

### Free Tier (Good for Development)

**Neon Database:**
- Free: 0.5 GB storage, 3 GB transfer
- Cost: $0/month

**Render Backend:**
- Free: 512 MB RAM, sleeps after 15 min
- Cost: $0/month

**Vercel Frontend:**
- Free: 100 GB bandwidth
- Cost: $0/month

**OpenAI:**
- Pay per use
- GPT-4 Turbo: ~$0.01-0.03 per 1K tokens
- Estimated: $10-50/month (depends on usage)

**Total: $10-50/month** (mostly OpenAI)

### Production Tier

**Neon Database:**
- Starter: 10 GB storage
- Cost: $19/month

**Render Backend:**
- Starter: 512 MB RAM, no sleep
- Cost: $7/month

**Vercel Frontend:**
- Pro: 1 TB bandwidth
- Cost: $20/month

**OpenAI:**
- Pay per use
- Estimated: $50-200/month

**Total: $96-246/month**

## Optimization Tips

### Reduce OpenAI Costs

1. **Use GPT-3.5 Turbo:**
   ```bash
   OPENAI_MODEL=gpt-3.5-turbo
   ```
   10x cheaper than GPT-4

2. **Reduce Max Tokens:**
   ```bash
   OPENAI_MAX_TOKENS=1000
   ```

3. **Cache Responses:**
   Implement caching for common queries

### Improve Performance

1. **Upgrade Render to Starter:**
   - No sleep time
   - Faster response
   - $7/month

2. **Use CDN:**
   - Vercel includes CDN
   - Automatic edge caching

3. **Optimize Images:**
   - Compress images
   - Use WebP format
   - Lazy loading

## Monitoring

### Render
- Dashboard → Logs
- Monitor errors
- Check resource usage

### Vercel
- Dashboard → Analytics
- Monitor page views
- Check performance

### OpenAI
- Platform → Usage
- Monitor token usage
- Set spending limits

## Next Steps

1. ✅ Backend deployed to Render
2. ✅ Frontend deployed to Vercel
3. ✅ Database connected
4. ✅ OpenAI configured
5. ✅ Google OAuth working
6. 🎯 **Your app is live!**

## Support

### Documentation
- **Render Guide:** `RENDER_DEPLOYMENT_GUIDE.md`
- **Vercel Guide:** `VERCEL_DEPLOYMENT_GUIDE.md`
- **Full Details:** Both guides above

### Resources
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs

---

**Your App:** https://your-app.vercel.app
**Backend:** https://sui-studio-backend.onrender.com
**Status:** Live in production! 🚀
