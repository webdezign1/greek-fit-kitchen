@echo off
echo Starting local web server for Greek Fit Kitchen...
start "" "http://localhost:8080/index.html"
python -m http.server 8080
pause
