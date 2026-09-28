export function getUploadTabHtml() {
  return `
    <section id="uploadTab" class="tab-content active">
      <div class="upload-card">
        <div class="dropzone" id="uploadDropzone" onclick="document.getElementById('fileUploadInput').click()">
          <div class="dropzone-icon">📷</div>
          <div class="dropzone-title" data-i18n="dropzone_title">Upload Any Portrait or Selfie</div>
          <p class="dropzone-subtitle" data-i18n="dropzone_subtitle">Drag & drop, click to browse, or press Ctrl+V to paste photo.</p>
          <div class="paste-badge"><span data-i18n="paste_hint">📋 Press Ctrl+V anywhere to paste image</span></div>
          <input type="file" id="fileUploadInput" accept="image/*" style="display: none;">
        </div>
        <div class="upload-actions">
          <button class="btn-secondary" id="btnOpenWebcam" data-i18n="btn_webcam" data-i18n-title="tooltip_open_webcam" data-shortcut-key="openWebcam">📸 Live Webcam</button>
          <button class="btn-secondary" id="btnToggleUrlInput" data-i18n="btn_url_load">🔗 Paste URL</button>
          <button class="btn-primary" id="btnChooseImage" onclick="document.getElementById('fileUploadInput').click()" data-i18n="btn_choose_file" data-i18n-title="tooltip_choose_file" data-shortcut-key="chooseFile">📁 Choose Image</button>
        </div>
        <div class="url-input-container" id="urlInputContainer" style="display: none;">
          <div class="url-input-box">
            <span class="url-icon">🌐</span>
            <input type="text" id="inputImageUrl" placeholder="Paste image link (https://... or data:image/...)" data-i18n-placeholder="url_placeholder" class="url-text-input">
            <button class="btn-smart" id="btnLoadImageUrl" type="button" data-i18n="btn_load_url">Load Photo</button>
            <button class="btn-icon" id="btnCloseUrlInput" type="button" title="Close">✕</button>
          </div>
        </div>
        <div class="sample-row">
          <span class="sample-title" data-i18n="quick_samples">Quick Try Samples:</span>
          <div class="sample-chip" data-sample-index="0" data-i18n="sample_male">👤 Male Portrait</div>
          <div class="sample-chip" data-sample-index="1" data-i18n="sample_female">👩 Female Portrait</div>
          <div class="sample-chip" data-sample-index="2" data-i18n="sample_casual">🏖️ Casual Photo</div>
        </div>
      </div>
      <div id="batchPhotoTrayContainer" class="batch-tray-container" style="display: none;">
        <div class="batch-tray-header">
          <span data-i18n="batch_tray_title">📸 Uploaded Photos Queue / Tray</span>
        </div>
        <div class="batch-items-scroll" id="batchPhotoTray"></div>
      </div>
    </section>
  `;
}
