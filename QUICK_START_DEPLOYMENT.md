# ⚡ Quick Start - Deploy in 15 Minutes

**Current Status**: Code pushed ✅ | Backend live ✅ | Frontend building 🔄

---

## 🚀 3 Simple Steps

### 1️⃣ Configure Render (5 min)

**Go to**: https://dashboard.render.com → Your Service → Environment

**Add 4 variables** (copy from `backend/.env.local`):

| Variable | Get From |
|----------|----------|
| `DATABASE_URL` | Line 6 in `backend/.env.local` |
| `JWT_SECRET` | Line 12 in `backend/.env.local` |
| `OPENAI_API_KEY` | Line 30 in `backend/.env.local` |
| `NODE_ENV` | Type: `production` |

**Click Save** → Render auto-redeploys (3 min)

---

### 2️⃣ Configure Vercel (3 min)

**Go to**: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Add 2 variables**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://sui-studio.onrender.com` |
| `VITE_WS_URL` | `wss://sui-studio.onrender.com` |

**Then**: Deployments → ... → Redeploy (2 min)

---

### 3️⃣ Test (2 min)

```bash
# Backend
curl https://sui-studio.onrender.com/health

# Frontend
# Visit your Vercel URL
```

---

## ✅ Done!

Your full stack Sui Studio is now live! 🎉

---

## 📱 Quick Links

- **Backend**: https://sui-studio.onrender.com
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Secrets**: `backend/.env.local`

---

## 🆘 Need Help?

Check these files:
- `DEPLOYMENT_SUCCESS.md` - Detailed status
- `TODAY_SESSION_COMPLETE.md` - Full summary
- `SECURE_PUSH_GUIDE.md` - Security tips

---

**Time**: 15 minutes  
**Difficulty**: Easy  
**Status**: Almost there! 🚀
