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
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, 64, 64);
        const dataUrl = cvs.toDataURL('image/png');
        updateLinks(dataUrl);
      } catch (_) {}
    };
    img.src = iconUrl;
  } catch (_) {}
}

export function updateHeaderBrandLogo(logoUrl) {
  if (!logoUrl) return;
  const brandLogoContainer = document.querySelector('.brand .brand-logo');
  if (brandLogoContainer) {
    brandLogoContainer.style.padding = '2px';
    brandLogoContainer.style.overflow = 'hidden';
    brandLogoContainer.innerHTML = `<img src="${logoUrl}" alt="Logo" class="brand-logo-img" />`;
  }
}

export async function initBrandLogoSync(storageKey = 'public_project_logo', port = 8086, slug = 'photo-public') {
  const cached = localStorage.getItem(storageKey);
  if (cached) {
    updateHeaderBrandLogo(cached);
    applyFavicon(cached);
  }

  const customDashboardUrl = (typeof window !== 'undefined' && localStorage.getItem('admin_dashboard_url')) || '';
  const urls = ['/api/project-brand'];
  if (customDashboardUrl) urls.push(`${customDashboardUrl.replace(/\/$/, '')}/api/public-settings`);
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (isLocal) {
    urls.push('http://127.0.0.1:3000/api/public-settings', 'http://localhost:3000/api/public-settings');
  }
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
