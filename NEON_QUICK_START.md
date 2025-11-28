# ⚡ Neon Database - Quick Start

## 3-Step Setup

### 1. Create Neon Database
```
Visit: https://neon.tech
→ Sign up
→ Create project
→ Copy connection string
```

### 2. Update Environment
```bash
# Edit backend/.env.local
DATABASE_URL="postgresql://neondb_owner:password@ep-name.region.aws.neon.tech/neondb?sslmode=require"
```

### 3. Push Schema
```bash
cd backend
npx prisma db push
npm run dev
```

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

## Verify Setup

```bash
# Open database viewer
npx prisma studio
```

Opens at http://localhost:5555

## Connection String Format

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Example:**
```
postgresql://neondb_owner:abc123@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Common Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev --name init

# View database
npx prisma studio

# Seed data
npm run seed
```

## Troubleshooting

**"Can't reach database"**
→ Check connection string includes `?sslmode=require`

**"SSL required"**
→ Add `?sslmode=require` to end of connection string

**"Too many connections"**
→ Add `&pgbouncer=true` to connection string

## Free Tier

✅ 0.5 GB storage
✅ 3 GB data transfer/month
✅ Unlimited projects
✅ 10 branches per project

Perfect for development!

## Production Tips

### Enable Connection Pooling
```
DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true&connection_limit=20"
```

### Use Branches
- `main` → Production
- `dev` → Development
- `staging` → Testing

### Monitor Usage
Check Neon dashboard for:
- Storage usage
- Query performance
- Connection count

## Migration from Supabase

```bash
# 1. Export from Supabase
pg_dump "your-supabase-url" > backup.sql

# 2. Import to Neon
psql "your-neon-url" < backup.sql

# 3. Update .env.local
DATABASE_URL="your-neon-url"

# 4. Verify
npx prisma studio
```

## Support

- **Docs**: https://neon.tech/docs
- **Prisma Guide**: https://neon.tech/docs/guides/prisma
- **Discord**: https://discord.gg/neon

---

**Full guide:** See `NEON_DATABASE_SETUP.md`
