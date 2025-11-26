#!/bin/bash
set -e

echo "🚀 Setting up Sui Studio Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env 2>/dev/null || echo "⚠️  No .env.example found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database URL and secrets"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Backend will be available at http://localhost:3001"
