import { toastService } from '../ui/toast-service.js';
import { renderPhotoToCanvas } from '../core/canvas-engine.js';
import { appState } from '../core/state.js';
import { t } from '../config/i18n.js';
import { formatFileName } from './downloads/filename-formatter.js';
import { getBlobWithTargetKb, estimatePhotoKbSize } from './downloads/kb-compressor.js';
import { printCanvasDirect, exportSheetPDF } from './downloads/pdf-exporter.js';

export { formatFileName, getBlobWithTargetKb, estimatePhotoKbSize, printCanvasDirect, exportSheetPDF };

export async function downloadCanvasImage(canvas, filename, format = 'image/jpeg', maxTargetKb = null) {
  if (!canvas) return;
  const targetKb = maxTargetKb || appState.get('targetKbLimit') || null;
  const blob = await getBlobWithTargetKb(canvas, format, targetKb);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename; link.href = objectUrl; link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  const sizeKb = Math.round(blob.size / 1024);
  toastService.show(`${t('msg_downloaded') || 'Downloaded: '} ${filename} (${sizeKb} KB)`, 'success');
}

export async function downloadAllSheetPages(canvases, format = 'image/jpeg') {
  const canvasArray = (Array.isArray(canvases) && canvases.length > 0) ? canvases : (window._renderedSheetPages || [canvases]);
  if (!canvasArray.length || !canvasArray[0]) return;
  const ext = format === 'image/png' ? 'png' : 'jpg';

  if (canvasArray.length === 1) {
    downloadCanvasImage(canvasArray[0], formatFileName({ type: 'sheet', ext }), format);
    return;
  }
  toastService.show(`Downloading ${canvasArray.length} sheet pages...`, 'info');
  for (let i = 0; i < canvasArray.length; i++) {
    const fn = formatFileName({ type: 'sheet', ext, pageIndex: i + 1 });
    setTimeout(() => downloadCanvasImage(canvasArray[i], fn, format), i * 350);
  }
}

export function downloadSinglePhoto(formatOverride = null) {
  const format = formatOverride || appState.get('exportFormat') || 'image/jpeg';
  const tempCanvas = document.createElement('canvas');
  renderPhotoToCanvas(tempCanvas, { transparentBg: format === 'image/png' });
  const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : format === 'application/pdf' ? 'pdf' : 'jpg';
  const filename = formatFileName({ type: 'photo', ext });
  if (format === 'application/pdf') exportSheetPDF(tempCanvas, filename);
  else downloadCanvasImage(tempCanvas, filename, format);
}
