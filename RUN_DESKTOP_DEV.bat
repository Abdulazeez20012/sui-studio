@echo off
echo ========================================
echo Sui Studio IDE - Development Mode
echo ========================================
echo.

echo Starting desktop app in development mode...
echo This will:
echo   1. Start Vite dev server on http://localhost:3000
echo   2. Launch Electron with hot-reload
echo.
echo Press Ctrl+C to stop
echo.

call npm run electron:dev
