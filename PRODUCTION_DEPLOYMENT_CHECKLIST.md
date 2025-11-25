# 🚀 Production Deployment Checklist

## Complete Configuration Guide for Vercel + Render

---

## ✅ Step-by-Step Configuration

### 1️⃣ Render Backend Configuration

**Your Render Backend URL**: `https://your-backend-name.onrender.com`

#### Environment Variables (Render Dashboard)

Go to: Render Dashboard → Your Service → Environment

Add these variables:

```env
NODE_ENV=production

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres

JWT_SECRET=generate-random-secret-here

PORT=3001

FRONTEND_URL=https://your-app.vercel.app

SUI_NETWORK=testnet

SUI_RPC_URL=https://fullnode.testnet.sui.io:443

RATE_LIMIT_WINDOW_MS=900000

RATE_LIMIT_MAX_REQUESTS=100
```

**Important Notes**:
- Replace `DATABASE_URL` with your Supabase connection string
- Replace `JWT_SECRET` with a random string (use: https://randomkeygen.com/)
- Replace `FRONTEND_URL` with your actual Vercel URL (no trailing slash)

#### Build Settings (Render Dashboard)

```
Build Command: npm run build
Start Command: npm start
Root Directory: backend
```

---

### 2️⃣ Vercel Frontend Configuration

**Your Vercel URL**: `https://your-app.vercel.app`

#### Environment Variables (Vercel Dashboard)

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables for **Production, Preview, and Development**:

```env
VITE_GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com

VITE_API_URL=https://your-backend-name.onrender.com

VITE_SUI_NETWORK=testnet

VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

**Important Notes**:
- Replace `VITE_API_URL` with your actual Render backend URL
- No trailing slash on URLs
- Make sure to add for all environments (Production, Preview, Development)

#### After Adding Variables

Click "Redeploy" to apply the new environment variables.

---

### 3️⃣ Google OAuth Configuration

Go to: https://console.cloud.google.com/apis/credentials

#### Find Your OAuth Client

Client ID: `46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn`

Click on it to edit.

#### Authorized JavaScript Origins

Add these URLs (one per line):

```
http://localhost:5173
http://localhost:3000
https://your-app.vercel.app
```

#### Authorized Redirect URIs

Add these URLs (one per line):

```
http://localhost:5173
http://localhost:3000
https://your-app.vercel.app
```

**Important**: Replace `your-app.vercel.app` with your actual Vercel domain.

Click **Save** and wait 5 minutes for changes to propagate.

---

### 4️⃣ Database Setup (Supabase)

If you haven't already:

1. Go to: https://supabase.com
2. Create a new project
3. Get your connection string from: Project Settings → Database
4. Run migrations on Render:
   - Go to Render Shell
   - Run: `npx prisma migrate deploy`

---

## 🔍 Verification Steps

### Test Backend Health

Visit in browser:
```
https://your-backend-name.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Click "Sign In"
3. Try Google OAuth
4. Create a new project
5. Check browser console for errors

### Test Backend Connection

Open browser console on your frontend and run:
```javascript
fetch('https://your-backend-name.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
```

Should log: `{status: "ok", timestamp: "..."}`

---

## 🐛 Common Issues & Fixes

### Issue 1: Google OAuth Error "invalid_client"

**Cause**: Production URL not in Google Console

**Fix**:
1. Add your Vercel URL to Google Console authorized origins
2. Wait 5 minutes
3. Clear browser cache
4. Try again

### Issue 2: CORS Error

**Cause**: Backend doesn't allow frontend origin

**Fix**:
1. Check `FRONTEND_URL` in Render environment variables
2. Make sure it matches your Vercel URL exactly
3. No trailing slash
4. Redeploy backend

### Issue 3: API Calls Fail

**Cause**: Wrong API URL in frontend

**Fix**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Make sure it matches your Render URL exactly
3. Redeploy frontend

### Issue 4: Backend Cold Start (Slow First Request)

**Cause**: Render free tier spins down after 15 min

**Fix**: This is normal on free tier
- First request takes 30-60 seconds
- Subsequent requests are fast
- Upgrade to paid tier ($7/month) to avoid cold starts

### Issue 5: Database Connection Failed

**Cause**: Wrong DATABASE_URL

**Fix**:
1. Get fresh connection string from Supabase
2. Make sure password is correct
3. Update in Render environment variables
4. Redeploy

---

## 📋 Quick Reference

### Your URLs

```
Frontend:  https://your-app.vercel.app
Backend:   https://your-backend-name.onrender.com
Database:  Supabase (via connection string)
```

### Important Commands

**Redeploy Frontend (Vercel)**:
```bash
vercel --prod
```

**Redeploy Backend (Render)**:
- Push to GitHub (auto-deploys)
- Or: Manual Deploy button in Render dashboard

**Run Database Migrations (Render Shell)**:
```bash
npx prisma migrate deploy
```

**View Backend Logs**:
- Render Dashboard → Your Service → Logs

---

## ✅ Final Checklist

Before going live, verify:

- [ ] Render backend is deployed and healthy
- [ ] Vercel frontend is deployed
- [ ] All environment variables are set correctly
- [ ] Google OAuth origins include production URL
- [ ] Database migrations are run
- [ ] Backend health endpoint returns 200
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Google sign-in works on production
- [ ] Can create and save projects
- [ ] No console errors on frontend

---

## 🎯 Testing Checklist

Test these features on production:

- [ ] Landing page loads
- [ ] Sign in with Google works
- [ ] Sign in with email works (if implemented)
- [ ] IDE loads after sign in
- [ ] Can create new project
- [ ] Can write code in editor
- [ ] Syntax highlighting works
- [ ] IntelliSense works
- [ ] Can save files
- [ ] File explorer works
- [ ] Terminal shows output
- [ ] Settings panel works
- [ ] Can sign out

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Google OAuth**: https://console.cloud.google.com/apis/credentials

---

## 🚀 You're Ready!

Once all checkboxes are complete, your app is production-ready and fully connected!

**Total Setup Time**: ~30 minutes
**Total Cost**: $0/month (free tiers)

---

**Need help?** Check the troubleshooting section above or review the logs in Render/Vercel dashboards.
