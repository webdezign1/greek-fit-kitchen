/**
 * Greek Fit Kitchen - Dynamic Database Site Connector
 * Connects the public website directly to the SQLite backend and Elementor builder published data.
 * Guarantees that any changes published through the dashboard or builder immediately reflect on the live website.
 */

(function () {
  'use strict';

  function getCurrentPageSlug() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('menu.html')) return 'menu';
    if (path.includes('delivery-rates.html')) return 'delivery';
    if (path.includes('about-us.html')) return 'about';
    if (path.includes('how-it-works.html')) return 'howitworks';
    if (path.includes('blog.html')) return 'blog';
    return 'home';
  }

  async function syncPublishedLayout() {
    const pageKey = getCurrentPageSlug();

    // 1. Check SQLite backend first if available
    try {
      const res = await fetch(`/api/builder/layout/${pageKey}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.sections) && data.sections.length > 0) {
          applyDatabaseLayout(data.sections);
          return;
        }
      }
    } catch (e) {
      // Backend offline or running in static GitHub Pages environment
    }

    // 2. Fallback to localStorage published layout
    const localSaved = localStorage.getItem(`gfk_builder_page_${pageKey}`);
    if (localSaved) {
      applyLocalLayout(localSaved);
    }
  }

  function applyLocalLayout(htmlString) {
    // If user edited homepage or custom page, apply to live container
    const liveTarget = document.getElementById('livePageContentContainer') || document.querySelector('main');
    if (!liveTarget) return;

    // Create temporary parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Strip builder handles
    doc.querySelectorAll('.section-actions, .element-actions').forEach(el => el.remove());
    doc.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    doc.querySelectorAll('.active-element, .active-section').forEach(el => {
      el.classList.remove('active-element', 'active-section');
    });

    // If specific sections exist in doc, hydrate
    const newSections = doc.querySelectorAll('.builder-section');
    if (newSections.length > 0) {
      // Keep existing header & footer intact, update content
      const targetMain = document.querySelector('main');
      if (targetMain) {
        targetMain.innerHTML = '';
        newSections.forEach(sec => targetMain.appendChild(sec.cloneNode(true)));
      }
    }
  }

  function applyDatabaseLayout(sections) {
    const targetMain = document.querySelector('main');
    if (!targetMain) return;

    targetMain.innerHTML = '';
    sections.forEach(sec => {
      const secEl = document.createElement('section');
      secEl.className = 'py-12 px-6';
      if (sec.background_value) secEl.style.backgroundColor = sec.background_value;
      if (sec.padding) secEl.style.padding = sec.padding;

      const innerDiv = document.createElement('div');
      innerDiv.className = sec.structure_type === '2col' ? 'max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6' :
                           sec.structure_type === '3col' ? 'max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6' :
                           'max-w-5xl mx-auto';

      if (Array.isArray(sec.elements)) {
        sec.elements.forEach(el => {
          try {
            const content = typeof el.content_json === 'string' ? JSON.parse(el.content_json) : el.content_json;
            const style = typeof el.style_json === 'string' ? JSON.parse(el.style_json) : el.style_json;
            const div = document.createElement('div');
            div.innerHTML = content.html || content.text || '';
            if (style) {
              if (style.color) div.style.color = style.color;
              if (style.fontSize) div.style.fontSize = style.fontSize;
              if (style.padding) div.style.padding = style.padding;
            }
            innerDiv.appendChild(div);
          } catch (e) {}
        });
      }

      secEl.appendChild(innerDiv);
      targetMain.appendChild(secEl);
    });
  }

  // Sync Live Meals from Backend Database if on Menu or Homepage
  async function syncLiveMeals() {
    try {
      const res = await fetch('/api/meals');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.meals) && data.meals.length > 0) {
          // Sync with window.MENU_ITEMS or local cache
          window.DB_MENU_ITEMS = data.meals;
          localStorage.setItem('gfk-menu-items', JSON.stringify(data.meals));
        }
      }
    } catch (e) {}
  }

  // Sync Header & Footer settings published from Admin Dashboard
  async function syncHeaderAndFooter() {
    let cfg = null;

    // Check localStorage first
    const raw = localStorage.getItem('gfk_header_footer_config');
    if (raw) {
      try {
        cfg = JSON.parse(raw);
      } catch (e) {}
    }

    // Attempt to pull latest from backend settings API if available
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings && data.settings.header_footer && data.settings.header_footer.config) {
          cfg = JSON.parse(data.settings.header_footer.config);
          localStorage.setItem('gfk_header_footer_config', JSON.stringify(cfg));
        }
      }
    } catch (e) {}

    if (!cfg) return;

    // 1. TOP ANNOUNCEMENT BAR
    let annBar = document.getElementById('siteAnnouncementBar');
    if (cfg.header && cfg.header.announcement && cfg.header.announcement.enabled && cfg.header.announcement.text) {
      if (!annBar) {
        annBar = document.createElement('div');
        annBar.id = 'siteAnnouncementBar';
        document.body.insertBefore(annBar, document.body.firstChild);
      }
      annBar.className = 'py-2 px-4 text-center text-xs font-bold tracking-wide transition-colors z-50 relative';
      annBar.style.backgroundColor = cfg.header.announcement.bgColor || '#101D3A';
      annBar.style.color = cfg.header.announcement.textColor || '#F5C542';
      if (cfg.header.announcement.link) {
        annBar.innerHTML = `<a href="${cfg.header.announcement.link}" class="hover:underline flex items-center justify-center gap-2"><span>${cfg.header.announcement.text}</span></a>`;
      } else {
        annBar.innerHTML = `<span>${cfg.header.announcement.text}</span>`;
      }
      annBar.style.display = 'block';
    } else if (annBar) {
      annBar.style.display = 'none';
    }

    // 2. HEADER
    const header = document.getElementById('siteHeader') || document.querySelector('header:not(.bg-\\[\\#26292c\\])');
    if (header && cfg.header) {
      // Sticky option
      if (cfg.header.styling && cfg.header.styling.sticky !== undefined) {
        if (cfg.header.styling.sticky) {
          header.classList.add('sticky', 'top-0');
        } else {
          header.classList.remove('sticky', 'top-0');
        }
      }

      // Header Navigation Links
      if (Array.isArray(cfg.header.navLinks) && cfg.header.navLinks.length > 0) {
        const nav = header.querySelector('nav');
        if (nav) {
          const currentPath = window.location.pathname.split('/').pop() || 'index.html';
          nav.innerHTML = cfg.header.navLinks.map(link => {
            const isActive = (currentPath === link.url) || (currentPath === '' && link.url === 'index.html');
            const activeClass = isActive ? 'text-greek-gold font-bold' : 'hover:text-greek-gold transition-colors';
            const target = link.newTab ? 'target="_blank" rel="noopener"' : '';
            return `<a href="${link.url}" ${target} class="${activeClass}">${link.label}</a>`;
          }).join('\n');
        }

        // Also update mobile drawer nav if present
        const mobileNav = document.getElementById('mobileMenuDrawerNav') || document.querySelector('#mobileNav, .mobile-nav-links');
        if (mobileNav) {
          mobileNav.innerHTML = cfg.header.navLinks.map(link => {
            const target = link.newTab ? 'target="_blank" rel="noopener"' : '';
            return `<a href="${link.url}" ${target} class="block py-2 text-base font-semibold text-gray-800 dark:text-white hover:text-greek-gold">${link.label}</a>`;
          }).join('\n');
        }
      }

      // CTA Button Label
      if (cfg.header.ctaButton && cfg.header.ctaButton.text) {
        const cartText = header.querySelector('.open-cart-btn span:not(.cart-badge)');
        if (cartText) {
          cartText.textContent = cfg.header.ctaButton.text;
        }
      }
    }

    // 3. FOOTER
    const footer = document.getElementById('siteFooter') || document.querySelector('footer');
    if (footer && cfg.footer) {
      // Description
      if (cfg.footer.brand && cfg.footer.brand.description) {
        const descP = footer.querySelector('div:first-child p.text-white\\/60, div:first-child p:not(.space-y-1 p)');
        if (descP) descP.textContent = cfg.footer.brand.description;
      }

      // Kitchen Manager & Address
      if (cfg.footer.brand) {
        const infoDiv = footer.querySelector('div:first-child .space-y-1, div:first-child .text-white\\/70');
        if (infoDiv) {
          let html = '';
          if (cfg.footer.brand.manager) html += `<p><strong>Manager:</strong> ${cfg.footer.brand.manager}</p>`;
          if (cfg.footer.brand.kitchenAddress) html += `<p><strong>Commercial Kitchen:</strong> ${cfg.footer.brand.kitchenAddress}</p>`;
          if (html) infoDiv.innerHTML = html;
        }
      }

      // Quick Links
      if (Array.isArray(cfg.footer.quickLinks) && cfg.footer.quickLinks.length > 0) {
        const quickUl = footer.querySelector('ul.space-y-2\\.5, ul');
        if (quickUl) {
          quickUl.innerHTML = cfg.footer.quickLinks.map(link => {
            return `<li><a href="${link.url}" class="hover:text-white transition-colors">${link.label}</a></li>`;
          }).join('\n');
        }
      }

      // Batch Drops
      if (Array.isArray(cfg.footer.batchDrops) && cfg.footer.batchDrops.length > 0) {
        const batchCol = footer.querySelector('.space-y-3.text-xs.text-white\\/70, .space-y-3');
        if (batchCol) {
          batchCol.innerHTML = cfg.footer.batchDrops.map(b => `
            <div>
              <strong class="text-white block">${b.title}</strong>
              <span>${b.cutoff}</span>
            </div>
          `).join('\n');
        }
      }

      // Support & Contact
      if (cfg.footer.contact) {
        const contactDiv = footer.querySelector('.space-y-2.text-xs.text-white\\/80, .space-y-2');
        if (contactDiv) {
          contactDiv.innerHTML = `
            <p>📧 ${cfg.footer.contact.supportEmail || 'orders@greekfitkitchen.ca'}</p>
            <p>📞 ${cfg.footer.contact.supportPhone || '(416) 555-GREEK'}</p>
            <p>🕒 ${cfg.footer.contact.hours || 'Mon–Fri 9:00 AM – 6:00 PM EST'}</p>
          `;
        }
      }

      // Copyright Row
      if (cfg.footer.bottomBar && cfg.footer.bottomBar.copyright) {
        const copyP = footer.querySelector('.border-t p, .border-t.border-white\\/10 p');
        if (copyP) {
          copyP.innerHTML = cfg.footer.bottomBar.copyright;
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncLiveMeals();
    syncPublishedLayout();
    syncHeaderAndFooter();
  });

})();
