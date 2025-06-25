@echo off
chcp 65001 >nul
REM SoloSlack Development Reload Script (Windows)
REM Reload source code changes (no rebuild)

echo [RELOAD] SoloSlack Development Reload Script
echo ===========================================

REM Check if container is running
docker-compose ps | findstr "soloslack.*Up" >nul
if errorlevel 1 (
    echo [ERROR] SoloSlack container is not running
    echo Please start container first with: docker-compose up -d
    pause
    exit /b 1
)

echo [RESTART] Restarting container...
docker-compose restart soloslack

echo [WAIT] Waiting for startup completion...
timeout /t 3 /nobreak >nul

REM Health check
echo [HEALTH] Performing health check...
for /l %%i in (1,1,10) do (
    curl -s http://localhost:8000/health >nul 2>&1
    if not errorlevel 1 (
        echo [SUCCESS] SoloSlack started successfully
        echo [URL] Access: http://localhost:8000
        pause
        exit /b 0
    )
    echo [WAIT] Starting... (%%i/10)
    timeout /t 2 /nobreak >nul
)

echo [ERROR] Failed to start SoloSlack
echo Check logs: docker-compose logs soloslack
pause 