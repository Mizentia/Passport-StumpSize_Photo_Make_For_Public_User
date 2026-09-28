# 🌍 08 - Configurations & Localization (`js/config/`)

The `js/config/` directory contains standard country specifications, paper dimensions, formal suit vector assets, sample photos, and bilingual dictionary mappings.

---

## 📐 Presets & Asset Configurations

| File Name | Purpose & Code Description |
| :--- | :--- |
| `photo-presets.js` | Exports the full array of built-in country passport and visa specifications. |
| `presets-data.js` | Raw dimension definitions for BD Passport (40x50mm), BD Stamp (20x25mm), US Visa (2x2 inch / 51x51mm), Schengen (35x45mm), Indian Visa (51x51mm), Canadian Visa (50x70mm), etc. |
| `paper-presets.js` | Dimension standards for photo papers (4R: 102x152mm, 5R: 127x178mm, 6R: 152x203mm, A4: 210x297mm, Letter: 216x279mm). |
| `suit-assets.js` | Formal attire collection catalog (Men's suits, Women's formal wear, Blazers, Ties, Traditional attire). |
| `suits/men-suits.js` | SVG vector paths and rendering data for men's formal suits and coats. |
| `suits/women-suits.js` | SVG vector paths for women's formal jackets, blazers, and collared shirts. |
| `sample-assets.js` | High-quality sample portrait demo images for instant one-click testing. |

---

## 🌐 Internationalization (i18n) Engine

| File Name | Purpose & Code Description |
| :--- | :--- |
| `i18n.js` | Translation loader and getter function `t(key)`. Supports instant runtime language switching between English and Bangla (`en` / `bn`). |
| `locales/en/general.js` | English dictionary for common UI labels, buttons, and navigation tabs. |
| `locales/en/editor.js` | English dictionary for cropping, transformation, filter sliders, and retouching tools. |
| `locales/en/sheet.js` | English dictionary for print sheet layout, paper sizes, and export options. |
| `locales/en/messages.js` | English dictionary for toast notifications, alerts, and system feedback messages. |
| `locales/bn/general.js` | Bengali (বাংলা) dictionary for common UI labels, buttons, and navigation. |
| `locales/bn/editor.js` | Bengali (বাংলা) dictionary for editing, filters, presets, and retouching tools. |
| `locales/bn/sheet.js` | Bengali (বাংলা) dictionary for sheet options, print formats, and download actions. |
| `locales/bn/messages.js` | Bengali (বাংলা) dictionary for notifications and feedback messages in Bengali. |
