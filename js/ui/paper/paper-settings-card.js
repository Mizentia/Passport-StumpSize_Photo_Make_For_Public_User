import { toBengaliNumeral } from '../../config/i18n.js';

export function renderPaperItemRowHtml(paper, index, totalCount, isBn) {
  const wInch = Math.round((paper.widthMm / 25.4) * 100) / 100;
  const hInch = Math.round((paper.heightMm / 25.4) * 100) / 100;
  const wMmStr = isBn ? toBengaliNumeral(Math.round(paper.widthMm * 10) / 10) : (Math.round(paper.widthMm * 10) / 10);
  const hMmStr = isBn ? toBengaliNumeral(Math.round(paper.heightMm * 10) / 10) : (Math.round(paper.heightMm * 10) / 10);
  const wInStr = isBn ? toBengaliNumeral(wInch) : wInch;
  const hInStr = isBn ? toBengaliNumeral(hInch) : hInch;

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <div style="overflow: hidden; flex: 1; margin-right: 8px;">
        <strong style="color: var(--text-main); font-size: 0.88rem;">📄 ${paper.name}</strong>
        <div style="font-size: 0.76rem; color: var(--accent-primary); font-weight: 600; margin-top: 2px;">
          ${wInStr} x ${hInStr}" &bull; ${wMmStr} x ${hMmStr} mm
        </div>
        <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 1px;">
          ${isBn ? 'মার্জিন' : 'Margin'}: ${paper.marginMm || 4}mm, ${isBn ? 'গ্যাপ' : 'Gap'}: ${paper.gapMm || 3}mm
        </div>
      </div>
      <div style="display: flex; gap: 4px; align-items: center;">
        <button class="btn-icon btn-move-paper-up" data-id="${paper.id}" title="${isBn ? 'উপরে নিন' : 'Move Up'}" style="width: 28px; height: 28px; font-size: 0.75rem;" ${index === 0 ? 'disabled style="opacity: 0.3; width: 28px; height: 28px;"' : ''}>⬆️</button>
        <button class="btn-icon btn-move-paper-down" data-id="${paper.id}" title="${isBn ? 'নিচে নামান' : 'Move Down'}" style="width: 28px; height: 28px; font-size: 0.75rem;" ${index === totalCount - 1 ? 'disabled style="opacity: 0.3; width: 28px; height: 28px;"' : ''}>⬇️</button>
        <button class="btn-icon btn-edit-custom-paper" data-id="${paper.id}" title="${isBn ? 'এডিট' : 'Edit'}" style="color: var(--accent-primary); width: 30px; height: 30px;">✏️</button>
        <button class="btn-icon btn-delete-custom-paper" data-id="${paper.id}" title="${isBn ? 'মুছে ফেলুন' : 'Delete'}" style="color: #ef4444; width: 30px; height: 30px;" ${totalCount <= 1 ? 'disabled style="opacity: 0.3; width: 30px; height: 30px;"' : ''}>🗑️</button>
      </div>
    </div>
  `;
}
