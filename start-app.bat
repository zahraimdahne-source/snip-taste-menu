@echo off
echo Starting Snip Taste App...
cd /d "%~dp0"
start "Snip Taste Dev Server" cmd /k npm run dev
echo App is running! Check the new window.
pause
