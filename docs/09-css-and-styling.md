# 🎨 09 - CSS Design System & Responsive Layouts (`css/`)

The `css/` directory implements a fully customized, modular design system with dark/light studio themes and responsive breakpoints for mobile, tablet, and desktop screens.

---

## 🎨 Design Tokens & Core Layout

| File Name | Purpose & Code Description |
| :--- | :--- |
| `variables.css` | CSS custom property definitions: color tokens, background shades, accent gradients, border radiuses, typography, and shadows for both dark and light modes. |
| `base.css` | Global CSS reset, box-sizing, custom scrollbars, typography, and layout containers. |
| `header-nav.css` | Top navigation bar styling, tabs, language switcher pill, and theme toggle buttons. |
| `upload-section.css` | Dropzone upload interface, dashed animation borders, file preview cards, and webcam trigger styling. |
| `editor-workspace.css` | 3-column desktop editor layout (`Left Sidebar` - `Canvas` - `Right Sidebar`). |
| `canvas-workspace.css` | Interactive canvas viewport, pan/zoom handlers, guideline overlays, and corner indicators. |
| `toolbars.css` | Floating bottom canvas toolbar for quick zoom, rotate, fit-to-screen, and guideline toggling. |
| `buttons.css` | Button styles (primary, secondary, danger, icon-only, subtle) and loading spinners. |
| `toast.css` | Toast notification animations, progress bars, and status icons. |

---

## 📱 Responsive & Specialized Panels (`css/`)

| File Name | Purpose & Code Description |
| :--- | :--- |
| `responsive.css` & `responsive-tablets.css` | Breakpoints for tablets (768px - 1024px) converting 3 columns into flexible 2 columns. |
| `responsive-mobile-core.css` | Mobile layout styles (< 768px) with full-width stacked views. |
| `responsive-mobile-canvas.css` | Optimizes canvas viewport for touch screen pinch-to-zoom on mobile devices. |
| `responsive-mobile-panels.css` | Collapsible accordions and bottom sheets for sidebar controls on mobile. |
| `responsive-small.css` | Micro-screens (< 400px) compact spacing adjustments. |
| `batch-tray.css` | Bottom multi-image batch queue tray and thumbnail carousel styling. |
| `sheet-panel.css` & `sheet/` | Print sheet options panel, paper size selector cards, and export action bar. |
| `history-tab.css` | Draft timeline grid, snapshot cards, action buttons, and search bar. |
| `modals.css` & `modals/` | Modal backdrop, animations, dialog layouts, settings tabs, and form elements. |
| `sidebar/` | Sidebar tool cards, accordion headers, slider rows, and color swatch palettes. |
