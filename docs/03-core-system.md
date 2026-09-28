# 🧠 03 - Core System & State Management (`js/core/`)

The `js/core/` directory contains the foundational business logic, state store, canvas rendering engine, and local storage abstractions.

---

## 🗃️ `js/core/` Files Breakdown

| File Name | Purpose & Code Description |
| :--- | :--- |
| `state.js` | `AppState` singleton class providing reactive state storage (`get`, `set`, `update`, `subscribe`). Dispatches events on updates. |
| `state-defaults.js` | Default state configuration containing initial crop coordinates, filter values, backdrop colors, attire configs, and sheet settings. |
| `canvas-engine.js` | Core drawing orchestrator. Renders the layered composition on the editor canvas: background -> segmented/original photo -> color filters -> retouch overlay -> suit overlay -> biometric guide overlays. |
| `storage-manager.js` | Manages persistence to `localStorage` and `IndexedDB`. Handles autosave, active session restoration, and draft recovery. |
| `indexeddb-helper.js` | Promise-wrapped IndexedDB abstraction for storing large binary objects (original and processed photo blobs). |
| `batch-manager.js` | Manages the queue of multiple uploaded photos, tracking active selection, thumbnails, and batch status. |
| `photo-preset-store.js` | Loads default country/photo presets, saves user-customized presets to storage, and tracks usage frequencies. |

---

## 📜 History & Undo/Redo Sub-modules (`js/core/`)

| File Name | Purpose & Code Description |
| :--- | :--- |
| `history-manager.js` | Controller for undo/redo stacks, auto-saving drafts, and triggering timeline refreshes. |
| `history-store.js` | Manages snapshots stored in IndexedDB with timestamps, names, and thumbnail generation. |
| `history-snapshot-builder.js` | Serializes the active state and canvas snapshot into a restorable history entry. |
| `history-restorer.js` | Deserializes a saved snapshot back into active `appState` and triggers canvas repainting. |
| `history-query.js` | Search and filter utilities for querying historical drafts by date, name, or preset. |
| `history-import-export.js` | Exports the full history store as a downloadable JSON backup and handles restoring JSON backups. |
