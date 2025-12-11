@echo off
REM 🤝 Setup Collaboration for Desktop IDE (Windows)
REM This script prepares your repository for collaboration

echo.
echo 🚀 Setting up Desktop IDE for Collaboration
echo ============================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Error: Not a git repository
    echo Run 'git init' first
    exit /b 1
)

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo 📍 Current branch: %CURRENT_BRANCH%
echo.

REM Step 1: Check for uncommitted changes
echo Step 1: Checking for uncommitted changes...
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  You have uncommitted changes
    echo.
    git status --short
    echo.
    set /p COMMIT="Do you want to commit these changes? (y/n): "
    if /i "%COMMIT%"=="y" (
        echo 📝 Committing changes...
        git add .
        git commit -m "feat: complete desktop IDE implementation - File watcher with chokidar - Recent files dropdown - Toast notification system - Breadcrumbs navigation - Git integration - Settings panel - Search across files - Test execution - Complete documentation"
        echo ✅ Changes committed
    ) else (
        echo ⏭️  Skipping commit
    )
) else (
    echo ✅ No uncommitted changes
)
echo.

REM Step 2: Create desktop branch
echo Step 2: Creating desktop branch...
git show-ref --verify --quiet refs/heads/desktop
if %errorlevel% equ 0 (
    echo ⚠️  Desktop branch already exists
    set /p SWITCH="Do you want to switch to it? (y/n): "
    if /i "%SWITCH%"=="y" (
        git checkout desktop
        echo ✅ Switched to desktop branch
    )
) else (
    git checkout -b desktop
    echo ✅ Desktop branch created
)
echo.

REM Step 3: Push desktop branch
echo Step 3: Pushing desktop branch to remote...
set /p PUSH="Do you want to push to remote? (y/n): "
if /i "%PUSH%"=="y" (
    git push -u origin desktop
    if %errorlevel% equ 0 (
        echo ✅ Desktop branch pushed to remote
    ) else (
        echo ⚠️  Failed to push. Make sure remote is configured.
    )
) else (
    echo ⏭️  Skipping push
)
echo.

REM Step 4: Create collaboration files
echo Step 4: Creating collaboration documentation...

if not exist "README_DESKTOP.md" (
    (
        echo # 🖥️ Sui Studio Desktop IDE
        echo.
        echo ## For Collaborators
        echo.
        echo ### Quick Setup
        echo ```bash
        echo git clone ^<your-repo-url^>
        echo cd sui-studio
        echo git checkout desktop
        echo npm install
        echo ```
        echo.
        echo ### Development
        echo ```bash
        echo # Run desktop IDE
        echo npm run electron:dev
        echo.
        echo # Build desktop IDE
        echo npm run electron:build
        echo ```
        echo.
        echo ### Workflow
        echo 1. Always work on `desktop` branch
        echo 2. Create feature branches from `desktop`
        echo 3. Submit PRs to `desktop` branch
        echo 4. Never push directly to `main`
        echo.
        echo ### Current Features
        echo - ✅ File management with auto-reload
        echo - ✅ Git integration
        echo - ✅ Terminal with Sui CLI
        echo - ✅ Settings ^& customization
        echo - ✅ Search ^& navigation
        echo - ✅ Testing integration
        echo.
        echo ### Documentation
        echo - `COLLABORATION_SETUP_GUIDE.md` - Complete guide
        echo - `SUI_IDE_FEATURE_ANALYSIS.md` - Feature roadmap
    ) > README_DESKTOP.md
    git add README_DESKTOP.md
    git commit -m "docs: add desktop IDE collaboration guide"
    echo ✅ README_DESKTOP.md created
) else (
    echo ⚠️  README_DESKTOP.md already exists
)
echo.

REM Step 5: Create PR template
echo Step 5: Creating PR template...
if not exist ".github" mkdir .github

if not exist ".github\PULL_REQUEST_TEMPLATE.md" (
    (
        echo ## Description
        echo Brief description of changes
        echo.
        echo ## Type of Change
        echo - [ ] Bug fix
        echo - [ ] New feature
        echo - [ ] Breaking change
        echo - [ ] Documentation update
        echo.
        echo ## Target Branch
        echo - [ ] desktop ^(Desktop IDE^) - Default
        echo - [ ] main ^(Web IDE^) - Requires maintainer approval
        echo.
        echo ## Testing
        echo - [ ] Tested on Windows
        echo - [ ] Tested on macOS
        echo - [ ] Tested on Linux
        echo - [ ] All tests passing
        echo.
        echo ## Checklist
        echo - [ ] Code follows style guidelines
        echo - [ ] Self-review completed
        echo - [ ] Documentation updated
        echo - [ ] No breaking changes to web IDE
    ) > .github\PULL_REQUEST_TEMPLATE.md
    git add .github\PULL_REQUEST_TEMPLATE.md
    git commit -m "chore: add PR template"
    echo ✅ PR template created
) else (
    echo ⚠️  PR template already exists
)
echo.

REM Summary
echo ============================================
echo 🎉 Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo.
echo 1. 🔒 Protect main branch on GitHub:
echo    - Go to Settings → Branches
echo    - Add protection rule for 'main'
echo    - Require PR reviews
echo.
echo 2. 👥 Invite collaborators:
echo    - Go to Settings → Collaborators
echo    - Add team members
echo.
echo 3. 📢 Share with team:
echo    - Send repository URL
echo    - Share README_DESKTOP.md
echo    - Share COLLABORATION_SETUP_GUIDE.md
echo.
echo 4. 🚀 Start collaborating:
echo    - Team creates feature branches
echo    - Submit PRs to 'desktop' branch
echo    - Review and merge
echo.
for /f "tokens=*" %%i in ('git branch --show-current') do echo Current branch: %%i
for /f "tokens=*" %%i in ('git remote get-url origin 2^>nul') do echo Remote: %%i
echo.
echo 📚 Documentation created:
echo    - README_DESKTOP.md
echo    - COLLABORATION_SETUP_GUIDE.md
echo    - PUSH_DESKTOP_COMMANDS.md
echo    - BRANCH_STRATEGY_VISUAL.md
echo    - .github\PULL_REQUEST_TEMPLATE.md
echo.
echo ✅ Your desktop IDE is ready for collaboration!
echo.
pause
