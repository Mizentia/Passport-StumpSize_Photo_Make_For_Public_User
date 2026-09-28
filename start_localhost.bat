@echo off
title Passport & Stamp Studio - Localhost (PC Only)
color 0a
cd /d "%~dp0"

echo ================================================================
echo       PASSPORT & STAMP PHOTO STUDIO - LOCALHOST (PC ONLY)       
echo ================================================================
echo.
echo [1/2] Starting Studio Server on http://localhost:8086/ ...
echo [2/2] Launching Default Browser...
echo.

:: Open Default Web Browser
start http://localhost:8086/

:: Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  node server.js --local-only
) else (
  echo [Notice] Node.js not found in PATH, launching using PowerShell HTTP Server...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$port=8086; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:' + $port + '/'); $listener.Prefixes.Add('http://127.0.0.1:' + $port + '/'); $listener.Start();" ^
    "Write-Host 'Server running on http://localhost:' $port; Write-Host 'Press Ctrl+C to stop.';" ^
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
