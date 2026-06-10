#!/bin/bash
# Havtam's Notes — Push to GitHub & clean up 🌸
cd "$(dirname "$0")"

echo "🌸 Havtam's Notes — GitHub Setup"
echo "================================="
echo ""

# Init git
if [ ! -d ".git" ]; then
  git init
  git branch -m main
fi

git config user.name "Havtam"
git config user.email "havtamdigital@gmail.com"

# Stage everything (node_modules excluded by .gitignore)
git add .
git status --short

echo ""
echo "📦 Files ready to commit."
echo ""

# Commit
git commit -m "Initial commit — Havtam's Notes" 2>/dev/null || echo "(already committed)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NEXT STEP: Create a GitHub repo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  1. Go to https://github.com/new"
echo "  2. Name it: havtam-notes"
echo "  3. Set to Private or Public (your choice)"
echo "  4. DON'T add README/gitignore (you have them)"
echo "  5. Click Create repository"
echo ""
echo "  Then paste this command in Terminal:"
echo ""
echo "  git -C \"$(pwd)\" remote add origin https://github.com/YOUR_USERNAME/havtam-notes.git && git -C \"$(pwd)\" push -u origin main"
echo ""
echo "  (Replace YOUR_USERNAME with your GitHub username)"
echo ""

# Offer to delete node_modules to free space
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Free up disk space?"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "  Delete node_modules now? (~157MB freed) [y/N] " answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  echo "  Deleting node_modules..."
  rm -rf frontend/node_modules
  echo "  ✅ Freed ~157MB!"
fi

echo ""
echo "🌸 Done! Press any key to close."
read -n 1
