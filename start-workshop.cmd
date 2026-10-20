@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 goto missing_node
echo Open http://127.0.0.1:8766/workshop/#01 in your browser.
echo Keep this window open. Press Ctrl+C to stop the workshop.
node scripts\serve-workshop.mjs
echo.
pause
exit /b
:missing_node
echo Node.js was not found. Install Node.js LTS from https://nodejs.org/en/download
echo Then close this window and run this file again.
pause
exit /b 1
