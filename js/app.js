/**
 * Greek Fit Kitchen - Enterprise E-Commerce & Operations Engine
 * BIG GREEK FLAVOUR. ZERO MEAL PREP.
 * Toronto & GTA | leanmeal.ca
 */

// -------------------------------------------------------------
// 1. DATA MODELS & INITIAL REFERENCE SPECIFICATION
// -------------------------------------------------------------

const DEFAULT_MENU_ITEMS = [
  {
    id: "grilled-chicken",
    name: "Grilled Chicken",
    price: 12.99,
    category: "chicken",
    image: "images/meals/grilled-chicken.jpg",
    description: "Tender herb-marinated chicken breast flame-grilled with Greek oregano, garlic, and extra virgin olive oil.",
    dietary: "High Protein, Gluten-Free",
    available: true
  },
  {
    id: "chilly-chicken",
    name: "Chilly Chicken",
    price: 13.99,
    category: "chicken",
    image: "images/meals/chilly-chicken.jpg",
    description: "Lean chicken breast tossed in a zesty Mediterranean chili and herb glaze for a vibrant metabolic kick.",
    dietary: "High Protein, Spicy",
    available: true
  },
  {
    id: "salmon",
    name: "Salmon",
    price: 14.99,
    category: "seafood",
    image: "images/meals/salmon.jpg",
    description: "Pan-seared Atlantic salmon fillet with sea salt, cracked black pepper, oregano, and fresh lemon essence.",
    dietary: "Omega-3, Heart Healthy, Keto Friendly",
    available: true
  },
  {
    id: "spinach-feta",
    name: "Spinach & Feta",
    price: 14.99,
    category: "chicken",
    image: "images/meals/spinach-feta-chicken.jpg",
    description: "Lean chicken breast stuffed with authentic Greek feta, wilted baby spinach, and roasted garlic cloves.",
    dietary: "High Protein, Signature Dish",
    available: true
  },
  {
    id: "stuffed-chicken",
    name: "Stuffed Chicken",
    price: 14.99,
    category: "chicken",
    image: "images/meals/stuffed-chicken.jpg",
    description: "Tender chicken breast generously stuffed with authentic Greek feta, fresh garden herbs, and roasted garlic, baked to golden perfection.",
    dietary: "High Protein, Chef Specialty",
    available: true
  },
  {
    id: "tandoori-chicken",
    name: "Tandoori Chicken",
    price: 14.99,
    category: "chicken",
    image: "images/meals/tandoori-chicken.jpg",
    description: "Greek-yogurt and aromatic spice-marinated chicken fillet, roasted tender with caramelized edges.",
    dietary: "High Protein, Lean",
    available: true
  },
  {
    id: "chicken-mushroom",
    name: "Chicken Mushroom Sauce",
    price: 13.99,
    category: "chicken",
    image: "images/meals/chicken-mushroom.jpg",
    description: "Succulent chicken breast smothered in a savory, simmered cremini mushroom reduction with Greek herbs.",
    dietary: "High Protein",
    available: true
  },
  {
    id: "chicken-fajita",
    name: "Chicken Fajita",
    price: 12.99,
    category: "chicken",
    image: "images/meals/chicken-fajita.jpg",
    description: "Sliced grilled chicken breast sautéed with sweet bell peppers, red onions, and smoky Mediterranean spices.",
    dietary: "High Protein, Nutrient Dense",
    available: true
  },
  {
    id: "beef-fajita",
    name: "Beef Fajita",
    price: 14.99,
    category: "beef",
    image: "images/meals/beef-fajita.jpg",
    description: "Char-broiled strips of tender Canadian flank beef seared with colorful sweet peppers and charred sweet onions.",
    dietary: "High Protein, Iron Rich",
    available: true
  },
  {
    id: "beef-mushroom",
    name: "Beef Mushroom Sauce",
    price: 14.99,
    category: "beef",
    image: "images/meals/beef-mushroom.jpg",
    description: "Slow-braised lean beef medallions topped with a rich garlic mushroom glaze and garden fresh parsley.",
    dietary: "High Protein, Hearty",
    available: true
  },
  {
    id: "smoked-turkey",
    name: "Smoked Turkey Breast",
    price: 13.99,
    category: "chicken",
    image: "images/meals/smoked-turkey.jpg",
    description: "Naturally hardwood-smoked lean turkey breast carved into tender slices with fragrant rosemary jus.",
    dietary: "Ultra Lean, High Protein",
    available: true
  },
  {
    id: "chicken-leg",
    name: "Chicken Leg Plate",
    price: 10.99,
    category: "chicken",
    image: "images/meals/chicken-leg.jpg",
    description: "Slow-roasted bone-in chicken leg quarters seasoned with aromatic garlic, wild thyme, and fresh lemon.",
    dietary: "High Protein, Traditional",
    available: true
  },
  {
    id: "chicken-fillet",
    name: "Chicken Fillet",
    price: 12.99,
    category: "chicken",
    image: "images/meals/chicken-fillet.jpg",
    description: "Ultra-lean grilled chicken breast fillet prepared simply with Greek lemon, sea salt, and extra virgin olive oil.",
    dietary: "Clean Macros, Low Fat",
    available: true
  },
  {
    id: "veggie-souvlaki",
    name: "Veggie Souvlaki",
    price: 11.99,
    category: "vegetarian",
    image: "images/meals/veggie-souvlaki.jpg",
    description: "Skewered char-grilled zucchini, bell peppers, cremini mushrooms, and red onions with Greek herb marinade.",
    dietary: "Vegetarian, Plant Powered",
    available: true
  },
  {
    id: "chicken-souvlaki",
    name: "Chicken Souvlaki Plate",
    price: 12.99,
    category: "chicken",
    image: "images/meals/chicken-souvlaki.jpg",
    description: "Traditional skewers of cubed chicken breast marinated in lemon, garlic, white wine, and Greek mountain oregano.",
    dietary: "Best Seller, High Protein",
    available: true
  },
  {
    id: "beef-souvlaki",
    name: "Beef Souvlaki Plate",
    price: 13.99,
    category: "beef",
    image: "images/meals/beef-souvlaki.jpg",
    description: "Tender sirloin steak skewers grilled over open flame with extra virgin olive oil and fragrant spices.",
    dietary: "Premium Beef, High Protein",
    available: true
  },
  {
    id: "pork-souvlaki",
    name: "Pork Souvlaki Plate",
    price: 9.99,
    category: "pork",
    image: "images/meals/pork-souvlaki.jpg",
    description: "Authentic Greek street-style marinated pork tenderloin skewers with vibrant lemon and crushed oregano.",
    dietary: "Authentic Greek, High Protein",
    available: true
  },
  {
    id: "spinach-pie",
    name: "Spinach Pie Dinner",
    price: 12.99,
    category: "vegetarian",
    image: "images/meals/spinach-pie.jpg",
    description: "Traditional homemade Spanakopita with flaky phyllo pastry, organic baby spinach, scallions, and sheep feta.",
    dietary: "Vegetarian, Handcrafted",
    available: true
  },
  {
    id: "pasta-al-greco",
    name: "Pasta al Greco",
    price: 9.99,
    category: "vegetarian",
    image: "images/meals/pasta-al-greco.jpg",
    description: "Penne pasta tossed in rich Greek roasted tomato sauce, virgin olive oil, fragrant basil, and crumbled sheep feta.",
    dietary: "Vegetarian, Pasta Dish (Sides Excluded)",
    available: true
  },
  {
    id: "smoked-pork-loin",
    name: "Smoked Pork Loin",
    price: 12.99,
    category: "pork",
    image: "images/meals/smoked-pork-loin.jpg",
    description: "Tender center-cut pork loin, lightly smoked with natural applewood and served with aromatic citrus jus.",
    dietary: "High Protein, Lean Cuts",
    available: true
  },
  {
    id: "turkey-souvlaki",
    name: "Turkey Souvlaki Plate",
    price: 13.99,
    category: "chicken",
    image: "images/meals/turkey-souvlaki.jpg",
    description: "Lean cubed turkey breast skewers flame-broiled with lemon, garlic, Greek sea salt, and extra virgin olive oil.",
    dietary: "Ultra Clean, High Protein",
    available: true
  }
];

