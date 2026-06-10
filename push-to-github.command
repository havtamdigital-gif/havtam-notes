#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Pushing to GitHub..."
git remote add origin https://github.com/havtamdigital-gif/havtam-notes.git 2>/dev/null || git remote set-url origin https://github.com/havtamdigital-gif/havtam-notes.git
git branch -M main
git push -u origin main
echo ""
echo "✅ Done! Code is live at:"
echo "   https://github.com/havtamdigital-gif/havtam-notes"
echo ""
echo "🌸 Press any key to close."
read -n 1
