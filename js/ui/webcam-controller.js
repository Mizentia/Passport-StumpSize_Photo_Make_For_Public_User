import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';
import { requestCameraStream, triggerMobileCameraCapture } from './camera-stream-helper.js';

export function setupWebcamController(onCaptureCallback) {
  const modal = document.getElementById('webcamModal');
  const video = document.getElementById('webcamVideo');
  const btnOpen = document.getElementById('btnOpenWebcam');
  const btnClose = document.getElementById('btnCloseWebcam');
  const btnSnap = document.getElementById('btnCapturePhoto');
  const countdownEl = document.getElementById('webcamCountdown');

  let stream = null;
  let countdownTimer = null;

  async function startCamera() {
    stream = await requestCameraStream();
    if (stream) {
      video.srcObject = stream;
      modal.classList.add('active');
      return;
    }

    // Fallback: If getUserMedia is unavailable or blocked (e.g. HTTP on mobile), open native camera
    triggerMobileCameraCapture((capturedImg) => {
      if (onCaptureCallback) onCaptureCallback(capturedImg);
    });
  }

  function stopCamera() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    if (countdownEl) countdownEl.style.display = 'none';

    if (stream) {
      stream.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      stream = null;
    }
    if (video) video.srcObject = null;
    modal?.classList.remove('active');
  }

  function capturePhotoWithCountdown() {
    if (btnSnap) btnSnap.disabled = true;
    let count = 3;
    if (countdownEl) {
      countdownEl.textContent = count;
      countdownEl.style.display = 'flex';
    }

    countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        if (countdownEl) countdownEl.textContent = count;
      } else {
        clearInterval(countdownTimer);
        countdownTimer = null;
        if (countdownEl) countdownEl.style.display = 'none';

        // Capture snapshot from video
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        // Mirror the webcam frame horizontally for a natural selfie look
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.onload = () => {
          stopCamera();
          if (btnSnap) btnSnap.disabled = false;
          if (onCaptureCallback) onCaptureCallback(img);
        };
        img.src = canvas.toDataURL('image/jpeg', 0.98);
      }
    }, 800);
  }

  btnOpen?.addEventListener('click', startCamera);
  btnClose?.addEventListener('click', stopCamera);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) stopCamera();
  });
  btnSnap?.addEventListener('click', capturePhotoWithCountdown);
}
