# ✅ Vercel + Render + Custom Domain Setup Checklist

## 🎯 Current Status
- ✅ Backend deployed to Render
- ✅ Frontend deployed to Vercel
- ✅ Custom domain: suistudio.live
- ❌ Frontend not connecting to backend (FIXING NOW)

---

## 📋 Step-by-Step Setup Guide

### 1️⃣ **Vercel Environment Variables** (CRITICAL)

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add ALL these variables:

```bash
VITE_API_URL=https://sui-studio.onrender.com
VITE_WS_URL=wss://sui-studio.onrender.com
VITE_GOOGLE_CLIENT_ID=46096349629-t087fo2e7o4qbkhi7baa9nemnisa0oqn.apps.googleusercontent.com
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_SUBSCRIPTION_PACKAGE_ID=0x0935baeeb59c29990f6328a8e72fd73fe8608fb01a3aa7520cf8db09760ed9f4
VITE_SUBSCRIPTION_TREASURY_ID=0x6505d6e2348dad25fc363f8325ebdabe708039ae1f929113da96395e94cf5e24
VITE_SUBSCRIPTION_PRICING_ID=0xcd15b458fce59a23a6b1e9183c07f447e83bd055d488c431ce873b3235900274
VITE_SUBSCRIPTION_CLOCK_ID=0x6
VITE_ENABLE_COLLABORATION=true
VITE_ENABLE_AI=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_VIDEO_CHAT=true
VITE_ENABLE_WALRUS=true
VITE_ENABLE_SUBSCRIPTIONS=true
VITE_ENABLE_EXTENSIONS=true
VITE_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
VITE_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
VITE_WALRUS_NETWORK=testnet
VITE_APP_VERSION=1.0.0
```

**Important:** 
- Select **Production**, **Preview**, AND **Development** for each variable
- Click **Save** after adding all variables
- Redeploy your project after adding variables

---

### 2️⃣ **Render Environment Variables** (CRITICAL)

Go to: https://dashboard.render.com → Your Service → Environment

Add/Update these variables:

```bash
DATABASE_URL=your-neon-database-url-here
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_MAX_TOKENS=4096
CORS_ORIGIN=https://suistudio.live,https://www.suistudio.live
FRONTEND_URL=https://suistudio.live
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this
NODE_ENV=production
PORT=3001
SUI_NETWORK=testnet
```

**Important:**
- Generate a secure JWT_SECRET (use: https://randomkeygen.com/)
- Click **Save Changes**
- Render will automatically redeploy

---

### 3️⃣ **Domain Configuration in Vercel**

1. Go to: https://vercel.com/dashboard → Your Project → Settings → Domains
2. Add your domain: `suistudio.live`
3. Add www subdomain: `www.suistudio.live`
4. Vercel will provide DNS records

---

### 4️⃣ **DNS Configuration (Your Domain Registrar)**

Go to your domain registrar (where you bought suistudio.live) and add these DNS records:

**For Vercel (Frontend):**

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Alternative (if Vercel provides different IPs):**
Check Vercel dashboard for the exact DNS records they provide.

---

### 5️⃣ **SSL/HTTPS Configuration**

Both Vercel and Render automatically provide SSL certificates:

- ✅ Vercel: Automatic SSL for custom domains
- ✅ Render: Automatic SSL for .onrender.com domains

**Wait 24-48 hours** for DNS propagation and SSL certificate issuance.

---

### 6️⃣ **Test Backend Connection**

Open browser console on https://suistudio.live and run:

```javascript
// Test API connection
fetch('https://sui-studio.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test WebSocket connection
const ws = new WebSocket('wss://sui-studio.onrender.com');
ws.onopen = () => console.log('WebSocket connected!');
ws.onerror = (e) => console.error('WebSocket error:', e);
```

Expected output:
```json
{
  "status": "ok",
  "timestamp": "2024-12-09T..."
}
```

---

### 7️⃣ **Redeploy Both Services**

After setting environment variables:

**Vercel:**
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache" = NO

**Render:**
1. Go to your service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Or it auto-deploys after env variable changes

---

### 8️⃣ **Verify Deployment**

Check these URLs:

1. **Frontend:** https://suistudio.live
   - Should load the landing page
   - Check browser console for errors

2. **Backend Health:** https://sui-studio.onrender.com/health
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Backend API:** https://sui-studio.onrender.com/api/
   - Should return: `{"error":"Route not found"}` (this is correct)

4. **CORS Test:** Open https://suistudio.live and check Network tab
   - API calls should succeed
   - No CORS errors in console

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" or "Network Error"

**Solution:**
1. Check if backend is running: https://sui-studio.onrender.com/health
2. Verify CORS_ORIGIN in Render includes your domain
3. Check browser console for specific error
4. Verify VITE_API_URL in Vercel matches Render URL

### Issue: "CORS policy blocked"

**Solution:**
1. Add your domain to CORS_ORIGIN in Render
2. Redeploy backend
3. Clear browser cache
4. Try in incognito mode

### Issue: "WebSocket connection failed"

**Solution:**
1. Verify VITE_WS_URL uses `wss://` (not `ws://`)
2. Check if Render service is running
3. Verify WebSocket endpoint: wss://sui-studio.onrender.com/ws

### Issue: "Environment variables not working"

**Solution:**
1. Verify variables are set for Production environment
2. Redeploy WITHOUT build cache
3. Check variable names start with `VITE_` for frontend
4. Wait 2-3 minutes after deployment

### Issue: DNS not resolving

**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Check DNS with: https://dnschecker.org
3. Verify DNS records in domain registrar
4. Clear DNS cache: `ipconfig /flushdns` (Windows)

---

## 🚀 Quick Commands

### Check if backend is accessible:
```bash
curl https://sui-studio.onrender.com/health
```

### Check DNS propagation:
```bash
nslookup suistudio.live
```

### Test CORS from command line:
```bash
curl -H "Origin: https://suistudio.live" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://sui-studio.onrender.com/health
```

---

## 📊 Expected Timeline

- **Environment Variables:** Immediate
- **Vercel Redeploy:** 2-5 minutes
- **Render Redeploy:** 5-10 minutes
- **DNS Propagation:** 1-48 hours
- **SSL Certificate:** 1-24 hours

---

## ✅ Final Checklist

- [ ] Added all environment variables to Vercel
- [ ] Added all environment variables to Render
- [ ] Updated CORS_ORIGIN in Render to include suistudio.live
- [ ] Configured DNS records at domain registrar
- [ ] Added custom domain in Vercel dashboard
- [ ] Redeployed frontend (Vercel)
- [ ] Redeployed backend (Render)
- [ ] Tested backend health endpoint
- [ ] Tested frontend loads correctly
- [ ] Verified no CORS errors in browser console
- [ ] Tested WebSocket connection
- [ ] Verified SSL certificates are active
- [ ] Tested API calls from frontend to backend

---

## 🆘 Still Having Issues?

1. **Check Render Logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for CORS or connection errors

2. **Check Vercel Logs:**
   - Go to Vercel dashboard → Deployments → Latest → View Function Logs
   - Look for build or runtime errors

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

4. **Test in Incognito Mode:**
   - Rules out caching issues
   - Fresh environment

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **CORS Guide:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Last Updated:** December 9, 2024  
**Status:** Ready for deployment ✅
