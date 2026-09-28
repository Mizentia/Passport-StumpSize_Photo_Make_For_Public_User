import { getAllHistoryRecordsRaw, putHistoryRecord } from './history-store.js';

export async function exportHistoryToJson() {
  const records = await getAllHistoryRecordsRaw();
  const payload = {
    version: 1,
    app: 'PassportPhotoMakerPro',
    exportedAt: new Date().toISOString(),
    count: records.length,
    records
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `photo-studio-history-${dStr}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
  return records.length;
}

export async function importHistoryFromJson(file) {
  if (!file) throw new Error('No file provided');
  const text = await file.text();
  const data = JSON.parse(text);
  const records = Array.isArray(data) ? data : (data.records || []);
  if (!Array.isArray(records) || records.length === 0) return 0;

  let importedCount = 0;
  for (const item of records) {
    if (item && item.id && item.snapshot && item.snapshot.originalImageData) {
      await putHistoryRecord(item);
      importedCount++;
    }
  }
  return importedCount;
}
