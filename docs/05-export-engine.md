# 🖨️ 05 - Export Engine & Print Sheet (`js/export/`)

The `js/export/` directory contains all layout engines, 300 DPI canvas rasterizers, multi-photo packing calculators, and file download handlers.

---

## 📄 Print Sheet Layout & Calculation

| File Name | Purpose & Code Description |
| :--- | :--- |
| `sheet-generator.js` | Top-level print sheet coordinator. Calculates total columns, rows, spacing, and orchestrates the sheet canvas render. |
| `sheet-drawer.js` | Canvas drawing pipeline for photo tiling, border strokes, spacing gaps, and corner cutting guides (crop marks). |
| `paper-config-helper.js` | Converts paper physical dimensions (mm/inches) into exact pixel dimensions at 300 DPI. |
| `drawer/sheet-crop-marks.js` | Renders high-precision cutting guide lines and cross-hair corner marks for physical paper trimming. |
| `drawer/sheet-border.js` | Draws customizable 1px/2px outer borders around each individual photo on the sheet. |

---

## 💾 File Exporters & Downloads (`js/export/`)

| File Name | Purpose & Code Description |
| :--- | :--- |
| `download-handler.js` | Exporter hub managing single photo and full sheet exports with custom naming and DPI metadata. |
| `downloads/single-photo-downloader.js` | Exports the single cropped and edited photo as high-res 300 DPI PNG or JPEG. |
| `downloads/sheet-image-downloader.js` | Generates full-sheet image downloads in PNG and JPEG formats ready for instant photo lab printing. |
| `downloads/pdf-exporter.js` | Integrates `jsPDF` to build exact physical-dimension vector PDF documents at 300 DPI for standard office/home printers. |
| `downloads/bulk-batch-downloader.js` | Iterates over the batch queue and exports all processed photos in sequential order. |
