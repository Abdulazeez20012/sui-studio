#!/bin/bash
set -e

echo "🚀 Setting up Sui Studio Backend..."

# Build includes installing dev dependencies and compiling
echo "🔨 Building application..."
npm run build

echo "✅ Backend setup complete!"
echo ""
echo "Backend will be available at http://localhost:3001"
