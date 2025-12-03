# 🏗️ Deployment Architecture

Visual guide to your production deployment setup.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                               │
│                    (Web Browsers)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                        │
│              https://your-app.vercel.app                    │
├─────────────────────────────────────────────────────────────┤
│  • React + TypeScript + Vite                                │
│  • Static Site Hosting                                      │
│  • Automatic HTTPS/SSL                                      │
│  • Global CDN                                               │
│  • Environment Variables:                                   │
│    - VITE_API_URL                                          │
│    - VITE_GOOGLE_CLIENT_ID                                 │
│    - VITE_SUI_NETWORK                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API + WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDER (Backend)                         │
│         https://sui-studio-backend.onrender.com             │
├─────────────────────────────────────────────────────────────┤
│  • Node.js + Express + TypeScript                           │
│  • RESTful API                                              │
│  • WebSocket Server (Collaboration)                         │
│  • JWT Authentication                                       │
│  • Environment Variables:                                   │
│    - DATABASE_URL                                           │
│    - OPENAI_API_KEY                                         │
│    - JWT_SECRET                                             │
│    - FRONTEND_URL                                           │
└────────┬──────────────┬──────────────┬──────────────────────┘
         │              │              │
         │              │              │
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   NEON DB    │ │   OpenAI     │ │  Sui Network │
│  (Postgres)  │ │     API      │ │   (Testnet)  │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ • Users      │ │ • GPT-4      │ │ • RPC        │
│ • Projects   │ │ • Chat       │ │ • Deploy     │
│ • AI Chats   │ │ • Code Gen   │ │ • Query      │
│ • Extensions │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Data Flow

### 1. User Authentication

```
User → Vercel → Google OAuth → Vercel
                      ↓
                 JWT Token
                      ↓
              localStorage
                      ↓
         All API requests include token
```

### 2. NEXI AI Chat

```
User types message
       ↓
Vercel Frontend
       ↓
POST /api/ai/chat (with JWT)
       ↓
Render Backend
       ↓
OpenAI API (GPT-4)
       ↓
Response saved to Neon DB
       ↓
Response sent to Frontend
       ↓
Displayed to User
```

### 3. Code Compilation

```
User writes code
       ↓
Vercel Frontend
       ↓
POST /api/compile (with JWT)
       ↓
Render Backend
       ↓
Sui CLI (compile Move code)
       ↓
Bytecode + Errors
       ↓
Response to Frontend
       ↓
Displayed to User
```

### 4. Contract Deployment

```
User clicks Deploy
       ↓
Vercel Frontend
       ↓
POST /api/deploy (with JWT)
       ↓
Render Backend
       ↓
Sui Network (publish package)
       ↓
Transaction Digest
       ↓
Saved to Neon DB
       ↓
Response to Frontend
       ↓
Displayed to User
```

## Environment Configuration

### Development (Local)

```
┌─────────────────┐
│   Frontend      │
│   localhost:    │
│   5173          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │
│   localhost:    │
│   3001          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│   Supabase/     │
│   Neon          │
└─────────────────┘
```

**Frontend .env.local:**
```bash
VITE_API_URL=http://localhost:3001
```

**Backend .env.local:**
```bash
DATABASE_URL=postgresql://localhost...
OPENAI_API_KEY=sk-proj-...
```

### Production (Deployed)

```
┌─────────────────┐
│   Vercel        │
│   your-app.     │
│   vercel.app    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Render        │
│   sui-studio-   │
│   backend.      │
│   onrender.com  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Neon          │
│   ep-name.      │
│   neon.tech     │
└─────────────────┘
```

**Vercel Environment:**
```bash
VITE_API_URL=https://sui-studio-backend.onrender.com
```

**Render Environment:**
```bash
DATABASE_URL=postgresql://ep-name.neon.tech...
FRONTEND_URL=https://your-app.vercel.app
```

## Security Architecture

### Authentication Flow

```
1. User clicks "Sign In"
   ↓
2. Redirect to Google OAuth
   ↓
3. User authorizes
   ↓
4. Google returns auth code
   ↓
5. Backend validates with Google
   ↓
6. Backend creates JWT token
   ↓
7. Token stored in localStorage
   ↓
8. All API requests include:
   Authorization: Bearer <token>
```

### API Security

```
Request → HTTPS → Vercel
              ↓
         CORS Check
              ↓
         JWT Validation
              ↓
         Rate Limiting
              ↓
         Process Request
              ↓
         Response
```

### Environment Variables

```
┌─────────────────────────────────────┐
│   Secrets (Never in Code)           │
├─────────────────────────────────────┤
│  • DATABASE_URL                     │
│  • OPENAI_API_KEY                   │
│  • JWT_SECRET                       │
│  • GOOGLE_CLIENT_SECRET             │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Platform Environment Variables    │
├─────────────────────────────────────┤
│  • Render: Environment tab          │
│  • Vercel: Environment Variables    │
│  • Encrypted at rest                │
│  • Injected at runtime              │
└─────────────────────────────────────┘
```

