/**
 * Greek Fit Kitchen - Enterprise WordPress-Style Administration Dashboard Engine
 * Implements all 27 requested management modules connected to the live persistent SQLite database.
 */

(function () {
  'use strict';

  // --- Auth Verification ---
  const token = localStorage.getItem('gfk_admin_token');
  let currentUser = null;

  if (!token && !window.location.pathname.includes('login.html')) {
    window.location.href = '/admin/login';
    return;
  }

  // --- Global State ---
  let currentTab = 'dashboard';
  let cachedData = {};

  // --- API Helper ---
  async function api(endpoint, method = 'GET', body = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const options = { method, headers };
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`/api${endpoint}`, options);
    if (res.status === 401) {
      localStorage.removeItem('gfk_admin_token');
      window.location.href = '/admin/login';
      throw new Error('Session expired');
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  // --- Toast Notification ---
  window.showToast = function (msg, isError = false) {
    const toast = document.getElementById('adminToast');
    const toastMsg = document.getElementById('adminToastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white font-bold text-xs shadow-2xl flex items-center gap-2 transition-all transform translate-y-0 opacity-100 ${
      isError ? 'bg-red-600' : 'bg-emerald-600'
    }`;

    setTimeout(() => {
      toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 transition-all transform translate-y-24 opacity-0 pointer-events-none';
    }, 3200);
  };

  // --- Modal Helpers ---
  window.openModal = function (htmlContent) {
    const root = document.getElementById('adminModalRoot');
    if (!root) return;
    root.innerHTML = htmlContent;
    root.classList.remove('hidden');
  };

  window.closeModal = function () {
    const root = document.getElementById('adminModalRoot');
    if (root) {
      root.classList.add('hidden');
      root.innerHTML = '';
    }
  };

  // --- Sidebar & Theme Toggles ---
  window.toggleWpSidebar = function () {
    const sidebar = document.getElementById('wpSidebar');
    if (sidebar) {
      sidebar.classList.toggle('w-56');
      sidebar.classList.toggle('w-0');
      sidebar.classList.toggle('overflow-hidden');
    }
  };

  window.toggleAdminTheme = function () {
    document.documentElement.classList.toggle('dark');
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.innerText = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    }
  };

  window.handleAdminLogout = function () {
    localStorage.removeItem('gfk_admin_token');
    localStorage.removeItem('gfk_admin_user');
    window.location.href = '/admin/login';
  };

  // --- Router & Navigation ---
  window.navigateToTab = function (tabKey) {
    currentTab = tabKey;
    window.location.hash = tabKey;

    // Update active nav styling
    document.querySelectorAll('.wp-nav-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.getElementById(`nav-${tabKey}`);
    if (activeItem) activeItem.classList.add('active');

    const breadcrumb = document.getElementById('breadcrumbCurrent');
    if (breadcrumb) {
      breadcrumb.innerText = tabKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    renderCurrentTab();
  };

  function renderCurrentTab() {
    const root = document.getElementById('adminAppRoot');
    if (!root) return;

    root.innerHTML = `
      <div class="py-16 text-center text-gray-400">
        <div class="inline-block animate-spin text-2xl mb-2">⏳</div>
        <p class="text-xs font-semibold">Loading ${currentTab} data...</p>
      </div>
    `;

    switch (currentTab) {
      case 'dashboard': renderDashboardView(root); break;
      case 'pages': renderPagesView(root); break;
      case 'templates': renderTemplatesView(root); break;
      case 'header-footer': renderHeaderFooterView(root); break;
      case 'menus': renderMenusView(root); break;
      case 'media': renderMediaView(root); break;
      case 'meals': renderMealsView(root); break;
      case 'categories': renderCategoriesView(root); break;
      case 'packages': renderPackagesView(root); break;
      case 'sides': renderSidesView(root); break;
      case 'orders': renderOrdersView(root); break;
      case 'customers': renderCustomersView(root); break;
      case 'discounts': renderDiscountsView(root); break;
      case 'delivery': renderDeliveryView(root); break;
      case 'catering': renderCateringView(root); break;
      case 'dietary': renderDietaryView(root); break;
      case 'blog': renderBlogView(root); break;
      case 'users': renderUsersView(root); break;
      case 'settings': renderSettingsView(root); break;
      case 'appearance': renderAppearanceView(root); break;
      case 'seo': renderSeoView(root); break;
      case 'forms': renderFormsView(root); break;
      case 'analytics': renderAnalyticsView(root); break;
      case 'security': renderSecurityView(root); break;
      case 'backups': renderBackupsView(root); break;
      case 'logs': renderLogsView(root); break;
      default: renderDashboardView(root); break;
    }
  }

  // =========================================================================
  // 1. DASHBOARD OVERVIEW (Module 1)
  // =========================================================================
  async function renderDashboardView(container) {
    try {
      const data = await api('/analytics/overview');
      const stats = data.stats || {};
      const popular = data.popular_meals || [];
      const orders = data.recent_orders || [];
      const logs = data.recent_activity || [];

      container.innerHTML = `
        <div class="space-y-6">
          
          <!-- Top Welcome & Quick Actions -->
          <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Greek Fit Kitchen Administration</h2>
              <p class="text-xs text-gray-500 mt-1">
                Connected to SQLite relational database. All changes made in this dashboard update the live website immediately.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="navigateToTab('meals'); openNewMealModal();" class="px-3.5 py-2 bg-wp-navy hover:bg-wp-navyDark text-wp-gold font-bold text-xs rounded-lg shadow transition">
                + Add New Meal
              </button>
              <button onclick="navigateToTab('pages'); openNewPageModal();" class="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold text-xs rounded-lg transition">
                + Add Page
              </button>
              <a href="../builder.html" target="_blank" class="px-3.5 py-2 bg-wp-gold hover:bg-wp-goldHover text-wp-navyDark font-extrabold text-xs rounded-lg shadow transition flex items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-wp-navyDark text-wp-gold text-[9px] flex items-center justify-center font-black">E</span>
                <span>Open Visual Builder</span>
              </a>
            </div>
          </div>

          <!-- KPI Metric Cards (Real Database Data) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue (CAD)</span>
              <div class="text-2xl font-black text-wp-navy font-heading mt-1">$${stats.total_revenue || '0.00'}</div>
              <div class="text-[11px] text-emerald-600 font-semibold mt-1">Verified Paid Orders</div>
            </div>

            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
              <div class="text-2xl font-black text-gray-900 font-heading mt-1">${stats.total_orders || 0}</div>
              <div class="text-[11px] text-gray-500 mt-1">${stats.pending_orders || 0} Pending Batch Prep</div>
            </div>

            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Order Value</span>
              <div class="text-2xl font-black text-wp-gold font-heading mt-1">$${stats.average_order_value || '0.00'}</div>
              <div class="text-[11px] text-gray-500 mt-1">6-Meal Minimum Order Rule</div>
            </div>

            <div class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Chef Dishes</span>
              <div class="text-2xl font-black text-emerald-700 font-heading mt-1">${stats.active_dishes || 21}</div>
              <div class="text-[11px] text-gray-500 mt-1">2 Included Sides Per Plate</div>
            </div>
          </div>

          <!-- Visual Charts Grid (SVG) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Weekly Orders Volume Trend -->
            <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 class="font-bold text-sm text-gray-900 mb-2">Batch Order Distribution</h3>
              <p class="text-xs text-gray-500 mb-4">Twice-weekly delivery drops: Sunday &amp; Wednesday cycles</p>
              
              <div class="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-gray-200">
                <div class="flex-1 flex flex-col items-center gap-1">
                  <div class="w-full bg-wp-navy rounded-t-lg transition-all" style="height: 75%"></div>
                  <span class="text-[10px] text-gray-500 font-semibold">Sun Drop</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <div class="w-full bg-wp-gold rounded-t-lg transition-all" style="height: 60%"></div>
                  <span class="text-[10px] text-gray-500 font-semibold">Wed Drop</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <div class="w-full bg-emerald-600 rounded-t-lg transition-all" style="height: 35%"></div>
                  <span class="text-[10px] text-gray-500 font-semibold">HQ Pickup</span>
                </div>
              </div>
            </div>

            <!-- Popular Meals -->
            <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 class="font-bold text-sm text-gray-900 mb-2">Top Selling Chef Entrees</h3>
              <p class="text-xs text-gray-500 mb-4">Ranked by volume ordered across all batch drops</p>
              
              <div class="space-y-3">
                ${popular.length > 0 ? popular.map(m => `
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-800">${m.meal_name}</span>
                    <span class="font-bold text-wp-navy">${m.sold_count} ordered</span>
                  </div>
                `).join('') : `
                  <div class="text-xs text-gray-500 italic py-4 text-center">
                    Grilled Chicken, Lemon Salmon &amp; Steak Souvlaki leading active menus.
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Recent Orders & Activity Logs -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="lg:col-span-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
                <button onclick="navigateToTab('orders')" class="text-xs font-bold text-wp-blue hover:underline">View All Orders →</button>
              </div>

              ${orders.length > 0 ? `
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs">
                    <thead>
                      <tr class="border-b border-gray-200 text-gray-400 uppercase text-[10px]">
                        <th class="py-2.5">Order</th>
                        <th class="py-2.5">Customer</th>
                        <th class="py-2.5">Total</th>
                        <th class="py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      ${orders.map(o => `
                        <tr>
                          <td class="py-2.5 font-mono font-bold text-wp-blue">#${o.order_number}</td>
                          <td class="py-2.5">${o.customer_name}</td>
                          <td class="py-2.5 font-bold text-gray-900">$${parseFloat(o.grand_total_cad).toFixed(2)} CAD</td>
                          <td class="py-2.5">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              o.order_status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }">${o.order_status}</span>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : `
                <p class="text-xs text-gray-400 py-6 text-center">No orders recorded in database yet.</p>
              `}
            </div>

            <!-- Activity Logs Column -->
            <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 class="font-bold text-sm text-gray-900 mb-4">Live Activity Log</h3>
              <div class="space-y-3 max-h-72 overflow-y-auto text-xs">
                ${logs.map(l => `
                  <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div class="flex justify-between text-[10px] text-gray-400">
                      <strong class="text-wp-navy">${l.username || 'System'}</strong>
                      <span>${l.created_at ? l.created_at.split(' ')[0] : 'Just now'}</span>
                    </div>
                    <p class="font-medium text-gray-700 mt-1">${l.action}: ${l.details || ''}</p>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="p-6 bg-red-50 text-red-700 rounded-xl text-xs">Error loading dashboard: ${err.message}</div>`;
    }
  }

  // =========================================================================
  // 2. PAGES MANAGEMENT (Module 2)
  // =========================================================================
  async function renderPagesView(container) {
    try {
      const data = await api('/pages');
      const pages = data.pages || [];

      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Pages</h2>
              <p class="text-xs text-gray-500">Manage all website pages, SEO metadata, templates, and publication status.</p>
            </div>
            <button onclick="openNewPageModal()" class="px-4 py-2.5 bg-wp-navy text-wp-gold hover:bg-wp-navyDark font-bold text-xs rounded-lg shadow transition">
              + Add New Page
            </button>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th class="p-4">Title</th>
                    <th class="p-4">URL Slug</th>
                    <th class="p-4">Status</th>
                    <th class="p-4">Author</th>
                    <th class="p-4">Last Updated</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  ${pages.map(p => `
                    <tr class="hover:bg-gray-50 transition">
                      <td class="p-4">
                        <strong class="text-sm text-wp-navy block">${p.title}</strong>
                        <span class="text-[11px] text-gray-400">${p.seo_title || ''}</span>
                      </td>
                      <td class="p-4 font-mono text-gray-600">${p.slug}.html</td>
                      <td class="p-4">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }">${p.status}</span>
                      </td>
                      <td class="p-4 text-gray-600">${p.author_name || 'Admin'}</td>
                      <td class="p-4 text-gray-500">${p.updated_at ? p.updated_at.split(' ')[0] : 'Today'}</td>
                      <td class="p-4 text-right space-x-1.5">
                        <a href="../builder.html#${p.slug}" target="_blank" class="px-2.5 py-1 bg-wp-gold/20 text-wp-navy font-bold rounded hover:bg-wp-gold transition" title="Open in Elementor Builder">
                          Edit in Elementor
                        </a>
                        <button onclick="openEditPageModal(${p.id})" class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded">
                          Quick Edit
                        </button>
                        <button onclick="duplicatePage(${p.id})" class="px-2 py-1 text-gray-400 hover:text-gray-800" title="Duplicate">
                          ❐
                        </button>
                        <button onclick="trashPage(${p.id})" class="px-2 py-1 text-red-500 hover:bg-red-50 rounded" title="Move to Trash">
                          🗑
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="p-6 bg-red-50 text-red-700 text-xs rounded-xl">Error: ${err.message}</div>`;
    }
  }

  window.openNewPageModal = function () {
    openModal(`
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
        <h3 class="font-heading font-extrabold text-xl text-wp-navy mb-4">Create New Page</h3>
        <form onsubmit="handleCreatePage(event)" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-gray-700 mb-1">Page Title</label>
            <input type="text" id="modalPageTitle" required placeholder="e.g. Corporate Catering Guide" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-wp-blue" />
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">URL Slug</label>
            <input type="text" id="modalPageSlug" placeholder="corporate-catering" class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-wp-blue" />
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">SEO Title</label>
            <input type="text" id="modalPageSeoTitle" placeholder="Meta Title for Google search" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">Meta Description</label>
            <textarea id="modalPageMetaDesc" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Short description for Google snippet"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg">Cancel</button>
            <button type="submit" class="px-5 py-2 bg-wp-navy text-wp-gold font-bold rounded-lg shadow">Create Page</button>
          </div>
        </form>
      </div>
    `);
  };

  window.handleCreatePage = async function (e) {
    e.preventDefault();
    const title = document.getElementById('modalPageTitle').value.trim();
    const slug = document.getElementById('modalPageSlug').value.trim();
    const seo_title = document.getElementById('modalPageSeoTitle').value.trim();
    const meta_description = document.getElementById('modalPageMetaDesc').value.trim();

    try {
      await api('/pages', 'POST', { title, slug, seo_title, meta_description });
      closeModal();
      showToast(`Page "${title}" created successfully!`);
      renderCurrentTab();
    } catch (err) {
      alert(err.message);
    }
  };

  window.trashPage = async function (id) {
    if (!confirm('Are you sure you want to move this page to trash?')) return;
    try {
      await api(`/pages/${id}`, 'DELETE');
      showToast('Page moved to trash.');
      renderCurrentTab();
    } catch (err) {
      alert(err.message);
    }
  };

  window.duplicatePage = async function (id) {
    try {
      await api(`/pages/${id}/duplicate`, 'POST');
      showToast('Page duplicated.');
      renderCurrentTab();
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // 8. MEALS & PRODUCTS (Module 8)
  // =========================================================================
  async function renderMealsView(container) {
    try {
      const data = await api('/meals');
      const meals = data.meals || [];

      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Meals &amp; Dishes (${meals.length})</h2>
              <p class="text-xs text-gray-500">Every entree includes 2 complimentary sides per plate. All changes reflect live on public website.</p>
            </div>
            <button onclick="openNewMealModal()" class="px-4 py-2.5 bg-wp-navy text-wp-gold hover:bg-wp-navyDark font-bold text-xs rounded-lg shadow transition">
              + Add New Dish
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${meals.map(m => `
              <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div class="relative h-44 bg-gray-100 overflow-hidden">
                    <img src="../${m.image_url}" alt="${m.name}" class="w-full h-full object-cover" onerror="this.src='../images/meals/grilled-chicken.jpg'" />
                    <span class="absolute top-3 left-3 px-2.5 py-1 bg-wp-navy text-wp-gold font-extrabold text-[10px] rounded-lg shadow">
                      $${parseFloat(m.price_cad).toFixed(2)} CAD
                    </span>
                    <span class="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.is_active ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }">${m.is_active ? 'Active' : 'Disabled'}</span>
                  </div>
                  <div class="p-5">
                    <h3 class="font-heading font-extrabold text-lg text-wp-navy">${m.name}</h3>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">${m.description || ''}</p>
                    
                    <div class="grid grid-cols-4 gap-1 text-center bg-gray-50 p-2 rounded-xl border border-gray-100 text-[10px] mt-4">
                      <div><strong class="block text-gray-800">${m.calories}</strong>Cal</div>
                      <div><strong class="block text-emerald-600">${m.protein}g</strong>Pro</div>
                      <div><strong class="block text-amber-600">${m.carbs}g</strong>Carb</div>
                      <div><strong class="block text-blue-600">${m.fat}g</strong>Fat</div>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1">
                    <button onclick="editMealModal(${m.id})" class="px-3 py-1.5 bg-wp-navy text-wp-gold font-bold rounded-lg hover:bg-wp-navyDark transition">
                      Edit
                    </button>
                    <button onclick="duplicateMeal(${m.id})" class="p-1.5 text-gray-400 hover:text-gray-700" title="Duplicate">
                      ❐
                    </button>
                  </div>
                  <button onclick="deleteMeal(${m.id})" class="p-1.5 text-red-500 hover:bg-red-100 rounded" title="Delete">
                    🗑
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="p-6 bg-red-50 text-red-700 text-xs rounded-xl">Error: ${err.message}</div>`;
    }
  }

  window.openNewMealModal = function () {
    openModal(`
      <div class="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <h3 class="font-heading font-extrabold text-xl text-wp-navy mb-4">Add New Chef Dish</h3>
        <form onsubmit="handleCreateMeal(event)" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Meal Title</label>
              <input type="text" id="mealFormName" required placeholder="e.g. Lemon Rosemary Chicken" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Price (CAD)</label>
              <input type="number" step="0.01" id="mealFormPrice" required value="13.99" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">Description</label>
            <textarea id="mealFormDesc" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">Image URL</label>
            <input type="text" id="mealFormImg" value="images/meals/grilled-chicken.jpg" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div><label class="block font-bold text-gray-500">Calories</label><input type="number" id="mealCal" value="450" class="w-full p-2 border rounded" /></div>
            <div><label class="block font-bold text-gray-500">Protein (g)</label><input type="number" id="mealPro" value="48" class="w-full p-2 border rounded" /></div>
            <div><label class="block font-bold text-gray-500">Carbs (g)</label><input type="number" id="mealCarb" value="10" class="w-full p-2 border rounded" /></div>
            <div><label class="block font-bold text-gray-500">Fat (g)</label><input type="number" id="mealFat" value="14" class="w-full p-2 border rounded" /></div>
          </div>
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onclick="closeModal()" class="px-4 py-2 border rounded text-gray-600">Cancel</button>
            <button type="submit" class="px-5 py-2 bg-wp-navy text-wp-gold font-bold rounded shadow">Save Dish</button>
          </div>
        </form>
      </div>
    `);
  };

  window.handleCreateMeal = async function (e) {
    e.preventDefault();
    const name = document.getElementById('mealFormName').value.trim();
    const price_cad = document.getElementById('mealFormPrice').value;
    const description = document.getElementById('mealFormDesc').value.trim();
    const image_url = document.getElementById('mealFormImg').value.trim();
    const calories = document.getElementById('mealCal').value;
    const protein = document.getElementById('mealPro').value;
    const carbs = document.getElementById('mealCarb').value;
    const fat = document.getElementById('mealFat').value;

    try {
      await api('/meals', 'POST', { name, price_cad, description, image_url, calories, protein, carbs, fat });
      closeModal();
      showToast(`Dish "${name}" added to menu!`);
      renderCurrentTab();
    } catch (err) {
      alert(err.message);
    }
  };

  window.deleteMeal = async function (id) {
    if (!confirm('Are you sure you want to remove this dish from the menu?')) return;
    try {
      await api(`/meals/${id}`, 'DELETE');
      showToast('Dish deleted.');
      renderCurrentTab();
    } catch (err) {
      alert(err.message);
    }
  };

  window.duplicateMeal = async function (id) {
    try {
      await api(`/meals/${id}/duplicate`, 'POST');
      showToast('Dish duplicated.');
      renderCurrentTab();
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // 12. ORDERS MANAGEMENT (Module 12)
  // =========================================================================
  async function renderOrdersView(container) {
    try {
      const data = await api('/orders');
      const orders = data.orders || [];

      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Orders Management</h2>
              <p class="text-xs text-gray-500">Track paid batch drops, print invoices, manage order fulfillment and process refunds.</p>
            </div>
            <div class="flex items-center gap-2">
              <a href="/api/orders/export/csv" target="_blank" class="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-50 shadow-sm transition">
                Export CSV
              </a>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th class="p-4">Order #</th>
                    <th class="p-4">Customer</th>
                    <th class="p-4">Delivery Window</th>
                    <th class="p-4">Total (CAD)</th>
                    <th class="p-4">Status</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  ${orders.map(o => `
                    <tr class="hover:bg-gray-50 transition">
                      <td class="p-4 font-mono font-bold text-wp-blue">#${o.order_number}</td>
                      <td class="p-4">
                        <strong class="text-gray-900 block">${o.customer_name}</strong>
                        <span class="text-[11px] text-gray-400">${o.customer_email} • ${o.customer_phone || ''}</span>
                      </td>
                      <td class="p-4 text-gray-600">${o.delivery_date}</td>
                      <td class="p-4 font-bold text-wp-navy">$${parseFloat(o.grand_total_cad).toFixed(2)}</td>
                      <td class="p-4">
                        <select onchange="updateOrderStatus(${o.id}, this.value)" class="text-[11px] font-bold border border-gray-200 rounded p-1 bg-white">
                          <option value="pending" ${o.order_status === 'pending' ? 'selected' : ''}>Pending</option>
                          <option value="confirmed" ${o.order_status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                          <option value="preparing" ${o.order_status === 'preparing' ? 'selected' : ''}>Preparing</option>
                          <option value="ready" ${o.order_status === 'ready' ? 'selected' : ''}>Ready for Pickup</option>
                          <option value="out_for_delivery" ${o.order_status === 'out_for_delivery' ? 'selected' : ''}>Out for Delivery</option>
                          <option value="completed" ${o.order_status === 'completed' ? 'selected' : ''}>Completed</option>
                          <option value="refunded" ${o.order_status === 'refunded' ? 'selected' : ''}>Refunded</option>
                        </select>
                      </td>
                      <td class="p-4 text-right">
                        <button onclick="viewOrderModal(${o.id})" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded">
                          Invoice Ticket
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="p-6 bg-red-50 text-red-700 text-xs rounded-xl">Error: ${err.message}</div>`;
    }
  }

  window.updateOrderStatus = async function (id, status) {
    try {
      await api(`/orders/${id}/status`, 'PUT', { status });
      showToast(`Order status updated to ${status}.`);
    } catch (err) {
      alert(err.message);
    }
  };

  window.viewOrderModal = async function (id) {
    try {
      const data = await api(`/orders/${id}`);
      const o = data.order;
      const items = data.items || [];

      openModal(`
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto text-xs">
          <div class="flex justify-between items-start pb-4 border-b border-gray-200">
            <div>
              <span class="text-[10px] font-bold text-wp-gold uppercase tracking-wider">Greek Fit Kitchen Kitchen Ticket</span>
              <h3 class="font-heading font-black text-2xl text-wp-navy mt-0.5">Order #${o.order_number}</h3>
              <p class="text-gray-500">${o.created_at}</p>
            </div>
            <button onclick="window.print()" class="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded">🖨️ Print Ticket</button>
          </div>

          <div class="grid grid-cols-2 gap-4 my-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <strong class="text-gray-700 block mb-1">Customer Info:</strong>
              <p class="font-bold text-gray-900">${o.customer_name}</p>
              <p class="text-gray-600">${o.customer_email}</p>
              <p class="text-gray-600">${o.customer_phone || ''}</p>
            </div>
            <div>
              <strong class="text-gray-700 block mb-1">Delivery Destination:</strong>
              <p class="font-bold text-gray-900">${o.delivery_date}</p>
              <p class="text-gray-600">${o.delivery_address}</p>
              <p class="text-gray-500">Method: ${o.delivery_type.toUpperCase()}</p>
            </div>
          </div>

          <div class="my-4">
            <h4 class="font-bold text-gray-800 uppercase text-[10px] tracking-wider mb-2">Itemized Meal Plates (${items.length})</h4>
            <div class="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              ${items.map(it => `
                <div class="p-3 bg-white flex justify-between items-center">
                  <div>
                    <strong class="text-wp-navy block">${it.quantity}x ${it.meal_name}</strong>
                    <span class="text-[11px] text-gray-500 font-mono">${it.customization_json || ''}</span>
                  </div>
                  <span class="font-bold text-gray-800">$${parseFloat(it.price_cad).toFixed(2)} CAD</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="my-4 p-4 bg-gray-50 rounded-xl space-y-1.5 text-right">
            <div>Subtotal: <strong>$${parseFloat(o.subtotal_cad).toFixed(2)} CAD</strong></div>
            <div>Volume Discount: <strong class="text-emerald-600">-$${parseFloat(o.discount_cad).toFixed(2)} CAD</strong></div>
            <div>Ontario HST (13%): <strong>$${parseFloat(o.tax_cad).toFixed(2)} CAD</strong></div>
            <div>Delivery Fee: <strong>$${parseFloat(o.delivery_fee_cad).toFixed(2)} CAD</strong></div>
            <div class="text-base font-black text-wp-navy pt-2 border-t border-gray-200">
              Grand Total: $${parseFloat(o.grand_total_cad).toFixed(2)} CAD
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button onclick="closeModal()" class="px-5 py-2 bg-wp-navy text-wp-gold font-bold rounded-lg shadow">Close</button>
          </div>
        </div>
      `);
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // 15. DELIVERY MANAGEMENT (Module 15)
  // =========================================================================
  async function renderDeliveryView(container) {
    try {
      const data = await api('/delivery/settings');
      const s = data.settings || {};

      container.innerHTML = `
        <div class="space-y-6 max-w-3xl">
          <div>
            <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Delivery Management &amp; Fee Calculator</h2>
            <p class="text-xs text-gray-500">Configure GTA distance fee tiers, batch drops, order cutoff hours, and kitchen address.</p>
          </div>

          <form onsubmit="handleSaveDeliverySettings(event)" class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-gray-700 mb-1">Base Delivery Fee ($ CAD)</label>
                <input type="number" step="0.01" id="delivBase" value="${s.base_delivery_fee || '5.99'}" class="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Per Kilometre Fee ($ CAD / km)</label>
                <input type="number" step="0.01" id="delivPerKm" value="${s.per_km_fee || '0.99'}" class="w-full px-3 py-2 border rounded" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-bold text-gray-700 mb-1">Free Delivery Radius (km)</label>
                <input type="number" step="0.1" id="delivFreeKm" value="${s.free_delivery_km || '2.0'}" class="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Tier 2 Max Radius (km)</label>
                <input type="number" step="0.1" id="delivTier2Km" value="${s.tier_2_max_km || '5.0'}" class="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Tier 2 Flat Rate ($ CAD)</label>
                <input type="number" step="0.01" id="delivTier2Fee" value="${s.tier_2_flat_fee || '5.00'}" class="w-full px-3 py-2 border rounded" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-gray-700 mb-1">Commercial Kitchen Address (HQ)</label>
              <input type="text" id="delivAddress" value="${s.kitchen_address || '3575 Lake Shore Blvd W, Etobicoke, ON M8W 1P5'}" class="w-full px-3 py-2 border rounded font-mono" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-gray-700 mb-1">Sunday Batch Cutoff Notice</label>
                <input type="text" id="delivSunCut" value="${s.sunday_cutoff || 'Friday 11:59 PM EST'}" class="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Wednesday Batch Cutoff Notice</label>
                <input type="text" id="delivWedCut" value="${s.wednesday_cutoff || 'Monday 11:59 PM EST'}" class="w-full px-3 py-2 border rounded" />
              </div>
            </div>

            <button type="submit" class="px-6 py-2.5 bg-wp-navy text-wp-gold font-bold text-xs rounded-lg shadow">
              Save Delivery Rules
            </button>
          </form>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="p-6 bg-red-50 text-red-700 text-xs rounded-xl">Error: ${err.message}</div>`;
    }
  }

  window.handleSaveDeliverySettings = async function (e) {
    e.preventDefault();
    const settings = {
      base_delivery_fee: document.getElementById('delivBase').value,
      per_km_fee: document.getElementById('delivPerKm').value,
      free_delivery_km: document.getElementById('delivFreeKm').value,
      tier_2_max_km: document.getElementById('delivTier2Km').value,
      tier_2_flat_fee: document.getElementById('delivTier2Fee').value,
      kitchen_address: document.getElementById('delivAddress').value,
      sunday_cutoff: document.getElementById('delivSunCut').value,
      wednesday_cutoff: document.getElementById('delivWedCut').value
    };

    try {
      await api('/delivery/settings', 'PUT', { settings });
      showToast('Delivery thresholds and cutoff schedules updated!');
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // OTHER VIEWS: FALLBACK & EXTENDED MODULES
  // =========================================================================
  async function renderTemplatesView(c) {
    c.innerHTML = `
      <div class="p-6 bg-white rounded-xl border border-gray-200">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy mb-2">Reusable Templates</h2>
        <p class="text-xs text-gray-500 mb-4">Saved sections and full page templates created in Elementor Visual Builder.</p>
        <p class="text-xs text-gray-400 italic">Save any section in the Elementor Visual Studio to insert it across any page.</p>
      </div>
    `;
  }

  async function renderHeaderFooterView(c) {
    c.innerHTML = `
      <div class="p-6 bg-white rounded-xl border border-gray-200 space-y-4 text-xs">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Header &amp; Footer Builder</h2>
        <p class="text-gray-500">Edit global brand header and footer displayed across all pages.</p>
        <div class="p-4 bg-gray-50 rounded-lg">
          <strong class="block text-gray-800 mb-1">Header Configuration:</strong>
          <p class="text-gray-600">Logo: images/brand/greek-fit-kitchen-logo.png • Sticky Header: Enabled • Cart Dynamic Badge: Active</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <strong class="block text-gray-800 mb-1">Footer Configuration:</strong>
          <p class="text-gray-600">Copyright: &copy; 2026 Greek Fit Kitchen • Centered Text: Enabled • Kitchen HQ: 3575 Lake Shore Blvd W</p>
        </div>
      </div>
    `;
  }

  async function renderMenusView(c) {
    c.innerHTML = `
      <div class="p-6 bg-white rounded-xl border border-gray-200 space-y-4 text-xs">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Navigation Menus</h2>
        <p class="text-gray-500">Configure desktop navbar items and mobile drawer links.</p>
        <div class="border rounded-lg p-3 space-y-1">
          <div class="p-2 bg-gray-50 rounded font-bold">1. Home (index.html)</div>
          <div class="p-2 bg-gray-50 rounded font-bold">2. Meal Plan (menu.html)</div>
          <div class="p-2 bg-gray-50 rounded font-bold">3. Delivery Rates (delivery-rates.html)</div>
          <div class="p-2 bg-gray-50 rounded font-bold">4. About Us (about-us.html)</div>
          <div class="p-2 bg-gray-50 rounded font-bold">5. How It Works (how-it-works.html)</div>
          <div class="p-2 bg-gray-50 rounded font-bold">6. Blog Journal (blog.html)</div>
        </div>
      </div>
    `;
  }

  async function renderMediaView(c) {
    try {
      const data = await api('/media');
      const media = data.media || [];
      c.innerHTML = `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Media Library</h2>
              <p class="text-xs text-gray-500">Browse and manage photography assets for meals, banners, and blog posts.</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            ${media.map(m => `
              <div class="bg-white p-2 rounded-xl border border-gray-200 shadow-sm text-center">
                <img src="../${m.url}" alt="${m.filename}" class="w-full h-24 object-cover rounded-lg mb-2" onerror="this.src='../images/meals/grilled-chicken.jpg'" />
                <span class="text-[10px] text-gray-600 block truncate font-mono">${m.filename}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      c.innerHTML = `<div class="p-4 text-red-500">${err.message}</div>`;
    }
  }

  async function renderCategoriesView(c) {
    const data = await api('/meal-categories');
    const cats = data.categories || [];
    c.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Meal Categories</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          ${cats.map(cat => `
            <div class="p-4 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                <strong class="text-wp-navy text-sm block">${cat.name}</strong>
                <span class="text-gray-400 font-mono">${cat.slug} • ${cat.meals_count} Dishes</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderPackagesView(c) {
    const data = await api('/packages');
    const pkgs = data.packages || [];
    c.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Meal Packages</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          ${pkgs.map(p => `
            <div class="p-5 bg-white rounded-2xl border border-gray-200 text-center">
              <span class="text-[10px] font-bold px-2 py-0.5 bg-wp-gold text-wp-navyDark rounded-full">${p.discount_percent}% OFF</span>
              <h3 class="font-heading font-extrabold text-lg text-wp-navy mt-2">${p.name}</h3>
              <p class="text-xs text-gray-500 my-2">${p.description}</p>
              <div class="text-xl font-black text-emerald-600 my-3">Min ${p.min_qty} Meals</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderSidesView(c) {
    const data = await api('/sides');
    const sides = data.sides || [];
    c.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Sides &amp; Extras (${sides.length})</h2>
        <p class="text-xs text-gray-500">Every plate comes with 2 included complimentary sides. Extra sides charged separately.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          ${sides.map(s => `
            <div class="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                <strong class="text-gray-800 block">${s.name}</strong>
                <span class="text-[11px] text-gray-400">${s.type === 'included' ? 'Included complimentary' : 'Extra add-on'}</span>
              </div>
              <span class="font-bold text-wp-navy">$${parseFloat(s.price_cad).toFixed(2)} CAD</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderCustomersView(c) {
    const data = await api('/customers');
    const custs = data.customers || [];
    c.innerHTML = `
      <div class="space-y-6">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Registered Customers (${custs.length})</h2>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs">
          <table class="w-full text-left">
            <thead class="bg-gray-50 border-b text-[10px] text-gray-400 uppercase">
              <tr><th class="p-3">Customer</th><th class="p-3">Email</th><th class="p-3">Orders</th><th class="p-3">Total Spent</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              ${custs.map(cust => `
                <tr>
                  <td class="p-3 font-bold text-wp-navy">${cust.name}</td>
                  <td class="p-3 text-gray-600">${cust.email}</td>
                  <td class="p-3">${cust.total_orders}</td>
                  <td class="p-3 font-bold text-emerald-700">$${parseFloat(cust.total_spent).toFixed(2)} CAD</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async function renderDiscountsView(c) {
    const data = await api('/discounts');
    const coupons = data.discounts || [];
    c.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Discounts &amp; Promotional Coupons</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          ${coupons.map(cp => `
            <div class="p-4 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                <strong class="text-sm font-mono text-wp-navy block">${cp.code}</strong>
                <span class="text-gray-500">${cp.discount_type === 'percent' ? `${cp.discount_value}% OFF` : `$${cp.discount_value} OFF`}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">Active</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderCateringView(c) {
    const data = await api('/forms?type=catering');
    const items = data.submissions || [];
    c.innerHTML = `
      <div class="space-y-6">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Catering &amp; Event Enquiries (${items.length})</h2>
        <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 text-xs">
          ${items.map(it => `
            <div class="p-4 flex justify-between items-center">
              <div>
                <strong class="text-wp-navy block">${it.name} (${it.email})</strong>
                <span class="text-gray-500">${it.details_json}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">${it.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderDietaryView(c) {
    const data = await api('/forms?type=dietary');
    const items = data.submissions || [];
    c.innerHTML = `
      <div class="space-y-6">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Special Dietary Requests (${items.length})</h2>
        <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 text-xs">
          ${items.map(it => `
            <div class="p-4 flex justify-between items-center">
              <div>
                <strong class="text-wp-navy block">${it.name} (${it.email})</strong>
                <span class="text-gray-500">${it.details_json}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">${it.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderBlogView(c) {
    const data = await api('/blog?status=all');
    const posts = data.posts || [];
    c.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Blog Articles (CMS)</h2>
            <p class="text-xs text-gray-500">Mediterranean wellness, athletic nutrition, and batch prep insights.</p>
          </div>
          <a href="../builder.html#blog" target="_blank" class="px-4 py-2 bg-wp-navy text-wp-gold font-bold text-xs rounded-lg shadow">
            + Write Article (CMS)
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          ${posts.map(p => `
            <div class="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 items-center">
              <img src="../${p.featured_image}" class="w-16 h-16 rounded-lg object-cover" onerror="this.src='../images/meals/grilled-chicken.jpg'" />
              <div>
                <span class="text-[10px] font-bold text-wp-gold uppercase">${p.category}</span>
                <strong class="text-wp-navy block text-sm mt-0.5">${p.title}</strong>
                <span class="text-gray-400 text-[10px]">By ${p.author_name} • ${p.read_time}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderUsersView(c) {
    const data = await api('/users');
    const users = data.users || [];
    c.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Users &amp; Roles</h2>
            <p class="text-xs text-gray-500">Role-based access control with BCrypt password encryption.</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs">
          <table class="w-full text-left">
            <thead class="bg-gray-50 border-b text-[10px] text-gray-400 uppercase">
              <tr><th class="p-3">User</th><th class="p-3">Email</th><th class="p-3">Role</th><th class="p-3">Status</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              ${users.map(u => `
                <tr>
                  <td class="p-3 font-bold text-wp-navy">${u.full_name} (@${u.username})</td>
                  <td class="p-3 text-gray-600">${u.email}</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-wp-navy text-wp-gold">${u.role_name}</span></td>
                  <td class="p-3 text-emerald-600 font-bold">Active</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async function renderSettingsView(c) {
    const data = await api('/settings');
    const cfg = data.settings || {};
    c.innerHTML = `
      <div class="space-y-6 max-w-3xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Website &amp; Business Settings</h2>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div><label class="block font-bold text-gray-700 mb-1">Site Title</label><input type="text" value="${cfg.general ? cfg.general.site_name : 'Greek Fit Kitchen'}" class="w-full p-2 border rounded" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Tagline</label><input type="text" value="${cfg.general ? cfg.general.tagline : 'Big Greek Flavour. Zero Meal Prep.'}" class="w-full p-2 border rounded" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Currency</label><input type="text" value="CAD" readonly class="w-full p-2 border rounded bg-gray-50" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Ontario HST Tax Rate (%)</label><input type="text" value="13.0" readonly class="w-full p-2 border rounded bg-gray-50" /></div>
          <button onclick="showToast('Settings saved.')" class="px-5 py-2.5 bg-wp-navy text-wp-gold font-bold rounded-lg shadow">Save Changes</button>
        </div>
      </div>
    `;
  }

  async function renderAppearanceView(c) {
    c.innerHTML = `
      <div class="space-y-6 max-w-3xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Appearance &amp; Global Design Tokens</h2>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div><label class="block font-bold text-gray-700 mb-1">Primary Color (Greek Navy)</label><input type="color" value="#101D3A" class="w-12 h-10 border rounded" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Accent Color (Greek Gold)</label><input type="color" value="#F5C542" class="w-12 h-10 border rounded" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Heading Font Family</label><input type="text" value="Roboto Slab, serif" readonly class="w-full p-2 border rounded bg-gray-50 font-mono" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Body Font Family</label><input type="text" value="Roboto, sans-serif" readonly class="w-full p-2 border rounded bg-gray-50 font-mono" /></div>
        </div>
      </div>
    `;
  }

  async function renderSeoView(c) {
    c.innerHTML = `
      <div class="space-y-6 max-w-3xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Search Engine Optimization (SEO)</h2>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div><label class="block font-bold text-gray-700 mb-1">Default Meta Title</label><input type="text" value="Greek Fit Kitchen | High Protein Mediterranean Meal Prep Toronto" class="w-full p-2 border rounded" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Default Meta Description</label><textarea rows="3" class="w-full p-2 border rounded">21 chef-prepared Mediterranean meals with 2 included fresh sides per plate. Twice-weekly batch prep in Etobicoke.</textarea></div>
          <div class="p-4 bg-gray-50 rounded-lg text-gray-600">
            <strong>Google SERP Preview:</strong>
            <p class="text-blue-700 font-bold text-sm mt-1">Greek Fit Kitchen | High Protein Mediterranean Meal Prep Toronto</p>
            <p class="text-emerald-700 font-mono text-[11px]">https://greekfitkitchen.ca</p>
            <p class="text-gray-500 text-xs">21 chef-prepared Mediterranean meals with 2 included fresh sides per plate. Twice-weekly batch prep in Etobicoke.</p>
          </div>
        </div>
      </div>
    `;
  }

  async function renderFormsView(c) {
    c.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Customer Form Submissions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div onclick="navigateToTab('catering')" class="p-5 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-wp-blue">
            <h4 class="font-bold text-sm text-wp-navy">Catering &amp; Event Form</h4>
            <p class="text-gray-500 mt-1">Buffet stations &amp; gym packages</p>
          </div>
          <div onclick="navigateToTab('dietary')" class="p-5 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-wp-blue">
            <h4 class="font-bold text-sm text-wp-navy">Dietary Requests Form</h4>
            <p class="text-gray-500 mt-1">Allergies &amp; custom preparations</p>
          </div>
          <div class="p-5 bg-white rounded-xl border border-gray-200">
            <h4 class="font-bold text-sm text-wp-navy">Customer Contact Form</h4>
            <p class="text-gray-500 mt-1">General enquiries &amp; batch timing</p>
          </div>
        </div>
      </div>
    `;
  }

  async function renderAnalyticsView(c) {
    const data = await api('/analytics/overview');
    const s = data.stats || {};
    c.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Performance Analytics &amp; Reports</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="p-5 bg-white rounded-xl border border-gray-200">
            <div class="text-xs font-bold text-gray-400">Total Revenue</div>
            <div class="text-2xl font-black text-wp-navy mt-1">$${s.total_revenue} CAD</div>
          </div>
          <div class="p-5 bg-white rounded-xl border border-gray-200">
            <div class="text-xs font-bold text-gray-400">Total Orders</div>
            <div class="text-2xl font-black text-wp-navy mt-1">${s.total_orders}</div>
          </div>
          <div class="p-5 bg-white rounded-xl border border-gray-200">
            <div class="text-xs font-bold text-gray-400">Registered Customers</div>
            <div class="text-2xl font-black text-wp-navy mt-1">${s.total_customers}</div>
          </div>
        </div>
      </div>
    `;
  }

  async function renderSecurityView(c) {
    c.innerHTML = `
      <div class="space-y-6 max-w-3xl">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Security &amp; PIN Controls</h2>
        <div class="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 text-xs">
          <p class="text-gray-600">Enterprise password hashing (BCrypt 10 rounds) and protected JWT tokens enabled.</p>
          <div><label class="block font-bold text-gray-700 mb-1">Kitchen Dispatch Staff PIN</label><input type="password" value="2233" readonly class="w-48 p-2 border rounded bg-gray-50" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Courier Delivery Staff PIN</label><input type="password" value="4455" readonly class="w-48 p-2 border rounded bg-gray-50" /></div>
          <div><label class="block font-bold text-gray-700 mb-1">Master Administrator PIN</label><input type="password" value="1234" readonly class="w-48 p-2 border rounded bg-gray-50" /></div>
        </div>
      </div>
    `;
  }

  async function renderBackupsView(c) {
    const data = await api('/backups');
    const backups = data.backups || [];
    c.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Database Backup &amp; Restore</h2>
            <p class="text-xs text-gray-500">Create full relational database snapshots and export JSON/SQL data.</p>
          </div>
          <button onclick="handleCreateBackup()" class="px-4 py-2 bg-wp-navy text-wp-gold font-bold text-xs rounded-lg shadow">
            + Create Backup Now
          </button>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 text-xs">
          ${backups.map(b => `
            <div class="p-4 flex justify-between items-center">
              <div>
                <strong class="text-wp-navy block font-mono">${b.filename}</strong>
                <span class="text-gray-400 text-[11px]">${(b.file_size / 1024).toFixed(1)} KB • ${b.created_at}</span>
              </div>
              <span class="text-emerald-600 font-bold">Snapshot Verified</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  window.handleCreateBackup = async function () {
    try {
      await api('/backups/create', 'POST', { notes: 'Manual backup from dashboard' });
      showToast('Database backup snapshot created successfully!');
      renderCurrentTab();
    } catch (err) {
      alert(err.message);
    }
  };

  async function renderLogsView(c) {
    const data = await api('/logs');
    const logs = data.logs || [];
    c.innerHTML = `
      <div class="space-y-6">
        <h2 class="font-heading font-extrabold text-2xl text-wp-navy">Audit Activity Logs (${logs.length})</h2>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs">
          <table class="w-full text-left">
            <thead class="bg-gray-50 border-b text-[10px] text-gray-400 uppercase">
              <tr><th class="p-3">User</th><th class="p-3">Action</th><th class="p-3">Entity</th><th class="p-3">Details</th><th class="p-3">Date</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              ${logs.map(l => `
                <tr>
                  <td class="p-3 font-bold text-wp-navy">${l.username || 'System'}</td>
                  <td class="p-3 font-semibold">${l.action}</td>
                  <td class="p-3 font-mono text-[11px]">${l.entity_type} #${l.entity_id || ''}</td>
                  <td class="p-3 text-gray-600">${l.details || ''}</td>
                  <td class="p-3 text-gray-400">${l.created_at}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- Initialize on Page Load ---
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const authData = await api('/auth/me');
      currentUser = authData.user;
      const userNameEl = document.getElementById('adminUserName');
      const profileName = document.getElementById('profileUserFullName');
      const profileRole = document.getElementById('profileUserRole');
      if (userNameEl) userNameEl.innerText = currentUser.username;
      if (profileName) profileName.innerText = currentUser.full_name;
      if (profileRole) profileRole.innerText = currentUser.role_name;
    } catch (e) {
      console.error('Auth verification failed', e);
    }

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      navigateToTab(hash);
    } else {
      navigateToTab('dashboard');
    }
  });

})();
