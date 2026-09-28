const http = require('http');
const fs = require('fs');
const path = require('path');
const { MIME_TYPES, getLocalIPv4 } = require('./scripts/server-utils.js');
const { handleServerBgRemoval, handleServerConfigInfo } = require('./scripts/server-bg-proxy.js');
const { handleServerProjectBrand } = require('./scripts/server-brand-proxy.js');

const PORT = process.env.PORT || 8086;
const isLocalOnly = process.argv.includes('--local-only');
const HOST = isLocalOnly ? '127.0.0.1' : '0.0.0.0';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/api/bg-remove' && req.method === 'POST') return handleServerBgRemoval(req, res);
  if (reqPath === '/api/server-info' && req.method === 'GET') return handleServerConfigInfo(req, res);
  if (reqPath === '/api/project-brand') return handleServerProjectBrand(req, res, 8086, 'photo-public');
  if (reqPath === '/api/portal-control' && req.method === 'GET') {
    let isPublicActive = true;
    try {
      const cfgPath = path.join(__dirname, 'config', 'server-api-keys.json');
      if (fs.existsSync(cfgPath)) {
        const c = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
        if (c.is_public_active !== undefined) isPublicActive = Boolean(c.is_public_active);
      }
    } catch (_) {}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, isPublicActive }));
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
    fs.createReadStream(filePath).pipe(res);
  });
});

let currentPort = Number(PORT);
const shouldOpenBrowser = process.argv.includes('--open');

function startServer(portToTry) {
  server.listen(portToTry, HOST, () => {
    const localIP = getLocalIPv4();
    try { console.clear(); } catch (_) {}
    console.log('================================================================');
    console.log('       PASSPORT & STAMP PHOTO STUDIO PRO - LIVE SERVER          ');
    console.log('================================================================\n');
    console.log(isLocalOnly ? ` Mode: LOCALHOST ONLY | URL: http://localhost:${portToTry}/\n` : ` 💻 This PC URL:       http://localhost:${portToTry}/\n 📱 Mobile / WiFi URL: http://${localIP}:${portToTry}/\n`);
    console.log(' Server Status: RUNNING (Press Ctrl+C to stop)\n================================================================\n');

    if (shouldOpenBrowser) {
      const { exec } = require('child_process');
      const openUrl = isLocalOnly ? `http://localhost:${portToTry}/` : `http://${localIP}:${portToTry}/`;
      exec(`start ${openUrl}`);
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    let nextPort = currentPort + 1;
    if (nextPort === 8085) nextPort = 8087;
    if (nextPort <= 8100) {
      console.log(`⚠️ Port ${currentPort} is in use, switching to port ${nextPort}...`);
      currentPort = nextPort;
      startServer(currentPort);
    } else {
      console.error(`❌ Error: All ports from ${PORT} to ${nextPort - 1} occupied.`);
      process.exit(1);
    }
  } else {
    console.error('❌ Server error:', err);
  }
});

startServer(currentPort);