## Scaling Strategy

### Current Setup (Free Tier)

```
Vercel:  100 GB bandwidth/month
Render:  512 MB RAM, sleeps after 15 min
Neon:    0.5 GB storage, 3 GB transfer
OpenAI:  Pay per use

Good for: Development, testing, demos
Cost:    $0-50/month (mostly OpenAI)
```

### Production Setup (Paid Tier)

```
Vercel:  1 TB bandwidth/month ($20)
Render:  512 MB RAM, no sleep ($7)
Neon:    10 GB storage ($19)
OpenAI:  Pay per use ($50-200)

Good for: Production apps, 1000+ users
Cost:    $96-246/month
```

### High-Scale Setup

```
Vercel:  Pro plan ($20)
Render:  Standard 2GB RAM ($25)
Neon:    Scale plan ($69)
OpenAI:  Enterprise ($500+)
CDN:     Cloudflare Pro ($20)

Good for: 10,000+ users
Cost:    $634+/month
```

## Monitoring & Logging

### Vercel

```
Dashboard → Analytics
  • Page views
  • Unique visitors
  • Performance metrics
  • Error tracking

Dashboard → Deployments → Logs
  • Build logs
  • Runtime logs
  • Function logs
```

### Render

```
Dashboard → Logs
  • Application logs
  • System logs
  • Error tracking
  • Performance metrics

Dashboard → Metrics
  • CPU usage
  • Memory usage
  • Request count
  • Response time
```

### Database (Neon)

```
Dashboard → Monitoring
  • Query performance
  • Connection count
  • Storage usage
  • Data transfer

Dashboard → Branches
  • Main (production)
  • Dev (development)
  • Staging (testing)
```

## Backup & Recovery

### Database Backups

```
Neon:
  • Automatic point-in-time recovery
  • 7-day retention (free tier)
  • 30-day retention (paid tier)
  • Manual snapshots available
```

### Code Backups

```
GitHub:
  • All code in version control
  • Automatic on every commit
  • Infinite retention
  • Easy rollback
```

### Deployment Rollback

```
Vercel:
  • Instant rollback to previous deployment
  • One-click in dashboard
  • No downtime

Render:
  • Redeploy previous commit
  • Manual process
  • ~5 minute downtime
```

## Performance Optimization

### Frontend (Vercel)

```
✅ Global CDN (automatic)
✅ Automatic compression
✅ Edge caching
✅ HTTP/2 & HTTP/3
✅ Image optimization
```

### Backend (Render)

```
✅ Connection pooling (Prisma)
✅ Database query optimization
✅ Response caching
✅ Rate limiting
✅ Compression middleware
```

### Database (Neon)

```
✅ Serverless (scales to zero)
✅ Connection pooling (pgBouncer)
✅ Query optimization
✅ Automatic indexing
✅ Read replicas (paid tier)
```

## Cost Optimization

### Reduce OpenAI Costs

```
1. Use GPT-3.5 Turbo (10x cheaper)
   OPENAI_MODEL=gpt-3.5-turbo

2. Reduce max tokens
   OPENAI_MAX_TOKENS=1000

3. Cache common responses
   Implement Redis caching

4. Rate limit users
   Max 50 requests per 15 min
```

### Reduce Hosting Costs

```
1. Use free tiers for development
   Vercel: Free
   Render: Free (with sleep)
   Neon: Free

2. Optimize images
   Compress, WebP format

3. Minimize API calls
   Cache responses
   Batch requests

4. Use CDN
   Vercel includes CDN
```

## Disaster Recovery

### Scenario 1: Database Failure

```
1. Neon has automatic backups
2. Restore from point-in-time
3. Update DATABASE_URL
4. Redeploy backend
5. Downtime: ~10 minutes
```

### Scenario 2: Backend Failure

```
1. Check Render logs
2. Fix issue in code
3. Push to GitHub
4. Render auto-deploys
5. Downtime: ~5 minutes
```

### Scenario 3: Frontend Failure

```
1. Check Vercel logs
2. Rollback to previous deployment
3. Or fix and redeploy
4. Downtime: ~1 minute
```

## Deployment Checklist

### Pre-Deployment
- [ ] Code tested locally
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] API keys obtained
- [ ] Google OAuth configured

### Backend (Render)
- [ ] Service created
- [ ] Environment variables set
- [ ] Build command configured
- [ ] Start command configured
- [ ] Database migrations run
- [ ] Health endpoint tested

### Frontend (Vercel)
- [ ] Project imported
- [ ] Environment variables set
- [ ] Build command configured
- [ ] Output directory set
- [ ] Custom domain configured (optional)
- [ ] Google OAuth updated

### Post-Deployment
- [ ] Health checks passing
- [ ] Authentication working
- [ ] NEXI AI responding
- [ ] Code editor functional
- [ ] Compilation working
- [ ] Deployment working
- [ ] Monitoring enabled
- [ ] Alerts configured

---

**Status:** Production architecture documented! 🚀
