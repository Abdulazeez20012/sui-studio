# 🚀 Backend Deployment Guide - Render + Supabase

## Complete Step-by-Step Guide

---

## Part 1: Setup Database (Supabase) - 5 minutes

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest)

### Step 2: Create New Project
1. Click "New Project"
2. Fill in:
   - **Name**: `sui-studio-db`
   - **Database Password**: (generate strong password - SAVE THIS!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### Step 3: Get Database Connection String
1. Go to Project Settings (gear icon)
2. Click "Database" in sidebar
3. Scroll to "Connection string"
4. Select "URI" tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual password

**Your connection string looks like**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

**Save this!** You'll need it for Render.

---

## Part 2: Deploy Backend (Render) - 10 minutes

### Step 1: Push Backend to GitHub

**If you haven't pushed your code yet**:

```bash
# In your project root (not backend folder)
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest)
4. Authorize Render to access your repos

### Step 3: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Select your `sui-studio` repo

### Step 4: Configure Service

**Basic Settings**:
```
Name: sui-studio-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend          ← IMPORTANT!
Runtime: Node
```

**Build & Deploy**:
```
Build Command: npm install && npm run build && npx prisma generate
Start Command: npm start
```

**Instance Type**:
```
Free
```

### Step 5: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these one by one:

```env
NODE_ENV=production

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres

JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random

PORT=3001

FRONTEND_URL=https://your-vercel-app.vercel.app

SUI_NETWORK=testnet

SUI_RPC_URL=https://fullnode.testnet.sui.io:443

RATE_LIMIT_WINDOW_MS=900000

RATE_LIMIT_MAX_REQUESTS=100
```

**Important**:
- Replace `DATABASE_URL` with your Supabase connection string
- Replace `JWT_SECRET` with a random string (use: https://randomkeygen.com/)
- Replace `FRONTEND_URL` with your actual Vercel URL

### Step 6: Deploy!

1. Click "Create Web Service"
2. Render will start building
3. Wait 3-5 minutes
4. You'll get a URL like: `https://sui-studio-backend.onrender.com`

---

## Part 3: Run Database Migrations - 2 minutes

### After First Deploy

Your backend is running, but database tables aren't created yet.

**Option A: Use Render Shell** (Recommended)

1. Go to your Render service
2. Click "Shell" tab
3. Run:
```bash
npx prisma migrate deploy
```

**Option B: Use Local Prisma**

1. In your local `backend` folder
2. Create `.env` file:
```env
DATABASE_URL=your-supabase-connection-string
```
3. Run:
```bash
npm run prisma:migrate
```

---

## Part 4: Update Frontend - 2 minutes

### Update API URL in Frontend

**In your frontend `.env.local`**:
```env
VITE_API_URL=https://sui-studio-backend.onrender.com
```

**Redeploy frontend**:
```bash
# If using Vercel
vercel --prod

# Or just push to GitHub (if auto-deploy is enabled)
git add .
git commit -m "Update API URL"
git push
```

---

## Part 5: Test Everything - 5 minutes

### Test Backend Health

Visit in browser:
```
https://sui-studio-backend.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-..."
}
```

### Test API Endpoints

**Test Auth**:
```bash
curl https://sui-studio-backend.onrender.com/api/auth/health
```

**Test Projects**:
```bash
curl https://sui-studio-backend.onrender.com/api/projects
```

### Test from Frontend

1. Open your frontend app
2. Try to sign in
3. Try to create a project
4. Check browser console for errors

---

## 🔧 Troubleshooting

### Issue: "Application failed to respond"

**Solution**: Check Render logs
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors

Common causes:
- Missing environment variables
- Database connection failed
- Port configuration wrong

### Issue: "Database connection failed"

**Solution**: Check DATABASE_URL
1. Make sure password is correct
2. Make sure no spaces in connection string
3. Test connection locally first

### Issue: "CORS errors in frontend"

**Solution**: Update FRONTEND_URL
1. Make sure FRONTEND_URL matches your Vercel URL exactly
2. Include `https://`
3. No trailing slash
4. Redeploy backend

### Issue: "Cold starts (slow first request)"

**Solution**: This is normal on free tier
- First request after 15 min takes 30-60 seconds
- Subsequent requests are fast
- Upgrade to paid tier to avoid cold starts

---

## 📊 What You Get (Free Tier)

### Render Free Tier:
- ✅ 750 hours/month (enough for 1 app)
- ✅ Auto-deploy from GitHub
- ✅ SSL certificate
- ✅ Custom domain support
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold start: 30-60 seconds

### Supabase Free Tier:
- ✅ 500MB database storage
- ✅ Unlimited API requests
- ✅ 2GB file storage
- ✅ 50MB file uploads
- ✅ Social OAuth providers
- ✅ Forever free!

---

## 🎯 Quick Reference

### Your URLs:
```
Frontend:  https://your-app.vercel.app
Backend:   https://sui-studio-backend.onrender.com
Database:  db.xxx.supabase.co (via Supabase)
```

### Important Commands:

**View Logs**:
```bash
# On Render dashboard → Logs tab
```

**Run Migrations**:
```bash
# In Render Shell
npx prisma migrate deploy
```

**Restart Service**:
```bash
# On Render dashboard → Manual Deploy → Clear build cache & deploy
```

---

## 🚀 After Deployment

### Update Your Frontend Services

**In `src/services/apiService.ts`**, the API_URL should automatically use:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

This will use your Render URL in production!

### Test All Features:
- [ ] User sign up/login
- [ ] Create project
- [ ] Save files
- [ ] Deploy contract (if implemented)
- [ ] Collaboration (if implemented)

---

## 💡 Pro Tips

1. **Monitor Your App**: Check Render dashboard regularly for errors

2. **Database Backups**: Supabase auto-backs up daily (free tier)

3. **Environment Variables**: Never commit `.env` files to GitHub

4. **Logs**: Check logs if something breaks

5. **Cold Starts**: First request after inactivity is slow (normal)

6. **Upgrade Path**: When you need more, upgrade Render to $7/month (no cold starts)

---

## 🎉 You're Done!

Your backend is now:
- ✅ Deployed to Render
- ✅ Connected to Supabase database
- ✅ Accessible from your frontend
- ✅ Auto-deploys on git push
- ✅ Has SSL certificate
- ✅ Completely free!

**Total Cost**: $0/month
**Total Time**: ~20 minutes

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Render Community**: https://community.render.com
- **Your Backend Logs**: Check Render dashboard

---

**Happy Deploying!** 🚀
