# Quick Database Setup

## Option 1: Neon (Recommended - Free)

1. **Sign up**: Go to https://neon.tech and create account
2. **Create project**: Click "Create Project"
3. **Copy connection string**: It looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Update backend/.env**:
   ```bash
   DATABASE_URL="your-neon-connection-string-here"
   ```

## Option 2: Local PostgreSQL

1. **Install PostgreSQL**:
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE sui_studio;
   CREATE USER sui_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE sui_studio TO sui_user;
   \q
   ```

3. **Update backend/.env**:
   ```bash
   DATABASE_URL="postgresql://sui_user:your_password@localhost:5432/sui_studio"
   ```

## After Setting Up Database

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm run dev
```