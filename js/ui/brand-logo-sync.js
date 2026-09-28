export function applyFavicon(iconUrl) {
  if (typeof document === 'undefined' || !iconUrl) return;
  try {
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;
    if (iconUrl.endsWith('.svg')) link.type = 'image/svg+xml';
    else if (iconUrl.endsWith('.png')) link.type = 'image/png';
    else link.type = 'image/x-icon';

    let shortcut = document.querySelector("link[rel='shortcut icon']");
    if (shortcut) shortcut.href = iconUrl;
  } catch (_) {}
}

export function updateHeaderBrandLogo(logoUrl) {
  if (!logoUrl) return;
  const brandLogoContainer = document.querySelector('.brand .brand-logo');
  if (brandLogoContainer) {
    brandLogoContainer.style.padding = '3px';
    brandLogoContainer.style.overflow = 'hidden';
    brandLogoContainer.innerHTML = `<img src="${logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:var(--radius-md);" />`;
  }
}

export async function initBrandLogoSync(storageKey = 'public_project_logo', port = 8086, slug = 'photo-public') {
  const cached = localStorage.getItem(storageKey);
  if (cached) {
    updateHeaderBrandLogo(cached);
    applyFavicon(cached);
  }

  const urls = ['/api/project-brand', 'http://127.0.0.1:3000/api/public-settings', 'http://localhost:3000/api/public-settings'];
  for (const u of urls) {
    try {
      const res = await fetch(u);
      if (!res.ok) continue;
      const data = await res.json();
      let logo = '';
      if (data.logo) {
        logo = data.logo;
      } else if (Array.isArray(data.projects)) {
        const found = data.projects.find(p => p.port === port || p.slug === slug || p.id === 'proj-photo-public');
        if (found?.logo) logo = found.logo;
      }
      if (logo) {
        localStorage.setItem(storageKey, logo);
        updateHeaderBrandLogo(logo);
        applyFavicon(logo);
        break;
      }
    } catch (_) {}
  }
}
