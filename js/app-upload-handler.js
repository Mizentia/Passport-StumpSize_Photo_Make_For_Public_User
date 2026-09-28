import { processImageFile } from './upload/file-image-processor.js';
import { processImageUrl } from './upload/url-image-loader.js';
import { setupSampleAvatars } from './upload/sample-avatar-loader.js';

export function setupUploadHandlers(onImageLoaded) {
  const fileInput = document.getElementById('fileUploadInput');
  const dropzone = document.getElementById('uploadDropzone');
  const urlContainer = document.getElementById('urlInputContainer');
  const toggleUrlBtn = document.getElementById('btnToggleUrlInput');
  const closeUrlBtn = document.getElementById('btnCloseUrlInput');
  const inputImageUrl = document.getElementById('inputImageUrl');
  const btnLoadImageUrl = document.getElementById('btnLoadImageUrl');

  const processFile = (file, isPasted = false) => processImageFile(file, isPasted, onImageLoaded);
  const loadUrl = (url, isPasted) => processImageUrl(url, isPasted, onImageLoaded, urlContainer, inputImageUrl);

  if (fileInput) {
    fileInput.addEventListener('click', () => { fileInput.value = ''; });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files?.[0]) processFile(e.target.files[0], false);
    });
  }

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer?.files?.length) {
        processFile(e.dataTransfer.files[0], false);
        return;
      }
      const uri = e.dataTransfer?.getData('text/uri-list') || e.dataTransfer?.getData('text/plain');
      if (uri && (uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('data:image/'))) {
        loadUrl(uri, false);
      }
    });
  }

  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.[0]?.type?.startsWith('image/')) processFile(e.dataTransfer.files[0], false);
  });

  window.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (items?.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) { processFile(file, true); return; }
        }
      }
    }
    const text = e.clipboardData?.getData('text')?.trim();
    if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/') || text.match(/\.(jpe?g|png|webp|avif|svg)(\?.*)?$/i))) {
      e.preventDefault();
      loadUrl(text, true);
    }
  });

  if (toggleUrlBtn && urlContainer) {
    toggleUrlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = urlContainer.style.display === 'none' || !urlContainer.style.display;
      urlContainer.style.display = isHidden ? 'block' : 'none';
      if (isHidden && inputImageUrl) inputImageUrl.focus();
    });
  }
  if (closeUrlBtn && urlContainer) {
    closeUrlBtn.addEventListener('click', (e) => { e.stopPropagation(); urlContainer.style.display = 'none'; });
  }
  if (btnLoadImageUrl && inputImageUrl) {
    btnLoadImageUrl.addEventListener('click', () => loadUrl(inputImageUrl.value, false));
  }
  if (inputImageUrl) {
    inputImageUrl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); loadUrl(inputImageUrl.value, false); }
    });
  }

  setupSampleAvatars(onImageLoaded);
}
