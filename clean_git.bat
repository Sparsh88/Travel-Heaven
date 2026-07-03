@echo off
echo ===================================================
echo   Git Repository Merger ^& Cleanup Script
echo ===================================================
echo.

:: 1. Delete the nested .git folder inside server
echo [1/5] Deleting nested .git folder in 'server'...
if exist "server\.git" (
    attrib -h -r -s "server\.git" /s /d
    rmdir /s /q "server\.git"
    if exist "server\.git" (
        echo [ERROR] Could not delete server\.git. Try running this script as Administrator.
    ) else (
        echo [SUCCESS] Nested .git folder deleted.
    )
) else (
    echo [INFO] Nested .git folder not found. It might have already been deleted.
)
echo.

:: 2. Remove cached server directory from root git
echo [2/5] Removing cached 'server' reference from root Git...
git rm --cached -r server 2>nul
echo [SUCCESS] Cache cleared.
echo.

:: 3. Stage all files in root repository
echo [3/5] Adding all files in the project to root Git tracking...
git add .
echo [SUCCESS] Files staged.
echo.

:: 4. Commit changes
echo [4/5] Committing changes...
git commit -m "Merge server repository into root"
echo.

:: 5. Push to GitHub
echo [5/5] Pushing changes to GitHub...
git push origin main
echo.

echo ===================================================
echo Merge complete! Your editor's "M" status should update now.
echo ===================================================
pause
