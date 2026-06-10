#!/bin/bash
cd "$(dirname "$0")"
echo "🌸 Setting up git and pushing to GitHub..."

# Clean any broken git state from previous attempt
rm -rf .git

# Fresh init
git init
git branch -M main
git config user.name "Havtam"
git config user.email "havtamdigital@gmail.com"

# Stage everything (.gitignore will exclude node_modules/dist)
git add .
echo ""
echo "📦 Staged files:"
git status --short | head -30

# Commit
git commit -m "Initial commit — Havtam's Notes 🌸"

# Set remote and push
git remote add origin https://github.com/havtamdigital-gif/havtam-notes.git
git push -u origin main

echo ""
echo "✅ Live at: https://github.com/havtamdigital-gif/havtam-notes"
echo ""
echo "🌸 Press any key to close."
read -n 1
