/**
 * Greek Fit Kitchen - Elementor Visual Page Builder & CMS Engine
 * Allows client to visually edit text, swap images, add/remove sections & elements,
 * manage pages, and publish blog articles.
 */

(function () {
  'use strict';

  // --- Constants & Defaults ---
  const DEFAULT_MEAL_IMAGES = [
    { title: 'Grilled Chicken', url: 'images/meals/grilled-chicken.jpg' },
    { title: 'Chicken Fillet', url: 'images/meals/chicken-fillet.jpg' },
    { title: 'Steak Souvlaki', url: 'images/meals/steak-souvlaki.jpg' },
    { title: 'Lemon Herb Salmon', url: 'images/meals/lemon-herb-salmon.jpg' },
    { title: 'Stuffed Chicken Breast', url: 'images/meals/stuffed-chicken.jpg' },
    { title: 'Spanakopita Spinach Pie', url: 'images/meals/spinach-pie.jpg' },
    { title: 'Beef Souvlaki', url: 'images/meals/beef-souvlaki.jpg' },
    { title: 'Pork Souvlaki', url: 'images/meals/pork-souvlaki.jpg' },
    { title: 'Chilly Chicken', url: 'images/meals/chilly-chicken.jpg' },
    { title: 'Shrimp Skewers', url: 'images/meals/shrimp-skewers.jpg' },
    { title: 'Turkey Bifteki', url: 'images/meals/turkey-bifteki.jpg' },
    { title: 'Fresh Ingredients Showcase', url: 'images/brand/fresh-ingredients-showcase.png' },
    { title: 'Greek Fit Logo', url: 'images/brand/greek-fit-kitchen-logo.png' }
  ];

  const DEFAULT_BLOG_POSTS = [
    {
      id: 'post_1',
      title: 'The Mediterranean Advantage: High-Protein Meal Prep for Athletic Recovery',
      slug: 'mediterranean-advantage-high-protein-recovery',
      category: 'Nutrition',
      author: 'George the Greek',
      date: 'November 2, 2026',
      readTime: '5 min read',
      image: 'images/meals/grilled-chicken.jpg',
      excerpt: 'Discover why extra virgin olive oil, wild oregano, lean poultry, and clean starches out-perform synthetic bodybuilder diets in long-term muscular endurance.',
      content: '<p class="text-base text-gray-700 leading-relaxed mb-4">When athletes think of meal prep, they often picture dry chicken breast and unseasoned steamed broccoli. But Mediterranean culinary heritage proves that nutrient-dense fuel can be deeply flavorful.</p><p class="text-base text-gray-700 leading-relaxed mb-4">At Greek Fit Kitchen, every meal is prepared with extra virgin cold-pressed olive oil, fresh lemon, mountain oregano, and clean sea salt.</p>'
    },
    {
      id: 'post_2',
      title: 'Clean Carbs vs. Fast Energy: Why Yellow Basmati & Sweet Potatoes Fuel Toronto Workouts',
      slug: 'clean-carbs-yellow-basmati-sweet-potatoes',
      category: 'Fitness',
      author: 'George the Greek',
      date: 'October 30, 2026',
      readTime: '6 min read',
      image: 'images/meals/lemon-herb-salmon.jpg',
      excerpt: 'Not all carbohydrates are created equal. Learn how complex starch profiles sustain glycogen stores throughout intense training sessions.',
      content: '<p class="text-base text-gray-700 leading-relaxed mb-4">Glycogen depletion is the number one cause of late-workout fatigue. By pairing lean protein with slow-digesting complex carbs like Yellow Basmati rice or roasted sweet potatoes, your muscles enjoy sustained glucose release.</p>'
    },
    {
      id: 'post_3',
      title: 'Inside George’s Kitchen: How We Prep 21 Chef Dishes Fresh Every Week',
      slug: 'inside-georges-kitchen-21-chef-dishes',
      category: 'Meal Prep',
      author: 'Kitchen Operations',
      date: 'October 29, 2026',
      readTime: '7 min read',
      image: 'images/meals/steak-souvlaki.jpg',
      excerpt: 'A behind-the-scenes look at our twice-weekly batch prep cycles at 3575 Lake Shore Blvd W in Etobicoke. Zero freezing, 100% fresh batch cookery.',
      content: '<p class="text-base text-gray-700 leading-relaxed mb-4">We never freeze our food. Orders close Friday at midnight for Sunday batch cooking, and Monday midnight for Wednesday delivery. Our commercial kitchen operates with surgical precision.</p>'
    },
    {
      id: 'post_4',
      title: 'Authentic Spanakopita Spinach Pie: Macro Breakdown & Prep',
      slug: 'authentic-spanakopita-macro-breakdown',
      category: 'Recipes',
      author: 'George the Greek',
      date: 'October 28, 2026',
      readTime: '4 min read',
      image: 'images/meals/spinach-pie.jpg',
      excerpt: 'Crispy flaky phyllo pastry meets mineral-dense wild spinach and creamy Greek feta. Here is why it makes an ideal athletic carbohydrate source.',
      content: '<p class="text-base text-gray-700 leading-relaxed mb-4">Who says comfort food cannot fit into a lean bulking or maintenance diet? Spanakopita offers a balance of complex carbohydrates, calcium, iron, and slow-digesting dietary fiber.</p>'
    }
  ];

  // Default initial page templates
  const DEFAULT_PAGE_TEMPLATES = {
    home: `
      <!-- Hero Section -->
      <section class="builder-section relative py-20 px-6 sm:px-12 bg-gradient-to-br from-[#101D3A] via-[#0C172E] to-[#101D3A] text-white rounded-t-2xl" data-section-id="sec_hero">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_hero', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_hero', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_hero')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto text-center">
          <span class="builder-element inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-[#F5C542] text-[#0C172E] mb-4" data-element-id="el_hero_tag" contenteditable="true">
            AUTHENTIC GREEK ATHLETIC MEAL PREP • TORONTO &amp; GTA
          </span>
          <h1 class="builder-element font-heading text-4xl sm:text-6xl font-black text-white leading-tight mb-6" data-element-id="el_hero_title" contenteditable="true">
            Fuel Your Body With Clean Mediterranean Power
          </h1>
          <p class="builder-element text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8" data-element-id="el_hero_sub" contenteditable="true">
            21 chef-crafted high-protein entrees with 2 included fresh sides per plate. Cooked fresh twice weekly at 3575 Lake Shore Blvd W in Etobicoke.
          </p>
          <div class="builder-element flex flex-wrap justify-center gap-4" data-element-id="el_hero_cta">
            <a href="menu.html" class="px-8 py-4 rounded-2xl bg-[#F5C542] hover:bg-[#E5B432] text-[#0C172E] font-extrabold text-base shadow-xl transition">
              Build Your Meal Plan
            </a>
            <a href="blog.html" class="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base transition border border-white/20">
              Read Nutrition Journal
            </a>
          </div>
        </div>
      </section>

      <!-- Fresh Ingredients Showcase -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white" data-section-id="sec_showcase">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_showcase', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">↑</button>
          <button onclick="moveSection('sec_showcase', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">↓</button>
          <button onclick="duplicateSection('sec_showcase')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">❐</button>
          <button onclick="deleteSection('sec_showcase')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div class="flex-1 builder-element" data-element-id="el_showcase_img">
            <img src="images/brand/fresh-ingredients-showcase.png" alt="Fresh Ingredients" class="w-full rounded-3xl shadow-xl border border-gray-100 object-cover" />
          </div>
          <div class="flex-1 space-y-4">
            <span class="builder-element text-xs font-extrabold tracking-widest text-[#F5C542] uppercase block" data-element-id="el_showcase_eyebrow" contenteditable="true">
              OUR CULINARY PROMISE
            </span>
            <h2 class="builder-element font-heading text-3xl sm:text-4xl font-extrabold text-[#101D3A]" data-element-id="el_showcase_heading" contenteditable="true">
              Never Frozen. Seasoned With Pure Extra Virgin Olive Oil.
            </h2>
            <p class="builder-element text-slate-600 text-base leading-relaxed" data-element-id="el_showcase_text" contenteditable="true">
              Every dish is seasoned with authentic Greek mountain oregano, hand-harvested sea salt, fresh garlic, and whole lemons. We fuel active lifestyles with zero shortcuts.
            </p>
            <div class="builder-element pt-2" data-element-id="el_showcase_btn">
              <a href="menu.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#101D3A] text-white font-bold text-sm hover:bg-[#0C172E] transition">
                <span>View Full 21-Dish Menu</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Meal Packages Section -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white" data-section-id="sec_plans">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_plans', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">↑</button>
          <button onclick="moveSection('sec_plans', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">↓</button>
          <button onclick="duplicateSection('sec_plans')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">❐</button>
          <button onclick="deleteSection('sec_plans')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto text-center mb-12">
          <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" data-element-id="el_plans_tag" contenteditable="true">VOLUME TIERS</span>
          <h2 class="builder-element font-heading text-3xl sm:text-4xl font-black text-[#101D3A] mt-2" data-element-id="el_plans_title" contenteditable="true">Build Your Weekly Meal Plan</h2>
          <p class="builder-element text-slate-600 text-sm mt-2" data-element-id="el_plans_desc" contenteditable="true">More meals mean greater savings. Perfect for individuals, fitness couples, or heavy training phases.</p>
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="builder-element bg-[#101D3A] text-white p-6 rounded-3xl border border-slate-700 flex flex-col justify-between" data-element-id="el_plan_card1">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/10 rounded-md">Minimum Tier</span>
              <h3 class="font-heading text-xl font-black mt-3">6-Meal Package</h3>
              <p class="text-xs text-slate-300 mt-1">Ideal for Monday through Saturday lunches.</p>
              <div class="text-2xl font-black text-[#F5C542] my-4">~$59.94 <span class="text-xs text-slate-400 font-normal">CAD</span></div>
              <ul class="text-xs text-slate-300 space-y-2 mb-6">
                <li>✓ 6 Chef-Prepared Entrees</li>
                <li>✓ 12 Total Custom Sides</li>
                <li>✓ Standard GTA Distance Rate</li>
              </ul>
            </div>
            <a href="menu.html" class="w-full py-3 text-center rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition">Customize 6-Meal Package</a>
          </div>

          <div class="builder-element bg-[#101D3A] text-white p-6 rounded-3xl border-2 border-[#F5C542] shadow-2xl relative flex flex-col justify-between" data-element-id="el_plan_card2">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#F5C542] text-[#0C172E] text-[10px] font-black uppercase rounded-full">MOST POPULAR • 10% OFF</span>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/10 rounded-md">Volume Savings</span>
              <h3 class="font-heading text-xl font-black mt-3">7 to 9 Meals Plan</h3>
              <p class="text-xs text-slate-300 mt-1">Full-week lunches &amp; post-workout dinners.</p>
              <div class="text-2xl font-black text-emerald-400 my-4">10% OFF <span class="text-xs text-slate-400 font-normal">applied at checkout</span></div>
              <ul class="text-xs text-slate-300 space-y-2 mb-6">
                <li>✓ 7–9 Chef-Prepared Entrees</li>
                <li>✓ 14–18 Total Custom Sides</li>
                <li>✓ 10% Volume Discount</li>
                <li>✓ Priority Batch Prep</li>
              </ul>
            </div>
            <a href="menu.html" class="w-full py-3 text-center rounded-xl bg-[#F5C542] hover:bg-[#E5B432] text-[#0C172E] font-extrabold text-xs transition shadow-lg">Build 7–9 Meal Plan (10% OFF)</a>
          </div>

          <div class="builder-element bg-[#101D3A] text-white p-6 rounded-3xl border border-slate-700 flex flex-col justify-between" data-element-id="el_plan_card3">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/10 rounded-md">Athlete &amp; Couples</span>
              <h3 class="font-heading text-xl font-black mt-3">10+ Meals Package</h3>
              <p class="text-xs text-slate-300 mt-1">Maximum convenience for heavy training.</p>
              <div class="text-2xl font-black text-emerald-400 my-4">10% OFF <span class="text-xs text-slate-400 font-normal">+ Best value per meal</span></div>
              <ul class="text-xs text-slate-300 space-y-2 mb-6">
                <li>✓ 10+ Complete Custom Meals</li>
                <li>✓ 20+ Included Custom Sides</li>
                <li>✓ 10% Flat Volume Discount</li>
                <li>✓ Split Sunday &amp; Wednesday delivery</li>
              </ul>
            </div>
            <a href="menu.html" class="w-full py-3 text-center rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition">Customize 10+ Meals (10% OFF)</a>
          </div>

        </div>
      </section>

      <!-- Catering Callout Banner -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white text-center" data-section-id="sec_catering">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_catering', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">↑</button>
          <button onclick="moveSection('sec_catering', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">↓</button>
          <button onclick="duplicateSection('sec_catering')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300">❐</button>
          <button onclick="deleteSection('sec_catering')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400">🗑</button>
        </div>
        <div class="max-w-3xl mx-auto">
          <span class="builder-element text-xs font-black text-[#F5C542] uppercase tracking-widest" data-element-id="el_cat_sub" contenteditable="true">GYMS • CORPORATE • WEDDINGS</span>
          <h2 class="builder-element font-heading text-3xl sm:text-5xl font-extrabold text-[#101D3A] mt-2 mb-4" data-element-id="el_cat_title" contenteditable="true">PLANNING SOMETHING BIGGER?</h2>
          <p class="builder-element text-slate-600 text-sm sm:text-base mb-8 max-w-xl mx-auto" data-element-id="el_cat_desc" contenteditable="true">
            We cater high-protein Greek buffet stations, gym challenge meal packages, and corporate team wellness luncheons. Custom allergy accommodations available.
          </p>
          <div class="builder-element flex flex-wrap justify-center gap-4" data-element-id="el_cat_btns">
            <a href="mailto:orders@greekfitkitchen.ca" class="px-6 py-3.5 rounded-xl bg-[#F5C542] hover:bg-[#E5B432] text-[#0C172E] font-black text-xs shadow-lg transition">Catering &amp; Event Enquiry</a>
            <a href="mailto:orders@greekfitkitchen.ca?subject=Dietary%20Request" class="px-6 py-3.5 rounded-xl bg-[#101D3A] text-white font-bold text-xs hover:bg-[#0C172E] transition">Special Dietary Request</a>
          </div>
        </div>
      </section>
    `,

    menu: `
      <!-- Meal Plan Hero -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_menu_hero">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="deleteSection('sec_menu_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400">🗑</button>
        </div>
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" data-element-id="el_m_tag" contenteditable="true">CHEF PREPARED • TWICE WEEKLY</span>
        <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-4" data-element-id="el_m_title" contenteditable="true">Our 21 Chef Dishes</h1>
        <p class="builder-element text-slate-300 max-w-xl mx-auto text-sm" data-element-id="el_m_sub" contenteditable="true">Every entree includes your choice of 2 fresh sides. 6-meal minimum order to ensure peak batch freshness.</p>
      </section>

      <!-- Dishes Showcase Grid -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_menu_items">
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition" data-element-id="el_dish_1">
            <img src="images/meals/grilled-chicken.jpg" alt="Grilled Chicken" class="w-full h-48 object-cover" />
            <div class="p-5">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-heading font-extrabold text-base text-[#101D3A]">Grilled Chicken</h3>
                <span class="font-black text-sm text-[#101D3A]">$12.99 CAD</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">Flame-grilled herb-crusted chicken breast. Comes with 2 included sides.</p>
              <a href="menu.html" class="block w-full py-2 text-center rounded-xl bg-[#F5C542] text-[#0C172E] font-bold text-xs">Select &amp; Customize</a>
            </div>
          </div>

          <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition" data-element-id="el_dish_2">
            <img src="images/meals/lemon-herb-salmon.jpg" alt="Lemon Salmon" class="w-full h-48 object-cover" />
            <div class="p-5">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-heading font-extrabold text-base text-[#101D3A]">Lemon Herb Salmon</h3>
                <span class="font-black text-sm text-[#101D3A]">$16.99 CAD</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">Atlantic salmon fillet with fresh dill and lemon emulsion. 2 included sides.</p>
              <a href="menu.html" class="block w-full py-2 text-center rounded-xl bg-[#F5C542] text-[#0C172E] font-bold text-xs">Select &amp; Customize</a>
            </div>
          </div>

          <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition" data-element-id="el_dish_3">
            <img src="images/meals/steak-souvlaki.jpg" alt="Steak Souvlaki" class="w-full h-48 object-cover" />
            <div class="p-5">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-heading font-extrabold text-base text-[#101D3A]">Steak Souvlaki</h3>
                <span class="font-black text-sm text-[#101D3A]">$15.99 CAD</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">Tender marinated beef tenderloin skewers flame-seared. 2 included sides.</p>
              <a href="menu.html" class="block w-full py-2 text-center rounded-xl bg-[#F5C542] text-[#0C172E] font-bold text-xs">Select &amp; Customize</a>
            </div>
          </div>
        </div>
      </section>
    `,

    about: `
      <section class="builder-section py-20 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_about_hero">
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" data-element-id="el_ab_tag" contenteditable="true">OUR STORY</span>
        <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-4" data-element-id="el_ab_title" contenteditable="true">About Greek Fit Kitchen</h1>
        <p class="builder-element text-slate-300 max-w-xl mx-auto text-sm" data-element-id="el_ab_sub" contenteditable="true">Founded by George the Greek to bridge authentic Greek island culinary traditions with modern athletic sports nutrition.</p>
      </section>
      <section class="builder-section py-16 px-6 sm:px-12 bg-white" data-section-id="sec_about_body">
        <div class="max-w-4xl mx-auto space-y-6 text-slate-700 leading-relaxed">
          <p class="builder-element text-base" data-element-id="el_ab_p1" contenteditable="true">We believe food is medicine, fuel, and culture. We reject frozen processed convenience meals and artificial flavor powders in favor of cold-pressed Greek extra virgin olive oil, mountain herbs, and premium lean meats.</p>
          <p class="builder-element text-base" data-element-id="el_ab_p2" contenteditable="true">Our commercial batch prep kitchen is situated at 3575 Lake Shore Blvd W, Etobicoke, serving active professionals and fitness communities across Greater Toronto.</p>
        </div>
      </section>
    `,

    delivery: `
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_del_hero">
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" contenteditable="true">GTA COURIER POLICY</span>
        <h1 class="builder-element font-heading text-4xl font-black mt-2 mb-3" contenteditable="true">Batch Delivery Rates</h1>
        <p class="builder-element text-slate-300 text-sm max-w-lg mx-auto" contenteditable="true">Sunday and Wednesday delivery drops dispatched in insulated refrigerated packaging.</p>
      </section>
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_del_rates">
        <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-heading font-extrabold text-lg text-[#101D3A]">Within 2 KM</h3>
            <p class="text-2xl font-black text-emerald-600 my-2">FREE</p>
            <p class="text-xs text-gray-500">Complimentary neighborhood delivery</p>
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-heading font-extrabold text-lg text-[#101D3A]">2 to 5 KM</h3>
            <p class="text-2xl font-black text-[#101D3A] my-2">$5.00 CAD</p>
            <p class="text-xs text-gray-500">Flat local delivery rate</p>
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-heading font-extrabold text-lg text-[#101D3A]">Over 5 KM</h3>
            <p class="text-2xl font-black text-[#101D3A] my-2">$1.00 / km</p>
            <p class="text-xs text-gray-500">Calculated via Google Maps</p>
          </div>
        </div>
      </section>
    `,

    howitworks: `
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_how_hero">
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" contenteditable="true">SIMPLE 3-STEP PROCESS</span>
        <h1 class="builder-element font-heading text-4xl font-black mt-2 mb-3" contenteditable="true">How Greek Fit Works</h1>
      </section>
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_how_steps">
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-2xl bg-slate-50">
            <div class="w-12 h-12 rounded-full bg-[#F5C542] text-[#0C172E] font-black text-xl flex items-center justify-center mx-auto mb-4">1</div>
            <h3 class="font-heading font-bold text-lg text-[#101D3A] mb-2">Build Your Plan</h3>
            <p class="text-xs text-gray-600">Select 6 or more meals. Pick your 2 complimentary sides per dish.</p>
          </div>
          <div class="text-center p-6 rounded-2xl bg-slate-50">
            <div class="w-12 h-12 rounded-full bg-[#F5C542] text-[#0C172E] font-black text-xl flex items-center justify-center mx-auto mb-4">2</div>
            <h3 class="font-heading font-bold text-lg text-[#101D3A] mb-2">Chef Batch Cook</h3>
            <p class="text-xs text-gray-600">We cook fresh Sunday &amp; Wednesday using Greek olive oil and clean ingredients.</p>
          </div>
          <div class="text-center p-6 rounded-2xl bg-slate-50">
            <div class="w-12 h-12 rounded-full bg-[#F5C542] text-[#0C172E] font-black text-xl flex items-center justify-center mx-auto mb-4">3</div>
            <h3 class="font-heading font-bold text-lg text-[#101D3A] mb-2">GTA Drop or Pickup</h3>
            <p class="text-xs text-gray-600">Delivered chilled in insulated coolers to your door or free Etobicoke kitchen pickup.</p>
          </div>
        </div>
      </section>
    `,

    blog: `
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_b_hero">
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" contenteditable="true">NUTRITION &amp; FITNESS</span>
        <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-3" contenteditable="true">The Mediterranean Fuel Journal</h1>
        <p class="builder-element text-slate-300 text-sm max-w-xl mx-auto" contenteditable="true">Manage articles in the Blog Posts CMS modal or edit this showcase section directly.</p>
      </section>
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_b_cards">
        <div class="max-w-5xl mx-auto flex justify-between items-center mb-8">
          <h2 class="font-heading font-extrabold text-2xl text-[#101D3A]">Featured Articles</h2>
          <button onclick="openBlogManagerModal()" class="px-4 py-2 bg-[#F5C542] text-[#0C172E] font-bold text-xs rounded-xl shadow">Manage All Posts (CMS)</button>
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" id="builderBlogCardsContainer">
          <!-- Populated from blog posts -->
        </div>
      </section>
    `
  };

  // --- Global State ---
  let activePageKey = 'home';
  let activeElement = null;
  let activeSection = null;
  let blogEditorTargetPostId = null;
  let mediaSelectCallback = null;

  // --- Auth & Session ---
  window.checkBuilderAuth = function () {
    const isAuth = sessionStorage.getItem('gfk_builder_logged_in') === 'true';
    const overlay = document.getElementById('builderLoginOverlay');
    if (overlay) {
      if (isAuth) {
        overlay.classList.add('hidden');
      } else {
        overlay.classList.remove('hidden');
      }
    }
  };

  window.handleBuilderLogin = function (e) {
    if (e) e.preventDefault();
    const user = (document.getElementById('loginUsername').value || '').trim();
    const pass = (document.getElementById('loginPassword').value || '').trim();
    const err = document.getElementById('loginErrorMsg');

    if (
      (user.toLowerCase() === 'admin' || user.toLowerCase() === 'george') &&
      (pass === 'admin123' || pass === '1234')
    ) {
      if (err) err.classList.add('hidden');
      sessionStorage.setItem('gfk_builder_logged_in', 'true');
      const overlay = document.getElementById('builderLoginOverlay');
      if (overlay) overlay.classList.add('hidden');
      showToast('Welcome, Administrator! Visual Builder ready.');
    } else {
      if (err) err.classList.remove('hidden');
    }
  };

  window.handleBuilderLogout = function () {
    sessionStorage.removeItem('gfk_builder_logged_in');
    const overlay = document.getElementById('builderLoginOverlay');
    if (overlay) overlay.classList.remove('hidden');
    showToast('Logged out of Elementor Studio.');
  };

  // --- Toast ---
  window.showToast = function (msg) {
    const toast = document.getElementById('builderToast');
    const toastMsg = document.getElementById('builderToastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  };

  // --- Page Management & Switching ---
  window.switchActivePage = function (pageKey) {
    activePageKey = pageKey;
    const selector = document.getElementById('pageSelector');
    if (selector) selector.value = pageKey;

    // Update metadata fields
    const metaTitle = document.getElementById('pageMetaTitle');
    const metaSlug = document.getElementById('pageMetaSlug');
    if (metaSlug) metaSlug.value = pageKey.endsWith('.html') ? pageKey : `${pageKey}.html`;
    if (metaTitle) metaTitle.value = `Greek Fit Kitchen | ${pageKey.toUpperCase()} Page`;

    loadAndRenderPage(pageKey);
    showToast(`Switched editor to: ${pageKey}`);
  };

  function loadAndRenderPage(pageKey) {
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    // Check localStorage first
    const saved = localStorage.getItem(`gfk_builder_page_${pageKey}`);
    if (saved) {
      container.innerHTML = saved;
    } else if (DEFAULT_PAGE_TEMPLATES[pageKey]) {
      container.innerHTML = DEFAULT_PAGE_TEMPLATES[pageKey];
    } else {
      // Custom blank page template
      container.innerHTML = `
        <section class="builder-section py-20 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_custom_hero">
          <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
            <button onclick="deleteSection('sec_custom_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400">🗑</button>
          </div>
          <span class="builder-element text-xs font-black text-[#F5C542] uppercase tracking-widest" contenteditable="true">CUSTOM PAGE</span>
          <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-4" contenteditable="true">${pageKey.toUpperCase()}</h1>
          <p class="builder-element text-slate-300 max-w-xl mx-auto text-sm" contenteditable="true">Click any element to edit text or open the left sidebar to add Elementor widgets.</p>
        </section>
        <section class="builder-section py-16 px-6 bg-white text-center" data-section-id="sec_custom_content">
          <p class="builder-element text-gray-500" contenteditable="true">Start typing your page content here...</p>
        </div>
      `;
    }

    // If blog page, ensure blog cards are populated
    if (pageKey === 'blog') {
      renderBlogCardsOnCanvas();
    }

    attachCanvasEventListeners();
  }

  function renderBlogCardsOnCanvas() {
    const blogContainer = document.getElementById('builderBlogCardsContainer');
    if (!blogContainer) return;
    const posts = getStoredBlogPosts().slice(0, 4);
    blogContainer.innerHTML = posts.map(post => `
      <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col" data-element-id="el_post_${post.id}">
        <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold text-[#F5C542] uppercase tracking-wider">${post.category}</span>
            <h3 class="font-heading font-extrabold text-lg text-[#101D3A] mt-1">${post.title}</h3>
            <p class="text-xs text-gray-500 mt-2 line-clamp-2">${post.excerpt}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>${post.date}</span>
            <span class="font-bold text-[#101D3A]">Read More →</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- Canvas Interaction: Element Selection & Inspector ---
  function attachCanvasEventListeners() {
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    // Attach click listener for all builder elements
    container.querySelectorAll('.builder-element').forEach(el => {
      // Ensure contenteditable is true for text nodes if not set
      if (!el.getAttribute('contenteditable') && !el.querySelector('img') && !el.querySelector('input')) {
        el.setAttribute('contenteditable', 'true');
      }

      el.onclick = function (e) {
        e.stopPropagation();
        selectElement(this);
      };
    });

    // Attach click listener for sections
    container.querySelectorAll('.builder-section').forEach(sec => {
      sec.onclick = function (e) {
        if (e.target === this) {
          selectSection(this);
        }
      };
    });
  }

  window.selectElement = function (el) {
    // Clear previously active
    document.querySelectorAll('.active-element').forEach(item => item.classList.remove('active-element'));
    activeElement = el;
    el.classList.add('active-element');

    // Switch sidebar tab to editor inspector
    switchSidebarTab('editor');

    const notice = document.getElementById('noElementSelectedNotice');
    const form = document.getElementById('elementInspectorForm');
    if (notice) notice.classList.add('hidden');
    if (form) form.classList.remove('hidden');

    // Populate inspector
    const tagName = el.tagName.toLowerCase();
    const tagBadge = document.getElementById('inspectorElementTag');
    const nameLabel = document.getElementById('inspectorElementName');
    if (tagBadge) tagBadge.innerText = tagName;
    if (nameLabel) nameLabel.innerText = el.getAttribute('data-element-id') || tagName;

    // Content text
    const textWrapper = document.getElementById('inspectorTextControlWrapper');
    const textInput = document.getElementById('inspectorTextInput');
    if (textWrapper && textInput) {
      if (tagName === 'img') {
        textWrapper.classList.add('hidden');
      } else {
        textWrapper.classList.remove('hidden');
        textInput.value = el.innerText || el.innerHTML;
      }
    }

    // Image URL
    const imgWrapper = document.getElementById('inspectorImageControlWrapper');
    const imgInput = document.getElementById('inspectorImageInput');
    const innerImg = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (imgWrapper && imgInput) {
      if (innerImg) {
        imgWrapper.classList.remove('hidden');
        imgInput.value = innerImg.getAttribute('src') || '';
      } else {
        imgWrapper.classList.add('hidden');
      }
    }

    // Link URL
    const linkWrapper = document.getElementById('inspectorLinkControlWrapper');
    const linkInput = document.getElementById('inspectorLinkInput');
    const innerLink = el.tagName === 'A' ? el : el.querySelector('a');
    if (linkWrapper && linkInput) {
      if (innerLink) {
        linkWrapper.classList.remove('hidden');
        linkInput.value = innerLink.getAttribute('href') || '';
      } else {
        linkWrapper.classList.add('hidden');
      }
    }

    // Color controls
    const colorText = document.getElementById('inspectorColorText');
    const colorPicker = document.getElementById('inspectorColorPicker');
    if (colorText && colorPicker) {
      const compColor = window.getComputedStyle(el).color;
      colorText.value = compColor;
    }
  };

  window.selectSection = function (sec) {
    document.querySelectorAll('.active-section').forEach(s => s.classList.remove('active-section'));
    activeSection = sec;
    sec.classList.add('active-section');
  };

  // --- Inspector Update Operations ---
  window.updateActiveElementContent = function (val) {
    if (!activeElement) return;
    activeElement.innerText = val;
  };

  window.updateActiveElementImage = function (val) {
    if (!activeElement) return;
    const img = activeElement.tagName === 'IMG' ? activeElement : activeElement.querySelector('img');
    if (img) {
      img.src = val;
    }
  };

  window.updateActiveElementLink = function (val) {
    if (!activeElement) return;
    const link = activeElement.tagName === 'A' ? activeElement : activeElement.querySelector('a');
    if (link) {
      link.href = val;
    }
  };

  window.updateActiveElementStyle = function (prop, val) {
    if (!activeElement) return;
    activeElement.style[prop] = val;
  };

  window.duplicateActiveElement = function () {
    if (!activeElement) return;
    const clone = activeElement.cloneNode(true);
    clone.classList.remove('active-element');
    clone.setAttribute('data-element-id', 'el_' + Date.now());
    activeElement.parentNode.insertBefore(clone, activeElement.nextSibling);
    attachCanvasEventListeners();
    selectElement(clone);
    showToast('Element duplicated!');
  };

  window.deleteActiveElement = function () {
    if (!activeElement) return;
    const parent = activeElement.parentNode;
    activeElement.remove();
    activeElement = null;
    document.getElementById('noElementSelectedNotice').classList.remove('hidden');
    document.getElementById('elementInspectorForm').classList.add('hidden');
    showToast('Element removed.');
  };

  // --- Section Operations ---
  window.openSectionStructureModal = function () {
    const modal = document.getElementById('sectionStructureModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeSectionStructureModal = function () {
    const modal = document.getElementById('sectionStructureModal');
    if (modal) modal.classList.add('hidden');
  };

  window.confirmAddSection = function (structure) {
    closeSectionStructureModal();
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    const secId = 'sec_' + Date.now();
    let innerColumns = '';

    if (structure === '1col') {
      innerColumns = `
        <div class="max-w-4xl mx-auto py-12 px-6">
          <div class="builder-element text-center p-8 border-2 border-dashed border-gray-300 rounded-2xl" data-element-id="el_${Date.now()}" contenteditable="true">
            <h3 class="font-heading font-extrabold text-2xl text-[#101D3A] mb-2">New 1-Column Section</h3>
            <p class="text-gray-600 text-sm">Click here to write text or add widgets from the left panel.</p>
          </div>
        </div>
      `;
    } else if (structure === '2col') {
      innerColumns = `
        <div class="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="builder-element p-8 border-2 border-dashed border-gray-300 rounded-2xl" data-element-id="el_${Date.now()}_1" contenteditable="true">
            <h3 class="font-heading font-extrabold text-xl text-[#101D3A] mb-2">Column 1</h3>
            <p class="text-gray-600 text-sm">Enter column 1 details here...</p>
          </div>
          <div class="builder-element p-8 border-2 border-dashed border-gray-300 rounded-2xl" data-element-id="el_${Date.now()}_2" contenteditable="true">
            <h3 class="font-heading font-extrabold text-xl text-[#101D3A] mb-2">Column 2</h3>
            <p class="text-gray-600 text-sm">Enter column 2 details here...</p>
          </div>
        </div>
      `;
    } else if (structure === '3col') {
      innerColumns = `
        <div class="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="builder-element p-6 border-2 border-dashed border-gray-300 rounded-2xl" data-element-id="el_${Date.now()}_1" contenteditable="true">
            <h3 class="font-heading font-extrabold text-base text-[#101D3A] mb-2">Feature 1</h3>
            <p class="text-gray-600 text-xs">Description text...</p>
          </div>
          <div class="builder-element p-6 border-2 border-dashed border-gray-300 rounded-2xl" data-element-id="el_${Date.now()}_2" contenteditable="true">
            <h3 class="font-heading font-extrabold text-base text-[#101D3A] mb-2">Feature 2</h3>
            <p class="text-gray-600 text-xs">Description text...</p>
          </div>
          <div class="builder-element p-6 border-2 border-dashed border-gray-300 rounded-2xl" data-element-id="el_${Date.now()}_3" contenteditable="true">
            <h3 class="font-heading font-extrabold text-base text-[#101D3A] mb-2">Feature 3</h3>
            <p class="text-gray-600 text-xs">Description text...</p>
          </div>
        </div>
      `;
    }

    const secHtml = `
      <section class="builder-section py-8 px-4 bg-white border-b border-gray-100" data-section-id="${secId}">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('${secId}', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('${secId}', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('${secId}')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('${secId}')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        ${innerColumns}
      </section>
    `;

    container.insertAdjacentHTML('beforeend', secHtml);
    attachCanvasEventListeners();
    showToast('New section added to page!');
  };

  window.moveSection = function (secId, dir) {
    const sec = document.querySelector(`[data-section-id="${secId}"]`);
    if (!sec) return;
    if (dir === -1 && sec.previousElementSibling) {
      sec.parentNode.insertBefore(sec, sec.previousElementSibling);
    } else if (dir === 1 && sec.nextElementSibling) {
      sec.parentNode.insertBefore(sec.nextElementSibling, sec);
    }
    showToast('Section reordered.');
  };

  window.duplicateSection = function (secId) {
    const sec = document.querySelector(`[data-section-id="${secId}"]`);
    if (!sec) return;
    const clone = sec.cloneNode(true);
    const newId = 'sec_' + Date.now();
    clone.setAttribute('data-section-id', newId);
    // update buttons in clone
    clone.querySelectorAll('.section-actions button').forEach(btn => {
      const onclickAttr = btn.getAttribute('onclick');
      if (onclickAttr) {
        btn.setAttribute('onclick', onclickAttr.replace(secId, newId));
      }
    });
    sec.parentNode.insertBefore(clone, sec.nextSibling);
    attachCanvasEventListeners();
    showToast('Section duplicated!');
  };

  window.deleteSection = function (secId) {
    if (!confirm('Are you sure you want to remove this section?')) return;
    const sec = document.querySelector(`[data-section-id="${secId}"]`);
    if (sec) {
      sec.remove();
      showToast('Section deleted.');
    }
  };

  // --- Widget Insertion ---
  window.insertWidget = function (widgetType) {
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    let targetContainer = activeElement ? activeElement.parentNode : null;
    if (!targetContainer || targetContainer === container) {
      const lastSection = container.querySelector('.builder-section:last-child');
      if (lastSection) {
        targetContainer = lastSection.querySelector('div') || lastSection;
      } else {
        window.confirmAddSection('1col');
        targetContainer = container.querySelector('.builder-section:last-child div');
      }
    }

    const elId = 'el_' + Date.now();
    let widgetHtml = '';

    switch (widgetType) {
      case 'heading':
        widgetHtml = `<h2 class="builder-element font-heading text-3xl font-extrabold text-[#101D3A] my-4" data-element-id="${elId}" contenteditable="true">Heading Title Text</h2>`;
        break;
      case 'text':
        widgetHtml = `<p class="builder-element text-base text-gray-700 leading-relaxed my-3" data-element-id="${elId}" contenteditable="true">Type your custom paragraph text or culinary story here...</p>`;
        break;
      case 'image':
        widgetHtml = `
          <div class="builder-element my-4 text-center" data-element-id="${elId}">
            <img src="images/brand/fresh-ingredients-showcase.png" alt="Showcase Photo" class="rounded-2xl max-w-full h-auto mx-auto shadow-md" />
          </div>
        `;
        break;
      case 'button':
        widgetHtml = `
          <div class="builder-element my-4 inline-block" data-element-id="${elId}">
            <a href="menu.html" class="px-6 py-3 rounded-xl bg-[#F5C542] hover:bg-[#E5B432] text-[#0C172E] font-extrabold text-xs shadow-md transition inline-block">
              Click Here
            </a>
          </div>
        `;
        break;
      case 'divider':
        widgetHtml = `<div class="builder-element my-6" data-element-id="${elId}"><hr class="border-t-2 border-gray-200" /></div>`;
        break;
      case 'spacer':
        widgetHtml = `<div class="builder-element h-12 w-full" data-element-id="${elId}"></div>`;
        break;
      case 'mealCard':
        widgetHtml = `
          <div class="builder-element bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-5 my-4" data-element-id="${elId}">
            <img src="images/meals/grilled-chicken.jpg" alt="Dish" class="w-32 h-32 rounded-xl object-cover" />
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <h4 class="font-heading font-black text-lg text-[#101D3A]">Custom Meal Dish</h4>
                <span class="text-sm font-black text-[#101D3A]">$13.99 CAD</span>
              </div>
              <p class="text-xs text-gray-500 mb-3">Freshly prepped with Mediterranean wild herbs and 2 included clean sides.</p>
              <a href="menu.html" class="px-4 py-2 bg-[#F5C542] text-[#0C172E] font-bold text-xs rounded-xl inline-block">Order Now</a>
            </div>
          </div>
        `;
        break;
      case 'pricingTier':
        widgetHtml = `
          <div class="builder-element bg-[#101D3A] text-white p-6 rounded-3xl border-2 border-[#F5C542] my-4 shadow-xl max-w-md mx-auto" data-element-id="${elId}">
            <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-[#F5C542] text-[#0C172E] rounded-full">Package Deal</span>
            <h3 class="font-heading text-xl font-black mt-3">Weekly Fit Plan</h3>
            <p class="text-xs text-slate-300 mt-1">Lunches and dinners tailored for athletic training.</p>
            <div class="text-3xl font-black text-[#F5C542] my-4">10% OFF</div>
            <a href="menu.html" class="block w-full py-3 text-center rounded-xl bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Get Started</a>
          </div>
        `;
        break;
      case 'cateringBanner':
        widgetHtml = `
          <div class="builder-element bg-[#101D3A] text-white p-8 rounded-3xl text-center my-6 shadow-xl" data-element-id="${elId}">
            <h3 class="font-heading text-2xl font-black text-[#F5C542] mb-2">Greek Catering Services</h3>
            <p class="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-4">We cater fitness gym challenges, corporate luncheons, and family gatherings.</p>
            <a href="mailto:orders@greekfitkitchen.ca" class="px-6 py-2.5 bg-[#F5C542] text-[#0C172E] font-extrabold text-xs rounded-xl inline-block">Contact George</a>
          </div>
        `;
        break;
      case 'reviewCard':
        widgetHtml = `
          <div class="builder-element p-6 rounded-2xl bg-slate-50 border border-slate-200 my-4 text-left" data-element-id="${elId}">
            <div class="text-[#F5C542] text-sm mb-2">★★★★★</div>
            <p class="text-xs text-slate-700 italic mb-3">"The food is incredible. Greek Fit Kitchen keeps me lean and energized throughout my high-intensity training cycles in Toronto."</p>
            <span class="text-xs font-bold text-[#101D3A] block">— Marcus T., Downtown Toronto</span>
          </div>
        `;
        break;
      default:
        widgetHtml = `<div class="builder-element p-4 border border-gray-200 rounded-xl my-2" data-element-id="${elId}" contenteditable="true">New Widget</div>`;
    }

    if (activeElement && activeElement.parentNode) {
      activeElement.insertAdjacentHTML('afterend', widgetHtml);
    } else if (targetContainer) {
      targetContainer.insertAdjacentHTML('beforeend', widgetHtml);
    }

    attachCanvasEventListeners();
    showToast(`Added ${widgetType} widget.`);
  };

  // --- Sidebar Tabs & Responsive Controls ---
  window.switchSidebarTab = function (tab) {
    ['widgets', 'editor', 'pageSettings'].forEach(t => {
      const btn = document.getElementById(`tabBtn-${t}`);
      const content = document.getElementById(`sidebarTab-${t}`);
      if (btn && content) {
        if (t === tab) {
          btn.className = 'flex-1 py-3 border-b-2 border-greek-gold text-white flex items-center justify-center gap-1.5 font-bold';
          content.classList.remove('hidden');
        } else {
          btn.className = 'flex-1 py-3 border-b-2 border-transparent text-gray-400 hover:text-white flex items-center justify-center gap-1.5 font-medium';
          content.classList.add('hidden');
        }
      }
    });
  };

  window.toggleElementorSidebar = function () {
    const sidebar = document.getElementById('elementorSidebar');
    if (sidebar) {
      sidebar.classList.toggle('w-80');
      sidebar.classList.toggle('w-0');
      sidebar.classList.toggle('overflow-hidden');
    }
  };

  window.setResponsiveMode = function (mode) {
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    ['desktop', 'tablet', 'mobile'].forEach(m => {
      const btn = document.getElementById(`respBtn-${m}`);
      if (btn) {
        if (m === mode) {
          btn.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-[#393d41] text-white transition flex items-center gap-1.5';
        } else {
          btn.className = 'px-3 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition flex items-center gap-1.5';
        }
      }
    });

    container.className = `bg-white text-slate-800 transition-all duration-300 min-h-full rounded-2xl shadow-2xl relative overflow-hidden viewport-${mode}`;
    showToast(`Previewing ${mode} layout`);
  };

  window.filterWidgets = function (query) {
    const q = (query || '').toLowerCase().trim();
    document.querySelectorAll('.widget-card').forEach(card => {
      const text = card.innerText.toLowerCase();
      if (!q || text.includes(q)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  window.changePageBackground = function (color) {
    const container = document.getElementById('livePageContainer');
    if (container) {
      container.style.backgroundColor = color;
      showToast(`Page background updated to ${color}`);
    }
  };

  window.resetCurrentPageToDefaults = function () {
    if (!confirm('Are you sure you want to reset this page to factory defaults? Any unsaved edits will be reverted.')) return;
    localStorage.removeItem(`gfk_builder_page_${activePageKey}`);
    loadAndRenderPage(activePageKey);
    showToast('Page reset to original template.');
  };

  // --- Media Library ---
  window.openMediaLibraryModal = function (cb) {
    mediaSelectCallback = cb || null;
    const modal = document.getElementById('mediaLibraryModal');
    const grid = document.getElementById('mediaLibraryGrid');
    if (!modal || !grid) return;

    grid.innerHTML = DEFAULT_MEAL_IMAGES.map(item => `
      <div onclick="selectMediaItem('${item.url}')" class="group relative rounded-2xl overflow-hidden border border-[#393d41] bg-[#1e2124] hover:border-greek-gold cursor-pointer transition">
        <img src="${item.url}" alt="${item.title}" class="w-full h-32 object-cover group-hover:scale-105 transition duration-300" />
        <div class="p-2 text-center text-xs font-semibold text-gray-300 truncate">${item.title}</div>
      </div>
    `).join('');

    modal.classList.remove('hidden');
  };

  window.closeMediaLibraryModal = function () {
    const modal = document.getElementById('mediaLibraryModal');
    if (modal) modal.classList.add('hidden');
  };

  window.selectMediaItem = function (url) {
    if (mediaSelectCallback) {
      mediaSelectCallback(url);
    } else if (activeElement) {
      const img = activeElement.tagName === 'IMG' ? activeElement : activeElement.querySelector('img');
      if (img) img.src = url;
      const input = document.getElementById('inspectorImageInput');
      if (input) input.value = url;
    }
    closeMediaLibraryModal();
    showToast('Image selected!');
  };

  window.handleCustomImageUpload = function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataUrl = event.target.result;
      DEFAULT_MEAL_IMAGES.unshift({ title: file.name, url: dataUrl });
      window.openMediaLibraryModal(mediaSelectCallback);
      showToast('Custom image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  // --- Blog Posts CMS ---
  function getStoredBlogPosts() {
    const raw = localStorage.getItem('gfk_builder_blog_posts');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (err) {
        console.error('Error parsing stored blog posts', err);
      }
    }
    localStorage.setItem('gfk_builder_blog_posts', JSON.stringify(DEFAULT_BLOG_POSTS));
    return DEFAULT_BLOG_POSTS;
  }

  function saveStoredBlogPosts(posts) {
    localStorage.setItem('gfk_builder_blog_posts', JSON.stringify(posts));
  }

  window.openBlogManagerModal = function () {
    const modal = document.getElementById('blogManagerModal');
    if (modal) {
      renderBlogManagerPostsList();
      cancelBlogEdit();
      modal.classList.remove('hidden');
    }
  };

  window.closeBlogManagerModal = function () {
    const modal = document.getElementById('blogManagerModal');
    if (modal) modal.classList.add('hidden');
  };

  window.renderBlogManagerPostsList = function () {
    const posts = getStoredBlogPosts();
    const list = document.getElementById('blogManagerPostsList');
    const countBadge = document.getElementById('blogPostsCount');
    if (countBadge) countBadge.innerText = posts.length;
    if (!list) return;

    list.innerHTML = posts.map(post => `
      <div class="p-4 rounded-2xl bg-[#1e2124] border border-[#393d41] flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <img src="${post.image}" alt="${post.title}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" onerror="this.src='images/meals/grilled-chicken.jpg'" />
          <div class="truncate">
            <span class="text-[10px] font-extrabold text-greek-gold uppercase tracking-wider">${post.category}</span>
            <h4 class="font-bold text-sm text-white truncate">${post.title}</h4>
            <div class="text-[11px] text-gray-400 mt-0.5">By ${post.author || 'Team'} • ${post.date}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="editBlogPost('${post.id}')" class="px-3 py-1.5 rounded-lg bg-greek-navy text-greek-gold text-xs font-bold border border-greek-gold/40 hover:bg-greek-navyDark transition">
            Edit
          </button>
          <button onclick="deleteBlogPost('${post.id}')" class="p-1.5 rounded-lg text-red-400 hover:bg-red-900/30 transition" title="Delete">
            🗑
          </button>
        </div>
      </div>
    `).join('');
  };

  window.openNewPostEditor = function () {
    blogEditorTargetPostId = null;
    document.getElementById('blogFormTitle').innerText = 'Write New Article';
    document.getElementById('editPostId').value = '';
    document.getElementById('postTitleInput').value = '';
    document.getElementById('postCategoryInput').value = 'Nutrition';
    document.getElementById('postAuthorInput').value = 'George the Greek';
    document.getElementById('postImageInput').value = 'images/meals/grilled-chicken.jpg';
    document.getElementById('postExcerptInput').value = '';
    document.getElementById('postContentInput').value = '';
    document.getElementById('blogEditFormContainer').classList.remove('hidden');
  };

  window.editBlogPost = function (id) {
    const posts = getStoredBlogPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    blogEditorTargetPostId = id;
    document.getElementById('blogFormTitle').innerText = 'Edit Article';
    document.getElementById('editPostId').value = post.id;
    document.getElementById('postTitleInput').value = post.title;
    document.getElementById('postCategoryInput').value = post.category || 'Nutrition';
    document.getElementById('postAuthorInput').value = post.author || 'George the Greek';
    document.getElementById('postImageInput').value = post.image || '';
    document.getElementById('postExcerptInput').value = post.excerpt || '';
    document.getElementById('postContentInput').value = post.content || '';
    document.getElementById('blogEditFormContainer').classList.remove('hidden');
  };

  window.cancelBlogEdit = function () {
    const form = document.getElementById('blogEditFormContainer');
    if (form) form.classList.add('hidden');
    blogEditorTargetPostId = null;
  };

  window.openMediaLibraryForBlog = function () {
    openMediaLibraryModal(function (url) {
      const input = document.getElementById('postImageInput');
      if (input) input.value = url;
    });
  };

  window.saveBlogPost = function () {
    const title = (document.getElementById('postTitleInput').value || '').trim();
    if (!title) {
      alert('Please enter an article title.');
      return;
    }

    const posts = getStoredBlogPosts();
    const category = document.getElementById('postCategoryInput').value;
    const author = document.getElementById('postAuthorInput').value || 'George the Greek';
    const image = document.getElementById('postImageInput').value || 'images/meals/grilled-chicken.jpg';
    const excerpt = document.getElementById('postExcerptInput').value || '';
    const content = document.getElementById('postContentInput').value || `<p>${excerpt}</p>`;

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (blogEditorTargetPostId) {
      // Update existing
      const idx = posts.findIndex(p => p.id === blogEditorTargetPostId);
      if (idx !== -1) {
        posts[idx] = {
          ...posts[idx],
          title,
          category,
          author,
          image,
          excerpt,
          content
        };
      }
    } else {
      // Add new
      const newPost = {
        id: 'post_' + Date.now(),
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        author,
        date: dateFormatted,
        readTime: '4 min read',
        image,
        excerpt,
        content
      };
      posts.unshift(newPost);
    }

    saveStoredBlogPosts(posts);
    renderBlogManagerPostsList();
    cancelBlogEdit();
    if (activePageKey === 'blog') {
      renderBlogCardsOnCanvas();
    }
    showToast('Blog article saved and published to live website!');
  };

  window.deleteBlogPost = function (id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    let posts = getStoredBlogPosts();
    posts = posts.filter(p => p.id !== id);
    saveStoredBlogPosts(posts);
    renderBlogManagerPostsList();
    if (activePageKey === 'blog') {
      renderBlogCardsOnCanvas();
    }
    showToast('Article deleted.');
  };

  // --- Pages Manager ---
  function getCustomPages() {
    const raw = localStorage.getItem('gfk_builder_custom_pages');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return [];
  }

  window.openPagesManagerModal = function () {
    const modal = document.getElementById('pagesManagerModal');
    if (!modal) return;
    renderPagesList();
    modal.classList.remove('hidden');
  };

  window.closePagesManagerModal = function () {
    const modal = document.getElementById('pagesManagerModal');
    if (modal) modal.classList.add('hidden');
  };

  window.renderPagesList = function () {
    const container = document.getElementById('pagesListContainer');
    if (!container) return;

    const defaultPages = [
      { name: 'Homepage', slug: 'home', file: 'index.html' },
      { name: 'Meal Plan', slug: 'menu', file: 'menu.html' },
      { name: 'About Us', slug: 'about', file: 'about-us.html' },
      { name: 'Delivery Rates', slug: 'delivery', file: 'delivery-rates.html' },
      { name: 'How It Works', slug: 'howitworks', file: 'how-it-works.html' },
      { name: 'Blog Journal', slug: 'blog', file: 'blog.html' }
    ];

    const customPages = getCustomPages();

    container.innerHTML = `
      ${defaultPages.map(p => `
        <div class="p-3 rounded-xl bg-[#26292c] border border-[#393d41] flex items-center justify-between">
          <div>
            <div class="text-xs font-bold text-white">${p.name}</div>
            <div class="text-[10px] text-gray-400 font-mono">${p.file}</div>
          </div>
          <button onclick="switchActivePage('${p.slug}'); closePagesManagerModal();" class="px-2.5 py-1 bg-greek-navy text-greek-gold font-bold text-xs rounded-lg border border-greek-gold/40 hover:bg-greek-navyDark">
            Edit
          </button>
        </div>
      `).join('')}

      ${customPages.map(p => `
        <div class="p-3 rounded-xl bg-[#26292c] border border-greek-gold/30 flex items-center justify-between">
          <div>
            <div class="text-xs font-bold text-greek-gold">${p.name} (Custom)</div>
            <div class="text-[10px] text-gray-400 font-mono">${p.slug}.html</div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="switchActivePage('${p.slug}'); closePagesManagerModal();" class="px-2.5 py-1 bg-greek-gold text-greek-navyDark font-bold text-xs rounded-lg">
              Edit
            </button>
            <button onclick="deleteCustomPage('${p.slug}')" class="p-1 text-red-400 hover:bg-red-900/30 rounded" title="Delete">
              🗑
            </button>
          </div>
        </div>
      `).join('')}
    `;
  };

  window.createNewPage = function () {
    const titleInput = document.getElementById('newPageTitleInput');
    const slugInput = document.getElementById('newPageSlugInput');
    const name = (titleInput.value || '').trim();
    let slug = (slugInput.value || '').trim().toLowerCase().replace('.html', '').replace(/[^a-z0-9_-]/g, '-');

    if (!name || !slug) {
      alert('Please provide both page title and slug.');
      return;
    }

    const customPages = getCustomPages();
    if (customPages.some(p => p.slug === slug)) {
      alert('A page with this slug already exists.');
      return;
    }

    customPages.push({ name, slug });
    localStorage.setItem('gfk_builder_custom_pages', JSON.stringify(customPages));

    // Add option to dropdown
    const selector = document.getElementById('pageSelector');
    if (selector) {
      const opt = document.createElement('option');
      opt.value = slug;
      opt.innerText = `${name} (${slug}.html)`;
      selector.appendChild(opt);
    }

    titleInput.value = '';
    slugInput.value = '';
    closePagesManagerModal();
    switchActivePage(slug);
    showToast(`Page "${name}" created! Ready to customize.`);
  };

  window.deleteCustomPage = function (slug) {
    if (!confirm(`Are you sure you want to delete ${slug}.html?`)) return;
    let customPages = getCustomPages();
    customPages = customPages.filter(p => p.slug !== slug);
    localStorage.setItem('gfk_builder_custom_pages', JSON.stringify(customPages));
    localStorage.removeItem(`gfk_builder_page_${slug}`);

    // Remove from select
    const selector = document.getElementById('pageSelector');
    if (selector) {
      const opt = selector.querySelector(`option[value="${slug}"]`);
      if (opt) opt.remove();
    }

    renderPagesList();
    if (activePageKey === slug) {
      switchActivePage('home');
    }
    showToast('Page deleted.');
  };

  // --- Publish & Export ---
  window.saveAndPublishChanges = function () {
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    // Deselect any active element before saving
    document.querySelectorAll('.active-element').forEach(el => el.classList.remove('active-element'));
    document.querySelectorAll('.active-section').forEach(sec => sec.classList.remove('active-section'));

    const htmlToSave = container.innerHTML;
    localStorage.setItem(`gfk_builder_page_${activePageKey}`, htmlToSave);

    showToast(`Page "${activePageKey}" published successfully! Changes are live.`);
  };

  window.previewLivePage = function () {
    const filename = activePageKey === 'home' ? 'index.html' : `${activePageKey}.html`;
    window.open(filename, '_blank');
  };

  window.exportWebsiteFiles = function () {
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    const pageTitle = document.getElementById('pageMetaTitle').value || 'Greek Fit Kitchen';
    const pageDesc = document.getElementById('pageMetaDesc').value || 'High protein meal prep in Toronto';

    // Clone and strip builder handles
    const clone = container.cloneNode(true);
    clone.querySelectorAll('.section-actions').forEach(el => el.remove());
    clone.querySelectorAll('.element-actions').forEach(el => el.remove());
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    clone.querySelectorAll('.active-element').forEach(el => el.classList.remove('active-element'));
    clone.querySelectorAll('.active-section').forEach(sec => sec.classList.remove('active-section'));

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDesc}" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Roboto', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Roboto Slab', serif; }
  </style>
</head>
<body class="bg-white text-slate-800 antialiased">
  ${clone.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activePageKey === 'home' ? 'index.html' : `${activePageKey}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded clean export: ${link.download}`);
  };

  // --- Initialization on Load ---
  document.addEventListener('DOMContentLoaded', function () {
    checkBuilderAuth();

    // Load any custom pages into dropdown
    const customPages = getCustomPages();
    const selector = document.getElementById('pageSelector');
    if (selector && customPages.length > 0) {
      customPages.forEach(p => {
        if (!selector.querySelector(`option[value="${p.slug}"]`)) {
          const opt = document.createElement('option');
          opt.value = p.slug;
          opt.innerText = `${p.name} (${p.slug}.html)`;
          selector.appendChild(opt);
        }
      });
    }

    // Check URL hash for direct page or modal (e.g. builder.html#blog)
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'blog') {
      switchActivePage('blog');
      setTimeout(() => openBlogManagerModal(), 400);
    } else if (hash && (DEFAULT_PAGE_TEMPLATES[hash] || customPages.some(p => p.slug === hash))) {
      switchActivePage(hash);
    } else {
      loadAndRenderPage('home');
    }
  });

})();
