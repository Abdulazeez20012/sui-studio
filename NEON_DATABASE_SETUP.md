# 🚀 Switch to Neon Database

Neon is a serverless Postgres database that's perfect for Sui Studio. It's fast, scalable, and has a generous free tier!

## Why Neon?

✅ **Serverless** - No server management
✅ **Free Tier** - 0.5 GB storage, 3 GB data transfer
✅ **Fast** - Built on Postgres with instant branching
✅ **Prisma Compatible** - Works perfectly with your existing schema
✅ **Auto-scaling** - Scales to zero when not in use
✅ **Branching** - Create dev/staging branches instantly

## Setup (5 Minutes)

### Step 1: Create Neon Account

1. Go to https://neon.tech
2. Sign up with GitHub, Google, or email
3. Create a new project
4. Choose a region (closest to your users)

### Step 2: Get Connection String

After creating your project, Neon will show you a connection string:

```
postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require
```

**Example:**
```
postgresql://neondb_owner:abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Copy this entire string!

### Step 3: Update Backend Environment

Edit `backend/.env.local`:

```bash
# Replace your current DATABASE_URL with Neon connection string
DATABASE_URL="postgresql://neondb_owner:your-password@ep-your-endpoint.region.aws.neon.tech/neondb?sslmode=require"

# Keep other variables
PORT=3001
NODE_ENV=development
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-your-openai-key
```

### Step 4: Run Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to Neon
npx prisma db push

# Seed initial data (optional)
npm run seed
```

### Step 5: Verify Connection

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

Should open at http://localhost:5555 showing your tables!

### Step 6: Start Backend

```bash
npm run dev
```

Should see: "✅ Database connected"

## Neon Dashboard Features

### 1. SQL Editor
Run queries directly in the browser:
```sql
SELECT * FROM "User";
SELECT * FROM "AIConversation";
```

### 2. Branching
Create instant database copies for testing:
```bash
# In Neon dashboard, click "Branches" → "Create Branch"
# Get new connection string for dev branch
```

### 3. Monitoring
- Query performance
- Connection count
- Storage usage
- Data transfer

### 4. Backups
Automatic point-in-time recovery (PITR)

## Connection String Format

### Standard Format
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### With Connection Pooling (Recommended for Production)
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require&pgbouncer=true
```

### Example with All Options
```
postgresql://neondb_owner:abc123@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=10&pool_timeout=10
```

## Prisma Configuration

Your current `schema.prisma` already works with Neon! No changes needed:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Migration Commands

### Push Schema (Development)
```bash
npx prisma db push
```
Fast, no migration files, perfect for development.

### Create Migration (Production)
```bash
npx prisma migrate dev --name init
```
Creates migration files for version control.

### Deploy Migration (Production)
```bash
npx prisma migrate deploy
```
Applies migrations in production.

## Troubleshooting

### ❌ "Can't reach database server"

**Fix:**
1. Check connection string is correct
2. Ensure `sslmode=require` is included
3. Check Neon project is not suspended (free tier)
4. Verify network/firewall settings

### ❌ "SSL connection required"

**Fix:**
Add `?sslmode=require` to connection string:
```
postgresql://user:pass@host/db?sslmode=require
```

### ❌ "Too many connections"

**Fix:**
Use connection pooling:
```
?sslmode=require&pgbouncer=true&connection_limit=10
```

### ❌ "Database does not exist"

**Fix:**
Run migrations:
```bash
npx prisma db push
```

## Free Tier Limits

Neon Free Tier includes:
- **Storage**: 0.5 GB
- **Data Transfer**: 3 GB/month
- **Compute**: Shared CPU
- **Branches**: 10 branches
- **Projects**: Unlimited

Perfect for development and small projects!

## Production Optimization

### 1. Connection Pooling

Update connection string:
```
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&pgbouncer=true&connection_limit=20"
```

### 2. Prisma Connection Pool

In your Prisma client initialization:
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});
```

### 3. Environment-Specific Settings

**Development:**
```bash
DATABASE_URL="postgresql://...?sslmode=require"
```

**Production:**
```bash
DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true&connection_limit=20&pool_timeout=10"
```

## Neon vs Supabase

| Feature | Neon | Supabase |
|---------|------|----------|
| **Database** | Postgres | Postgres |
| **Serverless** | ✅ Yes | ❌ No |
| **Branching** | ✅ Yes | ❌ No |
| **Free Tier** | 0.5 GB | 500 MB |
| **Auth** | ❌ No | ✅ Yes |
| **Storage** | ❌ No | ✅ Yes |
| **Realtime** | ❌ No | ✅ Yes |
| **Best For** | Database only | Full backend |

**Recommendation:** Use Neon for database, keep your custom backend for AI, auth, etc.

## Migration from Supabase to Neon

### Step 1: Export Data from Supabase

```bash
# Using pg_dump
pg_dump "postgresql://postgres:password@db.supabase.co:5432/postgres" > backup.sql
```

### Step 2: Import to Neon

```bash
# Using psql
psql "postgresql://neondb_owner:password@ep-name.neon.tech/neondb?sslmode=require" < backup.sql
```

### Step 3: Update Connection String

```bash
# In backend/.env.local
DATABASE_URL="postgresql://neondb_owner:password@ep-name.neon.tech/neondb?sslmode=require"
```

### Step 4: Verify

```bash
npx prisma studio
```

## Cost Comparison

### Free Tier
- **Neon**: 0.5 GB storage, 3 GB transfer
- **Supabase**: 500 MB storage, 2 GB transfer
- **Both**: Perfect for development

### Paid Plans
- **Neon**: $19/month (10 GB storage)
- **Supabase**: $25/month (8 GB storage + auth/storage)

## Best Practices

### 1. Use Environment Variables
```bash
# Never commit connection strings!
DATABASE_URL="postgresql://..."
```

### 2. Enable Connection Pooling
```bash
DATABASE_URL="...?pgbouncer=true"
```

### 3. Set Connection Limits
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

### 4. Use Branches for Testing
- `main` branch for production
- `dev` branch for development
- `staging` branch for testing

### 5. Monitor Usage
Check Neon dashboard regularly for:
- Storage usage
- Query performance
- Connection count

## Quick Start Commands

```bash
# 1. Get Neon connection string from dashboard

# 2. Update .env.local
echo 'DATABASE_URL="postgresql://..."' > backend/.env.local

# 3. Push schema
cd backend
npx prisma db push

# 4. Seed data (optional)
npm run seed

# 5. Start backend
npm run dev

# 6. Open Prisma Studio
npx prisma studio
```

## Testing Connection

Create `backend/test-db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to Neon database!');
    
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

Run:
```bash
npx tsx test-db.ts
```

## Support

### Neon Documentation
- **Docs**: https://neon.tech/docs
- **Prisma Guide**: https://neon.tech/docs/guides/prisma
- **Discord**: https://discord.gg/neon

### Common Issues
- **Connection**: Check SSL mode and endpoint
- **Migrations**: Use `prisma db push` for dev
- **Performance**: Enable connection pooling

## Next Steps

1. ✅ Create Neon account
2. ✅ Get connection string
3. ✅ Update `backend/.env.local`
4. ✅ Run `npx prisma db push`
5. ✅ Test with `npm run dev`
6. ✅ Open Prisma Studio to verify

---

**Ready?** Go to https://neon.tech and create your free database! 🚀
