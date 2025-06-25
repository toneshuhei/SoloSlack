@echo off
chcp 65001 >nul
REM SoloSlack Development Environment Initial Startup Script (Windows)
REM First startup or development environment setup

echo [START] SoloSlack Development Environment Initial Startup Script
echo ===============================================================

REM Check if Docker is available
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed
    echo Please install Docker and try again
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed
    echo Please install Docker Compose and try again
    pause
    exit /b 1
)

REM Stop existing containers
echo [STOP] Stopping existing containers...
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
        echo [SUCCESS] SoloSlack started successfully!
        echo.
        echo [URL] Access URL: http://localhost:8000
        echo [STATUS] Container status:
        docker-compose ps
        echo.
        echo [COMMANDS] Useful commands:
        echo   Source code reload: scripts\dev-reload.bat
        echo   Dependency rebuild: scripts\dev-rebuild.bat
        echo   View logs: docker-compose logs -f
        echo   Stop: docker-compose down
        pause
        exit /b 0
    )
    echo [WAIT] Starting... (%%i/15)
    timeout /t 3 /nobreak >nul
)

echo [ERROR] Failed to start SoloSlack
echo Check logs: docker-compose logs soloslack
pause 