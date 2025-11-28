@echo off
echo 🚀 Setting up Neon Database...
echo.

echo 📝 Step 1: Get your Neon connection string
echo    1. Go to: https://neon.tech
echo    2. Create account and project
echo    3. Copy connection string
echo.
set /p DATABASE_URL="Paste your Neon connection string: "

echo.
echo 💾 Step 2: Updating .env.local...
echo DATABASE_URL="%DATABASE_URL%" >> .env.local

echo.
echo 📦 Step 3: Installing dependencies...
call npm install

echo.
echo 🔄 Step 4: Generating Prisma client...
call npx prisma generate

echo.
echo 🗄️ Step 5: Pushing schema to Neon...
call npx prisma db push

echo.
echo 🌱 Step 6: Seeding database (optional)...
set /p SEED="Seed database with sample data? (y/n): "
if /i "%SEED%"=="y" call npm run seed

echo.
echo ✅ Neon database setup complete!
echo.
echo 🎯 Next steps:
echo    1. Start backend: npm run dev
echo    2. View database: npx prisma studio
echo.
pause
