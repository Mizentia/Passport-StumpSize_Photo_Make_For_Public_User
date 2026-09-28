# ⚡ 04 - Image Processors & AI Engines (`js/processors/`)

The `js/processors/` directory contains all image manipulation, AI segmentation, filter pipelines, and retouching algorithms.

---

## 🎨 Background Removal Engines

| File Name | Purpose & Code Description |
| :--- | :--- |
| `bg-remover.js` | Main facade for background removal. Dispatches removal tasks to Local AI, Cloud Server Proxy, or Chroma Floodfill. |
| `bg-ai-engine.js` | MediaPipe Selfie Segmentation wrapper running locally inside the client browser. |
| `bg-floodfill.js` | Smart color distance thresholding and edge-connected floodfill for solid backdrop isolation. |
| `bg/bg-chroma-utils.js` | Color difference (delta-E) calculations and alpha feathering for chroma keying. |

---

## ✂️ Cropping & Biometrics

| File Name | Purpose & Code Description |
| :--- | :--- |
| `cropper.js` | Interactive canvas drag, pan, zoom, pinch gestures, and bounding box constraints. |
| `face-detector.js` | Lightweight facial landmark / face bounding estimator to assist biometric eye-line alignment. |
| `face/biometric-guides.js` | Draws standard ICAO / ISO biometric passport guidelines (crown, eye-line, chin range). |

---

## 🌟 Filters, Retouch & Attires

| File Name | Purpose & Code Description |
| :--- | :--- |
| `image-filters.js` | Applies brightness, contrast, exposure, saturation, temperature, and tint to pixel data. |
| `filter-kernels.js` | Fast 2D convolution matrix operations for unsharp masking and edge sharpening. |
| `retouch-engine.js` | High-level coordinator for skin smoothing, blemish healing, teeth whitening, and red-eye fixes. |
| `retouch/skin-smooth.js` | Bilateral-style smoothing filter that softens skin while preserving edge details. |
| `retouch/blemish-fix.js` | Patch-based texture synthesis and color interpolation to remove spots and pimples. |
| `retouch/teeth-whiten.js` | Desaturates yellows and boosts lightness in localized brush areas. |
| `retouch/red-eye.js` | Detects high-red pixel clusters in pupils and replaces them with natural dark tones. |
| `suit-overlay.js` | Renders formal suit/attire assets onto the canvas with scale, position, and flip transformations. |
