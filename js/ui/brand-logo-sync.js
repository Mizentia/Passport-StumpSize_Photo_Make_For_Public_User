export const DEFAULT_DB_LOGO = 'https://res.cloudinary.com/ayewcaxj/image/upload/v1790432997/ChatGPT_Image_Sep_26_2026_08_27_13_PM_ufluye.png';
const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/projects';

export function applyFavicon(iconUrl) {
  if (typeof document === 'undefined' || !iconUrl) return;
  try {
    const updateLinks = (href) => {
      ['appFavicon', 'appShortcutIcon', 'appAppleIcon'].forEach(id => {
        let el = document.getElementById(id);
        if (!el) {
          el = document.createElement('link');
          el.id = id;
          el.rel = id === 'appAppleIcon' ? 'apple-touch-icon' : 'icon';
          document.head.appendChild(el);
        }
        el.href = href;
      });
    };
    updateLinks(iconUrl);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const cvs = document.createElement('canvas');
        cvs.width = 64; cvs.height = 64;
        const ctx = cvs.getContext('2d');
        ctx.beginPath(); ctx.arc(32, 32, 30, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
        ctx.drawImage(img, 0, 0, 64, 64);
        updateLinks(cvs.toDataURL('image/png'));
      } catch (_) {}
    };
    img.src = iconUrl;
  } catch (_) {}
}

export function updateHeaderBrandLogo(logoUrl) {
  if (!logoUrl) return;
  const el = document.querySelector('.brand .brand-logo');
  if (el) {
    el.style.padding = '2px'; el.style.overflow = 'hidden';
    el.innerHTML = `<img src="${logoUrl}" alt="Logo" class="brand-logo-img" onerror="this.onerror=null;this.src='${DEFAULT_DB_LOGO}'" />`;
  }
}

async function fetchDirectFromFirestore(port = 8086, slug = 'photo-public') {
  try {
    const res = await fetch(FIRESTORE_URL);
    if (!res.ok) return null;
    const json = await res.json();
    for (const item of (json.fields?.value?.arrayValue?.values || [])) {
      const p = item.mapValue?.fields;
      if (!p) continue;
      const portVal = parseInt(p.port?.integerValue || p.port?.stringValue || '0', 10);
      if (portVal === port || p.slug?.stringValue === slug || p.id?.stringValue === 'proj-photo-public') {
        return p.logo?.stringValue || null;
      }
    }
  } catch (_) {}
  return null;
}

export async function initBrandLogoSync(storageKey = 'public_project_logo', port = 8086, slug = 'photo-public') {
  const cached = localStorage.getItem(storageKey) || DEFAULT_DB_LOGO;
  localStorage.setItem(storageKey, cached);
  updateHeaderBrandLogo(cached);
  applyFavicon(cached);

  const customUrl = (typeof window !== 'undefined' && localStorage.getItem('admin_dashboard_url')) || '';
  const urls = ['/api/project-brand'];
  if (customUrl) urls.push(`${customUrl.replace(/\/$/, '')}/api/public-settings`);
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    urls.push('http://127.0.0.1:3000/api/public-settings', 'http://localhost:3000/api/public-settings');
  }

  let dbLogo = null;
  for (const u of urls) {
    try {
      const res = await fetch(u);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.logo) { dbLogo = data.logo; break; }
      if (Array.isArray(data.projects)) {
        const found = data.projects.find(p => p.port === port || p.slug === slug || p.id === 'proj-photo-public');
        if (found?.logo) { dbLogo = found.logo; break; }
      }
    } catch (_) {}
  }

  const finalLogo = dbLogo || (await fetchDirectFromFirestore(port, slug)) || DEFAULT_DB_LOGO;
  localStorage.setItem(storageKey, finalLogo);
  updateHeaderBrandLogo(finalLogo);
  applyFavicon(finalLogo);
}
