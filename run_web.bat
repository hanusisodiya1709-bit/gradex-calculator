@echo off
title GRADEX Web Prototype Launcher
echo ==========================================================
echo   Starting GRADEX Student Grade Calculator Prototype...
echo ==========================================================
python server.py
if errorlevel 1 (
    echo Python server failed to start, opening index.html directly...
    start index.html
)
pause
