export function getWebcamModalHtml() {
  return `
    <div class="modal-backdrop" id="webcamModal">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" data-i18n="webcam_title">Live Studio Camera Capture</div>
          <button class="btn-icon" id="btnCloseWebcam" title="Close" data-i18n-title="btn_close">✕</button>
        </div>
        <div class="webcam-viewport">
          <video id="webcamVideo" autoplay playsinline></video>
          <div class="countdown-overlay" id="webcamCountdown">3</div>
        </div>
        <button class="btn-primary" id="btnCapturePhoto" data-i18n="btn_take_photo">📸 Take 3s Snapshot</button>
      </div>
    </div>
  `;
}
