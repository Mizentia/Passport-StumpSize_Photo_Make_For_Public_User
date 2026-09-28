import { openDatabase, HISTORY_STORE } from './indexeddb-helper.js';

export async function putHistoryRecord(record) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite');
    const req = tx.objectStore(HISTORY_STORE).put(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getHistoryRecordById(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly');
    const req = tx.objectStore(HISTORY_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteHistoryRecord(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite');
    const req = tx.objectStore(HISTORY_STORE).delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export async function clearHistoryStore(typeFilter = 'all') {
  const db = await openDatabase();
  if (typeFilter === 'all') {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      const req = tx.objectStore(HISTORY_STORE).clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }
  const all = await getAllHistoryRecordsRaw();
  const tx = db.transaction(HISTORY_STORE, 'readwrite');
  const store = tx.objectStore(HISTORY_STORE);
  for (const item of all) {
    if (item.type === typeFilter) store.delete(item.id);
  }
  return new Promise((resolve) => { tx.oncomplete = () => resolve(true); });
}

export async function getAllHistoryRecordsRaw() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly');
    const req = tx.objectStore(HISTORY_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
