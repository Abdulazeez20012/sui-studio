# 🗄️ Database Options for Sui Studio

You have several great options for your Postgres database. Here's a comparison:

## Quick Comparison

| Feature | Neon | Supabase | Railway | Render |
|---------|------|----------|---------|--------|
| **Type** | Serverless Postgres | Full Backend | Platform | Platform |
| **Free Tier** | 0.5 GB | 500 MB | $5 credit | 90 days free |
| **Branching** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Auto-scale** | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| **Connection Pooling** | ✅ Built-in | ✅ Built-in | ✅ Yes | ✅ Yes |
| **Setup Time** | 2 min | 3 min | 3 min | 5 min |
| **Best For** | Database only | Full backend | All-in-one | Simple apps |

## Option 1: Neon (Recommended) ⭐

### Pros
✅ **Serverless** - Scales to zero, pay only for usage
✅ **Instant Branching** - Create dev/staging copies instantly
✅ **Fast Setup** - 2 minutes to production
✅ **Generous Free Tier** - 0.5 GB storage, 3 GB transfer
✅ **Built for Postgres** - Optimized for performance
✅ **Connection Pooling** - Built-in pgBouncer

### Cons
❌ Database only (no auth, storage, realtime)
❌ Smaller free tier than Supabase

### Setup
```bash
# 1. Create account at https://neon.tech
# 2. Get connection string
# 3. Update .env.local
DATABASE_URL="postgresql://neondb_owner:password@ep-name.region.aws.neon.tech/neondb?sslmode=require"

# 4. Push schema
npx prisma db push
```

### Best For
- Database-focused projects
- Need branching for dev/staging
- Want serverless auto-scaling
- Prefer Postgres-native features

**Guide:** See `NEON_DATABASE_SETUP.md`

## Option 2: Supabase (Current)

