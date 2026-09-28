export function getSettingsExtraEnginesHtml() {
  return `
    <div class="bg-engine-card" id="cardEnginePhotoRoom">
      <div class="bg-engine-card-header">
        <div class="bg-engine-title-area"><span class="bg-engine-name">📸 PhotoRoom</span><span class="bg-engine-badge badge-cloud">Studio API</span></div>
        <label class="switch"><input type="checkbox" id="chkEnginePhotoRoom"><span class="slider-toggle"></span></label>
      </div>
      <div class="bg-engine-credentials">
        <div style="display: flex; gap: 4px;">
          <input type="password" id="inputPhotoRoomKey" class="form-input" placeholder="PhotoRoom Key..." style="font-size: 0.78rem; font-family: monospace; height: 32px; padding: 4px 8px;">
          <button type="button" class="btn-icon btn-toggle-pw" data-target="inputPhotoRoomKey" style="width: 32px; height: 32px;" title="Show/Hide">👁️</button>
        </div>
      </div>
    </div>
    <div class="bg-engine-card" id="cardEngineCutoutPro">
      <div class="bg-engine-card-header">
        <div class="bg-engine-title-area"><span class="bg-engine-name">✂️ Cutout.pro</span><span class="bg-engine-badge badge-cloud">Passport AI</span></div>
        <label class="switch"><input type="checkbox" id="chkEngineCutoutPro"><span class="slider-toggle"></span></label>
      </div>
      <div class="bg-engine-credentials">
        <div style="display: flex; gap: 4px;">
          <input type="password" id="inputCutoutProKey" class="form-input" placeholder="Cutout.pro Key..." style="font-size: 0.78rem; font-family: monospace; height: 32px; padding: 4px 8px;">
          <button type="button" class="btn-icon btn-toggle-pw" data-target="inputCutoutProKey" style="width: 32px; height: 32px;" title="Show/Hide">👁️</button>
        </div>
      </div>
    </div>
    <div class="bg-engine-card" id="cardEngineRemoveBg">
      <div class="bg-engine-card-header">
        <div class="bg-engine-title-area"><span class="bg-engine-name">☁️ Remove.bg</span><span class="bg-engine-badge badge-cloud">Cloud API</span></div>
        <label class="switch"><input type="checkbox" id="chkEngineRemoveBg"><span class="slider-toggle"></span></label>
      </div>
      <div class="bg-engine-credentials">
        <div style="display: flex; gap: 4px;">
          <input type="password" id="inputRemoveBgKey" class="form-input" placeholder="Remove.bg Key..." style="font-size: 0.78rem; font-family: monospace; height: 32px; padding: 4px 8px;">
          <button type="button" class="btn-icon btn-toggle-pw" data-target="inputRemoveBgKey" style="width: 32px; height: 32px;" title="Show/Hide">👁️</button>
        </div>
      </div>
    </div>
    <div class="bg-engine-card" id="cardEngineClipDrop">
      <div class="bg-engine-card-header">
        <div class="bg-engine-title-area"><span class="bg-engine-name">☁️ ClipDrop</span><span class="bg-engine-badge badge-cloud">Stability AI</span></div>
        <label class="switch"><input type="checkbox" id="chkEngineClipDrop"><span class="slider-toggle"></span></label>
      </div>
      <div class="bg-engine-credentials">
        <div style="display: flex; gap: 4px;">
          <input type="password" id="inputClipDropKey" class="form-input" placeholder="ClipDrop Key..." style="font-size: 0.78rem; font-family: monospace; height: 32px; padding: 4px 8px;">
          <button type="button" class="btn-icon btn-toggle-pw" data-target="inputClipDropKey" style="width: 32px; height: 32px;" title="Show/Hide">👁️</button>
        </div>
      </div>
    </div>
    <div class="bg-engine-card" id="cardEngineCustomApi">
      <div class="bg-engine-card-header">
        <div class="bg-engine-title-area"><span class="bg-engine-name">🛠️ Custom AI Server</span><span class="bg-engine-badge badge-custom">Docker/Python</span></div>
        <label class="switch"><input type="checkbox" id="chkEngineCustomApi"><span class="slider-toggle"></span></label>
      </div>
      <div class="bg-engine-credentials">
        <input type="text" id="inputCustomApiEndpoint" class="form-input" placeholder="https://api.studio.com/remove" style="font-size: 0.78rem; height: 30px; padding: 4px 8px;">
        <input type="password" id="inputCustomApiKey" class="form-input" placeholder="Bearer Token (Optional)" style="font-size: 0.78rem; height: 30px; margin-top: 4px;">
      </div>
    </div>
    <div class="bg-engine-card enabled" id="cardEngineFloodFill">
      <div class="bg-engine-card-header">
        <div class="bg-engine-title-area"><span class="bg-engine-name">🎯 Color Flood-Fill</span><span class="bg-engine-badge badge-classic">Instant</span></div>
        <label class="switch"><input type="checkbox" id="chkEngineFloodFill" checked><span class="slider-toggle"></span></label>
      </div>
      <p class="bg-engine-desc" data-i18n="desc_engine_floodfill">Instant for solid backdrop studio walls.</p>
    </div>
    <div class="bg-engine-card" id="cardEngineChromaKey">
      <div class="bg-engine-card-header">
        <div class="bg-engine-title-area"><span class="bg-engine-name">🟩 Chroma Key Screen</span><span class="bg-engine-badge badge-chroma">Green/Blue</span></div>
        <label class="switch"><input type="checkbox" id="chkEngineChromaKey"><span class="slider-toggle"></span></label>
      </div>
      <p class="bg-engine-desc" data-i18n="desc_engine_chromakey">Removes green/blue studio cloth with auto de-spill.</p>
    </div>
  `;
}
