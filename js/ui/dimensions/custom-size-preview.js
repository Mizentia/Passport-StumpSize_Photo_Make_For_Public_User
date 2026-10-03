import { appState } from '../../core/state.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { formatNumber } from './dimension-calculator.js';

export function updateLiveCustomPreview(elements, state) {
  const { input1, input2, selectUnit, selectDpi, customDpiInput, previewBox, warningBox, label1, label2, btnSwap } = elements;
  const isBn = appState.get('lang') === 'bn';

  if (state.isHeightFirst) {
    if (label1) label1.textContent = isBn ? '২. উচ্চতা' : '2. Height';
    if (label2) label2.textContent = isBn ? '৩. প্রস্থ' : '3. Width';
    btnSwap?.setAttribute('title', isBn ? 'পোর্ট্রেট মোড ↕' : 'Portrait Mode ↕');
  } else {
    if (label1) label1.textContent = isBn ? '২. প্রস্থ' : '2. Width';
    if (label2) label2.textContent = isBn ? '৩. উচ্চতা' : '3. Height';
    btnSwap?.setAttribute('title', isBn ? 'ল্যান্ডস্কেপ মোড ↔' : 'Landscape Mode ↔');
  }

  const v1 = Number(input1?.value) || 0, v2 = Number(input2?.value) || 0;
  const heightVal = state.isHeightFirst ? v1 : v2;
  const widthVal = state.isHeightFirst ? v2 : v1;
  const unitVal = selectUnit?.value || 'mm';
  const targetDpi = selectDpi?.value === 'custom' ? (Number(customDpiInput?.value) || 300) : (Number(selectDpi?.value) || 300);

  let wMm = widthVal, hMm = heightVal, wInch = widthVal / 25.4, hInch = heightVal / 25.4;
  if (unitVal === 'inch') { wInch = widthVal; hInch = heightVal; wMm = widthVal * 25.4; hMm = heightVal * 25.4; }
  else if (unitVal === 'cm') { wMm = widthVal * 10; hMm = heightVal * 10; wInch = wMm / 25.4; hInch = hMm / 25.4; }
  else if (unitVal === 'px') { wMm = (widthVal / targetDpi) * 25.4; hMm = (heightVal / targetDpi) * 25.4; wInch = widthVal / targetDpi; hInch = heightVal / targetDpi; }

  let pxW = unitVal === 'px' ? Math.round(widthVal) : Math.round((wMm / 25.4) * targetDpi);
  let pxH = unitVal === 'px' ? Math.round(heightVal) : Math.round((hMm / 25.4) * targetDpi);

  const mmUnit = isBn ? 'মিমি' : 'mm', pxUnit = isBn ? 'পিক্সেল' : 'px';
  const wMmStr = formatNumber(wMm, isBn), hMmStr = formatNumber(hMm, isBn);
  const wInchStr = formatNumber(wInch, isBn), hInchStr = formatNumber(hInch, isBn);
  const pxWStr = isBn ? toBengaliNumeral(pxW) : pxW, pxHStr = isBn ? toBengaliNumeral(pxH) : pxH;
  const dpiStr = isBn ? toBengaliNumeral(targetDpi) : targetDpi;
  const labelPrefix = isBn ? '📏 সমতুল্য মাপ:' : '📏 Equivalent Size:';
  const modeBadge = state.isHeightFirst ?
    `<span style="background: rgba(59, 130, 246, 0.15); color: var(--accent-primary); padding: 1px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">↕ ${isBn ? 'পোর্ট্রেট' : 'Portrait'}</span>` :
    `<span style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 1px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">↔ ${isBn ? 'ল্যান্ডস্কেপ' : 'Landscape'}</span>`;

  if (previewBox) {
    previewBox.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div><strong>${labelPrefix}</strong> <span style="font-weight: 700; color: var(--accent-primary);">${wMmStr} x ${hMmStr} ${mmUnit}</span> &bull; <strong style="color: #10b981;">${wInchStr} x ${hInchStr}" (Inch)</strong></div>
          ${modeBadge}
        </div>
        <div style="font-size: 0.74rem; color: var(--text-dim);">${pxWStr} x ${pxHStr} ${pxUnit} @ <strong>${dpiStr} DPI</strong></div>
      </div>`;
  }

  if (warningBox) {
    if (wMm < 6 || hMm < 6) {
      warningBox.style.display = 'block';
      warningBox.innerHTML = isBn ? '⚠️ <strong>সতর্কতা:</strong> মাপ অত্যন্ত ছোট!' : '⚠️ <strong>Warning:</strong> Dimensions very small!';
    } else if (wMm > 500 || hMm > 500) {
      warningBox.style.display = 'block';
      warningBox.innerHTML = isBn ? '⚠️ <strong>সতর্কতা:</strong> মাপ অনেক বড়!' : '⚠️ <strong>Warning:</strong> Dimensions very large!';
    } else {
      warningBox.style.display = 'none';
    }
  }
}
