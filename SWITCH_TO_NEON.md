# 🚀 Switch to Neon - Complete Guide

Yes, you can absolutely use Neon! It's actually recommended for Sui Studio.

## Why Switch to Neon?

### Current Setup (Supabase)
- ✅ Works great
- ❌ Not serverless (always running)
- ❌ No database branching
- ❌ Paying for features you don't use (auth, storage, realtime)

### With Neon
- ✅ Serverless (scales to zero)
- ✅ Instant database branching
- ✅ Just database (your backend handles the rest)
- ✅ Free tier: 0.5 GB storage, 3 GB transfer
- ✅ Built-in connection pooling

## Quick Setup (2 Minutes)

### Step 1: Create Neon Account
```
1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Create new project
4. Copy connection string
```

### Step 2: Update Environment
```bash
# Edit backend/.env.local
DATABASE_URL="postgresql://neondb_owner:your-password@ep-your-endpoint.region.aws.neon.tech/neondb?sslmode=require"
```

### Step 3: Push Schema
```bash
cd backend
npx prisma db push
npm run dev
```

Done! ✅

## Automated Setup

**Windows:**
```bash
cd backend
setup-neon.bat
```

**Mac/Linux:**
```bash
cd backend
chmod +x setup-neon.sh
./setup-neon.sh
```

## What You Get

### Neon Features
- **Serverless Postgres** - Auto-scales, pay only for usage
- **Instant Branching** - Create dev/staging copies in seconds
- **Connection Pooling** - Built-in pgBouncer
- **Point-in-Time Recovery** - Automatic backups
- **SQL Editor** - Run queries in browser
- **Monitoring** - Query performance, storage usage

### Your Backend Still Handles
- ✅ Authentication (JWT + Google OAuth)
- ✅ AI (OpenAI integration)
- ✅ File operations
- ✅ WebSocket (collaboration)
- ✅ Business logic

Perfect separation of concerns!

## Migration from Supabase

### Option 1: Fresh Start (Recommended)
```bash
# 1. Create Neon database
# 2. Update DATABASE_URL in .env.local
# 3. Push schema
npx prisma db push

# 4. Seed data
npm run seed
```

### Option 2: Migrate Data
```bash
# 1. Export from Supabase
pg_dump "your-supabase-url" > backup.sql

# 2. Import to Neon
psql "your-neon-url" < backup.sql

# 3. Update .env.local
DATABASE_URL="your-neon-url"
```

### Option 3: Keep Both
```bash
# Development: Neon
DATABASE_URL="postgresql://neondb_owner:...@neon.tech/neondb?sslmode=require"

# Production: Supabase (for now)
DATABASE_URL="postgresql://postgres:...@supabase.co:5432/postgres"
```

## Branching Workflow

One of Neon's best features!

### Create Branches
```bash
# In Neon dashboard:
1. Click "Branches"
2. Click "Create Branch"
3. Name it (e.g., "dev", "staging")
4. Get new connection string
```

### Use Branches
```bash
# Development
DATABASE_URL="postgresql://...@ep-dev-123.neon.tech/neondb?sslmode=require"

# Staging
DATABASE_URL="postgresql://...@ep-staging-456.neon.tech/neondb?sslmode=require"

# Production
DATABASE_URL="postgresql://...@ep-main-789.neon.tech/neondb?sslmode=require"
```

### Benefits
- ✅ Test migrations safely
- ✅ Isolated development
- ✅ No impact on production
- ✅ Instant creation (seconds)
- ✅ Free (10 branches included)

## Connection String Format

### Basic
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### With Connection Pooling (Production)
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require&pgbouncer=true&connection_limit=20
```

### Example
```
postgresql://neondb_owner:abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Prisma Configuration

No changes needed! Your current schema works perfectly:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Verification

### Test Connection
```bash
cd backend
npx prisma studio
```

Opens at http://localhost:5555

