# ✅ Render Deployment Checklist

## Backend Deployment to Render

### Pre-Deployment
- [x] Updated @mysten/sui to v1.14.0
- [x] Fixed deprecated SDK imports
- [x] TypeScript compiles without errors
- [x] Local build successful

### Deployment Steps

#### 1. Commit and Push Changes
```bash
git add backend/package.json backend/src/routes/deploy.ts backend/src/routes/sui.ts
git commit -m "fix: update backend to @mysten/sui v1.14.0"
git push origin main
```

#### 2. Configure Render Service

**Service Type**: Web Service  
**Build Command**: `npm run build`  
**Start Command**: `npm start`  
**Environment**: Node  

#### 3. Set Environment Variables

Required variables in Render dashboard:

```env
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3001
```

Optional variables:
```env
OPENAI_API_KEY=sk-...
CORS_ORIGIN=https://your-frontend.vercel.app
```

#### 4. Deploy

1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Or push to trigger auto-deploy

#### 5. Monitor Build

Watch for these stages:
- ✅ Installing system dependencies
- ✅ Installing Rust
- ✅ Compiling Sui CLI (~10-15 min)
- ✅ Installing npm packages
- ✅ Generating Prisma client
- ✅ Building TypeScript
- ✅ Starting server

#### 6. Verify Deployment

Test endpoints:
```bash
# Health check
curl https://your-backend.onrender.com/health

# Network info
curl https://your-backend.onrender.com/api/sui/network/testnet

# Gas price
curl https://your-backend.onrender.com/api/sui/gas-price/testnet
```

---

## Frontend Deployment to Vercel

### Pre-Deployment
- [x] Backend URL configured
- [x] Environment variables set
- [x] Build successful locally

### Deployment Steps

#### 1. Update Environment Variables

In Vercel dashboard, set:
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com
```

#### 2. Deploy

```bash
# From root directory
npm run build
vercel --prod
```

Or push to trigger auto-deploy.

#### 3. Verify

Visit your frontend URL and test:
- Landing page loads
- IDE opens
- Backend connection works
- Wallet connects

---

## Troubleshooting

### Backend Build Fails

**Issue**: TypeScript errors
```bash
# Check locally first
cd backend
npm install
npx tsc --noEmit
```

**Issue**: Sui CLI compilation fails
- Check Render logs for Rust errors
- Ensure Dockerfile has correct dependencies

**Issue**: Prisma errors
- Verify DATABASE_URL is set
- Check database is accessible from Render

### Frontend Build Fails

**Issue**: Module not found
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Issue**: Environment variables
- Check Vercel dashboard settings
- Ensure all VITE_ prefixed vars are set

### Runtime Errors

**Issue**: CORS errors
- Set CORS_ORIGIN in backend env vars
- Check frontend URL matches

**Issue**: 502 Bad Gateway
- Backend might be starting up (wait 30s)
- Check backend logs in Render

**Issue**: Database connection
- Verify DATABASE_URL format
- Check Neon database is active

---

## Post-Deployment

### Monitor

1. **Backend Health**
   - Check Render metrics
   - Monitor error logs
   - Set up alerts

2. **Frontend Performance**
   - Check Vercel analytics
   - Monitor Core Web Vitals
   - Review error tracking

3. **Database**
   - Monitor Neon dashboard
   - Check connection pool
   - Review query performance

### Update DNS (Optional)

If using custom domain:

**Backend**:
1. Add CNAME record: `api.yourdomain.com` → `your-backend.onrender.com`
2. Update in Render settings

**Frontend**:
1. Add domain in Vercel
2. Update DNS records as instructed

---

## Quick Commands

### Backend
```bash
# Local dev
cd backend
npm run dev

# Build
npm run build

# Test
npm test

# Database
npm run prisma:migrate
npm run prisma:studio
```

### Frontend
```bash
# Local dev
npm run dev

# Build
npm run build

# Preview
npm run preview
```

---

## Status

- [x] Backend SDK updated
- [x] TypeScript errors fixed
- [x] Local build successful
- [ ] Deployed to Render
- [ ] Frontend connected
- [ ] Production tested

---

**Ready to Deploy**: YES ✅  
**Estimated Deploy Time**: 15-20 minutes (first time)  
**Date**: December 6, 2025
