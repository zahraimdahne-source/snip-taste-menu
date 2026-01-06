@echo off
echo ========================================
echo   Snip Taste Menu - APK Builder
echo ========================================
echo.

echo Step 1: Building web app...
call npm run build
if errorlevel 1 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)
echo ✓ Web build completed!
echo.

echo Step 2: Syncing with Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Android sync failed!
    pause
    exit /b 1
)
echo ✓ Android sync completed!
echo.

echo Step 3: Opening Android Studio...
echo.
echo IMPORTANT: If Android Studio doesn't open automatically:
echo 1. Open Android Studio manually
echo 2. Click "Open an Existing Project"
echo 3. Navigate to: %CD%\android
echo 4. Click OK
echo 5. Wait for Gradle sync
echo 6. Go to Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo.

call npx cap open android
if errorlevel 1 (
    echo.
    echo Android Studio not found in default location.
    echo Please open Android Studio manually and open the 'android' folder.
    echo.
    echo Android project location: %CD%\android
    echo.
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for Android Studio to open
echo 2. Wait for Gradle sync to finish
echo 3. Click Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo 4. Your APK will be in: android\app\build\outputs\apk\debug\
echo.
pause
