/**
 * Greek Fit Kitchen - Meal Package Selection, Individual Meal Customization & Automatic Discount System
 * Supports 6, 7, 8, 9, 10+ meal packages with 10% volume discount on >6 meals (7+).
 * Every meal slot is completely independent: dish, 2 sides, extras, and special instructions.
 */

(function () {
  'use strict';

  // Fallback dishes if MENU_ITEMS is loading or empty
  const FALLBACK_DISHES = [
    { id: "grilled-chicken", name: "Grilled Chicken", price: 12.99, image: "images/meals/grilled-chicken.jpg", category: "chicken", dietary: "High Protein, Clean Carb", calories: "520 kcal", protein: "48g Protein" },
    { id: "salmon", name: "Salmon Fillet", price: 15.99, image: "images/meals/salmon.jpg", category: "seafood", dietary: "Omega-3, Heart Healthy", calories: "560 kcal", protein: "44g Protein" },
    { id: "beef-souvlaki", name: "Beef Souvlaki", price: 14.99, image: "images/meals/beef-souvlaki.jpg", category: "beef", dietary: "High Protein, Iron Rich", calories: "580 kcal", protein: "50g Protein" },
    { id: "spinach-feta", name: "Spinach & Feta", price: 14.99, image: "images/meals/spinach-feta-chicken.jpg", category: "chicken", dietary: "High Protein, Signature Dish", calories: "540 kcal", protein: "46g Protein" },
    { id: "stuffed-chicken", name: "Stuffed Chicken", price: 14.99, image: "images/meals/stuffed-chicken.jpg", category: "chicken", dietary: "High Protein, Chef Specialty", calories: "550 kcal", protein: "47g Protein" },
    { id: "chicken-souvlaki", name: "Chicken Souvlaki", price: 13.99, image: "images/meals/chicken-souvlaki.jpg", category: "chicken", dietary: "Lean Protein", calories: "490 kcal", protein: "45g Protein" },
    { id: "chilly-chicken", name: "Chilly Chicken", price: 14.99, image: "images/meals/chilly-chicken.jpg", category: "chicken", dietary: "Spicy High Protein", calories: "530 kcal", protein: "47g Protein" },
    { id: "chicken-fillet", name: "Chicken Fillet", price: 12.99, image: "images/meals/chicken-fillet.jpg", category: "chicken", dietary: "High Protein, Ultra Lean", calories: "480 kcal", protein: "46g Protein" },
    { id: "pork-souvlaki", name: "Pork Souvlaki", price: 13.99, image: "images/meals/pork-souvlaki.jpg", category: "pork", dietary: "Tender Lean Pork", calories: "520 kcal", protein: "42g Protein" },
    { id: "gyros-plate", name: "Gyros Plate", price: 14.99, image: "images/meals/gyros-plate.jpg", category: "beef", dietary: "Traditional Mediterranean", calories: "610 kcal", protein: "46g Protein" },
    { id: "turkey-souvlaki", name: "Turkey Souvlaki", price: 13.99, image: "images/meals/turkey-souvlaki.jpg", category: "chicken", dietary: "Ultra Lean Protein", calories: "460 kcal", protein: "45g Protein" },
    { id: "shrimp-santorini", name: "Shrimp Santorini", price: 16.99, image: "images/meals/shrimp-santorini.jpg", category: "seafood", dietary: "Wild Catch, Mediterranean", calories: "490 kcal", protein: "40g Protein" }
  ];

  const FALLBACK_SIDES = [
    "Rice Pilaf with Veggies",
    "Yellow Basmati Rice",
    "Spinach Mushroom Rice",
    "Orzo in Tomato Sauce",
    "Garlic Butter Baked Potatoes",
    "Lemon Roasted Potatoes",
    "Sweet Potatoes",
    "Mashed Potatoes",
    "Sautéed Veggies",
    "Steamed Veggies",
    "Green Beans in Tomato Sauce"
  ];

  const FALLBACK_ADDONS = [
    { id: "extra-protein", name: "Double Grilled Protein Portion", price: 4.50 },
    { id: "tzatziki", name: "Authentic Greek Tzatziki (4oz cup)", price: 2.49 },
    { id: "feta", name: "Crumbled Dodoni Sheep Feta", price: 2.99 },
    { id: "kalamata", name: "Kalamata Olives & Pepperoncini Cup", price: 1.99 },
    { id: "dressing", name: "Extra Lemon Oregano Dressing", price: 1.49 },
    { id: "extra-side-choice", name: "Additional Side of Choice", price: 4.99 }
  ];

  // Module State
  const builderState = {
    quantity: 7, // Default quantity (>= 6)
    slots: [],   // Array of { slotNumber, dish, side1, side2, extras: [], instructions: "" }
    activeModalSlotIdx: null,
    modalSearchQuery: '',
    modalSelectedCategory: 'all'
  };

  function getMenuItems() {
    if (window.MENU_ITEMS && Array.isArray(window.MENU_ITEMS) && window.MENU_ITEMS.length > 0) {
      return window.MENU_ITEMS;
    }
    return FALLBACK_DISHES;
  }

  function getSidesList() {
    if (window.SIDES_LIST && Array.isArray(window.SIDES_LIST) && window.SIDES_LIST.length > 0) {
      return window.SIDES_LIST;
    }
    return FALLBACK_SIDES;
  }

  function getAddonsList() {
    if (window.ADDONS_LIST && Array.isArray(window.ADDONS_LIST) && window.ADDONS_LIST.length > 0) {
      return window.ADDONS_LIST;
    }
    return FALLBACK_ADDONS;
  }

  /**
   * Initialize or retrieve query params
   */
  function initPackageBuilder() {
    const params = new URLSearchParams(window.location.search);
    const qtyParam = parseInt(params.get('qty'), 10);
    if (!isNaN(qtyParam) && qtyParam >= 6) {
      builderState.quantity = qtyParam;
    } else {
      builderState.quantity = 7; // Default 7 meals (10% discount tier)
    }

    syncSlotsToQuantity();
    renderAll();
  }

  /**
   * Synchronize the slots array to match builderState.quantity exactly.
   * If increasing, append new slots.
   * If decreasing, slice from the end so existing slots 1..N maintain their selections.
   */
  function syncSlotsToQuantity() {
    const targetQty = Math.max(6, builderState.quantity);
    builderState.quantity = targetQty;
    const currentLength = builderState.slots.length;
    const dishes = getMenuItems();
    const sides = getSidesList();

    if (currentLength < targetQty) {
      for (let i = currentLength; i < targetQty; i++) {
        // Pick a default dish from dishes array in round-robin fashion
        const defaultDish = dishes[i % dishes.length] || dishes[0];
        const isPasta = defaultDish.id === 'pasta-al-greco';
        
        // Distinct default sides for varied nutrition
        const defaultSide1 = isPasta ? null : (sides[i % sides.length] || sides[0]);
        const defaultSide2 = isPasta ? null : (sides[(i + 4) % sides.length] || sides[1]);

        builderState.slots.push({
          slotNumber: i + 1,
          dish: { ...defaultDish },
          side1: defaultSide1,
          side2: defaultSide2,
          extras: [],
          instructions: ''
        });
      }
    } else if (currentLength > targetQty) {
      // Reduce quantity: remove from the end, retaining remaining slots' selections
      builderState.slots = builderState.slots.slice(0, targetQty);
    }
  }

  /**
   * Change quantity by delta (+1 or -1)
   */
  function changePackageQuantity(delta) {
    const newQty = builderState.quantity + delta;
    if (newQty < 6) {
      alert("Minimum order is 6 meals. You cannot select fewer than 6 meals.");
      return;
    }
    setPackageQuantity(newQty);
  }

  /**
   * Set exact quantity (e.g. 6, 7, 8, 9, 10, 12)
   */
  function setPackageQuantity(newQty) {
    const target = Math.max(6, parseInt(newQty, 10) || 6);
    builderState.quantity = target;
    syncSlotsToQuantity();
    renderAll();
  }

  /**
   * Pricing calculations
   * Automatic 10% discount on orders containing MORE THAN 6 meals (7+)
   */
  function calculatePricing() {
    const totalMeals = builderState.quantity;
    const dishes = builderState.slots.map(s => s.dish);
    
    // Subtotal of base meal prices
    const mealSubtotal = builderState.slots.reduce((sum, s) => {
      return sum + (s.dish ? Number(s.dish.price || 0) : 0);
    }, 0);

    // Automatic 10% discount when meals > 6
    const isDiscountActive = totalMeals > 6; // Active for 7, 8, 9, 10+ meals
    const discountRate = isDiscountActive ? 0.10 : 0.00;
    const discountAmount = Number((mealSubtotal * discountRate).toFixed(2));
    const discountedMealSubtotal = Number((mealSubtotal - discountAmount).toFixed(2));

    // Customization Extras & Add-ons subtotal
    const extrasSubtotal = builderState.slots.reduce((sum, s) => {
      return sum + s.extras.reduce((eSum, ext) => eSum + Number(ext.price || 0), 0);
    }, 0);

    const taxableSubtotal = Number((discountedMealSubtotal + extrasSubtotal).toFixed(2));
    const hstTax = Number((taxableSubtotal * 0.13).toFixed(2)); // Ontario HST 13%
    const grandTotal = Number((taxableSubtotal + hstTax).toFixed(2));

    // Completion status check
    let completedCount = 0;
    builderState.slots.forEach(slot => {
      if (isSlotComplete(slot)) {
        completedCount++;
      }
    });

    return {
      totalMeals,
      mealSubtotal,
      isDiscountActive,
      discountRate,
      discountAmount,
      discountedMealSubtotal,
      extrasSubtotal,
      taxableSubtotal,
      hstTax,
      grandTotal,
      completedCount,
      allComplete: completedCount === totalMeals
    };
  }

  function isSlotComplete(slot) {
    if (!slot.dish) return false;
    if (slot.dish.id === 'pasta-al-greco') return true; // Pasta does not require sides
    return Boolean(slot.side1 && slot.side2);
  }

  /**
   * Render everything
   */
  function renderAll() {
    renderQuantityHeader();
    renderProgressBar();
    renderSlotCards();
    renderOrderSummary();
  }

  /**
   * Render Package Quantity selector header
   */
  function renderQuantityHeader() {
    const qtyDisplay = document.getElementById('pkgSelectedQtyDisplay');
    const discountBadge = document.getElementById('pkgDiscountBadge');
    const discountNotice = document.getElementById('pkgDiscountNotice');
    const minusBtn = document.getElementById('pkgQtyMinusBtn');

    if (qtyDisplay) {
      qtyDisplay.innerText = `${builderState.quantity} Meals`;
    }

    if (minusBtn) {
      if (builderState.quantity <= 6) {
        minusBtn.disabled = true;
        minusBtn.classList.add('opacity-40', 'cursor-not-allowed');
      } else {
        minusBtn.disabled = false;
        minusBtn.classList.remove('opacity-40', 'cursor-not-allowed');
      }
    }

    const isDiscount = builderState.quantity > 6;
    if (discountBadge) {
      if (isDiscount) {
        discountBadge.innerHTML = `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500 text-white font-extrabold text-xs tracking-wider shadow-sm animate-pulse-subtle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            10% AUTOMATIC DISCOUNT UNLOCKED
          </span>
        `;
      } else {
        discountBadge.innerHTML = `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 font-bold text-xs">
            Standard Base Tier (Add 1 more meal for 10% OFF!)
          </span>
        `;
      }
    }

    if (discountNotice) {
      if (isDiscount) {
        discountNotice.innerHTML = `
          <div class="p-3.5 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-200 text-xs flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">🔥</span>
              <span><strong>10% Volume Savings Applied!</strong> You are saving 10% on every single meal in this ${builderState.quantity}-meal package.</span>
            </div>
            <span class="font-extrabold text-green-700 dark:text-green-300 uppercase tracking-wider text-[11px] bg-white dark:bg-green-900 px-2.5 py-1 rounded-lg border border-green-300 dark:border-green-700">10% OFF</span>
          </div>
        `;
      } else {
        discountNotice.innerHTML = `
          <div class="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">💡</span>
              <span><strong>6-Meal Minimum Package:</strong> Looking to save? Add just 1 more meal (7+ meals) to instantly trigger a <strong>10% automatic discount</strong> across your entire plan!</span>
            </div>
            <button onclick="window.pkgBuilder.setQuantity(7)" class="font-bold text-greek-navyDark bg-greek-gold hover:bg-greek-goldHover px-3 py-1 rounded-lg text-xs transition shadow-sm">
              Upgrade to 7 & Save 10%
            </button>
          </div>
        `;
      }
    }

    // Highlight active preset button if exists
    document.querySelectorAll('[data-pkg-preset]').forEach(btn => {
      const val = parseInt(btn.getAttribute('data-pkg-preset'), 10);
      if (val === builderState.quantity) {
        btn.classList.add('bg-greek-gold', 'text-greek-navyDark', 'border-greek-gold');
        btn.classList.remove('bg-white', 'dark:bg-greek-navy', 'text-gray-700', 'dark:text-gray-200');
      } else {
        btn.classList.remove('bg-greek-gold', 'text-greek-navyDark', 'border-greek-gold');
        btn.classList.add('bg-white', 'dark:bg-greek-navy', 'text-gray-700', 'dark:text-gray-200');
      }
    });
  }

  /**
   * Render dynamic progress tracker and quick navigation pills
   */
  function renderProgressBar() {
    const pricing = calculatePricing();
    const progressText = document.getElementById('pkgProgressText');
    const progressBar = document.getElementById('pkgProgressBarFill');
    const jumpNavContainer = document.getElementById('pkgJumpNavContainer');

    const pct = Math.round((pricing.completedCount / pricing.totalMeals) * 100);

    if (progressText) {
      progressText.innerHTML = `
        <span class="font-bold text-gray-900 dark:text-white">${pricing.completedCount} of ${pricing.totalMeals}</span> meals configured
        <span class="text-xs text-gray-500 dark:text-gray-400">(${pct}% complete)</span>
      `;
    }

    if (progressBar) {
      progressBar.style.width = `${pct}%`;
      if (pricing.allComplete) {
        progressBar.classList.remove('bg-greek-gold');
        progressBar.classList.add('bg-green-500');
      } else {
        progressBar.classList.remove('bg-green-500');
        progressBar.classList.add('bg-greek-gold');
      }
    }

    if (jumpNavContainer) {
      jumpNavContainer.innerHTML = builderState.slots.map((slot, idx) => {
        const complete = isSlotComplete(slot);
        const dishName = slot.dish ? slot.dish.name : `Meal ${idx + 1}`;
        return `
          <button 
            type="button" 
            onclick="window.pkgBuilder.scrollToSlot(${idx})" 
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 border ${
              complete
                ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800 hover:bg-green-100'
                : 'bg-white dark:bg-greek-navy text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-greek-gold'
            }"
          >
            <span>${complete ? '✓' : idx + 1}</span>
            <span class="max-w-[120px] truncate">${dishName}</span>
          </button>
        `;
      }).join('');
    }
  }

  /**
   * Render all Individual Meal Customization Cards
   */
  function renderSlotCards() {
    const container = document.getElementById('pkgSlotsContainer');
    if (!container) return;

    const allDishes = getMenuItems();
    const allSides = getSidesList();
    const allAddons = getAddonsList();

    container.innerHTML = builderState.slots.map((slot, idx) => {
      const isComplete = isSlotComplete(slot);
      const dish = slot.dish;
      const isPasta = dish && dish.id === 'pasta-al-greco';

      // Check for same side selection duplicate
      const hasDuplicateSides = !isPasta && slot.side1 && slot.side2 && slot.side1 === slot.side2;

      return `
        <div id="mealSlotCard_${idx}" class="p-6 sm:p-7 rounded-3xl bg-white dark:bg-greek-navy border ${
          isComplete ? 'border-gray-200 dark:border-white/10' : 'border-amber-300 dark:border-amber-500/40 shadow-sm'
        } shadow-md transition-all relative">
          
          <!-- Card Header -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-white/10 pb-4 mb-5">
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-2xl bg-greek-navy text-greek-gold font-heading font-black text-sm flex items-center justify-center shadow-sm">
                ${idx + 1}
              </span>
              <div>
                <h3 class="font-heading font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white leading-tight">
                  Meal ${idx + 1} of ${builderState.quantity}
                </h3>
                <span class="text-xs text-gray-500 dark:text-gray-400">Independent Selection & Custom Sides</span>
              </div>
            </div>

            <!-- Status Badge -->
            <div>
              ${
                isComplete
                  ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 font-bold text-xs border border-green-200 dark:border-green-800">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Completed
                    </span>`
                  : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 animate-pulse">
                      Pending Choices
                    </span>`
              }
            </div>
          </div>

          <!-- Section 1: Dish Selection -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-extrabold uppercase text-gray-700 dark:text-gray-300 tracking-wider">
                1. Select Main Dish (${allDishes.length} Chef Recipes Available)
              </label>
              <button 
                type="button" 
                onclick="window.pkgBuilder.openDishPicker(${idx})" 
                class="text-xs font-bold text-greek-gold hover:underline flex items-center gap-1"
              >
                <span>Browse Photo Gallery</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              </button>
            </div>

            <!-- Selected Dish Preview Banner with Dropdown -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <img 
                src="${dish ? dish.image + '?v=20261103_2' : 'images/meals/grilled-chicken.jpg'}" 
                alt="${dish ? dish.name : 'Meal'}" 
                class="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-200 dark:border-white/10 flex-shrink-0"
                onerror="this.src='images/meals/grilled-chicken.jpg'"
              />

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <h4 class="font-heading font-extrabold text-base text-gray-900 dark:text-white truncate">
                    ${dish ? dish.name : 'Select a Dish'}
                  </h4>
                  <span class="text-xs font-extrabold text-greek-gold bg-greek-navy px-2.5 py-0.5 rounded-full shadow-sm">
                    $${dish ? Number(dish.price).toFixed(2) : '12.99'} CAD
                  </span>
                </div>

                <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                  ${dish ? dish.description : 'High-protein chef-prepared Greek entree.'}
                </p>

                <!-- Quick Dish Selector Dropdown -->
                <div class="flex items-center gap-2">
                  <select 
                    onchange="window.pkgBuilder.selectDish(${idx}, this.value)"
                    class="w-full p-2.5 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-greek-navy text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greek-gold"
                  >
                    ${allDishes.map(d => `
                      <option value="${d.id}" ${dish && dish.id === d.id ? 'selected' : ''}>
                        ${d.name} — $${Number(d.price).toFixed(2)} CAD (${d.dietary || 'High Protein'})
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Side Selection (Two Sides Per Meal) -->
          <div class="mt-6 pt-5 border-t border-gray-100 dark:border-white/10 space-y-4">
            <div class="flex items-baseline justify-between">
              <label class="block text-xs font-extrabold uppercase text-gray-700 dark:text-gray-300 tracking-wider">
                2. Choose Included Sides (2 Included Complimentary)
              </label>
              <span class="text-[11px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-800">
                FREE WITH PLATE
              </span>
            </div>

            ${
              isPasta
                ? `
                  <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                    <strong>Pasta al Greco Notice:</strong> This dish is a complete scratch-cooked pasta plate and does not require included side selections. You can still select optional extras and add-ons below!
                  </div>
                `
                : `
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Side 1 Selector -->
                    <div>
                      <span class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                        Side 1: Clean Starch / Carbs
                      </span>
                      <select 
                        onchange="window.pkgBuilder.updateSide1(${idx}, this.value)"
                        class="w-full p-3 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-greek-navy text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greek-gold"
                      >
                        <option value="">-- Choose Side 1 --</option>
                        ${allSides.map(s => `
                          <option value="${s}" ${slot.side1 === s ? 'selected' : ''}>${s}</option>
                        `).join('')}
                      </select>
                    </div>

                    <!-- Side 2 Selector -->
                    <div>
                      <span class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                        Side 2: Fresh Veggies / Greens
                      </span>
                      <select 
                        onchange="window.pkgBuilder.updateSide2(${idx}, this.value)"
                        class="w-full p-3 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-greek-navy text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-greek-gold"
                      >
                        <option value="">-- Choose Side 2 --</option>
                        ${allSides.map(s => `
                          <option value="${s}" ${slot.side2 === s ? 'selected' : ''}>${s}</option>
                        `).join('')}
                      </select>
                    </div>
                  </div>

                  ${
                    hasDuplicateSides
                      ? `
                        <p class="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                          ℹ️ You picked <strong>${slot.side1}</strong> for both sides. You will receive a double portion of this side!
                        </p>
                      `
                      : ''
                  }
                `
            }
          </div>

          <!-- Section 3: Extras and Add-ons -->
          <div class="mt-6 pt-5 border-t border-gray-100 dark:border-white/10">
            <div class="flex justify-between items-baseline mb-2">
              <label class="block text-xs font-extrabold uppercase text-gray-700 dark:text-gray-300 tracking-wider">
                3. Optional Extras & Add-ons
              </label>
              <span class="text-[11px] text-gray-500 dark:text-gray-400">Independent per meal</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              ${allAddons.map(addon => {
                const isChecked = slot.extras.some(e => e.id === addon.id);
                return `
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl border ${
                    isChecked
                      ? 'border-greek-gold bg-greek-gold/10'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5'
                  } hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-xs transition">
                    <input 
                      type="checkbox" 
                      value="${addon.id}"
                      ${isChecked ? 'checked' : ''}
                      onchange="window.pkgBuilder.toggleExtra(${idx}, '${addon.id}', this.checked)"
                      class="rounded text-greek-gold focus:ring-greek-gold"
                    />
                    <span class="flex-1 text-gray-800 dark:text-gray-200 font-medium truncate">${addon.name}</span>
                    <span class="font-bold text-greek-navy dark:text-greek-gold">+$${Number(addon.price).toFixed(2)}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Section 4: Special Instructions -->
          <div class="mt-6 pt-5 border-t border-gray-100 dark:border-white/10">
            <label class="block text-xs font-extrabold uppercase text-gray-700 dark:text-gray-300 tracking-wider mb-1.5">
              4. Special Instructions (For Meal ${idx + 1})
            </label>
            <textarea 
              rows="2"
              oninput="window.pkgBuilder.updateInstructions(${idx}, this.value)"
              placeholder="e.g. Sauce on the side, no onions, extra lemon, less seasoning..."
              class="w-full p-3 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-greek-navy text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-greek-gold"
            >${slot.instructions || ''}</textarea>

            <!-- Quick helper chips -->
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span class="text-[11px] text-gray-400 self-center mr-1">Suggestions:</span>
              ${['Sauce on side', 'No onions', 'Less salt', 'Extra lemon', 'Well done'].map(chip => `
                <button 
                  type="button" 
                  onclick="window.pkgBuilder.appendInstruction(${idx}, '${chip}')"
                  class="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 hover:bg-greek-gold hover:text-greek-navyDark text-gray-700 dark:text-gray-300 text-[11px] transition"
                >
                  + ${chip}
                </button>
              `).join('')}
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  /**
   * Render Live Order Summary & Dynamic Pricing Breakdown
   */
  function renderOrderSummary() {
    const container = document.getElementById('pkgOrderSummaryContainer');
    if (!container) return;

    const pricing = calculatePricing();

    container.innerHTML = `
      <div class="bg-white dark:bg-greek-navy rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 sticky top-28">
        
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4 mb-4">
          <div>
            <span class="text-xs font-bold text-greek-gold uppercase tracking-wider">Live Package Builder</span>
            <h3 class="font-heading font-extrabold text-xl text-gray-900 dark:text-white">
              ${pricing.totalMeals}-Meal Custom Plan
            </h3>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
            pricing.isDiscountActive
              ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
              : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
          }">
            ${pricing.isDiscountActive ? '10% Discount Active' : 'Base Tier (6 Meals)'}
          </span>
        </div>

        <!-- Itemized Meal Review (Scrollable) -->
        <div class="mb-5">
          <div class="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            <span>Your Configured Meals (${pricing.completedCount}/${pricing.totalMeals})</span>
          </div>
          <div class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            ${builderState.slots.map((slot, idx) => {
              const complete = isSlotComplete(slot);
              const dishName = slot.dish ? slot.dish.name : 'No Dish Selected';
              const price = slot.dish ? `$${Number(slot.dish.price).toFixed(2)}` : '$0.00';
              const isPasta = slot.dish && slot.dish.id === 'pasta-al-greco';
              const sidesText = isPasta 
                ? 'Complete Pasta Dish' 
                : `${slot.side1 || 'Side 1 Pending'} + ${slot.side2 || 'Side 2 Pending'}`;
              
              const extrasText = slot.extras.length > 0 
                ? `(+${slot.extras.map(e => e.name).join(', ')})` 
                : '';

              return `
                <div class="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs flex items-start justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <span class="font-black text-greek-gold">M${idx + 1}:</span>
                      <strong class="text-gray-900 dark:text-white truncate">${dishName}</strong>
                      ${complete ? '<span class="text-green-600 text-[10px]">✓</span>' : '<span class="text-amber-500 text-[10px]">⚠️</span>'}
                    </div>
                    <span class="block text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">${sidesText} ${extrasText}</span>
                    ${slot.instructions ? `<span class="block text-[10px] text-gray-400 italic truncate">Note: "${slot.instructions}"</span>` : ''}
                  </div>
                  <span class="font-bold text-gray-700 dark:text-gray-300 flex-shrink-0">${price}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Pricing Breakdown Table -->
        <div class="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-white/10 pt-4 mb-6">
          <div class="flex justify-between">
            <span>Meal Subtotal (${pricing.totalMeals} Plates):</span>
            <span class="font-bold text-gray-900 dark:text-white">$${pricing.mealSubtotal.toFixed(2)} CAD</span>
          </div>

          <!-- Volume Discount Row -->
          ${
            pricing.isDiscountActive
              ? `
                <div class="flex justify-between text-green-700 dark:text-green-400 font-extrabold bg-green-50 dark:bg-green-950/40 p-2 rounded-xl border border-green-200 dark:border-green-800">
                  <span>Volume Discount (10% OFF 7+ Meals):</span>
                  <span>-$${pricing.discountAmount.toFixed(2)} CAD</span>
                </div>
              `
              : `
                <div class="flex justify-between text-gray-400 text-[11px]">
                  <span>Volume Discount:</span>
                  <span>$0.00 (Add 1 more meal for 10% OFF)</span>
                </div>
              `
          }

          ${
            pricing.extrasSubtotal > 0
              ? `
                <div class="flex justify-between text-gray-700 dark:text-gray-200">
                  <span>Custom Extras & Add-ons:</span>
                  <span class="font-bold">+$${pricing.extrasSubtotal.toFixed(2)} CAD</span>
                </div>
              `
              : ''
          }

          <div class="flex justify-between text-[11px]">
            <span>Ontario HST (13%):</span>
            <span class="font-semibold text-gray-700 dark:text-gray-300">$${pricing.hstTax.toFixed(2)} CAD</span>
          </div>

          <div class="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-white/10">
            <span>Estimated Total:</span>
            <span class="text-greek-navy dark:text-greek-gold font-heading text-xl">
              $${pricing.grandTotal.toFixed(2)} CAD
            </span>
          </div>
        </div>

        <!-- Add Package to Cart Button -->
        <button 
          type="button" 
          onclick="window.pkgBuilder.addPackageToCart()"
          ${!pricing.allComplete ? 'disabled' : ''}
          class="w-full py-4 rounded-2xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
            pricing.allComplete
              ? 'bg-greek-gold hover:bg-greek-goldHover text-greek-navyDark cursor-pointer shadow-greek-gold/20'
              : 'bg-gray-300 dark:bg-white/10 text-gray-500 cursor-not-allowed opacity-60'
          }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <span>${
            pricing.allComplete 
              ? `Add ${pricing.totalMeals}-Meal Package to Cart — $${pricing.grandTotal.toFixed(2)} CAD`
              : `Complete ${pricing.totalMeals - pricing.completedCount} more meal(s) to order`
          }</span>
        </button>

        <p class="text-[11px] text-gray-400 text-center mt-3">
          Minimum 6 meals. All meals are vacuum-sealed & batch delivered across Toronto & GTA.
        </p>

      </div>
    `;
  }

  /**
   * Slot actions
   */
  function selectDishForSlot(slotIdx, dishId) {
    const dishes = getMenuItems();
    const found = dishes.find(d => d.id === dishId);
    if (!found || !builderState.slots[slotIdx]) return;

    builderState.slots[slotIdx].dish = { ...found };

    // If switched to Pasta al Greco, reset sides
    if (found.id === 'pasta-al-greco') {
      builderState.slots[slotIdx].side1 = null;
      builderState.slots[slotIdx].side2 = null;
    } else {
      const sides = getSidesList();
      if (!builderState.slots[slotIdx].side1) builderState.slots[slotIdx].side1 = sides[0];
      if (!builderState.slots[slotIdx].side2) builderState.slots[slotIdx].side2 = sides[1];
    }

    renderAll();
  }

  function updateSide1ForSlot(slotIdx, sideName) {
    if (!builderState.slots[slotIdx]) return;
    builderState.slots[slotIdx].side1 = sideName;
    renderAll();
  }

  function updateSide2ForSlot(slotIdx, sideName) {
    if (!builderState.slots[slotIdx]) return;
    builderState.slots[slotIdx].side2 = sideName;
    renderAll();
  }

  function toggleExtraForSlot(slotIdx, addonId, isChecked) {
    if (!builderState.slots[slotIdx]) return;
    const allAddons = getAddonsList();
    const addon = allAddons.find(a => a.id === addonId);
    if (!addon) return;

    if (isChecked) {
      if (!builderState.slots[slotIdx].extras.some(e => e.id === addonId)) {
        builderState.slots[slotIdx].extras.push(addon);
      }
    } else {
      builderState.slots[slotIdx].extras = builderState.slots[slotIdx].extras.filter(e => e.id !== addonId);
    }
    renderAll();
  }

  function updateInstructionsForSlot(slotIdx, text) {
    if (!builderState.slots[slotIdx]) return;
    builderState.slots[slotIdx].instructions = text;
    // Don't re-render full card while typing, just update summary
    renderOrderSummary();
    renderProgressBar();
  }

  function appendInstructionForSlot(slotIdx, chipText) {
    if (!builderState.slots[slotIdx]) return;
    const current = builderState.slots[slotIdx].instructions || '';
    if (current.includes(chipText)) return;
    builderState.slots[slotIdx].instructions = current ? `${current}, ${chipText}` : chipText;
    renderAll();
  }

  function scrollToSlot(slotIdx) {
    const el = document.getElementById(`mealSlotCard_${slotIdx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-greek-gold');
      setTimeout(() => el.classList.remove('ring-2', 'ring-greek-gold'), 1500);
    }
  }

  /**
   * Visual Dish Picker Modal
   */
  function openDishPicker(slotIdx) {
    builderState.activeModalSlotIdx = slotIdx;
    const modal = document.getElementById('pkgDishPickerModal');
    if (!modal) return;

    renderDishPickerGrid();
    modal.classList.remove('hidden');
  }

  function closeDishPicker() {
    const modal = document.getElementById('pkgDishPickerModal');
    if (modal) modal.classList.add('hidden');
    builderState.activeModalSlotIdx = null;
  }

  function renderDishPickerGrid() {
    const grid = document.getElementById('pkgDishPickerGrid');
    const headerTitle = document.getElementById('pkgDishPickerModalTitle');
    if (!grid) return;

    if (headerTitle && builderState.activeModalSlotIdx !== null) {
      headerTitle.innerText = `Choose Dish for Meal ${builderState.activeModalSlotIdx + 1}`;
    }

    const allDishes = getMenuItems();
    const query = (builderState.modalSearchQuery || '').toLowerCase().trim();
    const cat = builderState.modalSelectedCategory || 'all';

    const filtered = allDishes.filter(d => {
      const matchCat = cat === 'all' || d.category === cat;
      const matchQuery = !query || d.name.toLowerCase().includes(query) || (d.description && d.description.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-gray-400">
          <p class="font-bold">No dishes found matching "${query}"</p>
          <button onclick="window.pkgBuilder.resetPickerFilter()" class="mt-2 text-xs text-greek-gold font-bold underline">Show all dishes</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(dish => `
      <div class="p-3.5 rounded-2xl bg-white dark:bg-greek-navy border border-gray-200 dark:border-white/10 shadow-sm flex flex-col justify-between hover:border-greek-gold transition group">
        <div>
          <div class="relative rounded-xl overflow-hidden mb-3 aspect-[4/3]">
            <img 
              src="${dish.image}?v=20261103_2" 
              alt="${dish.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
              onerror="this.src='images/meals/grilled-chicken.jpg'"
            />
            <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-greek-navy text-greek-gold shadow">
              $${Number(dish.price).toFixed(2)} CAD
            </span>
          </div>

          <h4 class="font-heading font-extrabold text-sm text-gray-900 dark:text-white leading-tight">
            ${dish.name}
          </h4>
          <span class="inline-block text-[11px] font-bold text-greek-lime mt-0.5">
            ${dish.dietary || 'High Protein'}
          </span>
          <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            ${dish.description || ''}
          </p>
        </div>

        <button 
          type="button" 
          onclick="window.pkgBuilder.confirmPickerDish('${dish.id}')"
          class="mt-4 w-full py-2.5 rounded-xl bg-greek-navy hover:bg-greek-gold text-white hover:text-greek-navyDark font-extrabold text-xs transition shadow-sm"
        >
          Select for Meal ${builderState.activeModalSlotIdx !== null ? builderState.activeModalSlotIdx + 1 : ''}
        </button>
      </div>
    `).join('');
  }

  function confirmPickerDish(dishId) {
    if (builderState.activeModalSlotIdx !== null) {
      selectDishForSlot(builderState.activeModalSlotIdx, dishId);
    }
    closeDishPicker();
  }

  function setPickerCategory(cat) {
    builderState.modalSelectedCategory = cat;
    renderDishPickerGrid();
  }

  function setPickerSearch(query) {
    builderState.modalSearchQuery = query;
    renderDishPickerGrid();
  }

  function resetPickerFilter() {
    builderState.modalSearchQuery = '';
    builderState.modalSelectedCategory = 'all';
    const input = document.getElementById('pkgDishPickerSearchInput');
    if (input) input.value = '';
    renderDishPickerGrid();
  }

  /**
   * Add Complete Package to Cart
   * Validates all slots, builds structured cart items with package metadata,
   * adds to state.cart, saves to localStorage, and updates UI.
   */
  function addPackageToCart() {
    const pricing = calculatePricing();
    if (!pricing.allComplete) {
      alert(`Please complete all ${pricing.totalMeals} meals before adding your package to cart.`);
      return;
    }

    if (!window.state) {
      window.state = { cart: [] };
    }
    if (!Array.isArray(window.state.cart)) {
      window.state.cart = [];
    }

    const packageId = 'pkg_' + Date.now();
    const packageName = `${pricing.totalMeals}-Meal Custom Package`;

    // Package discount rate (10% if > 6 meals)
    const discountRate = pricing.isDiscountActive ? 0.10 : 0.00;

    // Convert each configured meal slot into a dedicated cart plate item
    builderState.slots.forEach((slot, idx) => {
      const dish = slot.dish;
      const extraSidesList = slot.extras.filter(e => e.id === 'extra-side-choice').map(e => e.name);
      const addonsList = slot.extras.filter(e => e.id !== 'extra-side-choice');

      const extraSidesPrice = extraSidesList.length * 4.99;
      const addonsPrice = addonsList.reduce((sum, a) => sum + Number(a.price || 0), 0);
      const unitPrice = Number((Number(dish.price) + extraSidesPrice + addonsPrice).toFixed(2));

      const cartItem = {
        cartItemId: `item_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
        mealId: dish.id,
        name: dish.name,
        category: dish.category || 'plate',
        image: dish.image,
        basePrice: Number(dish.price),
        unitPrice: unitPrice,
        quantity: 1,
        side1: slot.side1 || (dish.id === 'pasta-al-greco' ? null : 'Rice Pilaf with Veggies'),
        side2: slot.side2 || (dish.id === 'pasta-al-greco' ? null : 'Sautéed Veggies'),
        extraSides: extraSidesList,
        extraSidesPrice: extraSidesPrice,
        addons: addonsList,
        addonsPrice: addonsPrice,
        specialInstructions: slot.instructions || '',
        // Package Metadata
        packageId: packageId,
        packageName: packageName,
        packageSlot: idx + 1,
        packageTotalMeals: pricing.totalMeals,
        packageDiscountRate: discountRate
      };

      window.state.cart.push(cartItem);
    });

    // Save cart
    if (typeof window.saveCart === 'function') {
      window.saveCart();
    } else {
      localStorage.setItem('gfk_cart', JSON.stringify(window.state.cart));
    }

    // Update Cart UI
    if (typeof window.updateCartUI === 'function') {
      window.updateCartUI();
    }

    // Open Cart Drawer to show items
    if (typeof window.openCartDrawer === 'function') {
      window.openCartDrawer();
    }

    // Friendly confirmation toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-50 bg-greek-navy text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-greek-gold flex items-center gap-3 animate-bounce';
    toast.innerHTML = `
      <span class="text-2xl">✓</span>
      <div>
        <p class="font-extrabold text-sm">${pricing.totalMeals}-Meal Package Added!</p>
        <p class="text-xs text-white/80">${pricing.isDiscountActive ? '10% volume discount applied!' : 'Ready for checkout.'}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Export to window
  window.pkgBuilder = {
    init: initPackageBuilder,
    setQuantity: setPackageQuantity,
    changeQuantity: changePackageQuantity,
    selectDish: selectDishForSlot,
    updateSide1: updateSide1ForSlot,
    updateSide2: updateSide2ForSlot,
    toggleExtra: toggleExtraForSlot,
    updateInstructions: updateInstructionsForSlot,
    appendInstruction: appendInstructionForSlot,
    scrollToSlot: scrollToSlot,
    openDishPicker: openDishPicker,
    closeDishPicker: closeDishPicker,
    confirmPickerDish: confirmPickerDish,
    setPickerCategory: setPickerCategory,
    setPickerSearch: setPickerSearch,
    resetPickerFilter: resetPickerFilter,
    addPackageToCart: addPackageToCart
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPackageBuilder);
  } else {
    initPackageBuilder();
  }

})();
