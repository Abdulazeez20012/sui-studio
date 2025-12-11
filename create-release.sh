#!/bin/bash

# Sui Studio - Create GitHub Release
# This script creates a GitHub release and uploads desktop apps

set -e

echo "🚀 Creating GitHub Release for Sui Studio Desktop..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
VERSION="v1.0.0"
TITLE="Sui Studio Desktop IDE v1.0.0"
LINUX_FILE="dist-electron/Sui Studio-1.0.0.AppImage"
WINDOWS_FILE="dist-electron/Sui-Studio-1.0.0-Windows-Portable.zip"

# Step 1: Check if files exist
echo -e "${BLUE}[1/5]${NC} Checking if build files exist..."

if [ ! -f "$LINUX_FILE" ]; then
    echo -e "${RED}✗${NC} Linux AppImage not found: $LINUX_FILE"
    echo "   Please build the desktop apps first:"
    echo "   ./update-and-rebuild.sh"
    exit 1
fi

if [ ! -f "$WINDOWS_FILE" ]; then
    echo -e "${RED}✗${NC} Windows ZIP not found: $WINDOWS_FILE"
    echo "   Please build the desktop apps first:"
    echo "   ./update-and-rebuild.sh"
    exit 1
fi

echo -e "${GREEN}✓${NC} Build files found"
echo "   Linux:   $(du -h "$LINUX_FILE" | cut -f1)"
echo "   Windows: $(du -h "$WINDOWS_FILE" | cut -f1)"
echo ""

# Step 2: Check if GitHub CLI is installed
echo -e "${BLUE}[2/5]${NC} Checking GitHub CLI..."

if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗${NC} GitHub CLI (gh) is not installed"
    echo ""
    echo "Install it with:"
    echo "  Linux:   sudo apt install gh"
    echo "  macOS:   brew install gh"
    echo "  Windows: winget install GitHub.cli"
    echo ""
    echo "Or visit: https://cli.github.com/"
    exit 1
fi

echo -e "${GREEN}✓${NC} GitHub CLI found"
echo ""

# Step 3: Check if logged in
echo -e "${BLUE}[3/5]${NC} Checking GitHub authentication..."

if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  Not logged in to GitHub"
    echo ""
    echo "Please login:"
    gh auth login
fi

echo -e "${GREEN}✓${NC} Authenticated with GitHub"
echo ""

# Step 4: Generate checksums
echo -e "${BLUE}[4/5]${NC} Generating checksums..."

cd dist-electron
sha256sum "Sui Studio-1.0.0.AppImage" > SHA256SUMS.txt
sha256sum "Sui-Studio-1.0.0-Windows-Portable.zip" >> SHA256SUMS.txt
cd ..

echo -e "${GREEN}✓${NC} Checksums generated"
cat dist-electron/SHA256SUMS.txt
echo ""

# Step 5: Create release
echo -e "${BLUE}[5/5]${NC} Creating GitHub release..."
echo ""

# Rename files for cleaner download names
cp "$LINUX_FILE" "dist-electron/Sui-Studio-Linux-1.0.0.AppImage"
# Windows file already has good name

# Create the release
gh release create $VERSION \
  --title "$TITLE" \
  --notes-file RELEASE_NOTES.md \
  "dist-electron/Sui-Studio-Linux-1.0.0.AppImage" \
  "$WINDOWS_FILE" \
  "dist-electron/SHA256SUMS.txt"

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}🎉 Release created successfully!${NC}"
    echo ""
    echo "View your release:"
    echo "  https://github.com/Abdulazeez20012/sui-studio/releases/tag/$VERSION"
    echo ""
    echo "Download links:"
    echo "  Linux:   https://github.com/Abdulazeez20012/sui-studio/releases/download/$VERSION/Sui-Studio-Linux-1.0.0.AppImage"
    echo "  Windows: https://github.com/Abdulazeez20012/sui-studio/releases/download/$VERSION/Sui-Studio-1.0.0-Windows-Portable.zip"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Next steps:"
    echo "  1. ✓ Release is live!"
    echo "  2. Update README with download links"
    echo "  3. Announce on social media"
    echo "  4. Share with the community"
    echo ""
else
    echo ""
    echo -e "${RED}✗${NC} Failed to create release"
    echo "   Please check the error message above"
    exit 1
fi
