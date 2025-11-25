@echo off
echo.
echo ========================================
echo   Sui Studio Test Suite
echo ========================================
echo.

set FRONTEND_PASSED=0
set BACKEND_PASSED=0

echo Running Frontend Tests...
echo ----------------------------------------
call npm test
if %ERRORLEVEL% EQU 0 (
    echo [32m✓ Frontend tests passed[0m
    set FRONTEND_PASSED=1
) else (
    echo [31m✗ Frontend tests failed[0m
)
echo.

echo Running Backend Tests...
echo ----------------------------------------
cd backend
call npm test
if %ERRORLEVEL% EQU 0 (
    echo [32m✓ Backend tests passed[0m
    set BACKEND_PASSED=1
) else (
    echo [31m✗ Backend tests failed[0m
)
cd ..
echo.

echo ========================================
echo   Test Summary
echo ========================================
if %FRONTEND_PASSED% EQU 1 (
    echo [32m✓ Frontend: PASSED[0m
) else (
    echo [31m✗ Frontend: FAILED[0m
)

if %BACKEND_PASSED% EQU 1 (
    echo [32m✓ Backend: PASSED[0m
) else (
    echo [31m✗ Backend: FAILED[0m
)
echo.

if %FRONTEND_PASSED% EQU 1 if %BACKEND_PASSED% EQU 1 (
    echo [32m🎉 All tests passed![0m
    exit /b 0
) else (
    echo [31m❌ Some tests failed[0m
    exit /b 1
)
