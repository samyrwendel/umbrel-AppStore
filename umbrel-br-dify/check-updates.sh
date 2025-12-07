#!/bin/bash
# Script to check for Dify updates
# Run: ./check-updates.sh

CURRENT_VERSION="1.10.1-fix.1"

# Get latest release from GitHub
LATEST=$(curl -s https://api.github.com/repos/langgenius/dify/releases/latest | grep '"tag_name"' | cut -d'"' -f4)

echo "Current version: $CURRENT_VERSION"
echo "Latest version:  $LATEST"

if [ "$CURRENT_VERSION" != "$LATEST" ]; then
    echo ""
    echo "⚠️  Update available!"
    echo ""
    echo "To update, edit these files:"
    echo "  1. umbrel-app.yml  → version: \"$LATEST\""
    echo "  2. docker-compose.yml → update image tags to :$LATEST"
    echo ""
    echo "Then run:"
    echo "  git add . && git commit -m \"bump: dify $LATEST\" && git push"
else
    echo ""
    echo "✅ You're up to date!"
fi
