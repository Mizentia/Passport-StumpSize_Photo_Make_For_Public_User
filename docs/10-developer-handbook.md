# 👨‍💻 10 - Developer Handbook & Maintenance Guide

This handbook provides practical guidelines for extending features, adding new presets/engines, and maintaining the strict architecture requirements.

---

## 📏 Core Architecture Rule: <= 100 Lines

> ⚠️ **CRITICAL RULE:** Every file in this project (JS, CSS, HTML, JSON, MD) must strictly contain **<= 100 lines of code**.

### How to add new features without violating line limits:
1. **Break down components:** If a controller grows beyond 80 lines, extract helper functions or sub-handlers into a dedicated sub-file (e.g. `feature/sub-handler.js`).
2. **Modularize templates:** Keep HTML generation functions concise and focused on single cards or modals.
3. **Run the automated audit script:**
   ```bash
   node scripts/audit-line-counts.js
   ```

---

## 🛠️ Common Development Tasks

### 1. Adding a New Country Photo Preset
1. Open `js/config/presets-data.js`.
2. Add your new preset object with width, height (in mm), aspect ratio, and ICAO guideline boundaries.
3. Add translations for the preset name in `js/config/locales/en/` and `js/config/locales/bn/`.

### 2. Adding a New Background Removal Provider
1. Open `scripts/server-provider-callers.js` and implement the API caller function.
2. Register the engine ID in `scripts/server-bg-proxy.js`.
3. Add the engine option in `js/ui/sidebar/engine-meta.js`.

### 3. Adding New UI Translations (i18n)
1. Add the key and English text in `js/config/locales/en/*.js`.
2. Add the corresponding Bengali translation in `js/config/locales/bn/*.js`.
3. Verify translation coverage by running:
   ```bash
   node scripts/audit-i18n.js
   ```

---

## 🧪 Quality Assurance & Test Commands

Before committing or deploying, run the full validation suite:
```bash
# 1. Check all file line counts (<= 100 lines)
node scripts/audit-line-counts.js

# 2. Verify JavaScript syntax
node scripts/verify-syntax.js

# 3. Verify bilingual translation dictionary
node scripts/audit-i18n.js
```
