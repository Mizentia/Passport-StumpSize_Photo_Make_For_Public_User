import { appState } from '../core/state.js';
import { renderPrintSheet, getActivePaperConfig } from '../export/sheet-generator.js';
import { downloadAllSheetPages, exportSheetPDF, printCanvasDirect } from '../export/download-handler.js';
import { renderCustomPaperOptionsInSelect, setupCustomPaperModalController } from './custom-paper-manager.js';
import { batchManager } from '../core/batch-manager.js';
import { updateDynamicButtonLabels, updateComboVisibility } from './sheet/sheet-labels.js';
import { renderSheetBatchTray } from './sheet/sheet-batch-tray.js';
import { renderSheetPagesCards } from './sheet/sheet-pages-renderer.js';
import { bindSheetOptions } from './sheet/sheet-options-bind.js';
import { historyManager } from '../core/history-manager.js';

export function setupSheetUI(primarySheetCanvas, photoCanvas) {
  let redrawFrameId = null;

  function triggerSheetRedraw() {
    if (redrawFrameId) cancelAnimationFrame(redrawFrameId);
    redrawFrameId = requestAnimationFrame(() => {
      redrawFrameId = null;
      const result = renderPrintSheet(primarySheetCanvas, photoCanvas);
      updateDynamicButtonLabels();
      renderSheetPagesCards(result, primarySheetCanvas);
      renderSheetBatchTray(triggerSheetRedraw);
    });
  }

  setupCustomPaperModalController(() => {
    renderCustomPaperOptionsInSelect();
    triggerSheetRedraw();
  });

  renderCustomPaperOptionsInSelect();
  bindSheetOptions(triggerSheetRedraw);

  document.getElementById('paperPresetSelect')?.addEventListener('change', (e) => {
    appState.set('paperPreset', e.target.value);
    try { localStorage.setItem('passport_default_paper', e.target.value); } catch (_) {}
    const { marginMm, gapMm } = getActivePaperConfig();
    const inputMargin = document.getElementById('inputSheetMarginMm');
    const inputGap = document.getElementById('inputSheetGapMm');
    if (inputMargin) inputMargin.value = marginMm;
    if (inputGap) inputGap.value = gapMm;
    triggerSheetRedraw();
  });

  const handleExport = (format) => {
    const pages = window._renderedSheetPages || [primarySheetCanvas];
    if (format === 'pdf') exportSheetPDF(pages);
    else if (format === 'png') downloadAllSheetPages(pages, 'image/png');
    else downloadAllSheetPages(pages, 'image/jpeg');
  };

  document.getElementById('btnDownloadSheetUnified')?.addEventListener('click', () => {
    const format = document.getElementById('selectSheetExportFormat')?.value || 'jpg';
    handleExport(format);
  });
  document.getElementById('btnDownloadSheetJpg')?.addEventListener('click', () => handleExport('jpg'));
  document.getElementById('btnDownloadSheetPng')?.addEventListener('click', () => handleExport('png'));
  document.getElementById('btnDownloadSheetPdf')?.addEventListener('click', () => handleExport('pdf'));
  document.getElementById('btnPrintDirect')?.addEventListener('click', () => printCanvasDirect(window._renderedSheetPages || [primarySheetCanvas]));

  appState.on('lang', () => { renderCustomPaperOptionsInSelect(); updateDynamicButtonLabels(); triggerSheetRedraw(); });
  appState.on('dpi', () => { updateDynamicButtonLabels(); triggerSheetRedraw(); });
  appState.on('customPaperPresets', () => { renderCustomPaperOptionsInSelect(); triggerSheetRedraw(); });

  batchManager.onChange(() => {
    renderSheetBatchTray(triggerSheetRedraw);
    triggerSheetRedraw();
  });

  historyManager.onChange(() => {
    if (appState.get('activeTab') === 'sheet') {
      renderSheetBatchTray(triggerSheetRedraw);
    }
  });

  appState.on('activeTab', (tab) => {
    if (tab === 'sheet') {
      batchManager.saveActiveSnapshot();
      renderCustomPaperOptionsInSelect();
      updateDynamicButtonLabels();
      renderSheetBatchTray(triggerSheetRedraw);
      setTimeout(triggerSheetRedraw, 50);
    }
  });

  updateDynamicButtonLabels();
  return { triggerSheetRedraw };
}
