export async function requestCameraStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return null;
  }
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'user' },
      audio: false
    });
  } catch (_) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
    } catch (_) {
      try {
        return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (err) {
        return null;
      }
    }
  }
}

export function triggerMobileCameraCapture(onImageReady) {
  let input = document.getElementById('mobileNativeCameraInput');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.id = 'mobileNativeCameraInput';
    input.accept = 'image/*';
    input.capture = 'user';
    input.style.display = 'none';
    document.body.appendChild(input);
  }
  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => onImageReady?.(img);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  input.value = '';
  input.click();
}
