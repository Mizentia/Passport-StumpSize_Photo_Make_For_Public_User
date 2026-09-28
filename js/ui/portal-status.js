import { appState } from '../core/state.js';

let maintenanceEl = null;

export async function checkPortalStatus() {
  try {
    const res = await fetch('/api/portal-control');
    if (!res.ok) return;
    const data = await res.json();
    if (data.isPublicActive === false) {
      showMaintenanceOverlay();
    } else if (maintenanceEl && document.body.contains(maintenanceEl)) {
      maintenanceEl.remove();
      maintenanceEl = null;
    }
  } catch (_) {}
}

function showMaintenanceOverlay() {
  if (maintenanceEl && document.body.contains(maintenanceEl)) return;
  const isBn = appState.get('lang') === 'bn';
  maintenanceEl = document.createElement('div');
  maintenanceEl.id = 'portalMaintenanceOverlay';
  maintenanceEl.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(10, 14, 23, 0.96); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; text-align: center; color: var(--text-main);
  `;

  maintenanceEl.innerHTML = `
    <div style="max-width: 480px; background: var(--bg-card); border: 1px solid var(--border-strong); border-radius: var(--radius-lg); padding: 2.5rem 2rem; box-shadow: var(--shadow-lg); display: flex; flex-direction: column; align-items: center; gap: 1rem;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
        🛠️
      </div>
      <h2 style="font-size: 1.4rem; font-weight: 800; margin: 0; color: var(--text-main);">
        ${isBn ? 'সেবা সাময়িকভাবে স্থগিত' : 'Service Temporarily Offline'}
      </h2>
      <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); margin: 0;">
        ${isBn 
          ? 'নকশা ল্যাব অনলাইন ফটো মেকার সেবাটি নিয়মিত রক্ষণাবেক্ষণের জন্য সাময়িকভাবে বন্ধ রাখা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।' 
          : 'Noksha Lab Public Photo Maker is currently paused for routine maintenance. Please check back shortly.'}
      </p>
      <button id="retryPortalBtn" style="margin-top: 0.5rem; background: var(--accent-gradient); color: #fff; border: none; padding: 0.75rem 1.75rem; border-radius: var(--radius-md); font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: transform var(--transition-fast);">
        ${isBn ? '🔄 পুনরায় চেষ্টা করুন' : '🔄 Check Again'}
      </button>
    </div>
  `;

  document.body.appendChild(maintenanceEl);
  document.getElementById('retryPortalBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('retryPortalBtn');
    if (btn) btn.textContent = isBn ? 'যাচাই করা হচ্ছে...' : 'Checking...';
    await checkPortalStatus();
  });
}
