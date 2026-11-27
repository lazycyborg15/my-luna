@echo off
title Birthday Letter Server
echo Starting server...
echo.
echo Open in your browser:
echo http://localhost:8000/index.html
echo http://localhost:8000/letter.html
echo.
echo Press Ctrl+C to stop the server.
echo.
python -m http.server 8000
pause
