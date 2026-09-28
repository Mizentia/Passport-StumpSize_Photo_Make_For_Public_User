export function getEditorCanvasHtml() {
  return `
    <section class="canvas-viewport-card">
      <div class="canvas-top-bar">
        <div class="btn-group-smart">
          <button class="btn-smart" id="btnChangePhoto" data-i18n="btn_change_photo" data-i18n-title="tooltip_choose_file" data-shortcut-key="chooseFile">📷 Change Photo</button>
          <button class="btn-smart" id="btnAutoFit" data-i18n="btn_auto_fit" data-i18n-title="tooltip_auto_fit" data-shortcut-key="autoFit">✨ Auto-Fit Face</button>
          <button class="btn-smart" id="btnAutoEnhance" data-i18n="btn_auto_enhance" data-i18n-title="tooltip_auto_enhance" data-shortcut-key="autoEnhance">🌟 Auto Enhance</button>
          <button class="btn-smart" id="btnSaveProjectToHistory" title="Save completed project to persistent history" data-i18n="btn_save_project" data-i18n-title="tooltip_save_project" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 600;">💾 Save to History</button>
          <button class="btn-smart" id="btnAddToBatchHistory" title="Save this edited photo to Session History for combined batch printing" data-i18n="btn_add_to_history" data-i18n-title="tooltip_add_to_history" style="background: rgba(59, 130, 246, 0.15); color: var(--accent-primary); font-weight: 600;">⭐ Add to Batch</button>
        </div>
        <div class="btn-group-history">
          <button class="btn-icon-subtle" id="btnUndo" title="Undo" data-i18n-title="title_undo" data-shortcut-key="undo">↶</button>
          <button class="btn-icon-subtle" id="btnRedo" title="Redo" data-i18n-title="title_redo" data-shortcut-key="redo">↷</button>
          <button class="btn-icon-subtle" id="btnResetAll" title="Reset All Adjustments" data-i18n-title="title_reset_all" data-shortcut-key="resetAll">🔄</button>
        </div>
      </div>
      <div class="canvas-dimension-header">
        <div class="dim-badge-content">
          <span class="dim-badge-chip" id="dimPresetTitle">BD Passport</span>
          <span class="dim-badge-chip" id="dimMmDetails">40 x 50 mm</span>
          <span class="dim-badge-chip" id="dimInchDetails">1.57 x 1.97"</span>
          <span class="dim-badge-chip" id="dimPxDetails">472 x 591 px</span>
          <span class="dim-badge-chip" id="dimDpiDetails" data-i18n="unit_dpi">300 DPI</span>
        </div>
        <div class="dim-zoom-chip" id="dimZoomPercent">🔍 100%</div>
      </div>
      <div class="canvas-workspace-layout">
        <div class="ruler-corner"></div>
        <div class="ruler-top" id="rulerWidthText">⟵ 40 mm / 1.57" (472 px) ⟶</div>
        <div class="ruler-left" id="rulerHeightText">⟵ 50 mm / 1.97" (591 px) ⟶</div>
        <div class="canvas-container">
          <canvas id="mainCanvas"></canvas>
          <div class="crop-guide-overlay" id="cropGuides"><div class="head-oval-guide"></div><div class="eye-line-guide"></div></div>
          <div class="crop-grid-overlay" id="cropGrid" style="display: none;"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
      <div class="canvas-bottom-bar">
        <div class="transform-actions">
          <button class="btn-icon" id="btnZoomOut" title="Zoom Out" data-i18n-title="title_zoom_out" data-shortcut-key="zoomOut">➖</button>
          <button class="btn-icon" id="btnZoomFit" title="Fit & Center" data-i18n-title="title_zoom_fit" data-shortcut-key="zoomFit">🔲</button>
          <button class="btn-icon" id="btnZoomIn" title="Zoom In" data-i18n-title="title_zoom_in" data-shortcut-key="zoomIn">➕</button>
          <div style="width: 1px; height: 22px; background: var(--border-subtle); margin: 0 2px;"></div>
          <button class="btn-icon" id="btnRotateRight" title="Rotate 90°" data-i18n-title="title_rotate" data-shortcut-key="rotate">🔄</button>
          <button class="btn-icon" id="btnFlipH" title="Flip Horizontal" data-i18n-title="title_flip" data-shortcut-key="flipH">↔️</button>
          <button class="btn-icon" id="btnFlipV" title="Flip Vertical" data-i18n-title="title_flip_v" data-shortcut-key="flipV">↕️</button>
          <button class="btn-icon" id="btnToggleGuides" title="Toggle Passport Guides" data-i18n-title="title_guides" data-shortcut-key="guides">🎯</button>
        </div>
        <div class="download-single-actions">
          <button class="btn-primary btn-sm" id="btnDownloadSingleJpg" data-i18n="btn_download_single_jpg" data-i18n-title="tooltip_download_single" data-shortcut-key="downloadSingle">⬇️ JPG (300 DPI)</button>
          <button class="btn-secondary btn-sm" id="btnDownloadSinglePng" data-i18n="btn_download_single_png" data-i18n-title="tooltip_download_png" data-shortcut-key="downloadPng">⬇️ PNG (Transparent)</button>
        </div>
      </div>
    </section>
  `;
}
