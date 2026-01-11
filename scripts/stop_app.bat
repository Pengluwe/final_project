@echo off
echo Stopping SkyMemories...

REM Navigate to project root relative to this script
cd /d "%~dp0.."

REM Kill all Node.js processes (Frontend & Backend)
echo Keying Node.js processes...
taskkill /F /IM node.exe /T 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Node.js processes stopped.
) else (
    echo No running Node.js processes found.
)

REM Stop MongoDB Docker container
echo Stopping MongoDB...
if exist "docker" (
    cd docker
    docker-compose stop
    cd ..
) else (
    echo Docker folder not found!
)

echo.
echo All SkyMemories services have been stopped.
pause
