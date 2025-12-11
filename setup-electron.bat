@echo off
REM Sui Studio - Electron Desktop Setup Script (Windows)
REM This script sets up the desktop build environment

echo.
echo ========================================
echo Sui Studio Desktop Build Setup
echo ========================================
echo.

REM Step 1: Check Node.js
echo [1/5] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+ first.
    pause
    exit /b 1
)
node -v
echo [OK] Node.js found
echo.

REM Step 2: Install Electron dependencies
echo [2/5] Installing Electron dependencies...
call npm install --save-dev electron electron-builder electron-updater
call npm install --save-dev concurrently wait-on cross-env
echo [OK] Electron dependencies installed
echo.

REM Step 3: Create electron directory
echo [3/5] Creating electron directory...
if not exist "electron" mkdir electron
echo [OK] Electron directory created
echo.

REM Step 4: Check for icon
echo [4/5] Checking for app icon...
if not exist "electron\icon.png" (
    echo [WARNING] No icon found at electron\icon.png
    echo Please add a 512x512 PNG icon to electron\icon.png
) else (
    echo [OK] App icon found
)
echo.

REM Step 5: Update package.json
echo [5/5] Updating package.json...
if exist "package.electron.json" (
    copy package.json package.json.backup >nul
    copy package.electron.json package.json >nul
    echo [OK] package.json updated (backup saved)
) else (
    echo [WARNING] package.electron.json not found, skipping...
)
echo.

REM Done
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Add an app icon (512x512 PNG):
echo    electron\icon.png
echo.
echo 2. Test in development mode:
echo    npm run electron:dev
echo.
echo 3. Build for Windows:
echo    npm run electron:build
echo    npm run electron:build:windows
echo.
echo 4. Find built apps in:
echo    dist-electron\
echo.
echo Read DESKTOP_BUILD_GUIDE.md for detailed instructions
echo.
pause
