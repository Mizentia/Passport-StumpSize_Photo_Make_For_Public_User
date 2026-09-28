@echo off
setlocal enabledelayedexpansion

title Noksha Lab Auto Git Push - Public User

echo ===================================================
echo      Noksha Lab Git Push Automation Tool
echo ===================================================
echo.

:: Check if Git is installed
where git >nul 2>nul
if !errorlevel! neq 0 (
    echo [ERROR] Git is not installed on this system!
    echo Please download and install Git from https://git-scm.com/
    goto end
)

:: Check if inside a git repository
if not exist .git (
    echo [ERROR] This folder is not a Git repository!
    echo Please run 'git init' first.
    goto end
)

:: Prevent Windows file-lock deletion prompt loop on .git/objects/
git config core.askyesno false

:: Get status
echo Checking Git status...
git status --short
echo.

:: Check if there are changes
git status --short | findstr /R "^" >nul
if !errorlevel! neq 0 (
    echo [INFO] No changes detected to commit.
    echo Checking if push is needed...
    goto push_stage
)

:: Check if project has a build script
findstr /i "\"build\":" package.json >nul 2>nul
if !errorlevel! equ 0 (
    echo ===================================================
    echo [BUILD CHECK] Verify Local Build before pushing?
    echo ===================================================
    echo This is highly recommended because your deployment
    echo will build this code live automatically.
    echo.
    set /p build_choice="Do you want to run a build check? (y/n, default: y): "
    set "first_char=!build_choice:~0,1!"
    if /i "!first_char!"=="n" (
        echo Skipping build check.
        goto add_stage
    )

    echo.
    echo Running local build (npm run build)...
    call npm run build
    if !errorlevel! neq 0 (
        echo.
        echo ===================================================
        echo [ERROR] Local build failed!
        echo Pushing this might break your live site.
        echo ===================================================
        echo.
        set /p proceed_anyway="Do you want to push anyway? (y/n, default: n): "
        if /i "!proceed_anyway!" neq "y" (
            echo Push cancelled by user.
            goto end
        )
    ) else (
        echo.
        echo [SUCCESS] Local build succeeded!
        echo.
    )
)

:add_stage
echo.
echo ===================================================
echo  Staging changes (git add .)...
echo ===================================================
git add .
if !errorlevel! neq 0 (
    echo [ERROR] Failed to stage files. Check folder permissions.
    goto end
)

:: Prompt for commit message
echo.
set /p commit_msg="Enter commit message (Press Enter for auto-message): "
if "!commit_msg!"=="" (
    set "commit_msg=Auto-update: %date% %time%"
)

echo.
echo Committing changes: "!commit_msg!"
git commit -m "!commit_msg!"
if !errorlevel! neq 0 (
    echo [ERROR] Commit failed.
    goto end
)

:push_stage
:: Check if remote is configured
git remote -v >nul 2>nul
if !errorlevel! neq 0 (
    echo [ERROR] No remote repository is configured!
    echo Please run: git remote add origin [your-github-repo-url]
    goto end
)

:: Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
if "!current_branch!"=="" (
    set current_branch=main
)

echo.
echo ===================================================
echo Pushing changes to GitHub (Branch: !current_branch!)...
echo ===================================================
git push origin !current_branch!
if !errorlevel! equ 0 goto push_success

echo.
echo ===================================================
echo [ERROR] Git push failed! Common reasons:
echo 1. You are not logged in to GitHub (run 'git credential-manager configure' or login via browser).
echo 2. The remote branch has new changes (run 'git pull origin !current_branch!' first).
echo 3. The remote repository URL is incorrect or access is denied.
echo ===================================================
goto end

:push_success
echo.
echo ===================================================
echo [SUCCESS] Project successfully pushed to GitHub!
echo ===================================================

:end
echo.
echo ===================================================
echo  Press any key to close this terminal...
echo ===================================================
pause >nul
