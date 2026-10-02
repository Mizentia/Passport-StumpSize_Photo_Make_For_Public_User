export function setupAboutModal() {
  const modal = document.getElementById('aboutModal');
  const btnOpen = document.getElementById('btnOpenAbout');
  const btnClose = document.getElementById('btnCloseAboutModal');
  const btnCloseBottom = document.getElementById('btnCloseAboutBtn');

  if (!modal) return;

  function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  btnOpen?.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });

  btnClose?.addEventListener('click', closeModal);
  btnCloseBottom?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  return { openModal, closeModal };
}
