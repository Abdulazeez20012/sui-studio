# 🚀 Deploy to Render - Complete Guide

## Current Situation

- ✅ Railway deployment worked (but you don't want to use it)
- ❌ Render deployment failed (Sui CLI timeout)
- ✅ Dockerfile is fixed and working
- ⏳ Need to deploy to Render successfully

---

## 🎯 Deploy to Render (2 Options)

### Option 1: Use Fixed Dockerfile (RECOMMENDED)

The Dockerfile is now fixed and should work on Render.

**Steps:**

1. **Push to GitHub** (after fixing secret issue)
   ```bash
   # Follow FINAL_PUSH_GUIDE.md to allow secret and push
   ```

2. **Go to Render Dashboard**
   - https://dashboard.render.com

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `sui-studio` repo

4. **Configure Service**
   ```
   Name: sui-studio-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Docker
   Dockerfile Path: backend/Dockerfile
   ```

5. **Set Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=your-neon-database-url
   JWT_SECRET=your-jwt-secret-here
   ANTHROPIC_API_KEY=your-anthropic-key
   FRONTEND_URL=https://suistudio.live
   SUI_NETWORK=testnet
   ```

6. **Choose Plan**
   - Free tier: 512MB RAM, sleeps after 15min inactivity
   - Starter ($7/month): 512MB RAM, no sleep
   - **Recommended**: Starter plan (Sui CLI needs resources)

7. **Deploy**
   - Click "Create Web Service"
   - Wait 10-15 minutes for build

### Option 2: Use Simple Dockerfile (NO SUI CLI)

If you don't need real Move compilation, use the simple version:

**Steps:**

1. **Update Render Configuration**
   - In Render dashboard → Your service → Settings
   - Change Dockerfile Path to: `backend/Dockerfile.simple`

2. **Redeploy**
   - Click "Manual Deploy" → "Deploy latest commit"

**Note:** This skips Sui CLI installation but compilation will be simulated.

---

## 🔧 Why Render Failed Before

The original Dockerfile tried to compile Sui CLI from source:
- Takes 15-30 minutes
- Uses 4GB+ RAM
- Render free tier times out

**Fixed version:**
- Downloads pre-built binary
- Takes 2-3 minutes
- Uses minimal RAM
- Should work on Render

---

## 📝 After Successful Deployment

### 1. Get Your Render URL

After deployment succeeds:
- Go to Render dashboard
- Your service URL will be like: `https://sui-studio-backend.onrender.com`
- Copy this URL

### 2. Update Frontend Environment

**Local (.env.local):**
```env
VITE_API_URL=https://sui-studio-backend.onrender.com
VITE_WS_URL=wss://sui-studio-backend.onrender.com
```

**Vercel (Production):**
1. Go to https://vercel.com/dashboard
2. Your project → Settings → Environment Variables
3. Update:
   ```env
   VITE_API_URL=https://sui-studio-backend.onrender.com
   VITE_WS_URL=wss://sui-studio-backend.onrender.com
   ```
4. Redeploy

### 3. Test Backend

```bash
curl https://sui-studio-backend.onrender.com/health
```

Should return: `{"status":"ok"}`

---

## 🆘 If Render Build Still Fails

### Issue: Timeout During Sui CLI Download

**Solution:** Use Dockerfile.simple (no Sui CLI)

### Issue: Out of Memory

**Solution:** Upgrade to Starter plan ($7/month)

### Issue: Build Takes Too Long

**Solution:** 
1. Check Render build logs
2. If stuck on Sui CLI, use Dockerfile.simple
3. Or upgrade plan for more resources

---

## 💰 Render Pricing

| Plan | RAM | Price | Sleep | Best For |
|------|-----|-------|-------|----------|
| Free | 512MB | $0 | Yes (15min) | Testing |
| Starter | 512MB | $7/mo | No | Production |
| Standard | 2GB | $25/mo | No | Heavy use |

**Recommendation:** Start with Starter plan for production

---

## 🔄 Render vs Railway Comparison

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | 512MB, sleeps | $5 credit/month |
| Pricing | $7/mo starter | Usage-based |
| Build Time | Slower | Faster |
| Ease of Use | Very easy | Very easy |
| Docker Support | ✅ Yes | ✅ Yes |
| Auto-deploy | ✅ Yes | ✅ Yes |

**Both are good choices!** Render is more predictable pricing.

---

## 📚 Complete Deployment Checklist

### Pre-Deployment
- [ ] Fix git secret issue (allow secret on GitHub)
- [ ] Push code to GitHub
- [ ] Have Neon database URL ready
- [ ] Have Anthropic API key ready

### Render Setup
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Configure with Docker
- [ ] Set environment variables
- [ ] Choose plan (Starter recommended)
- [ ] Deploy

### Post-Deployment
- [ ] Wait for build to complete (10-15 min)
- [ ] Test backend health endpoint
- [ ] Copy Render URL
- [ ] Update frontend .env.local
- [ ] Update Vercel environment variables
- [ ] Redeploy frontend on Vercel
- [ ] Test full stack at suistudio.live

---

## 🎯 Quick Commands

```bash
# 1. Allow secret and push to GitHub
# (Follow FINAL_PUSH_GUIDE.md)

# 2. Go to Render dashboard
# https://dashboard.render.com

# 3. Create Web Service with:
# - Runtime: Docker
# - Dockerfile: backend/Dockerfile
# - Environment variables (see above)

# 4. After deployment, test:
curl https://sui-studio-backend.onrender.com/health

# 5. Update frontend and redeploy
```

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **Your Repo**: https://github.com/Abdulazeez20012/sui-studio
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**The fixed Dockerfile should work on Render now. Just push to GitHub and deploy!** 🚀
