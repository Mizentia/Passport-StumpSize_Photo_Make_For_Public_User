import { appState } from '../../core/state.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { formatNumber } from './dimension-calculator.js';

export function updateLiveCustomPreview(elements, state) {
  const { input1, input2, selectUnit, selectDpi, customDpiInput, previewBox, warningBox, label1, label2, btnSwap } = elements;
  const isBn = appState.get('lang') === 'bn';

  if (state.isWidthFirst) {
    if (label1) label1.innerHTML = isBn ? '↔️ ১. প্রস্থ (Width)' : '↔️ 1. Width';
    if (label2) label2.innerHTML = isBn ? '↕️ ২. উচ্চতা (Height)' : '↕️ 2. Height';
    btnSwap?.setAttribute('title', isBn ? 'দিক পরিবর্তন (প্রস্থ ⇄ উচ্চতা)' : 'Swap Orientation (Width ⇄ Height)');
  } else {
    if (label1) label1.innerHTML = isBn ? '↕️ ১. উচ্চতা (Height)' : '↕️ 1. Height';
    if (label2) label2.innerHTML = isBn ? '↔️ ২. প্রস্থ (Width)' : '↔️ 2. Width';
    btnSwap?.setAttribute('title', isBn ? 'দিক পরিবর্তন (উচ্চতা ⇄ প্রস্থ)' : 'Swap Orientation (Height ⇄ Width)');
  }

  const v1 = Number(input1?.value) || 0, v2 = Number(input2?.value) || 0;
  const widthVal = state.isWidthFirst ? v1 : v2;
  const heightVal = state.isWidthFirst ? v2 : v1;
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

  const aspect = (heightVal > 0 && widthVal > 0) ? (widthVal / heightVal) : 1;
  let modeBadge = '';
  if (aspect > 1.05) modeBadge = `<span style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">↔ ${isBn ? 'ল্যান্ডস্কেপ' : 'Landscape'}</span>`;
  else if (aspect < 0.95) modeBadge = `<span style="background: rgba(59, 130, 246, 0.15); color: var(--accent-primary); padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">↕ ${isBn ? 'পোর্ট্রেট' : 'Portrait'}</span>`;
  else modeBadge = `<span style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6; padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">⬜ ${isBn ? 'স্কয়ার' : 'Square'}</span>`;

  const miniW = aspect >= 1 ? 38 : Math.max(18, Math.round(38 * aspect));
  const miniH = aspect <= 1 ? 44 : Math.max(18, Math.round(44 / aspect));

  if (previewBox) {
    previewBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 44px; height: 48px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--bg-surface); border-radius: 4px; border: 1px solid var(--border-subtle);">
          <div style="width: ${miniW}px; height: ${miniH}px; border: 2px dashed var(--accent-primary); border-radius: 3px; background: rgba(59, 130, 246, 0.12); transition: all 0.25s ease;"></div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 2px; flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; color: var(--text-main); font-size: 0.82rem;">${wMmStr} × ${hMmStr} ${mmUnit} (${wInchStr}×${hInchStr}")</span>
            ${modeBadge}
          </div>
          <div style="font-size: 0.73rem; color: var(--text-dim);">${pxWStr} × ${pxHStr} ${pxUnit} @ <strong style="color: var(--accent-primary);">${dpiStr} DPI</strong></div>
        </div>
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
