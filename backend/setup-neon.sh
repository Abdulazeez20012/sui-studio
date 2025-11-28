#!/bin/bash

echo "🚀 Setting up Neon Database..."
echo ""

echo "📝 Step 1: Get your Neon connection string"
echo "   1. Go to: https://neon.tech"
echo "   2. Create account and project"
echo "   3. Copy connection string"
echo ""
read -p "Paste your Neon connection string: " DATABASE_URL

echo ""
echo "💾 Step 2: Updating .env.local..."
echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.local

echo ""
echo "📦 Step 3: Installing dependencies..."
npm install

echo ""
echo "🔄 Step 4: Generating Prisma client..."
npx prisma generate

echo ""
echo "🗄️ Step 5: Pushing schema to Neon..."
npx prisma db push

echo ""
read -p "🌱 Seed database with sample data? (y/n): " SEED
if [ "$SEED" = "y" ] || [ "$SEED" = "Y" ]; then
    npm run seed
fi

echo ""
echo "✅ Neon database setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start backend: npm run dev"
echo "   2. View database: npx prisma studio"
echo ""
