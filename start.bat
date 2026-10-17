@echo off
REM ==============================================================================
REM LandLock Engine - Universal Start Script (Windows)
REM ==============================================================================
title LandLock Engine Launcher
cls

echo ================================================================
echo   LandLock Engine - Automated Injunction Registry (Windows)
echo ================================================================

REM 1. Database Check
echo.
echo [1/3] Checking Docker PostgreSQL database...
docker ps -a --format "{{.Names}}" | findstr /r "^landlockdb$" >nul
if %errorlevel% equ 0 (
    echo Starting existing landlockdb container...
    docker start landlockdb >nul 2>&1
) else (
    echo Creating and starting new landlockdb container on port 5433...
    docker run -d --name landlockdb -e POSTGRES_DB=landlockdb -e POSTGRES_USER=landlock -e POSTGRES_PASSWORD=landlock -p 5433:5432 postgres:15 >nul 2>&1
)
echo [OK] PostgreSQL is ready on port 5433.

REM 2. Start Spring Boot Backend
echo.
echo [2/3] Starting Spring Boot Backend (port 8080)...
cd server
start "LandLock Backend (Spring Boot)" cmd /k "mvn spring-boot:run"
cd ..

REM 3. Start React Frontend
echo.
echo [3/3] Starting React Frontend (port 5173)...
cd client
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
start "LandLock Frontend (Vite)" cmd /k "npm run dev"
cd ..

echo.
echo ================================================================
echo   LandLock Engine has been launched in background windows!
echo ================================================================
echo   Frontend URL:   http://localhost:5173
echo   Backend API:    http://localhost:8080
echo   Swagger UI:     http://localhost:8080/swagger-ui.html
echo.
echo Demo Accounts (Password: demo123):
echo   - court_officer1
echo   - order_approver1
echo   - registry_officer1
echo   - bank_officer1
echo   - citizen1
echo ================================================================
pause
