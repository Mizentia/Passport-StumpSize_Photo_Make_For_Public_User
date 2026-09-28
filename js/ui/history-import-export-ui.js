import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';
import { exportHistoryToJson, importHistoryFromJson } from '../core/history-import-export.js';

export function setupHistoryImportExport(controller) {
  const btnExport = document.getElementById('btnExportHistory');
  const btnImport = document.getElementById('btnImportHistory');
  const fileInput = document.getElementById('inputImportHistoryFile');

  btnExport?.addEventListener('click', async () => {
    try {
      const count = await exportHistoryToJson();
      toastService.show(t('msg_history_exported'), 'success');
    } catch (err) {
      toastService.show(t('msg_history_import_error'), 'error');
    }
  });

  btnImport?.addEventListener('click', () => {
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  });

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importHistoryFromJson(file);
      if (count > 0) {
        toastService.show(t('msg_history_imported').replace('{count}', count), 'success');
        controller.loadPage(true);
      } else {
        toastService.show(t('msg_history_import_empty'), 'warning');
      }
    } catch (err) {
      toastService.show(t('msg_history_import_error'), 'error');
    }
  });
}
