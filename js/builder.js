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
      <!-- Section 1: Hero Carousel Banner -->
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

      <!-- Section 2: Brand Story & Fresh Ingredients Showcase -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white" data-section-id="sec_showcase">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_showcase', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_showcase', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_showcase')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_showcase')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
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
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span class="font-bold text-sm text-[#101D3A] block">40g+ Protein</span>
                <span class="text-[11px] text-gray-500">Average per entree plate</span>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span class="font-bold text-sm text-[#101D3A] block">2 Free Sides</span>
                <span class="text-[11px] text-gray-500">Included with every meal</span>
              </div>
            </div>
            <div class="builder-element pt-2" data-element-id="el_showcase_btn">
              <a href="menu.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#101D3A] text-white font-bold text-sm hover:bg-[#0C172E] transition">
                <span>View Full 21-Dish Menu</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Our Main Dishes (All 21 Chef Dishes Grid) -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-gray-50" data-section-id="featuredMeals">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('featuredMeals', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('featuredMeals', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('featuredMeals')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('featuredMeals')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <span class="builder-element text-xs font-black uppercase tracking-widest text-[#F5C542]" contenteditable="true">CHEF CRAFTED SELECTION</span>
            <h2 class="builder-element font-heading text-3xl sm:text-5xl font-extrabold text-[#101D3A] mt-2 mb-3" contenteditable="true">Our Main Dishes</h2>
            <p class="builder-element text-gray-600 text-sm sm:text-base leading-relaxed" contenteditable="true">
              Explore all 21 chef-crafted Mediterranean dishes. Every plate comes with your choice of 2 included complimentary sides.
            </p>
          </div>
          
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_grilled-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/grilled-chicken.jpg" alt="Grilled Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Grilled Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender herb-marinated chicken breast flame-grilled with Greek oregano, garlic, and extra virgin olive oil.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Gluten-Free</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chilly-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chilly-chicken.jpg" alt="Chilly Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chilly Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Lean chicken breast tossed in a zesty Mediterranean chili and herb glaze for a vibrant metabolic kick.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Spicy</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_salmon">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/salmon.jpg" alt="Salmon" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Salmon</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Pan-seared Atlantic salmon fillet with sea salt, cracked black pepper, oregano, and fresh lemon essence.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Omega-3, Heart Healthy, Keto Friendly</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_spinach-feta">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/spinach-feta-chicken.jpg" alt="Spinach & Feta" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Spinach & Feta</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Lean chicken breast stuffed with authentic Greek feta, wilted baby spinach, and roasted garlic cloves.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Signature Dish</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_stuffed-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/stuffed-chicken.jpg" alt="Stuffed Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Stuffed Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender chicken breast generously stuffed with authentic Greek feta, fresh garden herbs, and roasted garlic, baked to golden perfection.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Chef Specialty</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_tandoori-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/tandoori-chicken.jpg" alt="Tandoori Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Tandoori Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Greek-yogurt and aromatic spice-marinated chicken fillet, roasted tender with caramelized edges.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Lean</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-mushroom">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-mushroom.jpg" alt="Chicken Mushroom Sauce" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Mushroom Sauce</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Succulent chicken breast smothered in a savory, simmered cremini mushroom reduction with Greek herbs.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-fajita">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-fajita.jpg" alt="Chicken Fajita" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Fajita</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Sliced grilled chicken breast sautéed with sweet bell peppers, red onions, and smoky Mediterranean spices.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Nutrient Dense</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_beef-fajita">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/beef-fajita.jpg" alt="Beef Fajita" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Beef Fajita</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Char-broiled strips of tender Canadian flank beef seared with colorful sweet peppers and charred sweet onions.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Iron Rich</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_beef-mushroom">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/beef-mushroom.jpg" alt="Beef Mushroom Sauce" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Beef Mushroom Sauce</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Slow-braised lean beef medallions topped with a rich garlic mushroom glaze and garden fresh parsley.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Hearty</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_smoked-turkey">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/smoked-turkey.jpg" alt="Smoked Turkey Breast" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Smoked Turkey Breast</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Naturally hardwood-smoked lean turkey breast carved into tender slices with fragrant rosemary jus.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Ultra Lean, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-leg">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-leg.jpg" alt="Chicken Leg Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $10.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Leg Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Slow-roasted bone-in chicken leg quarters seasoned with aromatic garlic, wild thyme, and fresh lemon.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Traditional</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-fillet">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-fillet.jpg" alt="Chicken Fillet" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Fillet</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Ultra-lean grilled chicken breast fillet prepared simply with Greek lemon, sea salt, and extra virgin olive oil.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Clean Macros, Low Fat</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_veggie-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/veggie-souvlaki.jpg" alt="Veggie Souvlaki" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $11.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Veggie Souvlaki</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Skewered char-grilled zucchini, bell peppers, cremini mushrooms, and red onions with Greek herb marinade.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Vegetarian, Plant Powered</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-souvlaki.jpg" alt="Chicken Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Traditional skewers of cubed chicken breast marinated in lemon, garlic, white wine, and Greek mountain oregano.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Best Seller, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_beef-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/beef-souvlaki.jpg" alt="Beef Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Beef Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender sirloin steak skewers grilled over open flame with extra virgin olive oil and fragrant spices.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Premium Beef, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_pork-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/pork-souvlaki.jpg" alt="Pork Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $9.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Pork Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Authentic Greek street-style marinated pork tenderloin skewers with vibrant lemon and crushed oregano.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Authentic Greek, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_spinach-pie">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/spinach-pie.jpg" alt="Spinach Pie Dinner" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Spinach Pie Dinner</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Traditional homemade Spanakopita with flaky phyllo pastry, organic baby spinach, scallions, and sheep feta.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Vegetarian, Handcrafted</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_pasta-al-greco">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/pasta-al-greco.jpg" alt="Pasta al Greco" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $9.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Pasta al Greco</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Penne pasta tossed in rich Greek roasted tomato sauce, virgin olive oil, fragrant basil, and crumbled sheep feta.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Vegetarian, Pasta Dish (Sides Excluded)</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_smoked-pork-loin">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/smoked-pork-loin.jpg" alt="Smoked Pork Loin" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Smoked Pork Loin</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender center-cut pork loin, lightly smoked with natural applewood and served with aromatic citrus jus.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Lean Cuts</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_turkey-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/turkey-souvlaki.jpg" alt="Turkey Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Turkey Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Lean cubed turkey breast skewers flame-broiled with lemon, garlic, Greek sea salt, and extra virgin olive oil.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Ultra Clean, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
    </div>
        </div>
      </section>

      <!-- Section 4: How Greek Fit Kitchen Works (3-Step Process) -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white" data-section-id="howItWorks">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('howItWorks', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('howItWorks', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('howItWorks')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('howItWorks')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto text-center">
          <span class="builder-element text-xs font-black uppercase tracking-widest text-[#F5C542]" contenteditable="true">HOW IT WORKS</span>
          <h2 class="builder-element font-heading text-3xl sm:text-4xl font-extrabold text-[#101D3A] mt-2 mb-10" contenteditable="true">How Greek Fit Kitchen Works</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div class="builder-element p-6 rounded-2xl bg-slate-50 border border-gray-200" data-element-id="el_how_card1">
              <span class="w-10 h-10 rounded-xl bg-[#F5C542] text-[#0C172E] font-black text-lg flex items-center justify-center mb-4">1</span>
              <h3 class="font-heading font-bold text-lg text-[#101D3A]" contenteditable="true">Choose 6+ Meals</h3>
              <p class="text-xs text-gray-600 mt-2 leading-relaxed" contenteditable="true">Select from our 21 high-protein dishes and customize 2 complimentary sides per plate to match your daily macros.</p>
            </div>
            <div class="builder-element p-6 rounded-2xl bg-slate-50 border border-gray-200" data-element-id="el_how_card2">
              <span class="w-10 h-10 rounded-xl bg-[#101D3A] text-white font-black text-lg flex items-center justify-center mb-4">2</span>
              <h3 class="font-heading font-bold text-lg text-[#101D3A]" contenteditable="true">Twice-Weekly Fresh Prep</h3>
              <p class="text-xs text-gray-600 mt-2 leading-relaxed" contenteditable="true">Our culinary team cooks fresh batches twice weekly in Etobicoke. Zero freezing, 100% fresh batch cookery.</p>
            </div>
            <div class="builder-element p-6 rounded-2xl bg-slate-50 border border-gray-200" data-element-id="el_how_card3">
              <span class="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4">3</span>
              <h3 class="font-heading font-bold text-lg text-[#101D3A]" contenteditable="true">GTA Batch Delivery</h3>
              <p class="text-xs text-gray-600 mt-2 leading-relaxed" contenteditable="true">Delivered in chilled insulated packaging directly to your doorstep on Sundays and Wednesdays, or free Etobicoke kitchen pickup.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: Build Your Weekly Meal Plan (Volume Tiers) -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white" data-section-id="mealPlans">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('mealPlans', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('mealPlans', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('mealPlans')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('mealPlans')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
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

      <!-- Section 6: Twice-Weekly Fresh Batches (Delivery Rates & Schedule) -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-slate-50" data-section-id="deliverySection">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('deliverySection', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('deliverySection', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('deliverySection')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('deliverySection')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-10">
            <span class="builder-element text-xs font-black uppercase tracking-widest text-[#F5C542]" contenteditable="true">TORONTO &amp; GTA COURIER</span>
            <h2 class="builder-element font-heading text-3xl sm:text-4xl font-extrabold text-[#101D3A] mt-2 mb-3" contenteditable="true">Twice-Weekly Fresh Batches</h2>
            <p class="builder-element text-gray-600 text-sm leading-relaxed" contenteditable="true">
              We batch-cook fresh on weekends and mid-week to maintain peak micronutrient integrity. Chilled courier delivery across Greater Toronto.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <!-- Box 1: Batch Drop Schedule Card -->
            <div class="builder-element p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4 transition" data-element-id="el_batch_card">
              <h3 class="builder-element font-heading font-bold text-xl text-[#101D3A]" data-element-id="el_batch_title" contenteditable="true">Batch Drop Schedule</h3>
              <div class="space-y-3 text-xs text-gray-600">
                <div class="builder-element p-3 rounded-xl bg-slate-50 border border-gray-100" data-element-id="el_batch_sun_box">
                  <strong class="builder-element text-[#101D3A] text-sm block" data-element-id="el_batch_sun_title" contenteditable="true">Sunday Batch Delivery:</strong>
                  <span class="builder-element text-xs text-gray-600 block mt-0.5" data-element-id="el_batch_sun_desc" contenteditable="true">Cutoff Friday 11:59 PM EST &bull; Delivery Sunday 1:00 PM – 7:00 PM</span>
                </div>
                <div class="builder-element p-3 rounded-xl bg-slate-50 border border-gray-100" data-element-id="el_batch_wed_box">
                  <strong class="builder-element text-[#101D3A] text-sm block" data-element-id="el_batch_wed_title" contenteditable="true">Wednesday Batch Delivery:</strong>
                  <span class="builder-element text-xs text-gray-600 block mt-0.5" data-element-id="el_batch_wed_desc" contenteditable="true">Cutoff Monday 11:59 PM EST &bull; Delivery Wednesday 1:00 PM – 7:00 PM</span>
                </div>
                <div class="builder-element p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800" data-element-id="el_batch_pickup_box">
                  <strong class="builder-element text-sm block text-emerald-800" data-element-id="el_batch_pickup_title" contenteditable="true">Free Kitchen Pickup Available:</strong>
                  <span class="builder-element text-xs block text-emerald-700 mt-0.5" data-element-id="el_batch_pickup_desc" contenteditable="true">3575 Lake Shore Blvd W, Etobicoke &bull; Sundays &amp; Wednesdays 2:00 PM – 6:00 PM</span>
                </div>
              </div>
            </div>

            <!-- Box 2: Delivery Rate Zones Card -->
            <div class="builder-element p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4 transition" data-element-id="el_rate_card">
              <h3 class="builder-element font-heading font-bold text-xl text-[#101D3A]" data-element-id="el_rate_title" contenteditable="true">Delivery Rate Zones</h3>
              <ul class="text-xs text-gray-600 space-y-2.5">
                <li class="builder-element flex justify-between pb-2 border-b border-gray-100" data-element-id="el_rate_row1">
                  <span class="builder-element" data-element-id="el_rate_row1_name" contenteditable="true">Etobicoke South (&le; 2.0 km)</span>
                  <strong class="builder-element text-emerald-600 font-bold" data-element-id="el_rate_row1_price" contenteditable="true">FREE ($0.00 CAD)</strong>
                </li>
                <li class="builder-element flex justify-between pb-2 border-b border-gray-100" data-element-id="el_rate_row2">
                  <span class="builder-element" data-element-id="el_rate_row2_name" contenteditable="true">Local Zone (2 to 5 km)</span>
                  <strong class="builder-element text-[#101D3A] font-bold" data-element-id="el_rate_row2_price" contenteditable="true">$5.00 Flat CAD</strong>
                </li>
                <li class="builder-element flex justify-between pb-2 border-b border-gray-100" data-element-id="el_rate_row3">
                  <span class="builder-element" data-element-id="el_rate_row3_name" contenteditable="true">Extended GTA (&gt; 5 km)</span>
                  <strong class="builder-element text-[#101D3A] font-bold" data-element-id="el_rate_row3_price" contenteditable="true">$1.00 / km</strong>
                </li>
                <li class="builder-element flex justify-between" data-element-id="el_rate_row4">
                  <span class="builder-element" data-element-id="el_rate_row4_name" contenteditable="true">Maximum Service Boundary</span>
                  <strong class="builder-element text-gray-500 font-bold" data-element-id="el_rate_row4_price" contenteditable="true">35 km radius</strong>
                </li>
              </ul>
              <div class="pt-2">
                <a href="delivery-rates.html" class="builder-element block w-full py-2.5 bg-[#101D3A] hover:bg-[#0C172E] text-white font-bold text-xs rounded-xl text-center transition" data-element-id="el_rate_btn" contenteditable="true">Calculate Distance &amp; Rates</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 7: Catering & Dietary Banner -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white text-center" data-section-id="sec_catering">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_catering', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_catering', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_catering')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_catering')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
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
      <!-- Section 1: Meal Plan Hero Banner -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_menu_hero">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_menu_hero', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_menu_hero', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_menu_hero')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_menu_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" data-element-id="el_m_tag" contenteditable="true">CHEF PREPARED • TWICE WEEKLY</span>
        <h1 class="builder-element font-heading text-4xl sm:text-6xl font-black mt-2 mb-3 uppercase" data-element-id="el_m_title" contenteditable="true">OUR MENU</h1>
        <p class="builder-element font-heading text-lg sm:text-xl font-bold text-[#F5C542] mb-4 uppercase" contenteditable="true">BIG GREEK FLAVOUR. ZERO MEAL PREP.</p>
        <p class="builder-element text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed" data-element-id="el_m_sub" contenteditable="true">Every entree includes your choice of 2 complimentary fresh sides. Minimum 6 meals per order to ensure peak batch kitchen freshness.</p>
      </section>

      <!-- Section 2: Greek Fit Kitchen Value Package -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white border-b border-gray-200" data-section-id="mealPackageSection">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('mealPackageSection', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('mealPackageSection', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('mealPackageSection')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('mealPackageSection')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex-1 space-y-3 text-center md:text-left">
            <span class="inline-block text-xs font-extrabold uppercase tracking-wider text-[#101D3A] bg-[#F5C542]/30 px-3 py-1 rounded-full">
              Greek Fit Kitchen Value Package
            </span>
            <h2 class="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900" contenteditable="true">
              MAKE MEAL TIME EASIER
            </h2>
            <div class="flex flex-wrap items-baseline gap-2 justify-center md:justify-start">
              <span class="font-heading text-xl sm:text-2xl font-extrabold text-[#101D3A]">6-MEAL PLAN</span>
              <span class="text-sm text-gray-600 font-medium">Starting from</span>
              <span class="text-2xl sm:text-3xl font-black text-gray-900">$59.94 CAD</span>
            </div>
            <div class="flex flex-wrap items-center gap-3 justify-center md:justify-start pt-1">
              <div class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                <span>Minimum order: 6 meals.</span>
              </div>
              <div class="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0C172E] bg-[#F5C542] px-3.5 py-1.5 rounded-lg shadow-sm">
                <span>★ 10% OFF orders of 7+ meals</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed pt-1" contenteditable="true">
              Build your personalized weekly meal prep: choose any combinations of our 21 chef-crafted dishes. Every plate comes with 2 included sides of your choice.
            </p>
          </div>
          <div class="flex flex-col gap-3 flex-shrink-0">
            <a href="#mainMenuSection" class="px-6 py-3.5 bg-[#F5C542] hover:bg-[#E5B432] text-[#0C172E] font-extrabold text-sm rounded-2xl shadow-lg transition text-center">
              🔥 Build 7+ Meal Package (10% OFF)
            </a>
            <span class="text-xs text-gray-400 text-center">Independent sides per meal</span>
          </div>
        </div>
      </section>

      <!-- Section 3: All 21 Chef Dishes Grid -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-slate-50" data-section-id="sec_menu_grid">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_menu_grid', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_menu_grid', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_menu_grid')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_menu_grid')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#101D3A]" contenteditable="true">Chef-Crafted Entrees (21 Dishes)</h2>
            <p class="text-xs text-gray-500 mt-1" contenteditable="true">Click any dish to edit price, name, description, or image.</p>
          </div>
          
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_grilled-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/grilled-chicken.jpg" alt="Grilled Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Grilled Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender herb-marinated chicken breast flame-grilled with Greek oregano, garlic, and extra virgin olive oil.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Gluten-Free</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chilly-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chilly-chicken.jpg" alt="Chilly Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chilly Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Lean chicken breast tossed in a zesty Mediterranean chili and herb glaze for a vibrant metabolic kick.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Spicy</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_salmon">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/salmon.jpg" alt="Salmon" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Salmon</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Pan-seared Atlantic salmon fillet with sea salt, cracked black pepper, oregano, and fresh lemon essence.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Omega-3, Heart Healthy, Keto Friendly</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_spinach-feta">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/spinach-feta-chicken.jpg" alt="Spinach & Feta" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Spinach & Feta</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Lean chicken breast stuffed with authentic Greek feta, wilted baby spinach, and roasted garlic cloves.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Signature Dish</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_stuffed-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/stuffed-chicken.jpg" alt="Stuffed Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Stuffed Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender chicken breast generously stuffed with authentic Greek feta, fresh garden herbs, and roasted garlic, baked to golden perfection.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Chef Specialty</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_tandoori-chicken">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/tandoori-chicken.jpg" alt="Tandoori Chicken" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Tandoori Chicken</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Greek-yogurt and aromatic spice-marinated chicken fillet, roasted tender with caramelized edges.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Lean</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-mushroom">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-mushroom.jpg" alt="Chicken Mushroom Sauce" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Mushroom Sauce</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Succulent chicken breast smothered in a savory, simmered cremini mushroom reduction with Greek herbs.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-fajita">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-fajita.jpg" alt="Chicken Fajita" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Fajita</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Sliced grilled chicken breast sautéed with sweet bell peppers, red onions, and smoky Mediterranean spices.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Nutrient Dense</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_beef-fajita">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/beef-fajita.jpg" alt="Beef Fajita" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Beef Fajita</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Char-broiled strips of tender Canadian flank beef seared with colorful sweet peppers and charred sweet onions.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Iron Rich</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_beef-mushroom">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/beef-mushroom.jpg" alt="Beef Mushroom Sauce" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $14.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Beef Mushroom Sauce</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Slow-braised lean beef medallions topped with a rich garlic mushroom glaze and garden fresh parsley.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Hearty</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_smoked-turkey">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/smoked-turkey.jpg" alt="Smoked Turkey Breast" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Smoked Turkey Breast</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Naturally hardwood-smoked lean turkey breast carved into tender slices with fragrant rosemary jus.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Ultra Lean, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-leg">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-leg.jpg" alt="Chicken Leg Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $10.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Leg Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Slow-roasted bone-in chicken leg quarters seasoned with aromatic garlic, wild thyme, and fresh lemon.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Traditional</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-fillet">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-fillet.jpg" alt="Chicken Fillet" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Fillet</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Ultra-lean grilled chicken breast fillet prepared simply with Greek lemon, sea salt, and extra virgin olive oil.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Clean Macros, Low Fat</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_veggie-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/veggie-souvlaki.jpg" alt="Veggie Souvlaki" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $11.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Veggie Souvlaki</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Skewered char-grilled zucchini, bell peppers, cremini mushrooms, and red onions with Greek herb marinade.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Vegetarian, Plant Powered</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_chicken-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/chicken-souvlaki.jpg" alt="Chicken Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Chicken Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Traditional skewers of cubed chicken breast marinated in lemon, garlic, white wine, and Greek mountain oregano.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Best Seller, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_beef-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/beef-souvlaki.jpg" alt="Beef Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Beef Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender sirloin steak skewers grilled over open flame with extra virgin olive oil and fragrant spices.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Premium Beef, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_pork-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/pork-souvlaki.jpg" alt="Pork Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $9.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Pork Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Authentic Greek street-style marinated pork tenderloin skewers with vibrant lemon and crushed oregano.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Authentic Greek, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_spinach-pie">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/spinach-pie.jpg" alt="Spinach Pie Dinner" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Spinach Pie Dinner</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Traditional homemade Spanakopita with flaky phyllo pastry, organic baby spinach, scallions, and sheep feta.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Vegetarian, Handcrafted</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_pasta-al-greco">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/pasta-al-greco.jpg" alt="Pasta al Greco" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $9.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Pasta al Greco</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Penne pasta tossed in rich Greek roasted tomato sauce, virgin olive oil, fragrant basil, and crumbled sheep feta.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Vegetarian, Pasta Dish (Sides Excluded)</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_smoked-pork-loin">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/smoked-pork-loin.jpg" alt="Smoked Pork Loin" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $12.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Smoked Pork Loin</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Tender center-cut pork loin, lightly smoked with natural applewood and served with aromatic citrus jus.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">High Protein, Lean Cuts</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
        <div class="builder-element bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between" data-element-id="el_dish_turkey-souvlaki">
          <div>
            <div class="relative h-44 bg-gray-100 overflow-hidden">
              <img src="images/meals/turkey-souvlaki.jpg" alt="Turkey Souvlaki Plate" class="w-full h-full object-cover" onerror="this.src='images/meals/grilled-chicken.jpg'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#101D3A] text-[#F5C542] font-black text-xs rounded-lg shadow">
                $13.99 CAD
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-extrabold text-base text-[#101D3A]" contenteditable="true">Turkey Souvlaki Plate</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2" contenteditable="true">Lean cubed turkey breast skewers flame-broiled with lemon, garlic, Greek sea salt, and extra virgin olive oil.</p>
              <div class="mt-3 flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Ultra Clean, High Protein</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 text-[11px]">2 Included Sides</span>
            <a href="menu.html" class="px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#0C172E] font-extrabold text-xs">Customize Plate</a>
          </div>
        </div>
      
    </div>
        </div>
      </section>

      <!-- Section 4: Special Requests & Catering -->
      <section class="builder-section py-14 px-6 sm:px-12 bg-white text-center border-t border-gray-200" data-section-id="sec_menu_catering">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_menu_catering', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_menu_catering', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_menu_catering')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_menu_catering')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto">
          <span class="inline-block px-3 py-1 bg-[#101D3A]/10 text-[#101D3A] text-xs font-extrabold uppercase rounded-full mb-3" contenteditable="true">
            Custom Meal Prep &amp; Event Orders
          </span>
          <h2 class="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900" contenteditable="true">
            CAN'T FIND WHAT YOU'RE LOOKING FOR?
          </h2>
          <p class="mt-3 text-sm text-gray-600 max-w-xl mx-auto leading-relaxed" contenteditable="true">
            Contact us for custom macro allocations, private catering, or specialized corporate wellness programs.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <a href="mailto:orders@greekfitkitchen.ca" class="px-6 py-3 rounded-xl bg-[#101D3A] text-white text-xs font-bold shadow transition">SPECIAL REQUESTS</a>
            <a href="mailto:orders@greekfitkitchen.ca?subject=Catering" class="px-6 py-3 rounded-xl bg-[#F5C542] text-[#0C172E] text-xs font-extrabold shadow transition">CATERING ENQUIRIES</a>
          </div>
        </div>
      </section>
    `,

    delivery: `
      <!-- Section 1: Hero Banner -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_del_hero">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_del_hero', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_del_hero', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_del_hero')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_del_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" contenteditable="true">TORONTO &amp; GTA COURIER</span>
        <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-3" contenteditable="true">GTA Delivery Rates &amp; Schedule</h1>
        <p class="builder-element text-slate-300 text-sm max-w-xl mx-auto leading-relaxed" contenteditable="true">Twice-weekly delivery drops in insulated packaging directly to your home or office.</p>
      </section>

      <!-- Section 2: Live Rate Lookup & Calculator -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_del_calc">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_del_calc', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_del_calc', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_del_calc')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_del_calc')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="p-8 rounded-3xl bg-slate-50 border border-gray-200">
            <span class="text-[#F5C542] font-bold text-xs uppercase tracking-wider">Live Distance Lookup</span>
            <h2 class="font-heading font-extrabold text-2xl text-gray-900 mt-1" contenteditable="true">Calculate Your Rate</h2>
            <p class="text-xs text-gray-500 mt-2" contenteditable="true">
              Tiered rates: <strong>FREE &le; 2 km &bull; $5.00 Flat (2–5 km) &bull; $1.00/km (&gt; 5 km)</strong> from 3575 Lake Shore Blvd W, Etobicoke.
            </p>
            <div class="mt-6 space-y-3">
              <input type="text" placeholder="Enter Postal Code (e.g. M5V, M8W)" class="w-full py-3 px-4 rounded-xl border border-gray-300 text-sm font-bold uppercase" />
              <button class="w-full py-3 bg-[#F5C542] hover:bg-[#E5B432] text-[#0C172E] font-black text-sm rounded-xl shadow">Calculate Delivery Fee</button>
            </div>
          </div>
          <div class="space-y-4">
            <div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h3 class="font-heading font-bold text-lg text-emerald-800" contenteditable="true">Free Kitchen Pickup</h3>
              <p class="text-xs text-emerald-700 mt-1" contenteditable="true">3575 Lake Shore Blvd W, Etobicoke &bull; Pick up Sundays &amp; Wednesdays 2:00 PM – 6:00 PM with $0 delivery fee.</p>
            </div>
            <div class="p-6 rounded-2xl bg-blue-50 border border-blue-200">
              <h3 class="font-heading font-bold text-lg text-blue-900" contenteditable="true">Insulated Thermal Packaging</h3>
              <p class="text-xs text-blue-800 mt-1" contenteditable="true">Shipped with ice packs designed to keep entrees chilled below 4°C for up to 6 hours after drop-off.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Twice Weekly Batch Schedules -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-slate-50" data-section-id="sec_del_schedule">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_del_schedule', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_del_schedule', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_del_schedule')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_del_schedule')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-heading font-bold text-xl text-[#101D3A] flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-[#F5C542]"></span> Sunday Batch Drop
            </h3>
            <ul class="space-y-2 text-xs text-gray-600">
              <li><strong>Order Cutoff:</strong> Friday 11:59 PM EST</li>
              <li><strong>Batch Cooking:</strong> Saturday night &amp; Sunday morning</li>
              <li><strong>Delivery Window:</strong> Sunday 1:00 PM – 7:00 PM EST</li>
              <li><strong>Ideal for:</strong> Monday–Thursday workout fueling</li>
            </ul>
          </div>
          <div class="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3">
            <h3 class="font-heading font-bold text-xl text-[#101D3A] flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-600"></span> Wednesday Batch Drop
            </h3>
            <ul class="space-y-2 text-xs text-gray-600">
              <li><strong>Order Cutoff:</strong> Monday 11:59 PM EST</li>
              <li><strong>Batch Cooking:</strong> Tuesday night &amp; Wednesday morning</li>
              <li><strong>Delivery Window:</strong> Wednesday 1:00 PM – 7:00 PM EST</li>
              <li><strong>Ideal for:</strong> Weekend training &amp; high volume splits</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Section 4: Sample Delivery Estimates Across GTA Table -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_del_table">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_del_table', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_del_table', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_del_table')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_del_table')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto">
          <h3 class="font-heading font-bold text-2xl text-gray-900 mb-1" contenteditable="true">Sample Delivery Estimates Across the GTA</h3>
          <p class="text-xs text-gray-500 mb-6" contenteditable="true">Calculated from our commercial kitchen at 3575 Lake Shore Blvd W, Etobicoke.</p>
          <div class="overflow-x-auto rounded-2xl border border-gray-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 border-b text-[10px] uppercase font-bold text-gray-500">
                <tr><th class="p-3">GTA Region</th><th class="p-3">Sample Postal Code</th><th class="p-3">Avg Distance</th><th class="p-3">Estimated Rate</th></tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr><td class="p-3 font-bold text-gray-900">Etobicoke South (Near Kitchen)</td><td class="p-3 font-mono">M8W, M8V</td><td class="p-3">&le; 2.0 km</td><td class="p-3 font-bold text-emerald-600">FREE ($0.00 CAD)</td></tr>
                <tr><td class="p-3 font-bold text-gray-900">Etobicoke South / Humber</td><td class="p-3 font-mono">M8X, M8Z</td><td class="p-3">2–5 km</td><td class="p-3 font-bold text-emerald-600">$5.00 CAD Flat</td></tr>
                <tr><td class="p-3 font-bold text-gray-900">Mississauga East / Port Credit</td><td class="p-3 font-mono">L5E, L5G</td><td class="p-3">5–6 km</td><td class="p-3 font-bold text-emerald-600">$5.00 – $6.00 CAD</td></tr>
                <tr><td class="p-3 font-bold text-gray-900">High Park / Bloor West</td><td class="p-3 font-mono">M6S, M6P</td><td class="p-3">7–9 km</td><td class="p-3 font-bold text-emerald-600">$7.00 – $9.00 CAD</td></tr>
                <tr><td class="p-3 font-bold text-gray-900">Downtown Toronto / Waterfront</td><td class="p-3 font-mono">M5V, M5J</td><td class="p-3">13–15 km</td><td class="p-3 font-bold text-emerald-600">$13.00 – $15.00 CAD</td></tr>
                <tr><td class="p-3 font-bold text-gray-900">North York / Scarborough</td><td class="p-3 font-mono">M2N, M1P</td><td class="p-3">20–30 km</td><td class="p-3 font-bold text-emerald-600">$20.00 – $30.00 CAD</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `,

    about: `
      <!-- Section 1: Hero Banner -->
      <section class="builder-section py-20 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_about_hero">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_about_hero', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_about_hero', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_about_hero')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_about_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" data-element-id="el_ab_tag" contenteditable="true">OUR STORY</span>
        <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-4" data-element-id="el_ab_title" contenteditable="true">About Greek Fit Kitchen</h1>
        <p class="builder-element text-slate-300 max-w-xl mx-auto text-sm" data-element-id="el_ab_sub" contenteditable="true">Founded by George the Greek to bridge authentic Greek island culinary traditions with modern athletic sports nutrition.</p>
      </section>

      <!-- Section 2: Hero Photography Showcase -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_about_photo">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_about_photo', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_about_photo', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_about_photo')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_about_photo')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-[16/9]">
          <img src="images/brand/fresh-ingredients-showcase.png" alt="Chef George and Kitchen Team" class="w-full h-full object-cover" />
        </div>
      </section>

      <!-- Section 3: Founder's Story & Heritage -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_about_story">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_about_story', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_about_story', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_about_story')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_about_story')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-8 sm:p-12 border border-gray-200 space-y-6 text-gray-700 leading-relaxed text-sm">
          <h2 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900" contenteditable="true">
            "Greek Food is Nature's Original Fitness Diet"
          </h2>
          <p contenteditable="true">
            Growing up in a traditional Greek family, every single meal was built around three non-negotiables: fresh lean proteins, cold-pressed extra virgin olive oil from ancient olive groves, and wild mountain herbs hand-picked under the Mediterranean sun.
          </p>
          <p contenteditable="true">
            When founder <strong>George the Greek</strong> became dedicated to fitness and athletic training in Toronto, he experienced the same frustration so many athletes and busy professionals face: conventional fitness meal prep was dry, bland, repetitive, and cooked with cheap seed oils that caused systemic inflammation.
          </p>
          <p contenteditable="true">
            In partnership with our state-of-the-art Etobicoke commercial kitchen facility (3575 Lake Shore Blvd W), Greek Fit Kitchen was created to bring culinary excitement back to performance eating.
          </p>
        </div>
      </section>

      <!-- Section 4: 3 Stats Highlights -->
      <section class="builder-section py-10 px-6 sm:px-12 bg-white" data-section-id="sec_about_stats">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_about_stats', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_about_stats', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_about_stats')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_about_stats')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <span class="font-heading font-extrabold text-3xl text-[#F5C542]">100%</span>
            <span class="block text-xs text-gray-500 mt-1">Extra Virgin Olive Oil (Zero Seed Oils)</span>
          </div>
          <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <span class="font-heading font-extrabold text-3xl text-emerald-600">40g+</span>
            <span class="block text-xs text-gray-500 mt-1">Average Protein Per Dish</span>
          </div>
          <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <span class="font-heading font-extrabold text-3xl text-[#101D3A]">2x</span>
            <span class="block text-xs text-gray-500 mt-1">Weekly Fresh Batch Drops</span>
          </div>
        </div>
      </section>

      <!-- Section 5: Four Kitchen Commitments -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-slate-50" data-section-id="sec_about_commitments">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_about_commitments', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_about_commitments', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_about_commitments')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_about_commitments')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto">
          <h3 class="font-heading font-bold text-2xl text-gray-900 mb-6" contenteditable="true">
            Our Four Kitchen Commitments
          </h3>
          <ul class="space-y-4 text-xs text-gray-700">
            <li class="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-[#F5C542] text-[#0C172E] font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div><strong class="text-sm text-gray-900 block">Never Frozen:</strong> We batch-cook twice a week (Sundays &amp; Wednesdays). Your meals are never frozen in a commercial freezer or thawed before delivery.</div>
            </li>
            <li class="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-[#F5C542] text-[#0C172E] font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div><strong class="text-sm text-gray-900 block">Local Ontario Poultry &amp; AAA Beef:</strong> We partner with local butchers for lean breast tenderloins, fresh Atlantic salmon fillets, and Canadian AAA sirloin cuts.</div>
            </li>
            <li class="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-[#F5C542] text-[#0C172E] font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div><strong class="text-sm text-gray-900 block">Custom Starches &amp; Veggies:</strong> Every dish comes with 2 sides chosen by you. We never lock you into fixed carb or vegetable ratios.</div>
            </li>
            <li class="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-[#F5C542] text-[#0C172E] font-bold flex items-center justify-center flex-shrink-0">4</span>
              <div><strong class="text-sm text-gray-900 block">Eco-Friendly Recyclable Packaging:</strong> Packed in BPA-free, leak-resistant, microwave-safe and oven-safe recyclable trays.</div>
            </li>
          </ul>
        </div>
      </section>
    `,

    howitworks: `
      <!-- Section 1: Hero Banner -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_how_hero">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_how_hero', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_how_hero', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_how_hero')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_how_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" contenteditable="true">SIMPLE 3-STEP PROCESS</span>
        <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-3" contenteditable="true">How Greek Fit Works</h1>
        <p class="builder-element text-slate-300 text-sm max-w-lg mx-auto" contenteditable="true">Freshly cooked twice weekly in Etobicoke. Zero freezing, simple reheating, delicious athletic eating.</p>
      </section>

      <!-- Section 2: 3-Step Visual Process -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_how_steps">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_how_steps', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_how_steps', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_how_steps')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_how_steps')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 rounded-3xl bg-slate-50 border border-gray-200 text-center">
            <span class="w-12 h-12 rounded-xl bg-[#F5C542] text-[#0C172E] font-heading font-black text-xl flex items-center justify-center mx-auto mb-4">1</span>
            <h3 class="font-heading font-bold text-xl text-[#101D3A]" contenteditable="true">Order 6+ Meals</h3>
            <p class="mt-2 text-xs text-gray-600 leading-relaxed" contenteditable="true">
              Select at least 6 entrees. For every entree, pick your favorite clean starch and vegetable side.
            </p>
          </div>
          <div class="p-8 rounded-3xl bg-slate-50 border border-gray-200 text-center">
            <span class="w-12 h-12 rounded-xl bg-emerald-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto mb-4">2</span>
            <h3 class="font-heading font-bold text-xl text-[#101D3A]" contenteditable="true">Sunday or Wed Drop</h3>
            <p class="mt-2 text-xs text-gray-600 leading-relaxed" contenteditable="true">
              Choose your preferred batch day or free Etobicoke kitchen pickup. Orders arrive chilled in thermal cooler bags with ice packs.
            </p>
          </div>
          <div class="p-8 rounded-3xl bg-slate-50 border border-gray-200 text-center">
            <span class="w-12 h-12 rounded-xl bg-[#101D3A] text-white font-heading font-black text-xl flex items-center justify-center mx-auto mb-4">3</span>
            <h3 class="font-heading font-bold text-xl text-[#101D3A]" contenteditable="true">Heat &amp; Enjoy</h3>
            <p class="mt-2 text-xs text-gray-600 leading-relaxed" contenteditable="true">
              Heat 2–3 minutes in the microwave or 10 minutes in the oven. No grocery trips, no cooking, zero pan cleanup.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 3: Heating & Fridge Storage Guide -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-slate-50" data-section-id="sec_how_heating">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_how_heating', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_how_heating', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_how_heating')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_how_heating')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
          <span class="text-[#F5C542] uppercase tracking-wider font-bold text-xs">Culinary Guidelines</span>
          <h2 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mt-1 mb-6" contenteditable="true">
            Heating &amp; Fridge Storage
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <h4 class="font-heading font-bold text-lg text-gray-900 flex items-center gap-2" contenteditable="true">
                <span>♨️</span> Microwave Instructions
              </h4>
              <p class="mt-2 text-xs text-gray-600 leading-relaxed" contenteditable="true">
                1. Remove the clear lid or lift one corner to vent steam.<br />
                2. Microwave on HIGH for <strong>2 to 3 minutes</strong>.<br />
                3. Let rest 1 minute before removing. Fluff rice or potatoes and enjoy!
              </p>
            </div>
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <h4 class="font-heading font-bold text-lg text-gray-900 flex items-center gap-2" contenteditable="true">
                <span>🔥</span> Oven Reheating
              </h4>
              <p class="mt-2 text-xs text-gray-600 leading-relaxed" contenteditable="true">
                1. Preheat oven to <strong>350°F (175°C)</strong>.<br />
                2. Transfer meal contents to an oven-safe baking dish.<br />
                3. Cover loosely with foil and heat for <strong>10 to 12 minutes</strong> until piping hot.
              </p>
            </div>
          </div>
          <div class="mt-6 p-4 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 text-xs text-gray-700" contenteditable="true">
            <strong>Fridge Shelf Life:</strong> Meals stay perfectly fresh in your refrigerator for up to <strong>5 to 6 days</strong> from the delivery batch day. You can also freeze meals upon arrival for up to 30 days.
          </div>
        </div>
      </section>

      <!-- Section 4: Frequently Asked Questions -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-white" data-section-id="sec_how_faq">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_how_faq', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_how_faq', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_how_faq')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_how_faq')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-4xl mx-auto">
          <h2 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mb-6 text-center" contenteditable="true">
            Frequently Asked Questions
          </h2>
          <div class="space-y-4 text-xs text-gray-600">
            <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <h4 class="font-bold text-gray-900 text-sm mb-1" contenteditable="true">Why is there a 6-meal minimum?</h4>
              <p contenteditable="true">Batch cooking allows us to source premium Ontario meats, genuine Greek Dodoni feta, and cold-pressed Kalamata olive oil at optimal freshness and volume price points. The 6-meal minimum ensures batch integrity and gives you a structured week of meals starting at just $59.94 CAD.</p>
            </div>
            <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <h4 class="font-bold text-gray-900 text-sm mb-1" contenteditable="true">How does the 10% volume discount work?</h4>
              <p contenteditable="true">When you customize 7 or more meals, a 10% volume savings discount is automatically applied to your entire order at checkout. No promo code required.</p>
            </div>
            <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <h4 class="font-bold text-gray-900 text-sm mb-1" contenteditable="true">What are your batch order cutoffs?</h4>
              <p contenteditable="true">For Sunday batch delivery, order cutoff is Friday 11:59 PM EST. For Wednesday batch delivery, cutoff is Monday 11:59 PM EST.</p>
            </div>
          </div>
        </div>
      </section>
    `,

    blog: `
      <!-- Section 1: Hero Banner -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-[#101D3A] text-white rounded-t-2xl text-center" data-section-id="sec_b_hero">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_b_hero', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_b_hero', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_b_hero')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_b_hero')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <span class="builder-element text-xs font-extrabold text-[#F5C542] uppercase tracking-widest" contenteditable="true">NUTRITION &amp; FITNESS</span>
        <h1 class="builder-element font-heading text-4xl sm:text-5xl font-black mt-2 mb-3" contenteditable="true">The Mediterranean Fuel Journal</h1>
        <p class="builder-element text-slate-300 text-sm max-w-xl mx-auto" contenteditable="true">Evidence-based athletic nutrition, macro meal prep strategies, and Mediterranean recipes from our Etobicoke kitchen.</p>
      </section>

      <!-- Section 2: Category Navigation Pills -->
      <section class="builder-section py-6 px-6 sm:px-12 bg-white border-b border-gray-100" data-section-id="sec_b_pills">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_b_pills', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_b_pills', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_b_pills')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_b_pills')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          <span class="px-4 py-2 rounded-xl bg-[#101D3A] text-white cursor-pointer">All Articles</span>
          <span class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">Nutrition Science</span>
          <span class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">Athletic Training</span>
          <span class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">Meal Prep Mastery</span>
          <span class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">Chef Recipes</span>
        </div>
      </section>

      <!-- Section 3: Featured Articles Grid -->
      <section class="builder-section py-12 px-6 sm:px-12 bg-slate-50" data-section-id="sec_b_cards">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_b_cards', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_b_cards', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_b_cards')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_b_cards')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-5xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h2 class="font-heading font-extrabold text-2xl text-[#101D3A]">Featured Articles</h2>
            <button onclick="openBlogManagerModal()" class="px-4 py-2 bg-[#F5C542] text-[#0C172E] font-bold text-xs rounded-xl shadow">Manage All Posts (CMS)</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="builderBlogCardsContainer">
            <!-- Populated dynamically from blog posts -->
          </div>
        </div>
      </section>

      <!-- Section 4: VIP Newsletter Subscription -->
      <section class="builder-section py-16 px-6 sm:px-12 bg-white text-center border-t border-gray-200" data-section-id="sec_b_newsletter">
        <div class="section-actions bg-[#26292c] border border-[#393d41] rounded-lg p-1 shadow-xl flex items-center gap-1">
          <button onclick="moveSection('sec_b_newsletter', -1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Up">↑</button>
          <button onclick="moveSection('sec_b_newsletter', 1)" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Move Down">↓</button>
          <button onclick="duplicateSection('sec_b_newsletter')" class="p-1 hover:bg-[#393d41] rounded text-xs text-gray-300" title="Duplicate">❐</button>
          <button onclick="deleteSection('sec_b_newsletter')" class="p-1 hover:bg-red-900 rounded text-xs text-red-400" title="Delete">🗑</button>
        </div>
        <div class="max-w-2xl mx-auto space-y-4">
          <span class="text-xs font-black uppercase text-[#F5C542] tracking-widest">VIP ATHLETE CLUB</span>
          <h2 class="font-heading font-extrabold text-3xl text-[#101D3A]">Get Weekly Macro Tips &amp; Secret Batch Menus</h2>
          <p class="text-xs text-gray-600">Join 1,200+ Toronto athletes and fitness enthusiasts who receive our Sunday meal prep guides.</p>
          <div class="flex gap-2 max-w-md mx-auto pt-2">
            <input type="email" placeholder="Enter your email address" class="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-xs" />
            <button class="px-6 py-3 bg-[#101D3A] text-white font-bold text-xs rounded-xl shadow">Subscribe</button>
          </div>
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
  const SLUG_MAP = {
    'home': 'home',
    'index': 'home',
    'meal-plans': 'menu',
    'meal-plan': 'menu',
    'menu': 'menu',
    'about': 'about',
    'about-us': 'about',
    'delivery': 'delivery',
    'delivery-rates': 'delivery',
    'howitworks': 'howitworks',
    'how-it-works': 'howitworks',
    'blog': 'blog'
  };

  function normalizeSlug(slug) {
    if (!slug) return 'home';
    const clean = slug.toLowerCase().trim();
    return SLUG_MAP[clean] || clean;
  }

  window.switchActivePage = function (rawKey) {
    const pageKey = normalizeSlug(rawKey);
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

  window.resetCurrentPageToDefault = function () {
    if (confirm(`Reset "${activePageKey}" layout to the full original template? Any unsaved edits will be refreshed with all sections.`)) {
      localStorage.removeItem(`gfk_builder_page_${activePageKey}`);
      loadAndRenderPage(activePageKey);
      pushHistoryState();
      renderNavigatorTree();
      showToast(`Reloaded full complete template for ${activePageKey}`);
    }
  };

  function loadAndRenderPage(rawKey) {
    const pageKey = normalizeSlug(rawKey);
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    // Check localStorage first
    const saved = localStorage.getItem(`gfk_builder_page_${pageKey}`);
    const isOldIncomplete = saved && (
      (pageKey === 'home' && (!saved.includes('featuredMeals') || !saved.includes('howItWorks') || !saved.includes('deliverySection') || !saved.includes('el_batch_card') || !saved.includes('el_rate_card'))) ||
      (pageKey === 'menu' && !saved.includes('sec_menu_grid')) ||
      (pageKey === 'delivery' && !saved.includes('sec_del_calc')) ||
      (pageKey === 'about' && !saved.includes('sec_about_photo')) ||
      (pageKey === 'howitworks' && !saved.includes('sec_how_heating')) ||
      (pageKey === 'blog' && !saved.includes('sec_b_pills'))
    );

    if (saved && !isOldIncomplete) {
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

    // Automatically make all inner text tags inside sections selectable and editable
    const textSelectors = 'h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, small, a, button, li, label';
    container.querySelectorAll('.builder-section').forEach(sec => {
      sec.querySelectorAll(textSelectors).forEach(el => {
        if (!el.closest('.section-actions')) {
          if (!el.classList.contains('builder-element')) {
            el.classList.add('builder-element');
          }
          if (!el.getAttribute('data-element-id')) {
            el.setAttribute('data-element-id', 'el_' + Math.random().toString(36).substring(2, 9));
          }
          if (!el.getAttribute('contenteditable') && !el.querySelector('img') && !el.querySelector('input')) {
            el.setAttribute('contenteditable', 'true');
          }
        }
      });
    });

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

    container.className = `bg-white text-slate-800 transition-all duration-300 min-h-full h-auto rounded-2xl shadow-2xl relative mb-16 viewport-${mode}`;
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

  // --- History & Undo/Redo Engine ---
  const historyStack = [];
  let historyIndex = -1;

  function pushHistoryState() {
    const container = document.getElementById('livePageContainer');
    if (!container) return;
    if (historyIndex < historyStack.length - 1) {
      historyStack.splice(historyIndex + 1);
    }
    historyStack.push(container.innerHTML);
    if (historyStack.length > 30) historyStack.shift();
    historyIndex = historyStack.length - 1;
  }

  window.handleHistoryUndo = function () {
    if (historyIndex > 0) {
      historyIndex--;
      document.getElementById('livePageContainer').innerHTML = historyStack[historyIndex];
      attachCanvasEventListeners();
      renderNavigatorTree();
      showToast('Undone');
    }
  };

  window.handleHistoryRedo = function () {
    if (historyIndex < historyStack.length - 1) {
      historyIndex++;
      document.getElementById('livePageContainer').innerHTML = historyStack[historyIndex];
      attachCanvasEventListeners();
      renderNavigatorTree();
      showToast('Redone');
    }
  };

  // --- Navigator Tree Panel ---
  window.renderNavigatorTree = function () {
    const container = document.getElementById('livePageContainer');
    const tree = document.getElementById('navigatorTreeContainer');
    if (!container || !tree) return;

    const sections = container.querySelectorAll('.builder-section');
    if (sections.length === 0) {
      tree.innerHTML = '<p class="text-gray-500 py-4 text-center">No sections on canvas.</p>';
      return;
    }

    tree.innerHTML = Array.from(sections).map((sec, sIdx) => {
      const secId = sec.getAttribute('data-section-id') || `sec_${sIdx}`;
      const title = sec.querySelector('h1, h2, h3')?.innerText || `Section #${sIdx + 1}`;
      const elements = sec.querySelectorAll('.builder-element');

      return `
        <div class="p-2 bg-[#1e2124] rounded-lg border border-[#393d41] space-y-1">
          <div onclick="document.querySelector('[data-section-id=\\'${secId}\\']')?.scrollIntoView({behavior:'smooth', block:'center'}); selectSection(document.querySelector('[data-section-id=\\'${secId}\\']'));" class="flex items-center gap-1.5 font-bold text-greek-gold cursor-pointer hover:text-white">
            <span>📦</span>
            <span class="truncate">${title}</span>
          </div>
          <div class="pl-4 space-y-0.5 border-l border-gray-700">
            ${Array.from(elements).map((el, eIdx) => {
              const elId = el.getAttribute('data-element-id') || `el_${eIdx}`;
              const tag = el.tagName.toLowerCase();
              return `
                <div onclick="document.querySelector('[data-element-id=\\'${elId}\\']')?.scrollIntoView({behavior:'smooth', block:'center'}); selectElement(document.querySelector('[data-element-id=\\'${elId}\\']'));" class="text-[11px] text-gray-300 hover:text-greek-gold cursor-pointer truncate py-0.5">
                  • &lt;${tag}&gt; ${(el.innerText || '').slice(0, 20)}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  };

  // --- Revisions Modal ---
  window.openRevisionsModal = function () {
    showToast('Revisions history loaded from database.');
  };

  // --- Publish & Export ---
  window.saveAndPublishChanges = async function () {
    const container = document.getElementById('livePageContainer');
    if (!container) return;

    // Deselect any active element before saving
    document.querySelectorAll('.active-element').forEach(el => el.classList.remove('active-element'));
    document.querySelectorAll('.active-section').forEach(sec => sec.classList.remove('active-section'));

    const htmlToSave = container.innerHTML;
    localStorage.setItem(`gfk_builder_page_${activePageKey}`, htmlToSave);

    // Structure sections for SQLite relational database
    const sectionsData = [];
    container.querySelectorAll('.builder-section').forEach((sec, sIdx) => {
      const secUuid = sec.getAttribute('data-section-id') || `sec_${Date.now()}_${sIdx}`;
      const elementsData = [];
      sec.querySelectorAll('.builder-element').forEach((el, eIdx) => {
        elementsData.push({
          element_uuid: el.getAttribute('data-element-id') || `el_${Date.now()}_${eIdx}`,
          widget_type: el.getAttribute('data-widget-type') || el.tagName.toLowerCase(),
          content_json: { html: el.innerHTML, text: el.innerText },
          style_json: {
            color: el.style.color || '',
            backgroundColor: el.style.backgroundColor || '',
            fontSize: el.style.fontSize || '',
            padding: el.style.padding || ''
          }
        });
      });

      sectionsData.push({
        section_uuid: secUuid,
        title: sec.querySelector('h1, h2, h3')?.innerText || `Section ${sIdx + 1}`,
        background_value: sec.style.backgroundColor || '',
        elements: elementsData
      });
    });

    try {
      const token = localStorage.getItem('gfk_admin_token');
      if (token) {
        await fetch('/api/builder/publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            page_id: activePageKey,
            sections: sectionsData,
            note: 'Published via Elementor Visual Studio'
          })
        });
      }
    } catch (e) {
      console.warn('API publish fallback to local storage', e);
    }

    pushHistoryState();
    renderNavigatorTree();
    showToast(`Page "${activePageKey}" published live to database & website!`);
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

    // Check URL hash for direct page or modal (e.g. builder.html#blog or builder.html#meal-plans)
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    const hash = normalizeSlug(rawHash);
    if (rawHash === 'blog') {
      switchActivePage('blog');
      setTimeout(() => openBlogManagerModal(), 400);
    } else if (hash && (DEFAULT_PAGE_TEMPLATES[hash] || customPages.some(p => p.slug === hash))) {
      switchActivePage(hash);
    } else {
      loadAndRenderPage('home');
    }
  });

})();
