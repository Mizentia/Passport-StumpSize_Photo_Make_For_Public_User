import { toastService } from '../../ui/toast-service.js';
import { t } from '../../config/i18n.js';
import { formatFileName } from './filename-formatter.js';

export function printCanvasDirect(canvases) {
  const canvasArray = (Array.isArray(canvases) && canvases.length > 0) ? canvases : (window._renderedSheetPages || [canvases]);
  if (!canvasArray.length || !canvasArray[0]) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toastService.show(t('msg_popup_blocked') || 'Popup was blocked by browser', 'warning');
    return;
  }

  const pagesHtml = canvasArray.map((c) => `<div class="sheet-print-page"><img src="${c.toDataURL('image/png')}" /></div>`).join('');
  printWindow.document.write(`
    <!DOCTYPE html><html><head><title>Studio Photo Print - 300 DPI</title>
    <style>
      @page { margin: 0; size: auto; } html, body { margin: 0; padding: 0; background: #fff; }
      .sheet-print-page { display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; page-break-after: always; break-after: page; }
      .sheet-print-page:last-child { page-break-after: avoid; break-after: avoid; }
      img { max-width: 100%; max-height: 100%; object-fit: contain; }
    </style></head>
    <body>${pagesHtml}<script>window.onload = () => { window.print(); setTimeout(() => window.close(), 1000); };</script></body></html>
  `);
  printWindow.document.close();
}

export async function exportSheetPDF(canvases, filenameOverride = null) {
  const canvasArray = (Array.isArray(canvases) && canvases.length > 0) ? canvases : (window._renderedSheetPages || [canvases]);
  if (!canvasArray.length || !canvasArray[0]) return;
  const filename = filenameOverride || formatFileName({ type: 'sheet', ext: 'pdf' });

  if (!window.jspdf) {
    toastService.show('jsPDF library loading...', 'info');
    return;
  }
  const { jsPDF } = window.jspdf;
  const firstCanvas = canvasArray[0];
  const orientation = firstCanvas.width > firstCanvas.height ? 'l' : 'p';
  const pdf = new jsPDF({ orientation, unit: 'pt', format: [firstCanvas.width * 0.75, firstCanvas.height * 0.75] });

  canvasArray.forEach((c, idx) => {
    if (idx > 0) pdf.addPage([c.width * 0.75, c.height * 0.75], c.width > c.height ? 'l' : 'p');
    pdf.addImage(c.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, c.width * 0.75, c.height * 0.75);
  });

  pdf.save(filename);
  toastService.show(t('msg_pdf_exported') || 'PDF exported successfully', 'success');
}
