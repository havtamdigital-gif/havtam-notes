#!/bin/bash
echo "🧹 Cleaning up..."
cd "$(dirname "$0")/frontend"
rm -rf node_modules
echo "✅ node_modules deleted — freed ~157MB"
cd ..
rm -rf dist 2>/dev/null
echo "✅ All clean!"
read -n 1
