import { appState } from '../../core/state.js';
import { toBengaliNumeral } from '../../config/i18n.js';

export function updateDynamicButtonLabels() {
  const dpi = appState.get('dpi') || 300;
  const isBn = appState.get('lang') === 'bn';
  const dpiStr = isBn ? toBengaliNumeral(dpi) : dpi;

  const btnUnified = document.getElementById('btnDownloadSheetUnified');
  if (btnUnified) btnUnified.textContent = isBn ? `⬇️ শিট ডাউনলোড` : `⬇️ Download Sheet`;

  const selFormat = document.getElementById('selectSheetExportFormat');
  if (selFormat) {
    const optJpg = selFormat.querySelector('option[value="jpg"]');
    const optPng = selFormat.querySelector('option[value="png"]');
    const optPdf = selFormat.querySelector('option[value="pdf"]');
    if (optJpg) optJpg.textContent = isBn ? `JPG (${dpiStr} DPI)` : `JPG (${dpiStr} DPI)`;
    if (optPng) optPng.textContent = isBn ? `PNG (লসলেস)` : `PNG (Lossless)`;
    if (optPdf) optPdf.textContent = isBn ? `PDF (প্রিন্ট রেডি)` : `PDF (Print Ready)`;
  }

  const btnJpg = document.getElementById('btnDownloadSheetJpg');
  if (btnJpg) btnJpg.textContent = isBn ? `🖼️ শিট ডাউনলোড (JPG ${dpiStr} DPI)` : `🖼️ Download Sheet (JPG ${dpiStr} DPI)`;

  const btnPng = document.getElementById('btnDownloadSheetPng');
  if (btnPng) btnPng.textContent = isBn ? `🖼️ শিট ডাউনলোড (PNG ${dpiStr} DPI)` : `🖼️ Download Sheet (PNG ${dpiStr} DPI)`;

  const btnPdf = document.getElementById('btnDownloadSheetPdf');
  if (btnPdf) btnPdf.textContent = isBn ? `📄 PDF ডাউনলোড (${dpiStr} DPI প্রিন্ট রেডি)` : `📄 Download PDF (${dpiStr} DPI Print Ready)`;

  const btnPrint = document.getElementById('btnPrintDirect');
  if (btnPrint) btnPrint.textContent = isBn ? `🖨️ সরাসরি প্রিন্ট (${dpiStr} DPI)` : `🖨️ Direct 1-Click Print (${dpiStr} DPI)`;

  const btnEditPaper = document.getElementById('btnEditCustomPaperSheet');
  if (btnEditPaper) btnEditPaper.style.display = 'inline-flex';
}

export function updateComboVisibility() {
  updateDynamicButtonLabels();
}
