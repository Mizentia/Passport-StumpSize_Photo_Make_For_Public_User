# 🎮 06 - UI Controllers & Interactions (`js/ui/`)

The `js/ui/` directory connects the visual DOM elements to state updates, canvas rendering, and user input events.

---

## 🗂️ Core UI Controllers

| File Name | Purpose & Code Description |
| :--- | :--- |
| `dom-loader.js` | Assembles all HTML template strings and injects the complete interface into `#app-root`. |
| `tab-manager.js` | Handles top navigation tabs (`Upload`, `Editor`, `Print Sheet`, `History`) with state synchronization. |
| `editor-ui.js` | Top coordinator for editor toolbars, sidebar panels, zoom controls, and redraw bindings. |
| `editor-transform-ui.js` | Controls for rotation, flip horizontal/vertical, pan reset, and scale slider bindings. |
| `editor-filter-ui.js` | Connects brightness, contrast, exposure, saturation, temperature, and tint sliders. |
| `editor-retouch-ui.js` | UI controls for AI facial retouching tools (smooth, blemish, red-eye, teeth whitening). |
| `editor-attire-ui.js` | Attire/suit selector grid, scale/position controls, and gender/category tabs. |
| `editor-dimension-ui.js` | Presets grid, unit switcher (mm/inch/px), aspect ratio lock, and custom size triggers. |
| `editor-hotkeys.js` | Global keyboard shortcuts (Ctrl+Z undo, Ctrl+Y redo, R rotate, + / - zoom, 1-4 tabs). |

---

## 📋 Modals, Sheet & Peripherals (`js/ui/`)

| File Name | Purpose & Code Description |
| :--- | :--- |
| `sheet-ui.js` | Paper selector (4R/A4), photo repeat count, gap controls, margin sliders, and print preview. |
| `history-ui.js` & `history-controller.js` | Renders snapshot cards, undo/redo buttons, timestamp labels, and draft restore actions. |
| `webcam-controller.js` & `camera-stream-helper.js` | Native webcam stream capture, mobile device camera fallback, and timer countdown. |
| `batch-ui.js` | Bottom tray thumbnail carousel for multi-photo batch management and switching. |
| `settings-modal-ui.js` | Config modal for API keys, default DPI, paper preferences, and AI server endpoints. |
| `custom-preset-manager.js` | Modal controller for creating and saving custom country/size photo presets. |
| `custom-paper-manager.js` | Modal controller for creating custom printer sheet paper sizes. |
| `lang-switcher.js` | Real-time language switcher between English and Bangla with dynamic DOM updates. |
| `theme-manager.js` | Dark/Light studio theme toggle with persistent storage in localStorage. |
| `toast-service.js` | Floating toast notifications for success, error, info, and loading states. |
| `tooltip-manager.js` | Dynamic hover tooltips showing descriptions and keyboard shortcuts. |
