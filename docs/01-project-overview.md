# 🏛️ 01 - Project Overview & Architecture

## 🎯 Project Vision
**Passport & Stamp Studio Pro** is an ultra-fast, professional studio-grade photo maker designed for generating biometric passport photos, visa photos, and stamp-size photos with 300 DPI high-resolution export for printing.

---

## 🏗️ Architecture Design Principles

1. **Strict Line Limit (<= 100 Lines per File):**
   - The entire codebase is completely modularized.
   - No monolithic script or massive stylesheet.
   - High maintainability and clean single-responsibility components.

2. **Zero Build Step / Native ES Modules:**
   - Runs directly in the browser via standard ES Modules (`type="module"`).
   - Instant reloading and zero dependency overhead during local development.

3. **Data Flow & Reactive State Architecture:**
   - `js/core/state.js` acts as the single source of truth (`appState`).
   - UI Controllers subscribe to state changes or trigger canvas redraws.
   - Canvas engine (`js/core/canvas-engine.js`) handles composite rendering (Crop -> AI BG -> Filters -> Retouch -> Suit Overlay).

4. **Multi-tier Background Removal:**
   - Local AI: In-browser MediaPipe Selfie Segmentation (WebAssembly/WebGL).
   - Chroma Key / Floodfill: Client-side color distance algorithm.
   - Cloud Server AI Proxy: Node.js server routes to Clipdrop / Remove.bg / Stability / Photoroom.

5. **Print Sheet Engine:**
   - Precise mm-to-pixel calculations at 300 DPI (`DPI = 300`, `1 mm ≈ 11.811 px`).
   - Supports single-photo repeats and mixed multi-photo batch layouts on standard photo papers (4R, 5R, 6R, A4, Letter, Custom).

6. **Offline & PWA Support:**
   - Full offline readiness via `sw.js` (Service Worker cache).
   - Installable on Mobile, Tablet, and Desktop.
