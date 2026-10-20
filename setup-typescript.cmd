@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 goto missing_node
where npm.cmd >nul 2>&1
if errorlevel 1 goto missing_node
echo Installing this course's TypeScript dependencies...
call npm.cmd ci --ignore-scripts
if errorlevel 1 goto failed
echo Checking the reference lessons. Your practice files will not be changed.
call npm.cmd run verify:labs
if errorlevel 1 goto failed
echo.
echo Setup complete. You can now edit practice\finals\08.ts and run:
echo npm.cmd run lab -- 08 --check
pause
exit /b 0
:missing_node
echo Node.js or npm was not found. Install Node.js LTS from https://nodejs.org/en/download
pause
exit /b 1
:failed
echo.
echo Setup or verification failed. Keep the error above for troubleshooting.
pause
exit /b 1