### Check Tables
```sql
-- In Neon SQL Editor
SELECT * FROM "User";
SELECT * FROM "Project";
SELECT * FROM "AIConversation";
```

### Test Backend
```bash
npm run dev
```

Should see: "✅ Database connected"

## Cost Comparison

### Free Tier
| Feature | Neon | Supabase |
|---------|------|----------|
| Storage | 0.5 GB | 500 MB |
| Transfer | 3 GB/mo | 2 GB/mo |
| Branches | 10 | 0 |
| Compute | Shared | Shared |
| Duration | Forever | Forever |

### Paid Plans
| Feature | Neon | Supabase |
|---------|------|----------|
| Price | $19/mo | $25/mo |
| Storage | 10 GB | 8 GB |
| Features | Branching, auto-scale | Auth, storage, realtime |

**For Sui Studio:** Neon is cheaper since you don't need Supabase's extra features!

## Troubleshooting

### ❌ "Can't reach database server"
**Fix:**
```bash
# Ensure connection string includes ?sslmode=require
DATABASE_URL="postgresql://...?sslmode=require"
```

### ❌ "SSL connection required"
**Fix:**
```bash
# Add SSL mode to connection string
?sslmode=require
```

### ❌ "Too many connections"
**Fix:**
```bash
# Enable connection pooling
?sslmode=require&pgbouncer=true&connection_limit=10
```

### ❌ "Database does not exist"
**Fix:**
```bash
# Push schema to create tables
npx prisma db push
```

## Production Checklist

### Before Deploying
- [ ] Create Neon production project
- [ ] Enable connection pooling
- [ ] Set connection limits
- [ ] Configure backups
- [ ] Test connection
- [ ] Update environment variables

### Environment Variables
```bash
# Production .env
DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true&connection_limit=20"
OPENAI_API_KEY=sk-prod-key
JWT_SECRET=prod-secret
NODE_ENV=production
```

### Monitoring
- [ ] Check storage usage
- [ ] Monitor query performance
- [ ] Track connection count
- [ ] Set up alerts

## Support & Resources

### Documentation
- **Neon Setup**: `NEON_DATABASE_SETUP.md`
- **Quick Start**: `NEON_QUICK_START.md`
- **Database Options**: `DATABASE_OPTIONS.md`

### Neon Resources
- **Docs**: https://neon.tech/docs
- **Prisma Guide**: https://neon.tech/docs/guides/prisma
- **Discord**: https://discord.gg/neon
- **Status**: https://neon.tech/status

### Common Commands
```bash
# Generate Prisma client
npx prisma generate

# Push schema
npx prisma db push

# Create migration
npx prisma migrate dev

# View database
npx prisma studio

# Seed data
npm run seed
```

## Next Steps

1. ✅ Create Neon account at https://neon.tech
2. ✅ Get connection string
3. ✅ Update `backend/.env.local`
4. ✅ Run `npx prisma db push`
5. ✅ Test with `npm run dev`
6. ✅ Open Prisma Studio to verify

## Quick Commands

```bash
# Full setup
cd backend
./setup-neon.sh    # Mac/Linux
setup-neon.bat     # Windows

# Manual setup
cd backend
npx prisma db push
npm run seed
npm run dev

# Verify
npx prisma studio
```

## Summary

### Why Neon for Sui Studio?

1. **Serverless** - Scales to zero, saves money
2. **Branching** - Perfect for dev/staging/prod
3. **Simple** - Just database, your backend handles the rest
4. **Fast** - Optimized Postgres performance
5. **Free** - Generous free tier for development
6. **Modern** - Built for cloud-native apps

### Your Backend Architecture

```
Frontend → Backend API → Neon Database
                ↓
         OpenAI (AI)
         JWT (Auth)
         WebSocket (Collab)
         Sui CLI (Blockchain)
```

Clean separation, each service does one thing well!

---

**Ready to switch?** Run `cd backend && ./setup-neon.sh` to get started! 🚀
