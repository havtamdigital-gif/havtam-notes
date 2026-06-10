#!/bin/bash
# Havtam's Notes — Double-click to start 🌸

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🌸 מפעילה את Havtam's Notes..."
echo ""

# Install frontend deps if needed
if [ ! -d "$DIR/frontend/node_modules/.bin" ]; then
  echo "📦 מתקינה frontend packages (פעם ראשונה — לוקח כ-30 שניות)..."
  cd "$DIR/frontend" && npm install
fi

# Install backend deps if needed
if [ ! -d "$DIR/backend/node_modules" ]; then
  echo "📦 מתקינה backend packages..."
  cd "$DIR/backend" && npm install
fi

# Start backend in background
echo "⚙️  מפעילה backend..."
cd "$DIR/backend" && node src/index.js &
BACKEND_PID=$!
sleep 2

# Start frontend
echo "🚀 מפעילה frontend..."
echo ""
echo "═══════════════════════════════════════"
echo "  פתחי דפדפן ב: http://localhost:5173"
echo "═══════════════════════════════════════"
echo ""
cd "$DIR/frontend" && npm run dev -- --open

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
