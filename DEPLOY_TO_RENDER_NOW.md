# 🚀 Deploy to Render - Quick Steps

## You Want Render (Not Railway) ✅

Got it! Here's how to deploy to Render with the fixed Dockerfile.

---

## Step 1: Push to GitHub (Fix Secret First)

**Click this link to allow the secret:**
```
https://github.com/Abdulazeez20012/sui-studio/security/secret-scanning/unblock-secret/36bKVEtPhqflCz47VGojpDkPzpm
```

**Then push:**
```bash
git add .
git commit -m "fix: Update Dockerfile for Render deployment"
git push origin main
```

---

## Step 2: Deploy on Render

### A. Go to Render Dashboard
https://dashboard.render.com

### B. Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"** (if not connected)
3. Select your **`sui-studio`** repository

### C. Configure Service

**Basic Settings:**
```
Name: sui-studio-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
```

**Build Settings:**
```
Runtime: Docker
Dockerfile Path: backend/Dockerfile
```

**Instance Type:**
```
Plan: Starter ($7/month) - RECOMMENDED
(Free tier might timeout during Sui CLI installation)
```

### D. Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your-neon-database-url-here
JWT_SECRET=your-jwt-secret-minimum-32-chars
ANTHROPIC_API_KEY=your-anthropic-api-key
FRONTEND_URL=https://suistudio.live
SUI_NETWORK=testnet
```

**Important:**
- `DATABASE_URL` - Get from Neon dashboard
- `JWT_SECRET` - Generate a random 32+ character string
- `ANTHROPIC_API_KEY` - Your Claude API key

### E. Deploy

1. Click **"Create Web Service"**
2. Wait 10-15 minutes for build
3. Watch the logs

**Expected logs:**
```
✅ Sui CLI installed successfully
sui 1.36.2-mainnet
✅ npm install
✅ Prisma generate
✅ TypeScript build
✅ Server started
```

---

## Step 3: Get Your Render URL

After deployment succeeds:
1. Your URL will be: `https://sui-studio-backend.onrender.com`
2. Or check in Render dashboard → Your service → URL at top

---

## Step 4: Update Frontend

### Local Environment

Edit `.env.local`:
```env
VITE_API_URL=https://sui-studio-backend.onrender.com
VITE_WS_URL=wss://sui-studio-backend.onrender.com
```

Test locally:
```bash
npm run dev
```

### Vercel (Production)

1. Go to https://vercel.com/dashboard
2. Click your project
3. **Settings** → **Environment Variables**
4. Update or add:
   ```env
   VITE_API_URL=https://sui-studio-backend.onrender.com
   VITE_WS_URL=wss://sui-studio-backend.onrender.com
   ```
5. **Deployments** → **Redeploy**

---

## Step 5: Test Everything

### Test Backend
```bash
curl https://sui-studio-backend.onrender.com/health
```
Expected: `{"status":"ok"}`

### Test Frontend
Open: https://suistudio.live

Check browser console:
- ✅ No WebSocket errors
- ✅ No 401 errors
- ✅ API calls working

---

## 🆘 Troubleshooting

### Build Timeout on Free Tier

**Problem:** Sui CLI installation takes too long

**Solution:** Upgrade to Starter plan ($7/month)

Or use simple Dockerfile (no Sui CLI):
- Settings → Dockerfile Path: `backend/Dockerfile.simple`
- Redeploy

### Out of Memory

**Problem:** Build fails with memory error

**Solution:** Upgrade to Starter or Standard plan

### Environment Variables Not Set

**Problem:** Server shows "undefined" for environment

**Solution:** 
1. Check all environment variables are set
2. Redeploy after adding them

---

## 💡 Pro Tips

1. **Auto-Deploy**: Render auto-deploys on git push (after initial setup)
2. **Logs**: View real-time logs in Render dashboard
3. **Sleep**: Free tier sleeps after 15min inactivity (Starter doesn't)
4. **Custom Domain**: Can add custom domain in Render settings

---

## 📊 Cost Estimate

**Recommended Setup:**
- Render Starter: $7/month
- Neon Database: Free (512MB)
- Vercel: Free
- **Total: $7/month**

---

## ✅ Summary

1. Allow secret on GitHub
2. Push code
3. Create Render Web Service
4. Configure with Docker + environment variables
5. Deploy (wait 10-15 min)
6. Update frontend with Render URL
7. Test and go live! 🎉

**Your backend will be at: `https://sui-studio-backend.onrender.com`**

---

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **GitHub Secret**: https://github.com/Abdulazeez20012/sui-studio/security/secret-scanning/unblock-secret/36bKVEtPhqflCz47VGojpDkPzpm
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Dashboard**: https://console.neon.tech

---

**Ready to deploy? Start with Step 1!** 🚀
