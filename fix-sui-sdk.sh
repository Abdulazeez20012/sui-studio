#!/bin/bash

echo "========================================"
echo "Fixing Sui SDK Migration"
echo "========================================"
echo ""

echo "[1/4] Uninstalling old @mysten/sui.js from frontend..."
npm uninstall @mysten/sui.js

echo ""
echo "[2/4] Installing new @mysten/sui in frontend..."
npm install @mysten/sui@latest

echo ""
echo "[3/4] Uninstalling old @mysten/sui.js from backend..."
cd backend
npm uninstall @mysten/sui.js

echo ""
echo "[4/4] Installing new @mysten/sui in backend..."
npm install @mysten/sui@latest
cd ..

echo ""
echo "========================================"
echo "Migration Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Build: npm run build"
echo "3. Commit: git add . && git commit -m 'fix: migrate to @mysten/sui'"
echo "4. Push: git push"
echo ""
