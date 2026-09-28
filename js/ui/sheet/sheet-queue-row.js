import { toBengaliNumeral } from '../../config/i18n.js';
import { generateThumbDataUrl } from '../../core/history-snapshot-builder.js';
import { batchManager } from '../../core/batch-manager.js';
import { appState } from '../../core/state.js';

export function createPhotoQueueRowElement(item, totalItems, isBn, triggerSheetRedraw) {
  const qty = Math.max(1, Number(item.quantityOnSheet) || 1);
  const row = document.createElement('div');
  row.className = 'sheet-photo-queue-row';
  row.style.cssText = 'display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.78rem;';

  const topRow = document.createElement('div');
  topRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; gap: 8px;';

  const left = document.createElement('div');
  left.style.cssText = 'display: flex; align-items: center; gap: 8px; overflow: hidden; flex: 1;';

  const thumbImg = document.createElement('img');
  thumbImg.src = item.thumbDataUrl || generateThumbDataUrl();
  thumbImg.style.cssText = 'width: 32px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle); background: #ffffff; flex-shrink: 0;';
  left.appendChild(thumbImg);

  const info = document.createElement('div');
  info.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
  const wMm = item.customSize?.widthMm || 40, hMm = item.customSize?.heightMm || 50;
  const wMmStr = isBn ? toBengaliNumeral(Math.round(wMm)) : Math.round(wMm);
  const hMmStr = isBn ? toBengaliNumeral(Math.round(hMm)) : Math.round(hMm);
  info.innerHTML = `
    <div style="font-weight: 700; color: var(--text-main); font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis;">${item.name || 'Photo'}</div>
    <div style="font-size: 0.72rem; color: var(--accent-primary); font-weight: 600;">${wMmStr} x ${hMmStr} mm</div>
  `;
  left.appendChild(info);

  const right = document.createElement('div');
  right.style.cssText = 'display: flex; align-items: center; gap: 4px; flex-shrink: 0;';

  const btnMinus = document.createElement('button');
  btnMinus.type = 'button'; btnMinus.className = 'btn-smart btn-sm'; btnMinus.textContent = '-';
  btnMinus.style.cssText = 'padding: 4px 8px; font-weight: 700; height: 30px; min-width: 26px;';
  btnMinus.addEventListener('click', () => {
    const cur = Math.max(1, qty - 1);
    batchManager.updateQuantity(item.id, cur);
    if (totalItems === 1) appState.set('sheetCopies', cur);
    triggerSheetRedraw();
  });

  const copiesInput = document.createElement('input');
  copiesInput.type = 'number'; copiesInput.min = '1'; copiesInput.max = '120'; copiesInput.value = qty;
  copiesInput.className = 'form-input'; copiesInput.style.cssText = 'width: 44px; height: 30px; font-size: 0.8rem; text-align: center; padding: 2px 4px;';
  copiesInput.addEventListener('change', (e) => {
    const cur = Math.max(1, Math.min(120, Number(e.target.value) || 1));
    batchManager.updateQuantity(item.id, cur);
    if (totalItems === 1) appState.set('sheetCopies', cur);
    triggerSheetRedraw();
  });

  const btnPlus = document.createElement('button');
  btnPlus.type = 'button'; btnPlus.className = 'btn-smart btn-sm'; btnPlus.textContent = '+';
  btnPlus.style.cssText = 'padding: 4px 8px; font-weight: 700; height: 30px; min-width: 26px;';
  btnPlus.addEventListener('click', () => {
    const cur = Math.min(120, qty + 1);
    batchManager.updateQuantity(item.id, cur);
    if (totalItems === 1) appState.set('sheetCopies', cur);
    triggerSheetRedraw();
  });

  right.appendChild(btnMinus); right.appendChild(copiesInput); right.appendChild(btnPlus);

  if (totalItems > 1) {
    const btnDel = document.createElement('button');
    btnDel.type = 'button'; btnDel.textContent = '🗑️'; btnDel.title = isBn ? 'মুছে ফেলুন' : 'Remove';
    btnDel.style.cssText = 'background: none; border: none; cursor: pointer; padding: 4px; font-size: 0.8rem; color: #ef4444;';
    btnDel.addEventListener('click', () => { batchManager.removeItem(item.id); triggerSheetRedraw(); });
    right.appendChild(btnDel);
  }

  topRow.appendChild(left); topRow.appendChild(right);
  row.appendChild(topRow);

  if (totalItems > 1) {
    const spaceRow = document.createElement('div');
    spaceRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding-top: 4px; border-top: 1px dashed var(--border-subtle); font-size: 0.72rem; color: var(--text-dim);';
    const label = document.createElement('span');
    label.textContent = isBn ? 'ফাঁকা স্থানে ফিট করুন:' : 'Fill empty space:';
    const chk = document.createElement('input');
    chk.type = 'checkbox'; chk.checked = item.allowRowSpaceSharing !== false;
    chk.addEventListener('change', (e) => { item.allowRowSpaceSharing = e.target.checked; triggerSheetRedraw(); });
    spaceRow.appendChild(label); spaceRow.appendChild(chk);
    row.appendChild(spaceRow);
  }

  return row;
}
