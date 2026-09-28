const os = require('os');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.tflite': 'application/octet-stream',
  '.onnx': 'application/octet-stream',
  '.bin': 'application/octet-stream'
};

function getLocalIPv4() {
  const interfaces = os.networkInterfaces();
  let candidate = '127.0.0.1';
  for (const name of Object.keys(interfaces)) {
    const isPrimary = /wi-fi|ethernet|wlan|lan|local/i.test(name);
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (isPrimary && (iface.address.startsWith('192.168.') || iface.address.startsWith('10.'))) {
          return iface.address;
        }
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.')) candidate = iface.address;
      }
    }
  }
  if (candidate !== '127.0.0.1') return candidate;
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return '127.0.0.1';
}

module.exports = { MIME_TYPES, getLocalIPv4 };
