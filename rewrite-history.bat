@echo off
REM Git History Rewrite Script for Windows
REM This removes the exposed API key from all git history

echo.
echo ====================================================
echo   Git History Rewrite - Remove API Key
echo ====================================================
echo.
echo WARNING: This will rewrite history and require force push!
echo.
pause

REM Create replacement file
echo Creating replacement patterns...
(
echo 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==^>your-anthropic-api-key-here
echo npg_MdO9AVl3QyUN==^>your-neon-password-here
) > secrets-to-remove.txt

echo Replacement patterns created
echo.

REM Backup current branch
echo Creating backup branch...
git branch backup-before-history-rewrite
echo Backup created: backup-before-history-rewrite
echo.

REM Check if git-filter-repo is available
where git-filter-repo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git-filter-repo not found!
    echo.
    echo Install it with:
    echo   pip install git-filter-repo
    echo   OR
    echo   pip3 install git-filter-repo
    echo.
    pause
    exit /b 1
)

echo Rewriting git history...
echo This may take a few minutes...
echo.

REM Run git-filter-repo
git filter-repo --replace-text secrets-to-remove.txt --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo   History rewritten successfully!
    echo ====================================================
    echo.
    echo Next steps:
    echo.
    echo 1. Verify the changes:
    echo    git log --all --oneline
    echo.
    echo 2. Force push to GitHub:
    echo    git push origin main --force
    echo.
    echo 3. Clean up:
    echo    del secrets-to-remove.txt
    echo.
    echo 4. IMMEDIATELY rotate your API key:
    echo    https://console.anthropic.com/settings/keys
    echo.
    echo WARNING: Anyone who has cloned your repo will need to:
    echo    git fetch origin
    echo    git reset --hard origin/main
    echo.
) else (
    echo.
    echo ERROR: History rewrite failed!
    echo.
    echo Restore from backup:
    echo   git checkout backup-before-history-rewrite
    echo.
    pause
    exit /b 1
)

pause
