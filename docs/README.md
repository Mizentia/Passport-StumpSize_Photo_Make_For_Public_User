# 📘 Passport & Stamp Studio Pro - Documentation Hub

Welcome to the comprehensive architecture and file documentation for **Passport & Stamp Studio Pro**.

> 💡 **নোট:** এই ফোল্ডারের প্রতিটি ফাইল সম্পূর্ণ প্রজেক্টের ফাইল স্ট্রাকচার, কোন ফাইলের কি কাজ এবং কীভাবে কোড সাজানো আছে তা বিস্তারিতভাবে তুলে ধরে যাতে ম্যানুয়ালি খোঁজাখুঁজি না করে দ্রুত ডেভেলপমেন্ট ও পরিবর্তন করা যায়।

---

## 📊 Project File Statistics

- **Total Project Files:** 211+
- **Architecture Rule:** Every file is strictly **<= 100 lines**.
- **Supported Languages:** English (EN) & Bangla (BN - বাংলা).
- **Core Technology:** Vanilla JavaScript (ES Modules), HTML5 Canvas (300 DPI), CSS3, Node.js Local Server.

---

## 📑 Documentation Index (সূচিপত্র)

| File | Topic & Scope |
| :--- | :--- |
| [01-project-overview.md](file:///docs/01-project-overview.md) | High-level architecture, state flow & lifecycle. |
| [02-root-and-scripts.md](file:///docs/02-root-and-scripts.md) | Root files (`index.html`, `server.js`, `sw.js`, `.bat`) & `scripts/`. |
| [03-core-system.md](file:///docs/03-core-system.md) | `js/core/` - Reactive state, canvas engine, storage, history, batch. |
| [04-processors.md](file:///docs/04-processors.md) | `js/processors/` - AI bg removal, filters, crop, face detection, suits. |
| [05-export-engine.md](file:///docs/05-export-engine.md) | `js/export/` - Sheet generator, 300 DPI calculations, PDF & image export. |
| [06-ui-controllers.md](file:///docs/06-ui-controllers.md) | `js/ui/` - Event handlers, tab switching, sliders, webcam, hotkeys. |
| [07-ui-templates.md](file:///docs/07-ui-templates.md) | `js/ui/templates/` - HTML structure generator functions for views & modals. |
| [08-config-and-i18n.md](file:///docs/08-config-and-i18n.md) | `js/config/` - Presets, paper sizes, English & Bangla locales. |
| [09-css-and-styling.md](file:///docs/09-css-and-styling.md) | `css/` - Design tokens, themes, responsive breakpoints, UI styles. |
| [10-developer-handbook.md](file:///docs/10-developer-handbook.md) | Maintenance rules, adding presets/engines, and guidelines. |

---

## ⚡ Quick Start Commands
- **Launch Localhost:** Double-click `start_localhost.bat` or run `node server.js --local-only --open`
- **Launch on Wi-Fi Network:** Double-click `start_local_network.bat` or run `node server.js --open`
- **Audit Line Counts:** `node scripts/audit-line-counts.js`
- **Verify Syntax:** `node scripts/verify-syntax.js`
- **Audit i18n Keys:** `node scripts/audit-i18n.js`
