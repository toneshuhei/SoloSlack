@echo off
chcp 65001 >nul
REM SoloSlack Development Environment Stop Script (Windows)

echo [STOP] SoloSlack Development Environment Stop Script
echo ====================================================

REM Check current container status
echo [INFO] Current container status:
docker-compose ps

echo.
set /p confirm="Stop containers? (y/N): "
if /i not "%confirm%"=="y" (
    echo [CANCEL] Stop operation cancelled
    pause
    exit /b 1
)

echo [STOP] Stopping containers...
docker-compose down

echo [SUCCESS] SoloSlack stopped successfully
echo.
echo [INFO] Restart commands:
echo   Normal start: scripts\dev-start.bat
echo   Reload: scripts\dev-reload.bat
echo   Rebuild: scripts\dev-rebuild.bat
pause 