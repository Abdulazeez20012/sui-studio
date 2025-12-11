@echo off
echo ========================================
echo Sui Studio IDE - Desktop Build Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building frontend...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)

echo.
echo Step 3: Building desktop app...
call npm run electron:build
if errorlevel 1 (
    echo ERROR: Failed to build desktop app
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Desktop app built successfully!
echo Location: dist-electron\win-unpacked\Sui Studio.exe
echo.
echo To run the app:
echo   1. Navigate to: dist-electron\win-unpacked\
echo   2. Double-click: Sui Studio.exe
echo.
pause
