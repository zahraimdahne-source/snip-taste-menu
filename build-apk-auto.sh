#!/bin/bash
# Automated APK Build Script
# This script builds your APK automatically

echo "=========================================="
echo "  Snip Taste Menu - Automated APK Build"
echo "=========================================="
echo ""

# Step 1: Clean previous builds
echo "Step 1: Cleaning previous builds..."
cd android
./gradlew clean
echo "✓ Clean completed!"
echo ""

# Step 2: Build web app
echo "Step 2: Building web app..."
cd ..
npm run build
echo "✓ Web build completed!"
echo ""

# Step 3: Sync with Android
echo "Step 3: Syncing with Android..."
npx cap sync android
echo "✓ Sync completed!"
echo ""

# Step 4: Build APK
echo "Step 4: Building APK..."
cd android
./gradlew assembleDebug
echo "✓ APK build completed!"
echo ""

# Step 5: Show APK location
echo "=========================================="
echo "  APK BUILD SUCCESSFUL!"
echo "=========================================="
echo ""
echo "Your APK is ready at:"
echo "android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "File size: $(du -h app/build/outputs/apk/debug/app-debug.apk | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Transfer APK to your Android phone"
echo "2. Tap the APK file to install"
echo "3. Open 'Snip Taste Menu' app"
echo "4. Enjoy!"
echo ""
echo "=========================================="
