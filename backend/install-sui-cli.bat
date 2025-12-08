@echo off
REM Sui CLI Installation Script for Windows

echo Installing Sui CLI...
echo.

REM Check if Sui CLI is already installed
where sui >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Sui CLI is already installed!
    sui --version
    exit /b 0
)

REM Check if Rust is installed
where cargo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Rust...
    echo Please download and install Rust from: https://rustup.rs/
    echo After installing Rust, run this script again.
    pause
    exit /b 1
)

REM Install Sui CLI from source
echo Installing Sui CLI (this may take 10-15 minutes)...
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

REM Verify installation
where sui >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Sui CLI installed successfully!
    echo Version:
    sui --version
    echo.
    echo You can now use real Sui compilation!
) else (
    echo Sui CLI installation failed
    exit /b 1
)