const DEFAULT_SIDES = [
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

const DEFAULT_ADDONS = [
  { id: "extra-protein", name: "Double Grilled Protein Portion", price: 4.50 },
  { id: "tzatziki", name: "Authentic Greek Tzatziki (4oz cup)", price: 2.49 },
  { id: "feta", name: "Crumbled Dodoni Sheep Feta", price: 2.99 },
  { id: "kalamata", name: "Kalamata Olives & Pepperoncini Cup", price: 1.99 },
  { id: "dressing", name: "Extra Lemon Oregano Dressing", price: 1.49 }
];

const DEFAULT_PACKAGES = [
  {
    id: "pkg-6-meal",
    name: "6-Meal Starter Plan",
    mealCount: 6,
    price: 59.94,
    pricePerMeal: 9.99,
    tagline: "Perfect for work lunches Monday through Saturday",
    description: "Select any 6 chef-crafted high-protein Greek meals. Includes 2 clean sides per eligible dish.",
    popular: true,
    badge: "Most Popular Starter"
  },
  {
    id: "pkg-10-meal",
    name: "10-Meal Performance Plan",
    mealCount: 10,
    price: 119.90,
    pricePerMeal: 11.99,
    tagline: "Lunch & Dinner recovery fuel for active athletes",
    description: "Choose 10 customizable meals. Automatically qualifies for our 10% volume discount savings.",
    popular: false,
    badge: "Save 10%"
  },
  {
    id: "pkg-14-meal",
    name: "14-Meal Athlete / Couple Plan",
    mealCount: 14,
    price: 159.90,
    pricePerMeal: 11.42,
    tagline: "Complete nutrition for couples or heavy training weeks",
    description: "14 macro-balanced Greek dishes covering full weeks with zero cooking or grocery runs.",
    popular: false,
    badge: "Best Value"
  }
];

const DEFAULT_COUPONS = [
  { code: "GREEK10", type: "percent", value: 10, description: "10% Off Entire Order", minMeals: 6, active: true },
  { code: "LEAN15", type: "percent", value: 15, description: "15% Off First Order", minMeals: 6, active: true },
  { code: "FITFREE", type: "free_delivery", value: 0, description: "Free GTA Doorstep Delivery", minMeals: 6, active: true },
  { code: "SAVE5", type: "dollar", value: 5.00, description: "$5.00 Off Order", minMeals: 6, active: true }
];

const DEFAULT_CONFIG = {
  minMeals: 6,
  packageStartPrice: 59.94,
  volumeDiscountThreshold: 7,
  volumeDiscountRate: 0.10,
  extraSidePrice: 4.99,
  taxRate: 0.13, // 13% Ontario HST
  taxEnabled: true,
  // Delivery Fee Rules (Exact formula specified by business)
  deliveryTier1MaxKm: 2.0,   // Free up to 2 km
  deliveryTier1Fee: 0.00,
  deliveryTier2MaxKm: 5.0,   // $5 over 2–5 km
  deliveryTier2Fee: 5.00,
  deliveryPerKmRate: 1.00,   // $1/km for the full distance above 5 km
  maxDeliveryDistanceKm: 35.0,
  kitchenAddress: "3575 Lake Shore Blvd W, Etobicoke, ON M8W 1P5",
  kitchenCutoffSunday: "Friday 11:59 PM EST",
  kitchenCutoffWednesday: "Monday 11:59 PM EST"
};

const DEFAULT_ORDERS = [
  {
    orderId: "GFK-892110",
    date: "2026-11-03 14:22",
    customerName: "Alex Papadopoulos",
    email: "alex@example.ca",
    phone: "(416) 555-0199",
    address: "250 Queens Quay West, Apt 810, Toronto, ON M5J 2R9",
    distanceKm: 12.4,
    deliveryMethod: "delivery",
    batchDay: "Next Sunday Batch (1:00 PM – 4:00 PM)",
    status: "Kitchen Prep",
    paymentStatus: "Paid (VISA •••• 4242)",
    mealsCount: 7,
    items: [
      { name: "Grilled Chicken", qty: 2, sides: ["Lemon Roasted Potatoes", "Sautéed Veggies"], price: 12.99 },
      { name: "Salmon", qty: 2, sides: ["Rice Pilaf with Veggies", "Steamed Veggies"], price: 14.99 },
      { name: "Spinach & Feta", qty: 2, sides: ["Garlic Butter Baked Potatoes", "Green Beans in Tomato Sauce"], price: 14.99 },
      { name: "Stuffed Chicken", qty: 1, sides: ["Yellow Basmati Rice", "Sautéed Veggies"], price: 14.99 }
    ],
    mealsSubtotal: 98.93,
    extraSidesSubtotal: 0.00,
    addonsSubtotal: 0.00,
    volumeDiscount: 9.89,
    couponDiscount: 0.00,
    tax: 11.58,
    deliveryFee: 12.40,
    grandTotal: 113.02
  },
  {
    orderId: "GFK-892111",
    date: "2026-11-03 16:45",
    customerName: "Dimitri Vlahos",
    email: "dimitri@vlahos.ca",
    phone: "(647) 555-8392",
    address: "3575 Lake Shore Blvd W, Etobicoke (Kitchen Pickup)",
    distanceKm: 0.1,
    deliveryMethod: "pickup",
    batchDay: "Next Wednesday Batch (4:00 PM – 7:00 PM)",
    status: "Received",
    paymentStatus: "Paid (MasterCard •••• 5519)",
    mealsCount: 6,
    items: [
      { name: "Chicken Souvlaki Plate", qty: 3, sides: ["Rice Pilaf with Veggies", "Lemon Roasted Potatoes"], price: 12.99 },
      { name: "Beef Souvlaki Plate", qty: 3, sides: ["Garlic Butter Baked Potatoes", "Sautéed Veggies"], price: 13.99 }
    ],
    mealsSubtotal: 80.94,
    extraSidesSubtotal: 4.99,
    addonsSubtotal: 4.50,
    volumeDiscount: 0.00,
    couponDiscount: 0.00,
    tax: 11.76,
    deliveryFee: 0.00,
    grandTotal: 102.19
  },
  {
    orderId: "GFK-892108",
    date: "2026-11-02 11:15",
    customerName: "Elena Rostova",
    email: "elena.r@lifestyle.ca",
    phone: "(416) 555-4421",
    address: "85 Royal York Rd, Etobicoke, ON M8V 2T7",
    distanceKm: 1.8,
    deliveryMethod: "delivery",
    batchDay: "Completed Sunday Batch",
    status: "Delivered",
    paymentStatus: "Paid (Apple Pay •••• 9012)",
    mealsCount: 10,
    items: [
      { name: "Salmon", qty: 5, sides: ["Steamed Veggies", "Sweet Potatoes"], price: 14.99 },
      { name: "Stuffed Chicken", qty: 5, sides: ["Spinach Mushroom Rice", "Sautéed Veggies"], price: 14.99 }
    ],
    mealsSubtotal: 149.90,
    extraSidesSubtotal: 0.00,
    addonsSubtotal: 0.00,
    volumeDiscount: 14.99,
    couponDiscount: 0.00,
    tax: 17.54,
    deliveryFee: 0.00, // <= 2 km Free
    grandTotal: 152.45
  }
];

const DEFAULT_ACTIVITY_LOGS = [
  { timestamp: "2026-11-03 23:01", role: "Admin", action: "Menu Update", details: "Added Stuffed Chicken ($14.99 CAD) to active menu." },
  { timestamp: "2026-11-03 19:06", role: "Admin", action: "UI Customization", details: "Removed category filter tabs above menu grid." },
  { timestamp: "2026-11-03 16:45", role: "Customer", action: "New Order", details: "Order #GFK-892111 received from Dimitri Vlahos ($102.19 CAD)." },
  { timestamp: "2026-11-03 14:22", role: "Customer", action: "New Order", details: "Order #GFK-892110 received from Alex Papadopoulos ($113.02 CAD)." }
];

// -------------------------------------------------------------
// 2. STATE INITIALIZATION & LOCAL PERSISTENCE
// -------------------------------------------------------------

function loadMenuItems() {
  const saved = localStorage.getItem('gfk-menu-items');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = false;
        DEFAULT_MENU_ITEMS.forEach(defaultItem => {
          const existing = parsed.find(item => item.id === defaultItem.id);
          if (!existing) {
            parsed.push(JSON.parse(JSON.stringify(defaultItem)));
            changed = true;
          } else {
            if (existing.image !== defaultItem.image) {
              existing.image = defaultItem.image;
              changed = true;
            }
          }
        });
        if (changed) {
          localStorage.setItem('gfk-menu-items', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not parse saved menu items:", e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS));
}

function loadSides() {
  const saved = localStorage.getItem('gfk-sides-list');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Could not parse saved sides:", e);
    }
  }
  return [...DEFAULT_SIDES];
}

function loadAddons() {
  const saved = localStorage.getItem('gfk-addons-list');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Could not parse saved addons:", e);
    }
  }
  return [...DEFAULT_ADDONS];
}

function loadPackages() {
  const saved = localStorage.getItem('gfk-packages-list');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Could not parse saved packages:", e);
    }
  }
  return [...DEFAULT_PACKAGES];
}

function loadCoupons() {
  const saved = localStorage.getItem('gfk-coupons-list');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Could not parse saved coupons:", e);
    }
  }
  return [...DEFAULT_COUPONS];
}

function loadOrders() {
  const saved = localStorage.getItem('gfk-orders');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Could not parse saved orders:", e);
    }
  }
  return [...DEFAULT_ORDERS];
}

function loadActivityLogs() {
  const saved = localStorage.getItem('gfk-activity-logs');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Could not parse saved activity logs:", e);
    }
  }
  return [...DEFAULT_ACTIVITY_LOGS];
}

function loadConfig() {
  const saved = localStorage.getItem('gfk-site-config');
  if (saved) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Could not parse saved config:", e);
    }
  }
  return { ...DEFAULT_CONFIG };
}

// Global active singletons
let MENU_ITEMS = loadMenuItems();
let SIDES_LIST = loadSides();
let ADDONS_LIST = loadAddons();
let PACKAGES_LIST = loadPackages();
let COUPONS_LIST = loadCoupons();
let ORDERS_LIST = loadOrders();
let ACTIVITY_LOGS = loadActivityLogs();
let CONFIG = loadConfig();

let state = {
  theme: 'light',
  cart: [],
  selectedCategory: 'all',
  searchQuery: '',
  customizingMeal: null,
  editingCartItemId: null,
  activeSlide: 0,
  deliveryMethod: 'delivery',
  calculatedDistanceKm: 8.0,
  calculatedDeliveryFee: calculateTieredDeliveryFee(8.0, 'delivery'),
  selectedBatch: 'sunday',
  selectedDeliveryTimeSlot: '1:00 PM – 4:00 PM',
  appliedCoupon: null,
  staffRole: localStorage.getItem('gfk-staff-role') || 'admin'
};

// Expose globals for modules (e.g. package builder)
window.MENU_ITEMS = MENU_ITEMS;
window.SIDES_LIST = SIDES_LIST;
window.ADDONS_LIST = ADDONS_LIST;
window.PACKAGES_LIST = PACKAGES_LIST;
window.COUPONS_LIST = COUPONS_LIST;
window.CONFIG = CONFIG;
window.state = state;

const GTA_FSA_TABLE = {
  "M8W": 1.8, "M8V": 3.2, "M8Z": 4.5, "M8X": 5.8, "M8Y": 5.2,
  "M9A": 6.8, "M9B": 7.4, "M9C": 7.0, "M9P": 11.5, "M9R": 12.8, "M9V": 15.5, "M9W": 14.5,
  "M6S": 7.2, "M6R": 8.8, "M6P": 9.4, "M6K": 10.2, "M6J": 11.4, "M6N": 9.5, "M6M": 12.0, "M6H": 11.0, "M6G": 12.5,
  "M5V": 13.2, "M5R": 14.0, "M5S": 14.2, "M5T": 13.8, "M5H": 14.8, "M5J": 14.2, "M5C": 15.0, "M5B": 15.4, "M5A": 15.8, "M5E": 14.9, "M5G": 14.8,
  "M4V": 16.5, "M4R": 18.0, "M4N": 19.5, "M4P": 17.5, "M4W": 16.8, "M4X": 16.5, "M4Y": 15.8, "M4C": 20.0, "M4E": 21.5, "M4K": 18.5, "M4J": 19.0, "M4L": 20.5,
  "M2N": 21.5, "M2M": 24.0, "M2R": 20.5, "M2P": 19.0, "M2J": 24.5, "M2K": 23.0, "M3A": 23.5, "M3B": 22.5, "M3C": 22.0, "M3H": 19.0, "M3J": 19.5,
  "M1B": 35.0, "M1C": 37.0, "M1E": 33.0, "M1G": 31.0, "M1H": 29.5, "M1K": 26.0, "M1L": 23.5, "M1P": 27.5, "M1R": 26.5,
  "L5E": 4.2, "L5G": 5.8, "L5H": 7.8, "L5J": 10.2, "L5A": 8.8, "L5B": 10.2, "L5C": 11.2, "L5K": 12.8, "L5L": 14.8, "L5M": 16.8, "L5N": 20.5,
  "L6P": 27.5, "L6R": 26.5, "L6S": 22.5, "L6T": 20.5, "L6H": 18.5, "L6J": 17.0, "L6K": 19.5, "L7L": 29.5, "L4K": 21.5, "L4L": 20.0, "L3R": 28.5
};

// -------------------------------------------------------------
// 3. CORE CALCULATION ENGINES
// -------------------------------------------------------------

/**
 * Requirement 9: Delivery Fees
 * Free up to 2 km; $5 over 2–5 km; $1/km for the full distance above 5 km.
 */
function calculateTieredDeliveryFee(km, method = 'delivery') {
  if (method === 'pickup') return 0.00;
  const distance = Math.max(0, Number(km) || 0);

  if (distance <= (CONFIG.deliveryTier1MaxKm || 2.0)) {
    return 0.00; // Free up to 2 km
  } else if (distance <= (CONFIG.deliveryTier2MaxKm || 5.0)) {
    return Number(CONFIG.deliveryTier2Fee || 5.00); // $5 over 2–5 km
  } else {
    return Number((distance * (CONFIG.deliveryPerKmRate || 1.00)).toFixed(2)); // $1/km for full distance
  }
}

/**
 * Requirement 5: Shopping Cart & Checkout Calculations
 * Taxes (13% HST Ontario), volume discount (10% on 7+ meals), coupons, extras.
 */
function calculateCartTotals() {
  const totalMeals = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const mealsSubtotal = state.cart.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  const extraSidesSubtotal = state.cart.reduce((sum, item) => sum + ((item.extraSidesPrice || 0) * item.quantity), 0);
  const addonsSubtotal = state.cart.reduce((sum, item) => sum + ((item.addonsPrice || 0) * item.quantity), 0);
  const rawSubtotal = mealsSubtotal + extraSidesSubtotal + addonsSubtotal;

  // 10% volume discount on orders containing 7 or more meals
  const hasVolumeDiscount = totalMeals >= CONFIG.volumeDiscountThreshold;
  const volumeDiscountAmount = hasVolumeDiscount ? Number((mealsSubtotal * CONFIG.volumeDiscountRate).toFixed(2)) : 0;

  // Coupon discount calculation
  let couponDiscountAmount = 0;
  let isFreeDeliveryCoupon = false;

  if (state.appliedCoupon) {
    if (state.appliedCoupon.type === 'percent') {
      couponDiscountAmount = Number(((mealsSubtotal - volumeDiscountAmount) * (state.appliedCoupon.value / 100)).toFixed(2));
    } else if (state.appliedCoupon.type === 'dollar') {
      couponDiscountAmount = Math.min(state.appliedCoupon.value, mealsSubtotal - volumeDiscountAmount);
    } else if (state.appliedCoupon.type === 'free_delivery') {
      isFreeDeliveryCoupon = true;
    }
  }

  const discountedMeals = Math.max(0, mealsSubtotal - volumeDiscountAmount - couponDiscountAmount);
  const taxableSubtotal = Number((discountedMeals + extraSidesSubtotal + addonsSubtotal).toFixed(2));

  // 13% Ontario HST
  const taxAmount = CONFIG.taxEnabled ? Number((taxableSubtotal * (CONFIG.taxRate || 0.13)).toFixed(2)) : 0.00;

  // Tiered Delivery Fee
  let deliveryFee = state.deliveryMethod === 'pickup' ? 0.00 : state.calculatedDeliveryFee;
  if (isFreeDeliveryCoupon) deliveryFee = 0.00;

  const grandTotal = Number((taxableSubtotal + taxAmount + deliveryFee).toFixed(2));

  return {
    totalMeals,
    mealsSubtotal: Number(mealsSubtotal.toFixed(2)),
    extraSidesSubtotal: Number(extraSidesSubtotal.toFixed(2)),
    addonsSubtotal: Number(addonsSubtotal.toFixed(2)),
    rawSubtotal: Number(rawSubtotal.toFixed(2)),
    hasVolumeDiscount,
    volumeDiscountAmount,
    couponDiscountAmount: Number(couponDiscountAmount.toFixed(2)),
    appliedCoupon: state.appliedCoupon,
    taxableSubtotal,
    taxRatePercent: Math.round((CONFIG.taxRate || 0.13) * 100),
    taxAmount,
    deliveryFee: Number(deliveryFee.toFixed(2)),
    grandTotal
  };
}

