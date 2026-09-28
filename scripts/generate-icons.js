const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconDir)) fs.mkdirSync(iconDir, { recursive: true });

function createSvgIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bgGrad)"/>
  <rect x="${size * 0.18}" y="${size * 0.18}" width="${size * 0.64}" height="${size * 0.64}" rx="${size * 0.1}" fill="none" stroke="url(#goldGrad)" stroke-width="${size * 0.04}" opacity="0.9"/>
  <text x="50%" y="58%" font-family="Arial, sans-serif" font-size="${size * 0.42}" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>`;
}

fs.writeFileSync(path.join(iconDir, 'icon-192.svg'), createSvgIcon(192));
fs.writeFileSync(path.join(iconDir, 'icon-512.svg'), createSvgIcon(512));
// Also write 192.png and 512.png as svg copies or minimal data if needed
fs.writeFileSync(path.join(iconDir, 'icon-192.png'), createSvgIcon(192));
fs.writeFileSync(path.join(iconDir, 'icon-512.png'), createSvgIcon(512));
console.log('App icons generated in icons/ directory');
