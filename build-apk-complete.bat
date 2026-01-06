@echo off
REM Automated APK Build Script for Windows
REM This script builds your APK automatically

echo ==========================================
echo   Snip Taste Menu - Automated APK Build
echo ==========================================
echo.

REM Step 1: Build web app
echo Step 1: Building web app...
call npm run build
if errorlevel 1 goto error
echo [32m✓ Web build completed![0m
echo.

REM Step 2: Sync with Android
echo Step 2: Syncing with Android...
call npx cap sync android
if errorlevel 1 goto error
echo [32m✓ Sync completed![0m
echo.

REM Step 3: Build APK using Gradle
echo Step 3: Building APK (this may take a few minutes)...
echo Please wait...
cd android
call gradlew.bat assembleDebug --no-daemon
if errorlevel 1 goto error
cd ..
echo [32m✓ APK build completed![0m
echo.

REM Step 4: Show success message
echo ==========================================
echo   APK BUILD SUCCESSFUL!
echo ==========================================
echo.
echo Your APK is ready at:
echo %CD%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Next steps:
echo 1. Transfer APK to your Android phone
echo 2. Tap the APK file to install
echo 3. Open 'Snip Taste Menu' app
echo 4. Enjoy!
echo.
echo ==========================================
echo.

REM Open the APK folder
explorer "%CD%\android\app\build\outputs\apk\debug"

goto end

:error
echo.
echo [31mERROR: Build failed![0m
echo.
echo Please check the error messages above.
echo You may need to:
echo 1. Ensure Android Studio has completed Gradle sync
echo 2. Check your internet connection
echo 3. Try building in Android Studio instead
echo.
pause
exit /b 1

:end
echo Press any key to exit...
pause >nul
