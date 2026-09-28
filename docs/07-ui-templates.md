# 🖼️ 07 - UI Templates & View Components (`js/ui/templates/`)

The `js/ui/templates/` directory provides pure functional HTML generation modules that assemble the entire responsive DOM tree with i18n data attributes.

---

## 🏛️ Layout & Tab Views

| File Name | Purpose & Code Description |
| :--- | :--- |
| `header-nav-view.js` | Top navigation bar containing app logo, language toggle, theme toggle, and 4 main tabs. |
| `upload-tab-view.js` | Drag-and-drop file upload zone, file picker button, sample photo loader, and webcam capture CTA. |
| `editor-canvas-view.js` | Central workspace holding the interactive `#mainCanvas`, zoom toolbar, biometric toggle, and guide lines. |
| `editor-sidebar-left-view.js` | Left panel holding Preset country cards, manual sorting toggle, backdrop color picker, and AI cutout controls. |
| `editor-sidebar-right-view.js` | Right panel holding Transform controls, Color Filter sliders, AI Retouch tools, and Formal Suit selector. |
| `sheet-tab-view.js` | Print sheet preview canvas container, paper size cards, zoom controls, and export format buttons. |
| `sheet-options-view.js` | Controls for sheet photo count, spacing gaps, margins, cutting lines, and mixed multi-size photo layout. |
| `history-tab-view.js` | History timeline container with draft search bar, clear history button, and JSON import/export actions. |
| `history-card-renderer.js` | HTML card template for individual historical snapshot items with thumbnail, preset badge, and restore CTA. |

---

## ⚙️ Modals & Settings Dialogs

| File Name | Purpose & Code Description |
| :--- | :--- |
| `custom-size-modal-view.js` | Modal template for inputting custom photo width, height, unit (mm/inch/px), DPI, and preset name. |
| `custom-paper-modal-view.js` | Modal template for creating custom printer sheet paper sizes (e.g. 8x10 inch, 12x18 inch). |
| `webcam-modal-view.js` | Modal containing live video feed, camera flip button, countdown timer, and snap capture button. |
| `settings-modal-view.js` | Main modal wrapper with tabbed settings navigation. |
| `settings-backdrop-view.js` | Settings panel for default studio backdrop color swatches and chroma thresholds. |
| `settings-cloud-engines-view.js` | Settings panel for configuring AI Background removal providers and API keys (Clipdrop, Remove.bg, etc.). |
| `settings-shortcuts-view.js` | Interactive keybinding customizer for all global and editor hotkeys. |
| `settings-standards-storage-view.js` | IndexedDB storage stats, draft auto-save interval, and factory reset actions. |
| `settings-branding-view.js` | Studio branding info and watermark toggle settings. |
| `settings-tabs-view.js` | Navigation tabs layout inside the Settings dialog. |
