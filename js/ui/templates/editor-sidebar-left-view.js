export function getEditorSidebarLeftHtml() {
  return `
    <aside class="editor-sidebar" id="editorSidebarLeft">
      <div class="sidebar-tab-nav" id="leftSidebarTabNav">
        <button class="sidebar-tab-btn active" id="btnLeftTabPresets" type="button" data-left-tab="presets">
          <span class="sidebar-tab-icon">📏</span>
          <span data-i18n="card_size_presets_short">Sizes & Presets</span>
        </button>
        <button class="sidebar-tab-btn" id="btnLeftTabBackdrop" type="button" data-left-tab="backdrop">
          <span class="sidebar-tab-icon">🎨</span>
          <span data-i18n="card_backdrop_short">Backdrop</span>
        </button>
      </div>

      <div class="tool-card sidebar-tab-panel active" id="panelPresets">
        <div class="tool-card-header-flex" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div class="tool-card-title" style="margin-bottom: 0;" data-i18n="card_size_presets">📏 Photo Size & Country Presets</div>
          <button class="btn-preset-settings-gear" id="btnTogglePresetSettings" title="Manage Presets" data-i18n-title="tooltip_manage_presets" type="button">
            ⚙️ <span data-i18n="btn_manage_presets">Manage</span>
          </button>
        </div>
        <div class="preset-sort-bar" id="presetManageDrawer" style="display: none;">
          <button class="btn-preset-add-header" id="btnAddPhotoPresetHeader" title="Add New Preset" data-i18n-title="tooltip_add_preset" type="button">
            <span data-i18n="btn_add_preset">➕ Add Size</span>
          </button>
          <label class="sort-mode-toggle" title="Toggle between manual fixed order and recent usage sorting" data-i18n-title="sort_mode_tip">
            <input type="checkbox" id="chkManualPresetSort">
            <span class="sort-mode-slider"></span>
            <span class="sort-mode-text" id="lblSortModeText" data-i18n="sort_manual">📌 Manual Order</span>
          </label>
          <div class="preset-header-sub-actions">
            <span class="sort-mode-indicator-pill" id="badgeSortState">⚡ Recent Top</span>
            <button class="btn-reset-presets-subtle" id="btnResetAllPresets" title="Reset all presets to default factory settings" data-i18n-title="tooltip_reset_presets" type="button">↺</button>
          </div>
        </div>
        <div class="preset-grid" id="photoPresetGrid"></div>
      </div>

      <div class="tool-card sidebar-tab-panel" id="panelBackdrop" style="display: none; padding: 12px 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div class="tool-card-title" style="margin-bottom: 0; font-size: 0.88rem;" data-i18n="card_backdrop">🎨 Studio Backdrop</div>
          <button type="button" id="btnQuickConfigBgEngines" title="Manage Engines in Settings" style="background: none; border: none; font-size: 0.75rem; color: var(--accent-primary); cursor: pointer; padding: 0; font-weight: 600;">⚙️ Config</button>
        </div>

        <div class="form-group" style="margin-bottom: 8px;">
          <select id="selectActiveBgEngine" class="form-select" style="width: 100%; font-size: 0.78rem; padding: 6px 8px; height: 34px; border-radius: var(--radius-sm);"></select>
        </div>

        <div style="display: flex; gap: 8px; align-items: stretch; margin-bottom: 8px;">
          <button class="btn-primary btn-sm" id="btnRemoveBg" style="flex: 1; min-height: 34px; font-size: 0.78rem; padding: 6px 12px; font-weight: 600; white-space: nowrap; justify-content: center; gap: 6px; border-radius: var(--radius-md);" data-i18n="btn_remove_bg" data-i18n-title="tooltip_remove_bg" data-shortcut-key="removeBg">🪄 Cutout</button>
          <button class="btn-secondary btn-sm" id="btnRestoreBg" title="Restore Original Background" style="min-height: 34px; padding: 6px 12px; font-size: 0.78rem; border-radius: var(--radius-md); flex-shrink: 0;" data-i18n="btn_restore_bg" data-i18n-title="title_restore_bg" data-shortcut-key="restoreBg">↺</button>
        </div>

        <div id="rowChromaKeyColor" class="form-group" style="margin-top: 4px; margin-bottom: 6px; display: none;">
          <div style="display: flex; gap: 6px; align-items: center;">
            <input type="color" id="inputChromaKeyColor" value="#00ff00" style="width: 28px; height: 28px; padding: 0; border: none; cursor: pointer; border-radius: var(--radius-sm);">
            <div style="display: flex; gap: 4px; flex: 1;">
              <button type="button" class="btn-quick-chroma" data-color="#00ff00" style="flex: 1; font-size: 0.7rem; background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 4px; padding: 2px 0; cursor: pointer; font-weight: 600;">Green</button>
              <button type="button" class="btn-quick-chroma" data-color="#0000ff" style="flex: 1; font-size: 0.7rem; background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 4px; padding: 2px 0; cursor: pointer; font-weight: 600;">Blue</button>
              <button type="button" class="btn-quick-chroma" data-color="#ffffff" style="flex: 1; font-size: 0.7rem; background: rgba(255, 255, 255, 0.15); color: var(--text-main); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 2px 0; cursor: pointer; font-weight: 600;">White</button>
            </div>
          </div>
        </div>

        <div id="savedBackdropSwatchesContainer" class="color-swatches" style="margin-bottom: 6px; display: flex; flex-wrap: wrap; gap: 5px;"></div>

        <div style="display: flex; gap: 6px; align-items: center; background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 4px 6px;">
          <div style="position: relative; width: 26px; height: 26px; flex-shrink: 0;">
            <input type="color" id="customBgColor" value="#ffffff" title="Pick Custom Color" style="width: 100%; height: 100%; padding: 0; border: none; border-radius: 3px; cursor: pointer;">
          </div>
          <div style="display: flex; flex-direction: column; flex: 1; gap: 1px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-dim);">
              <span data-i18n="lbl_backdrop_shade">Lightness</span>
              <span id="valBackdropShade" style="font-weight: 700; color: var(--accent-primary);">50%</span>
            </div>
            <input type="range" id="sliderBackdropShade" class="range-slider" min="10" max="95" value="50" style="width: 100%; height: 4px; margin: 0;">
          </div>
        </div>
      </div>
    </aside>
  `;
}
