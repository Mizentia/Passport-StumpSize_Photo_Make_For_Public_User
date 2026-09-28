@echo off
title Passport & Stamp Studio - Local Network (WiFi) Host
color 0b
cd /d "%~dp0"

echo ================================================================
echo    PASSPORT & STAMP PHOTO STUDIO - LOCAL NETWORK HOST (WIFI)   
echo ================================================================
echo.
echo [1/3] Detecting Local Network IP Address...

:: Detect Local IPv4 Address using PowerShell
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias '*Wi-Fi*', '*Ethernet*', '*Local Area Connection*' -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1).IPAddress"`) do set LOCAL_IP=%%i

if "%LOCAL_IP%"=="" (
  for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1).IPAddress"`) do set LOCAL_IP=%%i
)

if "%LOCAL_IP%"=="" set LOCAL_IP=localhost

echo [2/3] Local IP Detected: %LOCAL_IP%
echo [3/3] Launching Public Studio Server on Port 8086...
echo.

:: Open Default Web Browser
start http://%LOCAL_IP%:8086/

:: Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  node server.js
) else (
  echo [Notice] Node.js not found in PATH, launching using PowerShell HTTP Server...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$port=8086; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://*:' + $port + '/'); $listener.Start();" ^
    "Write-Host 'Server running on http://%LOCAL_IP%:' $port; Write-Host 'Press Ctrl+C to stop.';" ^
    "while($listener.IsListening){ $ctx = $listener.GetContext(); $req = $ctx.Request; $res = $ctx.Response;" ^
    "$url = $req.RawUrl.Split('?')[0]; if($url -eq '/') { $url = '/index.html' };" ^
    "$file = Join-Path (Get-Location) $url.TrimStart('/');" ^
    "if(Test-Path $file -PathType Leaf){" ^
    "  $bytes = [System.IO.File]::ReadAllBytes($file);" ^
    "  $ext = [System.IO.Path]::GetExtension($file).ToLower();" ^
    "  if($ext -eq '.html'){$res.ContentType='text/html'}" ^
    "  elseif($ext -eq '.js'){$res.ContentType='application/javascript'}" ^
    "  elseif($ext -eq '.css'){$res.ContentType='text/css'}" ^
    "  elseif($ext -eq '.png'){$res.ContentType='image/png'}" ^
    "  elseif($ext -eq '.jpg' -or $ext -eq '.jpeg'){$res.ContentType='image/jpeg'}" ^
    "  $res.ContentLength64 = $bytes.Length; $res.OutputStream.Write($bytes, 0, $bytes.Length);" ^
    "} else { $res.StatusCode = 404 }; $res.Close(); }"
)

pause
