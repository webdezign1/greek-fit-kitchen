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

  document.addEventListener('DOMContentLoaded', () => {
    syncLiveMeals();
    syncPublishedLayout();
  });

})();
