import { toBengaliNumeral } from '../../config/i18n.js';
import { appState } from '../../core/state.js';

export function renderSheetPagesCards(result, primarySheetCanvas) {
  const { pages, totalPages, capacityPerPage, totalPhotos, cols, rows } = result;
  const isBn = appState.get('lang') === 'bn';
  const pagesContainer = document.getElementById('sheetPagesContainer');
  const pageInfoPill = document.getElementById('sheetPageInfoPill');
  const capBadge = document.getElementById('sheetCapacityBadge');

  if (capBadge) capBadge.textContent = isBn ? `প্রতি পেজে: ${toBengaliNumeral(capacityPerPage)}টি` : `${capacityPerPage} per page`;
  if (pageInfoPill) {
    const pageStr = isBn ? toBengaliNumeral(totalPages) : totalPages;
    const photosStr = isBn ? toBengaliNumeral(totalPhotos) : totalPhotos;
    const capStr = isBn ? toBengaliNumeral(capacityPerPage) : capacityPerPage;
    const colsStr = isBn ? toBengaliNumeral(cols) : cols;
    const rowsStr = isBn ? toBengaliNumeral(rows) : rows;
    pageInfoPill.innerHTML = `📄 <strong>${isBn ? `পৃষ্ঠা সংখ্যা: ${pageStr}` : `Total Pages: ${pageStr}`}</strong> &bull; ${photosStr} ${isBn ? 'ছবি' : 'Photos'} (${colsStr} x ${rowsStr} = ${capStr}/${isBn ? 'পেজ' : 'page'})`;
  }

  if (pagesContainer) {
    pagesContainer.innerHTML = '';
    pages.forEach((canvas, idx) => {
      const pageCard = document.createElement('div');
      pageCard.className = 'sheet-page-card';
      pageCard.dataset.page = idx + 1;

      const startIdx = idx * capacityPerPage + 1;
      const endIdx = Math.min(totalPhotos, (idx + 1) * capacityPerPage);
      const badge = document.createElement('div');
      badge.className = 'sheet-page-badge';
      const pNum = isBn ? toBengaliNumeral(idx + 1) : idx + 1;
      const sNum = isBn ? toBengaliNumeral(startIdx) : startIdx;
      const eNum = isBn ? toBengaliNumeral(endIdx) : endIdx;
      badge.textContent = isBn ? `পৃষ্ঠা ${pNum} (ছবি ${sNum} - ${eNum})` : `Page ${pNum} (${sNum} - ${eNum})`;

      const wrapper = document.createElement('div');
      wrapper.className = 'sheet-canvas-wrapper';
      wrapper.appendChild(canvas);
      pageCard.appendChild(badge);
      pageCard.appendChild(wrapper);
      pagesContainer.appendChild(pageCard);
    });
  }
}
