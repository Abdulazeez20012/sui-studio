#!/bin/bash

# Git History Rewrite Script
# This removes the exposed API key from all git history

echo "🔧 Rewriting Git History to Remove API Key"
echo "⚠️  WARNING: This will rewrite history and require force push!"
echo ""

# Create replacement file
echo "Creating replacement patterns..."
cat > secrets-to-remove.txt << 'EOF'
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==>your-anthropic-api-key-here
npg_MdO9AVl3QyUN==>your-neon-password-here
EOF

echo "✅ Replacement patterns created"
echo ""

# Backup current branch
echo "Creating backup branch..."
git branch backup-before-history-rewrite
echo "✅ Backup created: backup-before-history-rewrite"
echo ""

# Check if git-filter-repo is available
if ! command -v git-filter-repo &> /dev/null; then
    echo "❌ git-filter-repo not found!"
    echo ""
    echo "Install it with:"
    echo "  pip install git-filter-repo"
    echo "  OR"
    echo "  pip3 install git-filter-repo"
    echo ""
    exit 1
fi

echo "🔄 Rewriting git history..."
echo "This may take a few minutes..."
echo ""

# Run git-filter-repo
git filter-repo --replace-text secrets-to-remove.txt --force

if [ $? -eq 0 ]; then
    echo "✅ History rewritten successfully!"
    echo ""
    echo "📋 Next steps:"
    echo ""
    echo "1. Verify the changes:"
    echo "   git log --all --oneline | head -20"
    echo ""
    echo "2. Force push to GitHub:"
    echo "   git push origin main --force"
    echo ""
    echo "3. Clean up:"
    echo "   rm secrets-to-remove.txt"
    echo ""
    echo "4. IMMEDIATELY rotate your API key:"
    echo "   https://console.anthropic.com/settings/keys"
    echo ""
    echo "⚠️  Note: Anyone who has cloned your repo will need to:"
    echo "   git fetch origin"
    echo "   git reset --hard origin/main"
    echo ""
else
    echo "❌ History rewrite failed!"
    echo ""
    echo "Restore from backup:"
    echo "  git checkout backup-before-history-rewrite"
    exit 1
fi
