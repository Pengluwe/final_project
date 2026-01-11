@echo off
echo Starting SkyMemories...

REM Navigate to project root relative to this script
cd /d "%~dp0.."

REM Start MongoDB if not running
echo Checking MongoDB...
if exist "docker" (
    cd docker
    docker-compose up -d
    cd ..
) else (
    echo Docker folder not found!
    pause
    exit
)

REM Start Frontend and Backend
echo Starting Application...
npm start

pause
