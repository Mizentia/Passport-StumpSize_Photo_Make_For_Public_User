import { getHeaderNavHtml } from './templates/header-nav-view.js';
import { getUploadTabHtml } from './templates/upload-tab-view.js';
import { getEditorSidebarLeftHtml } from './templates/editor-sidebar-left-view.js';
import { getEditorCanvasHtml } from './templates/editor-canvas-view.js';
import { getEditorSidebarRightHtml } from './templates/editor-sidebar-right-view.js';
import { getSheetTabHtml } from './templates/sheet-tab-view.js';
import { getHistoryTabHtml } from './templates/history-tab-view.js';
import { getAboutTabHtml } from './templates/about-tab-view.js';
import { getSettingsTabHtml } from './templates/settings-tab-view.js';
import { getCustomSizeModalHtml } from './templates/custom-size-modal-view.js';
import { getCustomPaperModalHtml } from './templates/custom-paper-modal-view.js';
import { getWebcamModalHtml } from './templates/webcam-modal-view.js';

import { initBrandLogoSync } from './brand-logo-sync.js';

export function loadApplicationDOM() {
  const root = document.getElementById('app-root') || document.body;
  
  const editorTabHtml = `
    <section id="editorTab" class="tab-content">
      <div class="editor-grid">
        ${getEditorSidebarLeftHtml()}
        ${getEditorCanvasHtml()}
        ${getEditorSidebarRightHtml()}
      </div>
    </section>
  `;

  root.innerHTML = `
    <div class="app-container">
      ${getHeaderNavHtml()}
      <main>
        ${getUploadTabHtml()}
        ${editorTabHtml}
        ${getSheetTabHtml()}
        ${getHistoryTabHtml()}
        ${getAboutTabHtml()}
        ${getSettingsTabHtml()}
      </main>
    </div>
    ${getWebcamModalHtml()}
    ${getCustomSizeModalHtml()}
    ${getCustomPaperModalHtml()}
  `;
}

loadApplicationDOM();
initBrandLogoSync('public_project_logo', 8086, 'photo-public');
