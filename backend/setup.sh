#!/bin/bash

echo "🚀 Setting up Sui Studio Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database URL and secrets"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Backend will be available at http://localhost:3001"