// -------------------------------------------------------------
// 4. LOGGING & AUDIT TRAIL ENGINE (Requirement 16)
// -------------------------------------------------------------

function logActivity(action, details) {
  const newLog = {
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    role: state.staffRole || 'Admin',
    action,
    details
  };
  ACTIVITY_LOGS.unshift(newLog);
  if (ACTIVITY_LOGS.length > 50) ACTIVITY_LOGS.pop();
  localStorage.setItem('gfk-activity-logs', JSON.stringify(ACTIVITY_LOGS));
}

// -------------------------------------------------------------
// 5. INITIALIZATION
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initCutoffCountdown();
  initHeroSlider();
  initMenu();
  initDeliveryCalculator();
  initEventModals();
  initMenuManagerUI();
  initAddressAutofill();

  if (document.getElementById('adminPortalContainer')) {
    switchAdminPortalTab('dashboard');
  }
});

// -------------------------------------------------------------
// 6. HERO SLIDER & BATCH COUNTDOWN (Requirement 7)
// -------------------------------------------------------------

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  setInterval(() => {
    slides[state.activeSlide].classList.remove('opacity-100');
    slides[state.activeSlide].classList.add('opacity-0');
    state.activeSlide = (state.activeSlide + 1) % slides.length;
    slides[state.activeSlide].classList.remove('opacity-0');
    slides[state.activeSlide].classList.add('opacity-100');
  }, 5000);
}

function initCutoffCountdown() {
  const countdownEl = document.getElementById('cutoffCountdown');
  if (!countdownEl) return;

  function update() {
    const now = new Date();
    const day = now.getDay(); // 0 is Sun, 5 is Fri, 1 is Mon
    let target = new Date(now);

    if (day <= 5) {
      // Target next Friday 23:59:59
      const daysUntilFri = 5 - day;
      target.setDate(now.getDate() + daysUntilFri);
      target.setHours(23, 59, 59, 999);
      countdownEl.innerText = `Sunday Batch Drops: Order cutoff in ${formatDiff(target - now)}`;
    } else {
      // Target next Monday 23:59:59
      const daysUntilMon = (1 + 7 - day) % 7;
      target.setDate(now.getDate() + daysUntilMon);
      target.setHours(23, 59, 59, 999);
      countdownEl.innerText = `Wednesday Batch Drops: Order cutoff in ${formatDiff(target - now)}`;
    }
  }

  function formatDiff(ms) {
    if (ms <= 0) return "Order Window Closing!";
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
  }

  update();
  setInterval(update, 60000);
}

// -------------------------------------------------------------
// 7. ONLINE MENU RENDERING & SEARCH (Requirements 1 & 2)
// -------------------------------------------------------------

function initMenu() {
  renderMenu();
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderMenu();
    });
  }
}

