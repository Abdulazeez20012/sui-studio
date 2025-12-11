@echo off
REM Comprehensive Test Suite Runner for Windows

echo.
echo ====================================================
echo   Sui Studio - Comprehensive Test Suite
echo ====================================================
echo.

REM Colors for output
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set NC=[0m

echo %YELLOW%Starting test suite...%NC%
echo.

REM Test 1: Backend Health Check
echo %YELLOW%[1/6] Testing Backend Health...%NC%
curl -s https://sui-studio.onrender.com/health > nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Backend is healthy%NC%
) else (
    echo %RED%✗ Backend health check failed%NC%
)
echo.

REM Test 2: Backend Unit Tests
echo %YELLOW%[2/6] Running Backend Unit Tests...%NC%
cd backend
call npm test -- --passWithNoTests
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Backend tests passed%NC%
) else (
    echo %RED%✗ Backend tests failed%NC%
)
cd ..
echo.

REM Test 3: Frontend Unit Tests
echo %YELLOW%[3/6] Running Frontend Unit Tests...%NC%
call npm test -- --run
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Frontend tests passed%NC%
) else (
    echo %RED%✗ Frontend tests failed%NC%
)
echo.

REM Test 4: API Endpoints
echo %YELLOW%[4/6] Testing API Endpoints...%NC%

echo Testing /health endpoint...
curl -s https://sui-studio.onrender.com/health | findstr "ok" > nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Health endpoint working%NC%
) else (
    echo %RED%✗ Health endpoint failed%NC%
)

echo Testing /api/project-init/templates endpoint...
curl -s https://sui-studio.onrender.com/api/project-init/templates > nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Templates endpoint working%NC%
) else (
    echo %RED%✗ Templates endpoint failed%NC%
)
echo.

REM Test 5: Frontend Build
echo %YELLOW%[5/6] Testing Frontend Build...%NC%
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Frontend builds successfully%NC%
) else (
    echo %RED%✗ Frontend build failed%NC%
)
echo.

REM Test 6: TypeScript Check
echo %YELLOW%[6/6] Running TypeScript Check...%NC%
call npx tsc --noEmit
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ No TypeScript errors%NC%
) else (
    echo %RED%✗ TypeScript errors found%NC%
)
echo.

echo ====================================================
echo   Test Suite Complete!
echo ====================================================
echo.
echo Run 'npm test -- --coverage' for detailed coverage report
echo.

pause
