# 🎯 Quick Reference Card: suistudio.live Setup

## 📋 Checklist (Do These Now!)

### ✅ Vercel Setup
1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables
2. Add 20 variables from `.env.production` file
3. Select: Production + Preview + Development for each
4. Redeploy WITHOUT cache

### ✅ Render Setup
1. Go to: https://dashboard.render.com → Your Service → Environment
2. Add 3 critical variables:
   - `CORS_ORIGIN=https://suistudio.live,https://www.suistudio.live`
   - `FRONTEND_URL=https://suistudio.live`
   - `JWT_SECRET=your-secure-random-string-32-chars`
3. Save (auto-redeploys)

### ✅ Push Code
```bash
git add .
git commit -m "Fix: CORS and domain configuration"
git push origin main
```

### ✅ Test
```bash
# Backend health
curl https://sui-studio.onrender.com/health

# Frontend
Open: https://suistudio.live
Press F12 → Check Console (no errors)
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | https://suistudio.live | Your live website |
| **Backend** | https://sui-studio.onrender.com | API server |
| **Backend Health** | https://sui-studio.onrender.com/health | Health check |
| **Vercel Dashboard** | https://vercel.com/dashboard | Frontend config |
| **Render Dashboard** | https://dashboard.render.com | Backend config |

---

## 🔑 Critical Environment Variables

### Vercel (Frontend)
```bash
VITE_API_URL=https://sui-studio.onrender.com
VITE_WS_URL=wss://sui-studio.onrender.com
```

### Render (Backend)
```bash
CORS_ORIGIN=https://suistudio.live,https://www.suistudio.live
FRONTEND_URL=https://suistudio.live
JWT_SECRET=your-secure-random-string
```

---

## 🧪 Quick Tests

### Test 1: Backend Health
```bash
curl https://sui-studio.onrender.com/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test 2: CORS
```bash
curl -H "Origin: https://suistudio.live" \
     -X OPTIONS \
     https://sui-studio.onrender.com/health
# Expected: Access-Control-Allow-Origin header present
```

### Test 3: Frontend
1. Open: https://suistudio.live
2. F12 → Console tab
3. Should see: NO red CORS errors

---

## 🚨 Common Errors & Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| **CORS blocked** | Add domain to CORS_ORIGIN in Render |
| **Failed to fetch** | Check VITE_API_URL in Vercel |
| **502 Bad Gateway** | Wait 60s (backend starting) |
| **WebSocket failed** | Use `wss://` not `ws://` |
| **Env vars not working** | Redeploy WITHOUT cache |

---

## ⏱️ Timeline

| Task | Time |
|------|------|
| Add Vercel env vars | 5 min |
| Add Render env vars | 3 min |
| Push code | 1 min |
| Vercel redeploy | 2-3 min |
| Render redeploy | 5-7 min |
| **Total** | **~15 min** |

---

## 📱 Quick Commands

```bash
# Check backend
curl https://sui-studio.onrender.com/health

# Check DNS
nslookup suistudio.live

# Test WebSocket
wscat -c wss://sui-studio.onrender.com/ws

# Clear browser cache
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
```

---

## 📚 Full Documentation

- **Quick Fix:** `QUICK_DOMAIN_FIX.md`
- **Complete Guide:** `VERCEL_RENDER_SETUP_CHECKLIST.md`
- **Architecture:** `DEPLOYMENT_ARCHITECTURE_DIAGRAM.md`
- **Summary:** `DOMAIN_CONNECTION_FIXED.md`

---

## ✅ Success Indicators

- [ ] Backend health returns `{"status":"ok"}`
- [ ] Frontend loads at https://suistudio.live
- [ ] No CORS errors in console
- [ ] API calls succeed (Network tab)
- [ ] Can create and compile projects

---

**Print this card and keep it handy!** 📌
