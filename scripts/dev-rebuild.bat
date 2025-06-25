@echo off
chcp 65001 >nul
REM SoloSlack Development Rebuild Script (Windows)
REM Rebuild when dependencies change

echo [REBUILD] SoloSlack Development Rebuild Script
echo =============================================

REM Stop containers
echo [STOP] Stopping containers...
docker-compose down

REM Build image
echo [BUILD] Building Docker image...
docker-compose build

REM Start containers
echo [START] Starting containers...
docker-compose up -d

echo [WAIT] Waiting for startup completion...
timeout /t 5 /nobreak >nul

REM Health check
echo [HEALTH] Performing health check...
for /l %%i in (1,1,15) do (
    curl -s http://localhost:8000/health >nul 2>&1
    if not errorlevel 1 (
        echo [SUCCESS] SoloSlack started successfully
        echo [URL] Access: http://localhost:8000
        pause
        exit /b 0
    )
    echo [WAIT] Starting... (%%i/15)
    timeout /t 3 /nobreak >nul
)

echo [ERROR] Failed to start SoloSlack
echo Check logs: docker-compose logs soloslack
pause 