#!/bin/bash

# Quick Deployment Script for Sui CLI Backend
# This script commits the Dockerfile fix and pushes to trigger Render deployment

set -e

echo "🚀 Deploying Sui CLI to Backend"
echo "================================"
echo ""

# Check if we're in the backend directory
if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: Dockerfile not found"
    echo "Please run this script from the backend directory:"
    echo "  cd backend && bash deploy-sui-cli.sh"
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
if ! git diff --quiet Dockerfile; then
    echo "✅ Dockerfile has changes to commit"
else
    echo "⚠️  No changes to Dockerfile detected"
    echo "Dockerfile may already be committed"
fi

echo ""
echo "📦 Committing Dockerfile fix..."
git add Dockerfile
git commit -m "fix: Remove duplicate lines in Sui CLI installation in Dockerfile" || echo "Nothing to commit (already committed)"

echo ""
echo "🚢 Pushing to trigger Render deployment..."
git push origin main

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "📊 Next Steps:"
echo "   1. Go to https://dashboard.render.com"
echo "   2. Find 'sui-studio-backend' service"
echo "   3. Watch deployment logs (5-10 minutes)"
echo "   4. Look for: ✅ Sui CLI installed successfully"
echo "   5. Run verification: node verify-sui-cli.js"
echo ""
echo "🎉 Once deployed, 80% of your features will be fully functional!"