function renderMenu() {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;

  const q = (state.searchQuery || '').toLowerCase().trim();
  const filtered = MENU_ITEMS.filter(meal => {
    return !q ||
      meal.name.toLowerCase().includes(q) ||
      (meal.description && meal.description.toLowerCase().includes(q)) ||
      (meal.dietary && meal.dietary.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div class="col-span-full py-16 text-center text-gray-500 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <p class="text-xl font-bold text-gray-800">No dishes match your search.</p>
        <p class="text-sm text-gray-500 mt-2">Try searching for another favorite or browse all dishes.</p>
        <button onclick="resetMenuFilter()" class="mt-5 px-6 py-3 bg-greek-gold text-greek-navyDark font-bold rounded-xl shadow hover:bg-greek-goldHover transition">
          View All ${MENU_ITEMS.length} Dishes
        </button>
      </div>
    `;
    return;
  }

  menuGrid.innerHTML = filtered.map(meal => {
    const isPasta = meal.id === 'pasta-al-greco';
    const isAvailable = meal.available !== false;
    const dietaryTag = meal.dietary || 'High Protein';

    return `
      <div class="meal-card flex flex-col justify-between rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
        <div class="relative h-60 w-full overflow-hidden bg-gray-100">
          <img 
            src="${meal.image}?v=20261103_2" 
            alt="${meal.name}" 
            class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onerror="this.src='images/meals/grilled-chicken.jpg'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div class="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <span class="px-3 py-1 bg-greek-gold text-greek-navyDark font-extrabold text-sm rounded-xl shadow-md">
              $${meal.price.toFixed(2)} CAD
            </span>
            <span class="px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg border border-white/20">
              ${dietaryTag}
            </span>
          </div>

          ${!isAvailable ? `
            <div class="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center">
              <span class="px-4 py-2 bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg">
                Sold Out for Current Batch
              </span>
            </div>
          ` : ''}
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-heading font-extrabold text-lg text-gray-900 group-hover:text-greek-gold transition-colors">
              ${meal.name}
            </h3>
            
            <p class="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2">
              ${meal.description || 'Authentic Greek fitness meal prep designed for high-protein athletic performance.'}
            </p>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>${isPasta ? 'Complete Italian-Greek Dish' : 'Includes 2 Clean Sides'}</span>
              <span class="text-green-700 font-bold">${isPasta ? 'Sides Excluded' : 'Sides FREE'}</span>
            </div>

            <button 
              type="button" 
              onclick="openSideCustomizer('${meal.id}')"
              ${!isAvailable ? 'disabled' : ''}
              class="w-full py-3 px-4 rounded-xl ${isAvailable ? 'bg-greek-navy hover:bg-greek-navyDark text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:bg-greek-gold group-hover:text-greek-navyDark"
            >
              <span>Add to Order</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resetMenuFilter() {
  state.searchQuery = '';
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) searchInput.value = '';
  renderMenu();
}

window.resetMenuFilter = resetMenuFilter;

// -------------------------------------------------------------
// 8. MEAL CUSTOMIZATION (Requirements 4: Sides, Extras, Add-ons)
// -------------------------------------------------------------

function openSideCustomizer(mealId) {
  const meal = MENU_ITEMS.find(m => m.id === mealId);
  if (!meal) return;

  state.customizingMeal = {
    ...meal,
    cartItemId: 'item_' + Date.now(),
    quantity: 1,
    side1: meal.id === 'pasta-al-greco' ? null : SIDES_LIST[0],
    side2: meal.id === 'pasta-al-greco' ? null : SIDES_LIST[1],
    extraSides: [],
    addons: [],
    specialInstructions: ''
  };

  const modal = document.getElementById('sideCustomizerModal');
  if (!modal) return;

  // Set Modal Header
  const titleEl = document.getElementById('customizerMealTitle');
  const basePriceEl = document.getElementById('customizerBasePrice');
  const imgEl = document.getElementById('customizerMealImg');
  const qtyInput = document.getElementById('customizerQuantityInput');
  const specialText = document.getElementById('customizerSpecialInstructions');

  if (titleEl) titleEl.innerText = meal.name;
  if (basePriceEl) basePriceEl.innerText = `$${meal.price.toFixed(2)} CAD`;
  if (imgEl) {
    imgEl.src = meal.image + '?v=20261103_2';
    imgEl.onerror = () => { imgEl.src = 'images/meals/grilled-chicken.jpg'; };
  }
  if (qtyInput) {
    qtyInput.value = 1;
    qtyInput.disabled = true;
    qtyInput.readOnly = true;
    const parentStepper = qtyInput.parentElement;
    if (parentStepper) {
      parentStepper.style.pointerEvents = 'none';
      parentStepper.style.opacity = '0.5';
      parentStepper.style.cursor = 'not-allowed';
      parentStepper.querySelectorAll('button').forEach(b => {
        b.disabled = true;
        b.setAttribute('disabled', 'disabled');
        b.style.pointerEvents = 'none';
        b.style.cursor = 'not-allowed';
      });
    }
  }
  if (specialText) specialText.value = '';

  // Render Sides Selection
  const isPasta = meal.id === 'pasta-al-greco';
  const sidesWrapper = document.getElementById('customizerSidesSelectionWrapper');
  const pastaNotice = document.getElementById('customizerPastaNoticeWrapper');

  if (isPasta) {
    if (sidesWrapper) sidesWrapper.classList.add('hidden');
    if (pastaNotice) pastaNotice.classList.remove('hidden');
  } else {
    if (sidesWrapper) sidesWrapper.classList.remove('hidden');
    if (pastaNotice) pastaNotice.classList.add('hidden');
    renderSidesCheckboxes();
    renderSidesDropdowns();
  }

  // Render Extra Sides Checkboxes
  renderExtraSidesCheckboxes();

  // Render Add-ons Checkboxes
  renderAddonsCheckboxes();

  updateCustomizerPriceBreakdown();
  modal.classList.remove('hidden');
}

function renderSidesCheckboxes() {
  const container1 = document.getElementById('customizerSide1Container');
  const container2 = document.getElementById('customizerSide2Container');

  if (container1) {
    container1.innerHTML = SIDES_LIST.map((side) => {
      const isChecked = state.customizingMeal && state.customizingMeal.side1 === side;
      return `
        <label class="flex items-center gap-2.5 p-2.5 rounded-xl border ${isChecked ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-400 font-bold' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'} cursor-pointer text-xs transition">
          <input 
            type="checkbox" 
            name="customizer_side1_box" 
            value="${side}" 
            ${isChecked ? 'checked' : ''}
            onchange="selectIncludedSide1('${side}')"
            class="rounded text-greek-gold focus:ring-greek-gold w-4 h-4 cursor-pointer"
          />
          <span class="flex-1 text-gray-800 font-medium">${side}</span>
          <span class="text-green-700 font-extrabold text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-200">INCLUDED</span>
        </label>
      `;
    }).join('');
  }

  if (container2) {
    container2.innerHTML = SIDES_LIST.map((side) => {
      const isChecked = state.customizingMeal && state.customizingMeal.side2 === side;
      return `
        <label class="flex items-center gap-2.5 p-2.5 rounded-xl border ${isChecked ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-400 font-bold' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'} cursor-pointer text-xs transition">
          <input 
            type="checkbox" 
            name="customizer_side2_box" 
            value="${side}" 
            ${isChecked ? 'checked' : ''}
            onchange="selectIncludedSide2('${side}')"
            class="rounded text-greek-gold focus:ring-greek-gold w-4 h-4 cursor-pointer"
          />
          <span class="flex-1 text-gray-800 font-medium">${side}</span>
          <span class="text-green-700 font-extrabold text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-200">INCLUDED</span>
        </label>
      `;
    }).join('');
  }
}

function selectIncludedSide1(side) {
  if (!state.customizingMeal) return;
  state.customizingMeal.side1 = side;
  renderSidesCheckboxes();
  const select1 = document.getElementById('customizerSide1Select');
  if (select1) select1.value = side;
  updateCustomizerPriceBreakdown();
}

function selectIncludedSide2(side) {
  if (!state.customizingMeal) return;
  state.customizingMeal.side2 = side;
  renderSidesCheckboxes();
  const select2 = document.getElementById('customizerSide2Select');
  if (select2) select2.value = side;
  updateCustomizerPriceBreakdown();
}

function renderSidesDropdowns() {
  const side1Select = document.getElementById('customizerSide1Select');
  const side2Select = document.getElementById('customizerSide2Select');
  if (!side1Select || !side2Select) return;

  const optionsHtml = SIDES_LIST.map(side => `<option value="${side}">${side}</option>`).join('');
  side1Select.innerHTML = optionsHtml;
  side2Select.innerHTML = optionsHtml;

  side1Select.value = state.customizingMeal.side1 || SIDES_LIST[0];
  side2Select.value = state.customizingMeal.side2 || SIDES_LIST[1];
}

function renderExtraSidesCheckboxes() {
  const container = document.getElementById('customizerExtraSidesContainer');
  if (!container) return;

  container.innerHTML = SIDES_LIST.map((side, idx) => `
    <label class="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 cursor-pointer text-xs">
      <input 
        type="checkbox" 
        value="${side}" 
        onchange="toggleExtraSide(this.value, this.checked)"
        class="rounded text-greek-gold focus:ring-greek-gold"
      />
      <span class="flex-1 text-gray-800 font-medium">${side}</span>
      <span class="text-greek-navy font-bold">+$${CONFIG.extraSidePrice.toFixed(2)}</span>
    </label>
  `).join('');
}

function renderAddonsCheckboxes() {
  let container = document.getElementById('customizerAddonsContainer');
  if (!container) {
    // If container doesn't exist in markup yet, inject it right above price breakdown
    const breakdown = document.getElementById('customizerBreakdownBase')?.closest('.p-4');
    if (breakdown) {
      const addonsWrapper = document.createElement('div');
      addonsWrapper.innerHTML = `
        <div class="mt-4 mb-2">
          <div class="flex justify-between items-baseline mb-1.5">
            <label class="block text-xs font-extrabold uppercase text-gray-700">Premium Add-ons &amp; Sauces</label>
            <span class="text-xs text-gray-500 font-medium">Optional Upgrades</span>
          </div>
          <div id="customizerAddonsContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1"></div>
        </div>
      `;
      breakdown.parentNode.insertBefore(addonsWrapper, breakdown);
      container = document.getElementById('customizerAddonsContainer');
    }
  }

  if (container) {
    container.innerHTML = ADDONS_LIST.map(addon => `
      <label class="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 cursor-pointer text-xs">
        <input 
          type="checkbox" 
          value="${addon.id}" 
          onchange="toggleCustomizerAddon('${addon.id}', this.checked)"
          class="rounded text-greek-gold focus:ring-greek-gold"
        />
        <span class="flex-1 text-gray-800 font-medium">${addon.name}</span>
        <span class="text-greek-navy font-bold">+$${addon.price.toFixed(2)}</span>
      </label>
    `).join('');
  }
}

function toggleExtraSide(sideName, isChecked) {
  if (!state.customizingMeal) return;
  if (isChecked) {
    if (!state.customizingMeal.extraSides.includes(sideName)) {
      state.customizingMeal.extraSides.push(sideName);
    }
  } else {
    state.customizingMeal.extraSides = state.customizingMeal.extraSides.filter(s => s !== sideName);
  }
  updateCustomizerPriceBreakdown();
}

function toggleCustomizerAddon(addonId, isChecked) {
  if (!state.customizingMeal) return;
  const addon = ADDONS_LIST.find(a => a.id === addonId);
  if (!addon) return;

  if (isChecked) {
    if (!state.customizingMeal.addons.some(a => a.id === addonId)) {
      state.customizingMeal.addons.push(addon);
    }
  } else {
    state.customizingMeal.addons = state.customizingMeal.addons.filter(a => a.id !== addonId);
  }
  updateCustomizerPriceBreakdown();
}

function updateCustomizerSide1(val) {
  if (state.customizingMeal) state.customizingMeal.side1 = val;
}

function updateCustomizerSide2(val) {
  if (state.customizingMeal) state.customizingMeal.side2 = val;
}

function changeCustomizerQty(delta) {
  // Quantity selector is disabled per requirement (individual meal plate customization)
  return;
}

function updateCustomizerPriceBreakdown() {
  if (!state.customizingMeal) return;

  const basePrice = state.customizingMeal.price;
  const extraSidesCost = (state.customizingMeal.extraSides.length || 0) * CONFIG.extraSidePrice;
  const addonsCost = (state.customizingMeal.addons || []).reduce((sum, a) => sum + a.price, 0);
  const singleMealTotal = basePrice + extraSidesCost + addonsCost;
  const allMealsTotal = singleMealTotal * state.customizingMeal.quantity;

  const breakdownBase = document.getElementById('customizerBreakdownBase');
  const breakdownExtra = document.getElementById('customizerBreakdownExtraSides');
  const breakdownTotal = document.getElementById('customizerBreakdownTotal');
  const btnText = document.getElementById('customizerAddBtnText');

  if (breakdownBase) breakdownBase.innerText = `$${basePrice.toFixed(2)} CAD`;
  if (breakdownExtra) breakdownExtra.innerText = `$${(extraSidesCost + addonsCost).toFixed(2)} CAD`;
  if (breakdownTotal) breakdownTotal.innerText = `$${allMealsTotal.toFixed(2)} CAD`;
  if (btnText) btnText.innerText = `Add to Order — $${allMealsTotal.toFixed(2)} CAD`;
}

function closeSideCustomizer() {
  const modal = document.getElementById('sideCustomizerModal');
  if (modal) modal.classList.add('hidden');
  state.customizingMeal = null;
}

function confirmAddCustomMeal() {
  if (!state.customizingMeal) return;

  const specialText = document.getElementById('customizerSpecialInstructions');
  if (specialText) state.customizingMeal.specialInstructions = specialText.value.trim();

  const extraSidesCost = (state.customizingMeal.extraSides.length || 0) * CONFIG.extraSidePrice;
  const addonsCost = (state.customizingMeal.addons || []).reduce((sum, a) => sum + a.price, 0);
  const unitPrice = state.customizingMeal.price + extraSidesCost + addonsCost;

  const cartItem = {
    cartItemId: state.customizingMeal.cartItemId,
    mealId: state.customizingMeal.id,
    name: state.customizingMeal.name,
    image: state.customizingMeal.image,
    basePrice: state.customizingMeal.price,
    extraSidesPrice: extraSidesCost,
    addonsPrice: addonsCost,
    unitPrice: unitPrice,
    quantity: state.customizingMeal.quantity,
    side1: state.customizingMeal.side1,
    side2: state.customizingMeal.side2,
    extraSides: [...state.customizingMeal.extraSides],
    addons: [...state.customizingMeal.addons],
    specialInstructions: state.customizingMeal.specialInstructions
  };

  state.cart.push(cartItem);
  saveCart();
  closeSideCustomizer();
  openCartDrawer();
}

window.openSideCustomizer = openSideCustomizer;
window.closeSideCustomizer = closeSideCustomizer;
window.changeCustomizerQty = changeCustomizerQty;
window.toggleExtraSide = toggleExtraSide;
window.toggleCustomizerAddon = toggleCustomizerAddon;
window.renderSidesCheckboxes = renderSidesCheckboxes;
window.selectIncludedSide1 = selectIncludedSide1;
window.selectIncludedSide2 = selectIncludedSide2;
window.updateCustomizerSide1 = selectIncludedSide1;
window.updateCustomizerSide2 = selectIncludedSide2;
window.confirmAddCustomMeal = confirmAddCustomMeal;

// -------------------------------------------------------------
// 9. COMBO PACKAGES & BUNDLE BUILDER (Requirement 3)
// -------------------------------------------------------------

function addStarterSixMealPackage() {
  const popularDishIds = ["grilled-chicken", "salmon", "spinach-feta", "stuffed-chicken", "beef-souvlaki", "chicken-souvlaki"];
  popularDishIds.forEach(id => {
    const dish = MENU_ITEMS.find(m => m.id === id) || MENU_ITEMS[0];
    state.cart.push({
      cartItemId: 'pkg_item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      mealId: dish.id,
      name: dish.name,
      image: dish.image,
      basePrice: dish.price,
      extraSidesPrice: 0,
      addonsPrice: 0,
      unitPrice: dish.price,
      quantity: 1,
      side1: SIDES_LIST[0],
      side2: SIDES_LIST[5] || SIDES_LIST[1],
      extraSides: [],
      addons: [],
      specialInstructions: "6-Meal Starter Package Bundle"
    });
  });

  saveCart();
  openCartDrawer();
}

window.addStarterSixMealPackage = addStarterSixMealPackage;

// -------------------------------------------------------------
// 10. SHOPPING CART & PROMOTIONS (Requirements 5 & 11)
// -------------------------------------------------------------

function initCart() {
  const saved = localStorage.getItem('gfk-cart');
  if (saved) {
    try {
      state.cart = JSON.parse(saved);
    } catch (e) {
      state.cart = [];
    }
  }

  // Open/Close buttons
  document.querySelectorAll('.open-cart-btn').forEach(b => {
    b.addEventListener('click', openCartDrawer);
  });

  const closeBtn = document.getElementById('cartCloseBtn');
  const overlay = document.getElementById('cartOverlay');
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  updateCartUI();
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function saveCart() {
  localStorage.setItem('gfk-cart', JSON.stringify(state.cart));
  updateCartUI();
}

function updateCartUI() {
  const totals = calculateCartTotals();

  // Badges in header
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.innerText = totals.totalMeals;
    b.classList.toggle('hidden', totals.totalMeals === 0);
  });

  const container = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmptyState');
  const footer = document.getElementById('cartDrawerFooter');

  if (!container) return;

  if (state.cart.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (footer) footer.classList.add('hidden');
    container.innerHTML = '';
    updateCartSummaryFields(totals);
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (footer) footer.classList.remove('hidden');

  container.innerHTML = state.cart.map(item => {
    const itemGrandTotal = (item.unitPrice * item.quantity).toFixed(2);
    const hasAddons = item.addons && item.addons.length > 0;
    const hasExtraSides = item.extraSides && item.extraSides.length > 0;

    return `
      <div class="flex flex-col p-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm relative">
        <div class="flex gap-4">
          <img src="${item.image}?v=20261103_2" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-200" onerror="this.src='images/meals/grilled-chicken.jpg'" />
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-1">
              <div>
                ${item.packageSlot ? `<span class="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-greek-navy text-greek-gold uppercase tracking-wider mb-1">Meal ${item.packageSlot} of ${item.packageTotalMeals}</span>` : ''}
                <h4 class="font-bold text-sm text-gray-900">${item.name}</h4>
              </div>
              <button onclick="removeCartItem('${item.cartItemId}')" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remove Meal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>

            <div class="text-xs text-gray-500 mt-1 space-y-0.5">
              ${item.side1 ? `<p>✓ Sides: <span class="text-gray-700">${item.side1}, ${item.side2}</span></p>` : '<p class="text-gray-400 italic">Pasta Dish (No Included Sides)</p>'}
              ${hasExtraSides ? `<p class="text-greek-navy font-semibold">+ Extras: ${item.extraSides.join(', ')}</p>` : ''}
              ${hasAddons ? `<p class="text-amber-800 font-semibold">+ Add-ons: ${item.addons.map(a => a.name).join(', ')}</p>` : ''}
              ${item.specialInstructions ? `<p class="italic text-gray-400">“${item.specialInstructions}”</p>` : ''}
            </div>

            <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60">
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white text-xs">
                <button onclick="changeCartItemQty('${item.cartItemId}', -1)" class="px-2.5 py-1 text-gray-700 hover:bg-gray-100 font-bold">-</button>
                <span class="px-2.5 font-bold text-gray-900">${item.quantity}</span>
                <button onclick="changeCartItemQty('${item.cartItemId}', 1)" class="px-2.5 py-1 text-gray-700 hover:bg-gray-100 font-bold">+</button>
              </div>

              <span class="font-heading font-extrabold text-sm text-gray-900">$${itemGrandTotal} CAD</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateCartSummaryFields(totals);
}

function updateCartSummaryFields(totals) {
  // Update Subtotals
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountAmountEl = document.getElementById('cartDiscountAmount');
  const deliveryFeeEl = document.getElementById('cartDeliveryFee');
  const grandTotalEl = document.getElementById('cartGrandTotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  const progressText = document.getElementById('cartProgressText');
  const progressFill = document.getElementById('cartProgressFill');
  const minOrderNotice = document.getElementById('cartMinOrderNotice');

  if (subtotalEl) subtotalEl.innerText = `$${totals.rawSubtotal.toFixed(2)} CAD`;

  // Volume discount display
  if (discountRow) {
    if (totals.hasVolumeDiscount) {
      discountRow.classList.remove('hidden');
      if (discountAmountEl) discountAmountEl.innerText = `-$${totals.volumeDiscountAmount.toFixed(2)} CAD`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  // Coupon discount display
  const couponRow = document.getElementById('cartCouponRow');
  const couponAmountEl = document.getElementById('cartCouponAmount');
  if (couponRow) {
    if (totals.couponDiscountAmount > 0) {
      couponRow.classList.remove('hidden');
      if (couponAmountEl) couponAmountEl.innerText = `-$${totals.couponDiscountAmount.toFixed(2)} CAD`;
    } else {
      couponRow.classList.add('hidden');
    }
  }

  // Tax display
  const taxAmountEl = document.getElementById('cartTaxAmount');
  if (taxAmountEl) {
    taxAmountEl.innerText = `$${totals.taxAmount.toFixed(2)} CAD`;
  }

  // Delivery fee
  if (deliveryFeeEl) {
    deliveryFeeEl.innerText = totals.deliveryFee === 0 ? "FREE" : `$${totals.deliveryFee.toFixed(2)} CAD`;
  }

  // Grand Total
  if (grandTotalEl) grandTotalEl.innerText = `$${totals.grandTotal.toFixed(2)} CAD`;

  // Minimum 6-meal order validation
  const needed = Math.max(0, CONFIG.minMeals - totals.totalMeals);
  const percent = Math.min(100, Math.round((totals.totalMeals / CONFIG.minMeals) * 100));

  if (progressFill) progressFill.style.width = `${percent}%`;

  if (progressText) {
    if (needed > 0) {
      progressText.innerHTML = `<strong>Minimum Order: ${CONFIG.minMeals} Meals</strong> (${totals.totalMeals} added)`;
    } else {
      progressText.innerHTML = `<span class="text-green-700 font-bold">✓ Minimum Reached (${totals.totalMeals} Meals in Plan)</span>`;
    }
  }

  if (minOrderNotice) {
    if (needed > 0) {
      minOrderNotice.classList.remove('hidden');
      minOrderNotice.innerHTML = `
        <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>You need <strong>${needed} more meal${needed > 1 ? 's' : ''}</strong> to reach the ${CONFIG.minMeals}-meal minimum order.</span>
        </div>
      `;
    } else {
      minOrderNotice.classList.add('hidden');
    }
  }

  // Enable/Disable checkout
  if (checkoutBtn) {
    if (totals.totalMeals >= CONFIG.minMeals) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      checkoutBtn.classList.add('hover:bg-greek-goldHover');
      checkoutBtn.innerText = `Proceed to Checkout ($${totals.grandTotal.toFixed(2)} CAD)`;
    } else {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
      checkoutBtn.classList.remove('hover:bg-greek-goldHover');
      checkoutBtn.innerText = `Add ${needed} More Meal${needed > 1 ? 's' : ''} to Checkout`;
    }
  }

  // Synchronize with standalone checkout page if present
  if (window.syncStandaloneCheckoutPage) {
    window.syncStandaloneCheckoutPage(totals);
  }
}

function changeCartItemQty(cartItemId, delta) {
  const index = state.cart.findIndex(i => i.cartItemId === cartItemId);
  if (index > -1) {
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
  }
}

function removeCartItem(cartItemId) {
  state.cart = state.cart.filter(i => i.cartItemId !== cartItemId);
  saveCart();
}

function applyCouponCode(rawCode) {
  const code = (rawCode || '').trim().toUpperCase();
  const coupon = COUPONS_LIST.find(c => c.code === code && c.active !== false);

  if (!coupon) {
    alert("Invalid promo code. Try GREEK10, LEAN15, or FITFREE");
    return false;
  }

  const totals = calculateCartTotals();
  if (totals.totalMeals < (coupon.minMeals || 6)) {
    alert(`This promo requires a minimum of ${coupon.minMeals || 6} meals.`);
    return false;
  }

  state.appliedCoupon = coupon;
  updateCartUI();
  alert(`✓ Coupon ${coupon.code} Applied: ${coupon.description}!`);
  return true;
}

window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.changeCartItemQty = changeCartItemQty;
window.removeCartItem = removeCartItem;
window.applyCouponCode = applyCouponCode;
window.saveCart = saveCart;
window.updateCartUI = updateCartUI;
window.calculateCartTotals = calculateCartTotals;

// -------------------------------------------------------------
// 11. ADDRESS AUTOFILL & DELIVERY VALIDATION (Requirements 8 & 9)
// -------------------------------------------------------------

const GTA_AUTOFILL_PRESETS = [
  { label: "3575 Lake Shore Blvd W, Etobicoke, ON M8W 1P5", km: 0.1, zone: "Etobicoke (Kitchen Pickup Zone)" },
  { label: "85 Royal York Rd, Etobicoke, ON M8V 2T7", km: 1.8, zone: "South Etobicoke" },
  { label: "700 Evans Ave, Etobicoke, ON M9C 1A3", km: 4.2, zone: "Etobicoke Sherway" },
  { label: "100 City Centre Dr, Mississauga, ON L5B 2C9", km: 8.5, zone: "Mississauga Central" },
  { label: "250 Queens Quay West, Toronto, ON M5J 2R9", km: 12.4, zone: "Downtown Waterfront" },
  { label: "123 King St W, Toronto, ON M5H 3T9", km: 13.1, zone: "Financial District" },
  { label: "5000 Yonge St, North York, ON M2N 6P3", km: 18.2, zone: "North York" },
  { label: "300 Borough Dr, Scarborough, ON M1P 4P5", km: 28.5, zone: "Scarborough" },
  { label: "200 University Ave, Toronto, ON M5H 3E2", km: 13.5, zone: "Downtown Core" },
  { label: "1405 Lakeshore Rd E, Mississauga, ON L5E 1G5", km: 3.5, zone: "Lakeview Mississauga" }
];

function initAddressAutofill() {
  const inputs = document.querySelectorAll('.gta-address-autocomplete-input');
  inputs.forEach(input => {
    let listEl = document.getElementById(input.id + '_dropdown');
    if (!listEl) {
      listEl = document.createElement('div');
      listEl.id = input.id + '_dropdown';
      listEl.className = 'absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 mt-1 max-h-56 overflow-y-auto hidden';
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(listEl);
    }

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      if (query.length < 2) {
        listEl.classList.add('hidden');
        return;
      }

      const matches = GTA_AUTOFILL_PRESETS.filter(p => p.label.toLowerCase().includes(query));
      if (matches.length > 0) {
        listEl.innerHTML = matches.map(m => {
          const fee = calculateTieredDeliveryFee(m.km, 'delivery');
          return `
            <div onclick="selectAutofillAddress('${m.label}', ${m.km})" class="p-3 hover:bg-greek-gold/10 cursor-pointer border-b border-gray-100 flex items-center justify-between text-xs">
              <div>
                <strong class="block text-gray-900">${m.label}</strong>
                <span class="text-gray-500">${m.zone} (${m.km} km from kitchen)</span>
              </div>
              <span class="font-extrabold ${fee === 0 ? 'text-green-700' : 'text-greek-navy'}">${fee === 0 ? 'FREE' : '$' + fee.toFixed(2)}</span>
            </div>
          `;
        }).join('');
        listEl.classList.remove('hidden');
      } else {
        listEl.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !listEl.contains(e.target)) {
        listEl.classList.add('hidden');
      }
    });
  });
}

function selectAutofillAddress(address, km) {
  const inputs = document.querySelectorAll('.gta-address-autocomplete-input');
  inputs.forEach(input => {
    input.value = address;
    const listEl = document.getElementById(input.id + '_dropdown');
    if (listEl) listEl.classList.add('hidden');
  });

  state.calculatedDistanceKm = km;
  state.calculatedDeliveryFee = calculateTieredDeliveryFee(km, state.deliveryMethod);

  // Update notes on calculator if available
  const notesEl = document.getElementById('calcResultNotes');
  const priceEl = document.getElementById('calcResultPrice');
  if (priceEl) priceEl.innerText = state.calculatedDeliveryFee === 0 ? "FREE" : `$${state.calculatedDeliveryFee.toFixed(2)} CAD`;
  if (notesEl) {
    if (km <= 2.0) {
      notesEl.innerText = `Verified: ${km} km (FREE Tier up to 2 km from Etobicoke kitchen).`;
    } else if (km <= 5.0) {
      notesEl.innerText = `Verified: ${km} km ($5.00 Flat Tier for 2–5 km).`;
    } else {
      notesEl.innerText = `Verified: ${km} km ($1.00/km full distance above 5 km).`;
    }
  }

  updateCartUI();
}

window.selectAutofillAddress = selectAutofillAddress;

function initDeliveryCalculator() {
  const calcBtn = document.getElementById('calculateDeliveryBtn');
  const postalInput = document.getElementById('deliveryPostalInput');

  if (calcBtn && postalInput) {
    calcBtn.addEventListener('click', () => {
      calculateDeliveryEstimate(postalInput.value);
    });
    postalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') calculateDeliveryEstimate(postalInput.value);
    });
  }
}

function calculateDeliveryEstimate(inputVal) {
  const priceEl = document.getElementById('calcResultPrice');
  const notesEl = document.getElementById('calcResultNotes');
  const val = (inputVal || '').trim();

  let km = 8.0;

  if (val) {
    const numMatch = val.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:km|k|kilometers?)?$/i);
    if (numMatch) {
      km = parseFloat(numMatch[1]) || 8.0;
    } else {
      const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const fsa = clean.substring(0, 3);
      if (GTA_FSA_TABLE[fsa]) {
        km = GTA_FSA_TABLE[fsa];
      } else if (clean.startsWith('M8')) {
        km = 2.5;
      } else if (clean.startsWith('M9') || clean.startsWith('M6')) {
        km = 8.5;
      } else if (clean.startsWith('M5')) {
        km = 13.0;
      } else if (clean.startsWith('M4')) {
        km = 17.5;
      } else if (clean.startsWith('L5')) {
        km = 9.0;
      } else {
        km = 14.0;
      }
    }
  }

  const fee = calculateTieredDeliveryFee(km, state.deliveryMethod);
  state.calculatedDistanceKm = km;
  state.calculatedDeliveryFee = fee;

  if (priceEl) priceEl.innerText = fee === 0 ? "FREE" : `$${fee.toFixed(2)} CAD`;
  if (notesEl) {
    if (km <= 2.0) {
      notesEl.innerText = `Calculated: ${km.toFixed(1)} km from Etobicoke kitchen (FREE up to 2 km).`;
    } else if (km <= 5.0) {
      notesEl.innerText = `Calculated: ${km.toFixed(1)} km from Etobicoke kitchen ($5.00 Flat Fee for 2–5 km).`;
    } else {
      notesEl.innerText = `Calculated: ${km.toFixed(1)} km from Etobicoke kitchen ($1.00/km full distance above 5 km).`;
    }
  }

  updateCartUI();
}

// -------------------------------------------------------------
// 12. CHECKOUT & SECURE PAYMENT ENGINE (Requirements 6 & 7)
// -------------------------------------------------------------

function toggleCheckoutMethod(method) {
  state.deliveryMethod = method;
  state.calculatedDeliveryFee = calculateTieredDeliveryFee(state.calculatedDistanceKm, method);

  const shippingGroup = document.getElementById('shippingFieldsGroup');
  if (shippingGroup) {
    shippingGroup.classList.toggle('hidden', method === 'pickup');
  }

  updateCartUI();
}

function submitCheckoutOrder(e) {
  if (e) e.preventDefault();

  const totals = calculateCartTotals();
  if (totals.totalMeals < CONFIG.minMeals) {
    alert(`Minimum order is ${CONFIG.minMeals} meals. You currently have ${totals.totalMeals} meals.`);
    return;
  }

  const form = e ? e.target : document.getElementById('checkoutForm') || document.getElementById('standaloneCheckoutForm');
  const formData = form ? new FormData(form) : null;

  const orderNumber = 'GFK-' + Math.floor(100000 + Math.random() * 900000);
  const customerName = formData ? (formData.get('fullName') || 'Customer') : 'Greek Fit Customer';
  const customerEmail = formData ? (formData.get('email') || 'customer@greekfit.ca') : 'customer@greekfit.ca';
  const customerPhone = formData ? (formData.get('phone') || '(416) 555-0199') : '(416) 555-0199';
  const customerAddress = state.deliveryMethod === 'pickup' 
    ? "3575 Lake Shore Blvd W, Etobicoke (Kitchen Pickup)" 
    : (formData ? (formData.get('address') || 'GTA Doorstep Delivery') : 'GTA Doorstep Delivery');

  const newOrder = {
    orderId: orderNumber,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    customerName,
    email: customerEmail,
    phone: customerPhone,
    address: customerAddress,
    distanceKm: state.calculatedDistanceKm,
    deliveryMethod: state.deliveryMethod,
    batchDay: state.selectedBatch === 'sunday' ? 'Next Sunday Batch (1:00 PM – 4:00 PM)' : 'Next Wednesday Batch (1:00 PM – 4:00 PM)',
    status: "Received",
    paymentStatus: "Paid (Verified SSL 256-Bit)",
    mealsCount: totals.totalMeals,
    items: state.cart.map(item => ({
      name: item.name,
      qty: item.quantity,
      sides: [item.side1, item.side2].filter(Boolean),
      extraSides: item.extraSides || [],
      addons: (item.addons || []).map(a => a.name),
      price: item.unitPrice
    })),
    mealsSubtotal: totals.mealsSubtotal,
    extraSidesSubtotal: totals.extraSidesSubtotal,
    addonsSubtotal: totals.addonsSubtotal,
    volumeDiscount: totals.volumeDiscountAmount,
    couponDiscount: totals.couponDiscountAmount,
    tax: totals.taxAmount,
    deliveryFee: totals.deliveryFee,
    grandTotal: totals.grandTotal
  };

  ORDERS_LIST.unshift(newOrder);
  localStorage.setItem('gfk-orders', JSON.stringify(ORDERS_LIST));

  logActivity("New Order Placed", `Order #${orderNumber} placed by ${customerName} for $${totals.grandTotal.toFixed(2)} CAD.`);

  // Empty cart
  state.cart = [];
  saveCart();

  // Close modals
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) checkoutModal.classList.add('hidden');

  // Show Order Confirmed Modal
  const confirmModal = document.getElementById('orderConfirmedModal');
  if (confirmModal) {
    const numEl = document.getElementById('confirmOrderNumber');
    const amtEl = document.getElementById('confirmTotalAmount');
    if (numEl) numEl.innerText = orderNumber;
    if (amtEl) amtEl.innerText = `$${totals.grandTotal.toFixed(2)} CAD`;
    confirmModal.classList.remove('hidden');
  } else {
    alert(`🎉 Order ${orderNumber} Confirmed! Total: $${totals.grandTotal.toFixed(2)} CAD.`);
  }
}

function openCheckoutModal() {
  const totals = calculateCartTotals();
  if (totals.totalMeals < CONFIG.minMeals) {
    alert(`Minimum order is ${CONFIG.minMeals} meals. You currently have ${totals.totalMeals} meals in your plan.`);
    return;
  }
  window.location.href = 'checkout.html';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('hidden');
}

function closeConfirmedModal() {
  const modal = document.getElementById('orderConfirmedModal');
  if (modal) modal.classList.add('hidden');
}

window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.closeConfirmedModal = closeConfirmedModal;
window.toggleCheckoutMethod = toggleCheckoutMethod;
window.submitCheckoutOrder = submitCheckoutOrder;

// -------------------------------------------------------------
// 13. ORDER STATUS TRACKING (Requirement 10)
// -------------------------------------------------------------

function openOrderTrackingModal(orderId) {
  let order = null;
  if (orderId) {
    order = ORDERS_LIST.find(o => o.orderId === orderId);
  }
  if (!order) {
    order = ORDERS_LIST[0]; // Default to latest order
  }

  let modal = document.getElementById('orderTrackingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'orderTrackingModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
    document.body.appendChild(modal);
  }

  const steps = [
    { title: "Order Received", desc: "Payment authorized via 256-bit encryption", active: true },
    { title: "Kitchen Batch Prep", desc: "Fresh organic ingredients grilled in Etobicoke", active: order.status !== "Received" },
    { title: "Cold-Chain Certified", desc: "Sealed fresh with tamper-proof thermal packaging", active: order.status === "Cold-Chain Verified" || order.status === "Out for Delivery" || order.status === "Delivered" },
    { title: "Out for Courier Delivery", desc: "Courier on route with climate-controlled cooler", active: order.status === "Out for Delivery" || order.status === "Delivered" },
    { title: "Doorstep Drop / Picked Up", desc: "Delivered to recipient with photo & SMS confirmation", active: order.status === "Delivered" }
  ];

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
      <button onclick="closeOrderTrackingModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-2">✕</button>
      
      <div class="border-b border-gray-100 pb-4 mb-6">
        <span class="text-xs font-bold text-greek-gold uppercase tracking-wider">Live Batch Tracking</span>
        <h3 class="font-heading font-extrabold text-2xl text-gray-900">Order #${order.orderId}</h3>
        <p class="text-xs text-gray-500 mt-1">${order.batchDay} • ${order.address}</p>
      </div>

      <!-- 5-Step Progress Timeline -->
      <div class="space-y-6 relative pl-6 border-l-2 border-greek-gold/40 my-6">
        ${steps.map((s, idx) => `
          <div class="relative">
            <span class="absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.active ? 'bg-greek-gold text-greek-navyDark ring-4 ring-greek-gold/20' : 'bg-gray-200 text-gray-500'}">
              ${s.active ? '✓' : idx + 1}
            </span>
            <strong class="block text-sm ${s.active ? 'text-gray-900' : 'text-gray-400'}">${s.title}</strong>
            <span class="text-xs text-gray-500">${s.desc}</span>
          </div>
        `).join('')}
      </div>

      <!-- Simulated SMS & Email Notifications -->
      <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-2 mt-6">
        <strong class="text-gray-700 block">📱 Delivery Notifications Log:</strong>
        <p class="text-gray-600">✓ SMS alert sent to ${order.phone}: "Your Greek Fit Kitchen order #${order.orderId} is confirmed for batch prep."</p>
        <p class="text-gray-600">✓ Email receipt dispatched to ${order.email}.</p>
      </div>

      <div class="mt-6 flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>Order Grand Total: <strong>$${order.grandTotal.toFixed(2)} CAD</strong></span>
        <button onclick="closeOrderTrackingModal()" class="px-5 py-2.5 bg-greek-navy text-white font-bold rounded-xl shadow">Close Tracker</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeOrderTrackingModal() {
  const modal = document.getElementById('orderTrackingModal');
  if (modal) modal.classList.add('hidden');
}

window.openOrderTrackingModal = openOrderTrackingModal;
window.closeOrderTrackingModal = closeOrderTrackingModal;

// -------------------------------------------------------------
// 14. ADMIN & OPERATIONS DASHBOARD (Requirements 12–16)
// -------------------------------------------------------------

function initMenuManagerUI() {
  renderAdminUI();
}

function renderAdminUI() {
  // If we are on the standalone admin.html portal, do NOT inject popup modal or floating launcher
  if (document.getElementById('adminPortalContainer') || window.location.pathname.toLowerCase().includes('admin.html')) {
    return;
  }
  if (document.getElementById('visualMenuManagerLauncher')) return;

  const launcher = document.createElement('div');
  launcher.id = 'visualMenuManagerLauncher';
  launcher.className = 'fixed bottom-5 left-5 z-40';
  launcher.innerHTML = `
    <button onclick="openMenuManagerModal()" class="flex items-center gap-2 px-4 py-2.5 bg-greek-navy hover:bg-greek-navyDark text-white text-xs font-bold rounded-full shadow-2xl border border-greek-gold/40 transition-all hover:scale-105" title="Manage Business & Menu">
      <span class="w-2.5 h-2.5 rounded-full bg-greek-gold animate-pulse"></span>
      <span>Operations Admin</span>
    </button>
  `;
  document.body.appendChild(launcher);

  const modalWrapper = document.createElement('div');
  modalWrapper.id = 'menuManagerModal';
  modalWrapper.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm hidden';
  modalWrapper.innerHTML = `
    <div class="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
      
      <!-- Modal Header -->
      <div class="p-6 bg-greek-navy text-white flex items-center justify-between border-b border-greek-gold/30">
        <div>
          <span class="text-xs uppercase font-bold text-greek-gold tracking-widest">Greek Fit Kitchen Operations Suite</span>
          <h2 class="text-xl sm:text-2xl font-extrabold font-heading">Business &amp; Menu Administration</h2>
          <p class="text-xs text-slate-300 mt-1">Manage dishes, orders, delivery zones, promo coupons, refunds, and analytics without coding.</p>
        </div>
        <button onclick="closeMenuManagerModal()" class="p-2 text-gray-300 hover:text-white rounded-lg">✕</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 px-6 pt-3 gap-2 overflow-x-auto text-xs font-bold">
        <button onclick="switchAdminPortalTab('dashboard')" id="adminTabBtn-dashboard" class="px-4 py-2.5 rounded-t-xl bg-white border-t-2 border-greek-gold text-greek-navy">Dashboard</button>
        <button onclick="switchAdminPortalTab('orders')" id="adminTabBtn-orders" class="px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900">Orders (${ORDERS_LIST.length})</button>
        <button onclick="switchAdminPortalTab('menu')" id="adminTabBtn-menu" class="px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900">Dishes (${MENU_ITEMS.length})</button>
        <button onclick="switchAdminPortalTab('packages')" id="adminTabBtn-packages" class="px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900">Packages (${PACKAGES_LIST.length})</button>
        <button onclick="switchAdminPortalTab('sides')" id="adminTabBtn-sides" class="px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900">Sides &amp; Add-ons</button>
        <button onclick="switchAdminPortalTab('delivery')" id="adminTabBtn-delivery" class="px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900">Delivery &amp; Tax</button>
        <button onclick="switchAdminPortalTab('promotions')" id="adminTabBtn-promotions" class="px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900">Coupons</button>
        <button onclick="switchAdminPortalTab('logs')" id="adminTabBtn-logs" class="px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900">Staff &amp; Logs</button>
      </div>

      <!-- Content Area -->
      <div class="p-6 flex-1 overflow-y-auto space-y-6" id="adminContentArea">
        <!-- Rendered dynamically -->
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3 text-xs">
        <div class="flex items-center gap-2">
          <a href="admin.html" class="text-greek-navy font-bold hover:underline">Open Dedicated Standalone Portal →</a>
        </div>
        <div class="flex gap-2">
          <button onclick="closeMenuManagerModal()" class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition">Close</button>
          <button onclick="saveAllMenuManagerChanges()" class="px-5 py-2.5 bg-greek-gold hover:bg-greek-goldHover text-greek-navyDark font-bold rounded-xl shadow transition">Save All Changes</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalWrapper);
}

function openMenuManagerModal() {
  const modal = document.getElementById('menuManagerModal');
  if (modal) {
    modal.classList.remove('hidden');
    switchAdminPortalTab('dashboard');
  }
}

function closeMenuManagerModal() {
  const modal = document.getElementById('menuManagerModal');
  if (modal) modal.classList.add('hidden');
}

window.openMenuManagerModal = openMenuManagerModal;
window.closeMenuManagerModal = closeMenuManagerModal;

function switchAdminPortalTab(tabName) {
  // Update Tab Header Classes in both standalone portal & modal
  ['dashboard', 'orders', 'menu', 'packages', 'sides', 'delivery', 'promotions', 'logs'].forEach(t => {
    // 1. Standalone Portal Navigation Buttons (admin.html)
    const portalBtn = document.getElementById('portalTab-' + t);
    if (portalBtn) {
      if (t === tabName) {
        portalBtn.className = 'portal-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-greek-gold text-greek-navyDark shadow-sm';
      } else {
        portalBtn.className = 'portal-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition';
      }
    }

    // 2. Popup Modal Navigation Buttons (if modal exists on other pages)
    const modalBtn = document.getElementById('adminTabBtn-' + t);
    if (modalBtn) {
      if (t === tabName) {
        modalBtn.className = 'px-4 py-2.5 rounded-t-xl bg-white border-t-2 border-greek-gold text-greek-navy font-bold';
      } else {
        modalBtn.className = 'px-4 py-2.5 rounded-t-xl text-gray-600 hover:text-gray-900 font-semibold';
      }
    }
  });

  // Prefer standalone container on admin.html, otherwise modal content area
  const contentArea = document.getElementById('adminPortalContainer') || document.getElementById('adminContentArea');
  if (!contentArea) {
    console.error("switchAdminPortalTab: neither adminPortalContainer nor adminContentArea found");
    return;
  }

  if (tabName === 'dashboard') {
    renderAdminDashboardTab(contentArea);
  } else if (tabName === 'orders') {
    renderAdminOrdersTab(contentArea);
  } else if (tabName === 'menu') {
    renderAdminMenuTab(contentArea);
  } else if (tabName === 'packages') {
    renderAdminPackagesTab(contentArea);
  } else if (tabName === 'sides') {
    renderAdminSidesTab(contentArea);
  } else if (tabName === 'delivery') {
    renderAdminDeliveryTab(contentArea);
  } else if (tabName === 'promotions') {
    renderAdminPromotionsTab(contentArea);
  } else if (tabName === 'logs') {
    renderAdminLogsTab(contentArea);
  }
}

window.switchAdminPortalTab = switchAdminPortalTab;

// 14A. Dashboard & Reports Tab (Requirement 15)
function renderAdminDashboardTab(container) {
  const totalRevenue = ORDERS_LIST.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalOrders = ORDERS_LIST.length;
  const aov = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';
  const totalMealsSold = ORDERS_LIST.reduce((sum, o) => sum + (o.mealsCount || 0), 0);

  container.innerHTML = `
    <div class="space-y-6">
      <!-- KPI Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <span class="text-xs font-bold text-gray-400 uppercase">Total Revenue</span>
          <h3 class="text-2xl font-extrabold text-greek-navy font-heading mt-1">$${totalRevenue.toFixed(2)} CAD</h3>
          <span class="text-[11px] text-green-600 font-semibold">↑ Verified Paid Batches</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <span class="text-xs font-bold text-gray-400 uppercase">Orders Processed</span>
          <h3 class="text-2xl font-extrabold text-gray-900 font-heading mt-1">${totalOrders} Orders</h3>
          <span class="text-[11px] text-gray-500">Sunday &amp; Wednesday Drops</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <span class="text-xs font-bold text-gray-400 uppercase">Average Order Value</span>
          <h3 class="text-2xl font-extrabold text-greek-gold font-heading mt-1">$${aov} CAD</h3>
          <span class="text-[11px] text-gray-500">Target > $85.00 CAD</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <span class="text-xs font-bold text-gray-400 uppercase">Chef Meals Prepped</span>
          <h3 class="text-2xl font-extrabold text-green-700 font-heading mt-1">${totalMealsSold} Meals</h3>
          <span class="text-[11px] text-gray-500">100% Greek Kitchen Scratch Prep</span>
        </div>
      </div>

      <!-- Popular Meals & Delivery Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h4 class="font-bold text-sm text-gray-900 mb-4">Top Performing Chef Dishes</h4>
          <div class="space-y-3">
            <div class="space-y-1 text-xs">
              <div class="flex justify-between font-bold"><span>Grilled Chicken</span><span>28% of orders</span></div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div class="bg-greek-gold h-full" style="width: 28%"></div></div>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between font-bold"><span>Salmon Fillet</span><span>22% of orders</span></div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div class="bg-greek-navy h-full" style="width: 22%"></div></div>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between font-bold"><span>Stuffed Chicken</span><span>18% of orders</span></div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div class="bg-green-600 h-full" style="width: 18%"></div></div>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between font-bold"><span>Spinach &amp; Feta Chicken</span><span>15% of orders</span></div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div class="bg-amber-600 h-full" style="width: 15%"></div></div>
            </div>
          </div>
        </div>

        <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h4 class="font-bold text-sm text-gray-900 mb-4">Delivery Zone Distribution</h4>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between p-2.5 bg-gray-50 rounded-xl"><span>Etobicoke (Tier 1: Free &lt;= 2km)</span><strong>34%</strong></div>
            <div class="flex justify-between p-2.5 bg-gray-50 rounded-xl"><span>Mississauga / South Etobicoke (Tier 2: $5)</span><strong>28%</strong></div>
            <div class="flex justify-between p-2.5 bg-gray-50 rounded-xl"><span>Downtown Toronto (Tier 3: $1/km)</span><strong>26%</strong></div>
            <div class="flex justify-between p-2.5 bg-gray-50 rounded-xl"><span>Kitchen Pickup (Etobicoke HQ)</span><strong>12%</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 14B. Order Administration Tab (Requirement 13)
function renderAdminOrdersTab(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-base text-gray-900">Customer Order Administration</h3>
          <p class="text-xs text-gray-500">Track batch prep status, review customer instructions, cancel orders, or process refunds.</p>
        </div>
      </div>

      <div class="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
              <th class="p-3.5">Order ID</th>
              <th class="p-3.5">Customer &amp; Phone</th>
              <th class="p-3.5">Batch Drop &amp; Address</th>
              <th class="p-3.5">Meals</th>
              <th class="p-3.5">Total Paid</th>
              <th class="p-3.5">Status</th>
              <th class="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            ${ORDERS_LIST.map(o => `
              <tr class="hover:bg-gray-50/50">
                <td class="p-3.5 font-mono font-bold text-greek-navy">${o.orderId}</td>
                <td class="p-3.5">
                  <strong class="block text-gray-900">${o.customerName}</strong>
                  <span class="text-gray-500">${o.phone}</span>
                </td>
                <td class="p-3.5 max-w-xs">
                  <span class="block text-greek-gold font-bold">${o.batchDay}</span>
                  <span class="text-gray-600 truncate block">${o.address}</span>
                </td>
                <td class="p-3.5 font-bold">${o.mealsCount} Meals</td>
                <td class="p-3.5 font-bold text-green-700">$${o.grandTotal.toFixed(2)} CAD</td>
                <td class="p-3.5">
                  <select onchange="updateOrderStatus('${o.orderId}', this.value)" class="py-1 px-2.5 rounded-lg border border-gray-300 text-xs font-bold focus:ring-1 focus:ring-greek-gold">
                    <option value="Received" ${o.status === 'Received' ? 'selected' : ''}>Received</option>
                    <option value="Kitchen Prep" ${o.status === 'Kitchen Prep' ? 'selected' : ''}>Kitchen Prep</option>
                    <option value="Cold-Chain Verified" ${o.status === 'Cold-Chain Verified' ? 'selected' : ''}>Cold-Chain Verified</option>
                    <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled & Refunded" ${o.status === 'Cancelled & Refunded' ? 'selected' : ''}>Cancelled &amp; Refunded</option>
                  </select>
                </td>
                <td class="p-3.5 text-right space-x-1">
                  <button onclick="openOrderTrackingModal('${o.orderId}')" class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold">Track</button>
                  <button onclick="adminProcessRefund('${o.orderId}')" class="px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded-lg text-red-700 font-bold">Refund</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function updateOrderStatus(orderId, newStatus) {
  const order = ORDERS_LIST.find(o => o.orderId === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem('gfk-orders', JSON.stringify(ORDERS_LIST));
    logActivity("Order Status Updated", `Order #${orderId} marked as "${newStatus}".`);
    alert(`Order #${orderId} status updated to: ${newStatus}`);
  }
}

function adminProcessRefund(orderId) {
  const order = ORDERS_LIST.find(o => o.orderId === orderId);
  if (!order) return;

  const reason = prompt(`Enter refund reason for Order #${orderId} ($${order.grandTotal.toFixed(2)} CAD):`, "Customer Cancellation Request");
  if (reason) {
    order.status = "Cancelled & Refunded";
    localStorage.setItem('gfk-orders', JSON.stringify(ORDERS_LIST));
    logActivity("Refund Processed", `Refund of $${order.grandTotal.toFixed(2)} CAD processed for Order #${orderId}. Reason: ${reason}`);
    alert(`✓ Refund of $${order.grandTotal.toFixed(2)} CAD processed successfully. Order marked as Cancelled & Refunded.`);
    switchAdminPortalTab('orders');
  }
}

window.updateOrderStatus = updateOrderStatus;
window.adminProcessRefund = adminProcessRefund;

// 14C. Menu Administration Tab (Requirement 12)
function renderAdminMenuTab(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-base text-gray-900">Manage Menu Items &amp; Prices (${MENU_ITEMS.length} Dishes)</h3>
          <p class="text-xs text-gray-500">Edit meal prices, names, descriptions, or toggle stock availability instantly.</p>
        </div>
        <button onclick="adminAddNewMealPrompt()" class="px-4 py-2 bg-greek-gold hover:bg-greek-goldHover text-greek-navyDark font-extrabold text-xs rounded-xl shadow transition">
          + Add New Dish
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${MENU_ITEMS.map((meal, idx) => `
          <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex gap-4">
            <img src="${meal.image}" alt="${meal.name}" class="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0" onerror="this.src='images/meals/grilled-chicken.jpg'" />
            <div class="flex-1 space-y-2">
              <div class="flex justify-between items-start">
                <input type="text" value="${meal.name}" onchange="adminUpdateMealField(${idx}, 'name', this.value)" class="font-bold text-sm text-gray-900 border-b border-gray-200 focus:border-greek-gold outline-none w-full mr-2" />
                <button onclick="adminDeleteMeal(${idx})" class="text-gray-400 hover:text-red-500 p-1" title="Delete Dish">✕</button>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1 text-xs">
                  <span class="text-gray-500">$</span>
                  <input type="number" step="0.50" value="${meal.price.toFixed(2)}" onchange="adminUpdateMealField(${idx}, 'price', parseFloat(this.value))" class="w-16 p-1 rounded-lg border border-gray-300 font-extrabold text-xs text-greek-navy" />
                  <span class="text-gray-500">CAD</span>
                </div>

                <label class="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" ${meal.available !== false ? 'checked' : ''} onchange="adminUpdateMealField(${idx}, 'available', this.checked)" class="rounded text-greek-gold focus:ring-greek-gold" />
                  <span class="${meal.available !== false ? 'text-green-700' : 'text-red-600'}">${meal.available !== false ? 'In Stock' : 'Sold Out'}</span>
                </label>
              </div>

              <input type="text" value="${meal.dietary || 'High Protein'}" onchange="adminUpdateMealField(${idx}, 'dietary', this.value)" placeholder="Dietary tags" class="w-full text-xs text-gray-500 border-b border-gray-100 focus:border-greek-gold outline-none" />
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function adminUpdateMealField(idx, field, value) {
  if (MENU_ITEMS[idx]) {
    MENU_ITEMS[idx][field] = value;
    localStorage.setItem('gfk-menu-items', JSON.stringify(MENU_ITEMS));
    logActivity("Dish Modified", `Updated ${field} of ${MENU_ITEMS[idx].name} to: ${value}`);
    renderMenu();
  }
}

function adminAddNewMealPrompt() {
  const name = prompt("Enter new meal name:", "Greek Lemon Herb Chicken");
  if (!name) return;
  const price = parseFloat(prompt("Enter meal price in CAD:", "13.99")) || 13.99;

  const newMeal = {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name,
    price,
    category: "chicken",
    image: "images/meals/grilled-chicken.jpg",
    description: "Chef-prepared fresh Greek fitness meal prep with organic spices and clean macro balance.",
    dietary: "High Protein, Clean Ingredients",
    available: true
  };

  MENU_ITEMS.push(newMeal);
  localStorage.setItem('gfk-menu-items', JSON.stringify(MENU_ITEMS));
  logActivity("New Dish Added", `Created new dish: ${name} ($${price.toFixed(2)} CAD).`);
  renderMenu();
  switchAdminPortalTab('menu');
}

function adminDeleteMeal(idx) {
  if (confirm(`Are you sure you want to delete ${MENU_ITEMS[idx].name}?`)) {
    const deleted = MENU_ITEMS.splice(idx, 1);
    localStorage.setItem('gfk-menu-items', JSON.stringify(MENU_ITEMS));
    logActivity("Dish Removed", `Deleted dish: ${deleted[0].name}.`);
    renderMenu();
    switchAdminPortalTab('menu');
  }
}

window.adminUpdateMealField = adminUpdateMealField;
window.adminAddNewMealPrompt = adminAddNewMealPrompt;
window.adminDeleteMeal = adminDeleteMeal;

// 14D. Combo Packages Tab (Requirement 3)
function renderAdminPackagesTab(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-base text-gray-900">Combo Packages Administration (${PACKAGES_LIST.length} Plans)</h3>
        <p class="text-xs text-gray-500">Configure multi-meal package plans, starting prices, and customer descriptions.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${PACKAGES_LIST.map((pkg, idx) => `
          <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <span class="px-3 py-1 bg-greek-gold/20 text-greek-navyDark text-xs font-bold rounded-full">${pkg.badge}</span>
            <h4 class="font-bold text-lg text-gray-900">${pkg.name}</h4>
            <p class="text-xs text-gray-500">${pkg.description}</p>
            
            <div class="space-y-2 pt-2 border-t border-gray-100 text-xs">
              <div class="flex justify-between items-center">
                <span>Meal Count:</span>
                <input type="number" value="${pkg.mealCount}" onchange="adminUpdatePackage(${idx}, 'mealCount', parseInt(this.value))" class="w-16 p-1 border rounded-lg font-bold text-right" />
              </div>
              <div class="flex justify-between items-center">
                <span>Package Price (CAD):</span>
                <input type="number" step="0.50" value="${pkg.price.toFixed(2)}" onchange="adminUpdatePackage(${idx}, 'price', parseFloat(this.value))" class="w-20 p-1 border rounded-lg font-bold text-right text-greek-navy" />
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function adminUpdatePackage(idx, field, val) {
  if (PACKAGES_LIST[idx]) {
    PACKAGES_LIST[idx][field] = val;
    localStorage.setItem('gfk-packages-list', JSON.stringify(PACKAGES_LIST));
    logActivity("Package Updated", `Updated ${PACKAGES_LIST[idx].name} ${field} to: ${val}`);
  }
}

window.adminUpdatePackage = adminUpdatePackage;

// 14E. Sides & Add-ons Tab (Requirement 4)
function renderAdminSidesTab(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-base text-gray-900">Side Options &amp; Add-ons Management</h3>
        <p class="text-xs text-gray-500">Manage the 11 complimentary sides list, extra sides price ($4.99), and premium protein add-ons.</p>
      </div>

      <!-- Extra Side Price Control -->
      <div class="p-5 bg-white rounded-2xl border border-gray-200 flex justify-between items-center">
        <div>
          <strong class="block text-sm text-gray-900">Extra Side Add-on Price</strong>
          <span class="text-xs text-gray-500">Charged when customers add additional sides beyond the 2 included sides.</span>
        </div>
        <div class="flex items-center gap-1 font-bold text-sm">
          <span>$</span>
          <input type="number" step="0.50" value="${CONFIG.extraSidePrice.toFixed(2)}" onchange="adminUpdateConfig('extraSidePrice', parseFloat(this.value))" class="w-20 p-2 border border-gray-300 rounded-xl text-center" />
          <span>CAD</span>
        </div>
      </div>

      <!-- Sides List -->
      <div class="p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
        <div class="flex justify-between items-center">
          <h4 class="font-bold text-sm text-gray-900">Approved Sides Options (${SIDES_LIST.length})</h4>
          <button onclick="adminAddSidePrompt()" class="px-3 py-1.5 bg-greek-navy text-white text-xs font-bold rounded-xl hover:bg-greek-navyDark transition">+ Add Side</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          ${SIDES_LIST.map((s, idx) => `
            <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <span class="font-medium text-gray-800">${s}</span>
              <button onclick="adminDeleteSide(${idx})" class="text-gray-400 hover:text-red-500 font-bold p-1">✕</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function adminAddSidePrompt() {
  const name = prompt("Enter new side option name:", "Roasted Greek Cauliflower");
  if (name) {
    SIDES_LIST.push(name.trim());
    localStorage.setItem('gfk-sides-list', JSON.stringify(SIDES_LIST));
    logActivity("Side Added", `Added side option: ${name}.`);
    switchAdminPortalTab('sides');
  }
}

function adminDeleteSide(idx) {
  if (confirm(`Remove "${SIDES_LIST[idx]}" from sides?`)) {
    const deleted = SIDES_LIST.splice(idx, 1);
    localStorage.setItem('gfk-sides-list', JSON.stringify(SIDES_LIST));
    logActivity("Side Removed", `Removed side option: ${deleted[0]}.`);
    switchAdminPortalTab('sides');
  }
}

window.adminAddSidePrompt = adminAddSidePrompt;
window.adminDeleteSide = adminDeleteSide;

// 14F. Delivery & Tax Settings Tab (Requirements 9 & 14)
function renderAdminDeliveryTab(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-base text-gray-900">Delivery Zones &amp; Tax Settings</h3>
        <p class="text-xs text-gray-500">Configure exact distance fee tiers, 13% Ontario HST tax rates, and order rules.</p>
      </div>

      <div class="p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
        <h4 class="font-bold text-sm text-gray-900">Tiered Delivery Fee Schedule</h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <strong class="block text-gray-900 font-bold">Tier 1: Local Etobicoke</strong>
            <span class="text-gray-500">Up to ${CONFIG.deliveryTier1MaxKm} km</span>
            <div class="pt-2 font-extrabold text-green-700 text-sm">FREE ($0.00 CAD)</div>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <strong class="block text-gray-900 font-bold">Tier 2: Near GTA</strong>
            <span class="text-gray-500">Over 2 km up to 5 km</span>
            <div class="pt-2 font-extrabold text-greek-navy text-sm">$5.00 CAD Flat</div>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <strong class="block text-gray-900 font-bold">Tier 3: Greater Toronto</strong>
            <span class="text-gray-500">Distance > 5 km</span>
            <div class="pt-2 font-extrabold text-greek-navy text-sm">$1.00 CAD / km Full Distance</div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
        <h4 class="font-bold text-sm text-gray-900">Tax Settings (Ontario HST)</h4>
        <div class="flex items-center justify-between text-xs">
          <div>
            <strong class="block text-gray-900 font-semibold">Enable 13% Ontario HST</strong>
            <span class="text-gray-500">Calculated automatically on meal prep order subtotal</span>
          </div>
          <label class="flex items-center gap-2 cursor-pointer font-bold">
            <input type="checkbox" ${CONFIG.taxEnabled ? 'checked' : ''} onchange="adminUpdateConfig('taxEnabled', this.checked)" class="rounded text-greek-gold" />
            <span>Active (13% HST)</span>
          </label>
        </div>
      </div>

      <div class="p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
        <h4 class="font-bold text-sm text-gray-900">Minimum Order Rule</h4>
        <div class="flex items-center justify-between text-xs">
          <div>
            <strong class="block text-gray-900 font-semibold">Minimum Meal Threshold</strong>
            <span class="text-gray-500">Customers must select this many meals before checkout is unlocked.</span>
          </div>
          <input type="number" min="1" max="20" value="${CONFIG.minMeals}" onchange="adminUpdateConfig('minMeals', parseInt(this.value))" class="w-16 p-2 border rounded-xl font-bold text-center" />
        </div>
      </div>
    </div>
  `;
}

function adminUpdateConfig(key, val) {
  CONFIG[key] = val;
  localStorage.setItem('gfk-site-config', JSON.stringify(CONFIG));
  logActivity("Setting Modified", `Updated configuration setting "${key}" to: ${val}`);
  updateCartUI();
}

window.adminUpdateConfig = adminUpdateConfig;

// 14G. Promotions & Coupons Tab (Requirement 11)
function renderAdminPromotionsTab(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-base text-gray-900">Promotions, Coupons &amp; Volume Discounts</h3>
          <p class="text-xs text-gray-500">Manage customer promo codes, discount percentages, and 7+ meal volume rules.</p>
        </div>
        <button onclick="adminAddCouponPrompt()" class="px-4 py-2 bg-greek-gold text-greek-navyDark font-extrabold text-xs rounded-xl shadow">+ Create Promo Code</button>
      </div>

      <!-- Volume Discount Card -->
      <div class="p-5 bg-white rounded-2xl border border-gray-200 flex justify-between items-center">
        <div>
          <strong class="block text-sm text-gray-900">Automatic Volume Discount</strong>
          <span class="text-xs text-gray-500">10% discount applied to meal items on orders of 7 meals or more.</span>
        </div>
        <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Active: 10% on 7+ Meals</span>
      </div>

      <!-- Coupons Table -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
            <tr>
              <th class="p-3.5">Code</th>
              <th class="p-3.5">Type &amp; Value</th>
              <th class="p-3.5">Description</th>
              <th class="p-3.5">Min Order</th>
              <th class="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            ${COUPONS_LIST.map((c, idx) => `
              <tr>
                <td class="p-3.5 font-mono font-bold text-greek-navy">${c.code}</td>
                <td class="p-3.5 font-bold">${c.type === 'percent' ? c.value + '% Off' : (c.type === 'dollar' ? '$' + c.value.toFixed(2) + ' Off' : 'Free Delivery')}</td>
                <td class="p-3.5 text-gray-600">${c.description}</td>
                <td class="p-3.5">${c.minMeals} Meals</td>
                <td class="p-3.5 text-right">
                  <button onclick="adminDeleteCoupon(${idx})" class="text-gray-400 hover:text-red-500 font-bold">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function adminAddCouponPrompt() {
  const code = prompt("Enter new coupon code (e.g. FIT20):");
  if (!code) return;
  const val = parseFloat(prompt("Enter discount percentage value (e.g. 20):", "20")) || 10;

  COUPONS_LIST.push({
    code: code.trim().toUpperCase(),
    type: "percent",
    value: val,
    description: `${val}% Discount Coupon`,
    minMeals: 6,
    active: true
  });
  localStorage.setItem('gfk-coupons-list', JSON.stringify(COUPONS_LIST));
  logActivity("Coupon Created", `Created promo code: ${code.toUpperCase()} (${val}% Off).`);
  switchAdminPortalTab('promotions');
}

function adminDeleteCoupon(idx) {
  const deleted = COUPONS_LIST.splice(idx, 1);
  localStorage.setItem('gfk-coupons-list', JSON.stringify(COUPONS_LIST));
  logActivity("Coupon Deleted", `Removed coupon: ${deleted[0].code}.`);
  switchAdminPortalTab('promotions');
}

window.adminAddCouponPrompt = adminAddCouponPrompt;
window.adminDeleteCoupon = adminDeleteCoupon;

// 14H. Staff Access & Activity Logs Tab (Requirement 16)
function renderAdminLogsTab(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-base text-gray-900">Staff Access Roles &amp; Security Audit Log</h3>
        <p class="text-xs text-gray-500">Role-based controls, PIN authorization, and permanent audit trail.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="p-4 bg-white rounded-2xl border ${state.staffRole === 'admin' ? 'border-greek-gold ring-2 ring-greek-gold/20' : 'border-gray-200'}">
          <strong class="block text-gray-900 font-bold">1. Administrator (PIN: 1234)</strong>
          <p class="text-gray-500 mt-1">Full access to menus, pricing, refunds, analytics, and staff settings.</p>
        </div>
        <div class="p-4 bg-white rounded-2xl border ${state.staffRole === 'kitchen' ? 'border-greek-gold ring-2 ring-greek-gold/20' : 'border-gray-200'}">
          <strong class="block text-gray-900 font-bold">2. Kitchen Staff (PIN: 2233)</strong>
          <p class="text-gray-500 mt-1">Access to meal batch prep tickets, side counts, and dietary notes.</p>
        </div>
        <div class="p-4 bg-white rounded-2xl border ${state.staffRole === 'courier' ? 'border-greek-gold ring-2 ring-greek-gold/20' : 'border-gray-200'}">
          <strong class="block text-gray-900 font-bold">3. Delivery Courier (PIN: 4455)</strong>
          <p class="text-gray-500 mt-1">Access to delivery routes, customer addresses, buzzer codes, and drop confirmations.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700">
          Activity Audit Log (Last 50 Events)
        </div>
        <div class="divide-y divide-gray-100 max-h-72 overflow-y-auto text-xs">
          ${ACTIVITY_LOGS.map(log => `
            <div class="p-3 flex items-start justify-between gap-4 hover:bg-gray-50/50">
              <div>
                <span class="font-bold text-greek-navy">[${log.role}]</span>
                <span class="font-semibold text-gray-900 ml-1">${log.action}:</span>
                <span class="text-gray-600 ml-1">${log.details}</span>
              </div>
              <span class="text-gray-400 font-mono text-[11px] flex-shrink-0">${log.timestamp}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function changeStaffRole(role) {
  state.staffRole = role;
  localStorage.setItem('gfk-staff-role', role);
  logActivity("Role Switched", `Staff active role changed to: ${role.toUpperCase()}`);
  alert(`Active interface role set to: ${role.toUpperCase()}`);
}

window.changeStaffRole = changeStaffRole;

function saveAllMenuManagerChanges() {
  localStorage.setItem('gfk-menu-items', JSON.stringify(MENU_ITEMS));
  localStorage.setItem('gfk-sides-list', JSON.stringify(SIDES_LIST));
  localStorage.setItem('gfk-site-config', JSON.stringify(CONFIG));
  localStorage.setItem('gfk-packages-list', JSON.stringify(PACKAGES_LIST));
  localStorage.setItem('gfk-coupons-list', JSON.stringify(COUPONS_LIST));
  logActivity("Bulk Save", "Administrator saved all menu, pricing, and operational settings.");
  renderMenu();
  alert("✓ All changes saved and synchronized across the website!");
  closeMenuManagerModal();
}

window.saveAllMenuManagerChanges = saveAllMenuManagerChanges;

// -------------------------------------------------------------
// 15. AUXILIARY MODALS & DRAWERS
// -------------------------------------------------------------

function initEventModals() {
  const mobileBtn = document.getElementById('mobileMenuToggleBtn');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');
  const mobileClose = document.getElementById('mobileMenuCloseBtn');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('-translate-x-full');
    });
  }
  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.add('-translate-x-full');
    });
  }
}