### Pros
✅ **Full Backend** - Database + Auth + Storage + Realtime
✅ **Larger Free Tier** - 500 MB storage (vs Neon's 0.5 GB)
✅ **Built-in Auth** - OAuth, magic links, etc.
✅ **Realtime** - WebSocket subscriptions
✅ **Storage** - File uploads built-in

### Cons
❌ Not serverless (always running)
❌ No database branching
❌ More complex than needed if only using database

### Setup
Already configured! Your current setup:
```bash
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
```

### Best For
- Need full backend features
- Want built-in auth
- Need file storage
- Want realtime subscriptions

**Current Status:** ✅ Already working

## Option 3: Railway

### Pros
✅ **All-in-one** - Database + Backend + Frontend
✅ **Simple Deployment** - Git push to deploy
✅ **Good Free Tier** - $5 credit/month
✅ **Auto-scaling** - Scales with usage

### Cons
❌ Credit-based (not truly free)
❌ More expensive than others
❌ Overkill for just database

### Setup
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and create project
railway login
railway init

# 3. Add Postgres
railway add postgres

# 4. Get connection string
railway variables
```

### Best For
- Full-stack deployment
- Need backend + database + frontend
- Want simple Git-based deployment

## Option 4: Render

### Pros
✅ **Free Tier** - 90 days free Postgres
✅ **Simple Setup** - Easy dashboard
✅ **Auto-backups** - Daily backups included
✅ **Good Performance** - Fast database

### Cons
❌ Limited free tier (90 days)
❌ Slower cold starts
❌ Less features than others

### Setup
```bash
# 1. Create account at https://render.com
# 2. Create Postgres database
# 3. Get connection string
# 4. Update .env.local
DATABASE_URL="postgresql://user:password@host.render.com/database"
```

### Best For
- Simple projects
- Need temporary database
- Want easy setup

## Recommendation by Use Case

### 🏆 For Sui Studio (Recommended)

**Use Neon if:**
- You only need database
- Want serverless auto-scaling
- Need dev/staging branches
- Prefer modern Postgres features

**Use Supabase if:**
- You want full backend features
- Need built-in auth
- Want file storage
- Need realtime subscriptions

### 💡 Our Recommendation: Neon

**Why?**
1. **Serverless** - Scales to zero, saves money
2. **Branching** - Instant dev/staging environments
3. **Fast** - Optimized for Postgres
4. **Simple** - Just database, no extras
5. **Free Tier** - Generous for development

**Your current backend already handles:**
- ✅ Auth (JWT + Google OAuth)
- ✅ AI (OpenAI integration)
- ✅ File operations
- ✅ WebSocket (collaboration)

So you only need database → **Neon is perfect!**

## Migration Guide

### From Supabase to Neon

```bash
# 1. Export data from Supabase
pg_dump "postgresql://postgres:password@db.supabase.co:5432/postgres" > backup.sql

# 2. Create Neon database
# Visit https://neon.tech and create project

# 3. Import to Neon
psql "postgresql://neondb_owner:password@ep-name.neon.tech/neondb?sslmode=require" < backup.sql

# 4. Update .env.local
DATABASE_URL="postgresql://neondb_owner:password@ep-name.neon.tech/neondb?sslmode=require"

# 5. Test connection
npx prisma studio
```

### Keep Both (Recommended for Testing)

```bash
# Development: Use Neon
DATABASE_URL="postgresql://neondb_owner:password@ep-name.neon.tech/neondb?sslmode=require"

# Production: Keep Supabase
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
```

## Cost Comparison

### Free Tier
| Provider | Storage | Transfer | Duration |
|----------|---------|----------|----------|
| **Neon** | 0.5 GB | 3 GB/mo | Forever |
| **Supabase** | 500 MB | 2 GB/mo | Forever |
| **Railway** | $5 credit | Unlimited | Monthly |
| **Render** | 1 GB | Unlimited | 90 days |

### Paid Plans (Starting)
| Provider | Price | Storage | Features |
|----------|-------|---------|----------|
| **Neon** | $19/mo | 10 GB | Branching, auto-scale |
| **Supabase** | $25/mo | 8 GB | Auth, storage, realtime |
| **Railway** | $5/mo | 1 GB | Full platform |
| **Render** | $7/mo | 1 GB | Backups, scaling |

## Setup Scripts

We've created setup scripts for easy migration:

### Neon
```bash
cd backend
./setup-neon.sh    # Mac/Linux
setup-neon.bat     # Windows
```

### Test Connection
```bash
cd backend
npx prisma studio
```

## Performance Comparison

### Query Speed (avg)
- **Neon**: ~10-20ms (serverless)
- **Supabase**: ~5-15ms (always-on)
- **Railway**: ~15-25ms
- **Render**: ~20-30ms

### Cold Start
- **Neon**: ~100-200ms (serverless)
- **Supabase**: 0ms (always-on)
- **Railway**: ~50-100ms
- **Render**: ~200-300ms

## Decision Matrix

### Choose Neon if:
- ✅ You want serverless
- ✅ You need branching
- ✅ You only need database
- ✅ You want modern features

### Choose Supabase if:
- ✅ You want full backend
- ✅ You need built-in auth
- ✅ You want file storage
- ✅ You need realtime

### Choose Railway if:
- ✅ You want all-in-one
- ✅ You need simple deployment
- ✅ You want Git-based workflow

### Choose Render if:
- ✅ You want simple setup
- ✅ You need temporary database
- ✅ You prefer traditional hosting

## Our Final Recommendation

### For Sui Studio: **Neon** 🏆

**Reasons:**
1. Your backend already handles auth, AI, files
2. You only need database
3. Serverless saves money
4. Branching is perfect for dev/staging
5. Free tier is generous
6. Modern Postgres features

**Setup Time:** 2 minutes
**Cost:** Free for development
**Complexity:** Low

---

**Ready to switch?** See `NEON_DATABASE_SETUP.md` for full guide!
