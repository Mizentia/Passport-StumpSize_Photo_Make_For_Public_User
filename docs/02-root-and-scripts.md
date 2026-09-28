# 📁 02 - Root Files & Scripts Directory

This document details all root-level execution files and automated auditing/server scripts.

---

## 🗂️ Root Files Breakdown

| File Name | Purpose & Functionality |
| :--- | :--- |
| `index.html` | Application entry HTML point. Loads external fonts (Google Fonts), CDNs (jsPDF, MediaPipe), CSS files, and initiates `dom-loader.js` and `app.js`. |
| `server.js` | Zero-dependency Node.js HTTP server. Serves static files with MIME types, provides auto-port switching (8085-8100), network IP detection, and proxies AI background removal requests. |
| `sw.js` | Service Worker for offline PWA functionality. Caches core UI assets and falls back gracefully when offline. |
| `manifest.json` | Web App Manifest defining app name, icons, standalone display mode, and theme color for PWA installation. |
| `start_localhost.bat` | Windows batch script to launch the app restricted to `localhost:8085` and open the default browser. |
| `start_local_network.bat` | Windows batch script to launch the app on `0.0.0.0`, display the local Wi-Fi IP, and open the browser. |

---

## 🛠️ `scripts/` Directory Breakdown

| File Name | Purpose & Code Description |
| :--- | :--- |
| `scripts/audit-line-counts.js` | Validates that **all project files** (JS, CSS, HTML, JSON, MD) strictly adhere to the `<= 100 lines` rule. |
| `scripts/verify-syntax.js` | Runs `node --check` across all JS files in the project to catch any syntax or parsing errors. |
| `scripts/audit-i18n.js` | Scans all `t('key')` calls in JS and `data-i18n` attributes in HTML, ensuring 100% dictionary match in English and Bangla. |
| `scripts/generate-icons.js` | Generates standard 192x192 and 512x512 PWA icons in the `icons/` folder. |
| `scripts/server-bg-proxy.js` | Backend routing logic for handling background removal API requests (`/api/bg-remove`) and provider configuration. |
| `scripts/server-provider-callers.js` | API client integrations for third-party background removal services (Clipdrop, Remove.bg, Photoroom, Stability AI, Pixelcut). |
| `scripts/server-utils.js` | Utilities for network IPv4 address lookup and MIME type resolution for the HTTP server. |
