/**
 * Greek Fit Kitchen - Database Connection & Schema Initialization
 * SQLite 3 Engine with WAL mode, Relational Schema, and Complete Pre-Seeding
 */

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data', 'greekfitkitchen.db');
const db = new sqlite3.Database(DB_PATH);

// Promise-based wrappers
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function initDB() {
  await exec(`PRAGMA journal_mode = WAL;`);
  await exec(`PRAGMA foreign_keys = ON;`);

  // 1. Roles & Users
  await exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      permissions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
      avatar TEXT,
      is_active INTEGER DEFAULT 1,
      last_login_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      ip_address TEXT,
      user_agent TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Pages & Layout Structure
  await exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      status TEXT DEFAULT 'published', -- 'published', 'draft', 'trash'
      template TEXT DEFAULT 'default',
      featured_image TEXT,
      seo_title TEXT,
      meta_description TEXT,
      author_id INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS page_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      section_uuid TEXT NOT NULL,
      title TEXT,
      structure_type TEXT DEFAULT '1col',
      background_type TEXT DEFAULT 'color',
      background_value TEXT DEFAULT '#ffffff',
      padding TEXT,
      margin TEXT,
      order_index INTEGER DEFAULT 0,
      is_hidden INTEGER DEFAULT 0,
      custom_css TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS page_elements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL REFERENCES page_sections(id) ON DELETE CASCADE,
      element_uuid TEXT NOT NULL,
      widget_type TEXT NOT NULL,
      column_index INTEGER DEFAULT 0,
      content_json TEXT,
      style_json TEXT,
      advanced_json TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS page_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      author_id INTEGER REFERENCES users(id),
      layout_json TEXT NOT NULL,
      revision_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      template_type TEXT NOT NULL, -- 'section', 'page', 'element'
      content_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS navigation_menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL UNIQUE, -- 'primary', 'footer', 'mobile'
      items_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Media Library
  await exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      url TEXT NOT NULL,
      alt_text TEXT,
      caption TEXT,
      description TEXT,
      folder TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Meals, Categories, Packages & Sides
  await exec(`
    CREATE TABLE IF NOT EXISTS meal_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category_id INTEGER REFERENCES meal_categories(id) ON DELETE SET NULL,
      description TEXT,
      price_cad REAL NOT NULL,
      image_url TEXT,
      calories INTEGER DEFAULT 0,
      protein INTEGER DEFAULT 0,
      carbs INTEGER DEFAULT 0,
      fat INTEGER DEFAULT 0,
      ingredients TEXT,
      allergens TEXT,
      dietary_labels TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS meal_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      min_qty INTEGER NOT NULL DEFAULT 6,
      max_qty INTEGER,
      base_price_cad REAL DEFAULT 59.94,
      discount_percent REAL DEFAULT 0,
      description TEXT,
      image_url TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'included', -- 'included', 'extra'
      price_cad REAL DEFAULT 0.00,
      description TEXT,
      image_url TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Orders, Customers & Delivery
  await exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      default_address TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      delivery_address TEXT,
      delivery_date TEXT,
      delivery_type TEXT DEFAULT 'delivery', -- 'delivery', 'pickup'
      delivery_distance_km REAL DEFAULT 0.0,
      subtotal_cad REAL NOT NULL,
      discount_cad REAL DEFAULT 0.0,
      tax_cad REAL DEFAULT 0.0,
      delivery_fee_cad REAL DEFAULT 0.0,
      grand_total_cad REAL NOT NULL,
      payment_status TEXT DEFAULT 'paid', -- 'pending', 'paid', 'refunded'
      payment_method TEXT DEFAULT 'Credit Card (Simulated)',
      order_status TEXT DEFAULT 'confirmed', -- 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled', 'refunded'
      special_instructions TEXT,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      meal_id INTEGER REFERENCES meals(id) ON DELETE SET NULL,
      meal_name TEXT NOT NULL,
      price_cad REAL NOT NULL,
      quantity INTEGER DEFAULT 1,
      customization_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS discounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      discount_type TEXT DEFAULT 'percent', -- 'percent', 'fixed'
      discount_value REAL NOT NULL,
      min_order_value REAL DEFAULT 0.0,
      min_meals_qty INTEGER DEFAULT 0,
      usage_limit INTEGER,
      times_used INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS delivery_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT NOT NULL UNIQUE,
      setting_value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Blog, Forms, Settings, Analytics, Activity Logs & Backups
  await exec(`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_type TEXT NOT NULL, -- 'catering', 'dietary', 'contact'
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      details_json TEXT NOT NULL,
      status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'responded', 'closed'
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT DEFAULT 'Nutrition',
      tags TEXT,
      author_id INTEGER REFERENCES users(id),
      author_name TEXT DEFAULT 'George the Greek',
      featured_image TEXT,
      excerpt TEXT,
      content TEXT,
      status TEXT DEFAULT 'published', -- 'published', 'draft', 'scheduled'
      seo_title TEXT,
      meta_description TEXT,
      read_time TEXT DEFAULT '5 min read',
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS global_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_group TEXT NOT NULL, -- 'general', 'design', 'business', 'integrations', 'seo'
      setting_key TEXT NOT NULL UNIQUE,
      setting_value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      username TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      file_size INTEGER NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if empty
  await seedDefaults();
}

async function seedDefaults() {
  // Roles
  const rolesCount = await get(`SELECT COUNT(*) as cnt FROM roles`);
  if (rolesCount.cnt === 0) {
    const rolesList = [
      ['Super Admin', 'super_admin', 'Complete access to entire platform, users and high-level security', '["*"]'],
      ['Admin', 'admin', 'Manage website pages, meals, orders, and business settings', '["pages.*","meals.*","orders.*","blog.*","settings.view"]'],
      ['Editor', 'editor', 'Create and edit pages, blog articles, media and website copy', '["pages.edit","blog.*","media.*"]'],
      ['Store Manager', 'store_manager', 'Manage meals, packages, orders, customers and delivery', '["meals.*","packages.*","orders.*","customers.*","delivery.*"]'],
      ['Customer Support', 'customer_support', 'View customers, orders and enquiry responses', '["orders.view","customers.view","forms.*"]'],
      ['Customer', 'customer', 'Access own client account and order tickets', '["account.own"]']
    ];
    for (const r of rolesList) {
      await run(`INSERT INTO roles (name, slug, description, permissions) VALUES (?, ?, ?, ?)`, r);
    }
  }

  // Super Admin User
  const usersCount = await get(`SELECT COUNT(*) as cnt FROM users`);
  if (usersCount.cnt === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    const superAdminRole = await get(`SELECT id FROM roles WHERE slug = 'super_admin'`);
    await run(`
      INSERT INTO users (username, email, password_hash, full_name, role_id, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `, ['admin', 'admin@greekfitkitchen.ca', passwordHash, 'George the Greek (Administrator)', superAdminRole.id]);

    await run(`
      INSERT INTO activity_logs (username, action, entity_type, details)
      VALUES ('System', 'Initialization', 'System', 'Pre-seeded database with administrator account and enterprise catalog.')
    `);
  }

  // Meal Categories
  const catCount = await get(`SELECT COUNT(*) as cnt FROM meal_categories`);
  if (catCount.cnt === 0) {
    const cats = [
      ['Poultry & White Meat', 'poultry', 'High protein lean chicken & turkey dishes', 'images/meals/grilled-chicken.jpg', 1],
      ['Beef & Steak', 'beef', 'Grass-fed beef tenderloin and souvlaki cuts', 'images/meals/steak-souvlaki.jpg', 2],
      ['Fresh Seafood', 'seafood', 'Wild Atlantic salmon & grilled shrimp skewers', 'images/meals/lemon-herb-salmon.jpg', 3],
      ['Vegetarian & Heritage Greek', 'vegetarian', 'Authentic Spanakopita & plant-powered Greek staples', 'images/meals/spinach-pie.jpg', 4]
    ];
    for (const c of cats) {
      await run(`INSERT INTO meal_categories (name, slug, description, image_url, display_order) VALUES (?, ?, ?, ?, ?)`, c);
    }
  }

  // 21 Greek Fit Kitchen Meals
  const mealsCount = await get(`SELECT COUNT(*) as cnt FROM meals`);
  if (mealsCount.cnt === 0) {
    const defaultMeals = [
      { name: "Grilled Chicken", slug: "grilled-chicken", cat: "poultry", price: 12.99, img: "images/meals/grilled-chicken.jpg", cal: 420, pro: 48, carb: 6, fat: 12, desc: "Flame-grilled herb-crusted chicken breast, marinated in Greek mountain oregano, garlic, lemon, and extra virgin olive oil." },
      { name: "Chicken Fillet", slug: "chicken-fillet", cat: "poultry", price: 13.99, img: "images/meals/chicken-fillet.jpg", cal: 440, pro: 46, carb: 8, fat: 14, desc: "Tender boneless chicken fillet cutlet, lightly seasoned with Mediterranean spices and seared to golden perfection." },
      { name: "Chicken Souvlaki", slug: "chicken-souvlaki", cat: "poultry", price: 13.99, img: "images/meals/chicken-souvlaki.jpg", cal: 430, pro: 45, carb: 7, fat: 13, desc: "Skewered marinated chicken breast cubes grilled over open flame with Greek herbs and fresh lemon squeeze." },
      { name: "Chicken Bifteki", slug: "chicken-bifteki", cat: "poultry", price: 13.99, img: "images/meals/chicken-bifteki.jpg", cal: 450, pro: 44, carb: 10, fat: 15, desc: "Greek-style seasoned lean minced chicken patties infused with fresh mint, parsley, and garlic." },
      { name: "Spinach & Feta Chicken", slug: "spinach-feta-chicken", cat: "poultry", price: 14.99, img: "images/meals/spinach-feta-chicken.jpg", cal: 480, pro: 49, carb: 9, fat: 18, desc: "Lean chicken breast topped with wilted baby spinach and authentic crumbled Greek feta cheese." },
      { name: "Chilly Chicken", slug: "chilly-chicken", cat: "poultry", price: 13.99, img: "images/meals/chilly-chicken.jpg", cal: 460, pro: 46, carb: 12, fat: 14, desc: "Spiced chicken breast glazed with Mediterranean chili sauce and sweet red peppers." },
      { name: "Stuffed Chicken", slug: "stuffed-chicken", cat: "poultry", price: 14.99, img: "images/meals/stuffed-chicken.jpg", cal: 490, pro: 50, carb: 11, fat: 19, desc: "Juicy chicken breast stuffed with roasted peppers, fresh herbs, and low-fat Mediterranean feta." },
      { name: "Steak Souvlaki", slug: "steak-souvlaki", cat: "beef", price: 15.99, img: "images/meals/steak-souvlaki.jpg", cal: 520, pro: 50, carb: 5, fat: 18, desc: "Tender beef tenderloin steak cubes marinated in red wine vinegar and grilled to medium." },
      { name: "Beef Souvlaki", slug: "beef-souvlaki", cat: "beef", price: 14.99, img: "images/meals/beef-souvlaki.jpg", cal: 510, pro: 48, carb: 5, fat: 17, desc: "Flame-seared marinated AAA beef skewers with Greek sea salt and crushed black pepper." },
      { name: "Beef Bifteki", slug: "beef-bifteki", cat: "beef", price: 14.99, img: "images/meals/beef-bifteki.jpg", cal: 530, pro: 46, carb: 8, fat: 20, desc: "Traditional Greek ground beef patties seasoned with onion, oregano, and EVOO." },
      { name: "Roast Beef", slug: "roast-beef", cat: "beef", price: 15.99, img: "images/meals/roast-beef.jpg", cal: 490, pro: 52, carb: 4, fat: 16, desc: "Slow-roasted lean beef carved into thin tender slices and served with savory Greek au jus." },
      { name: "Pork Souvlaki", slug: "pork-souvlaki", cat: "beef", price: 13.99, img: "images/meals/pork-souvlaki.jpg", cal: 470, pro: 44, carb: 4, fat: 16, desc: "Succulent lean pork loin skewers seasoned with Greek mountain oregano and lemon juice." },
      { name: "Pork Chops", slug: "pork-chops", cat: "beef", price: 14.99, img: "images/meals/pork-chops.jpg", cal: 480, pro: 46, carb: 3, fat: 17, desc: "Center-cut bone-in pork chops charbroiled with garlic herb butter and rosemary." },
      { name: "Turkey Souvlaki", slug: "turkey-souvlaki", cat: "poultry", price: 13.99, img: "images/meals/turkey-souvlaki.jpg", cal: 400, pro: 47, carb: 4, fat: 9, desc: "Ultra-lean turkey breast skewers seasoned with thyme, oregano, and olive oil." },
      { name: "Turkey Bifteki", slug: "turkey-bifteki", cat: "poultry", price: 13.99, img: "images/meals/turkey-bifteki.jpg", cal: 420, pro: 45, carb: 6, fat: 11, desc: "Lean ground turkey burger patties with grated zucchini, mint, and fresh garlic." },
      { name: "Salmon Fillet", slug: "salmon-fillet", cat: "seafood", price: 16.99, img: "images/meals/salmon-fillet.jpg", cal: 540, pro: 46, carb: 2, fat: 24, desc: "Fresh Atlantic salmon fillet pan-seared with fresh dill, capers, and lemon butter emulsion." },
      { name: "Shrimp Skewers", slug: "shrimp-skewers", cat: "seafood", price: 15.99, img: "images/meals/shrimp-skewers.jpg", cal: 360, pro: 42, carb: 4, fat: 8, desc: "Jumbo wild shrimp skewers grilled over flame with garlic, lemon, and fresh parsley." },
      { name: "Shrimp Saganaki", slug: "shrimp-saganaki", cat: "seafood", price: 16.99, img: "images/meals/shrimp-saganaki.jpg", cal: 430, pro: 40, carb: 14, fat: 16, desc: "Succulent shrimp baked in rich Greek tomato sauce, ouzo aroma, and melted feta cheese." },
      { name: "Spanakopita", slug: "spanakopita", cat: "vegetarian", price: 12.99, img: "images/meals/spinach-pie.jpg", cal: 410, pro: 16, carb: 38, fat: 22, desc: "Crisp flaky phyllo pastry stuffed with fresh chopped spinach, leeks, wild herbs, and Greek feta." },
      { name: "Veggie Souvlaki", slug: "veggie-souvlaki", cat: "vegetarian", price: 11.99, img: "images/meals/veggie-souvlaki.jpg", cal: 280, pro: 12, carb: 26, fat: 10, desc: "Flame-grilled skewers of zucchini, bell peppers, red onion, button mushrooms, and cherry tomatoes." },
      { name: "Pasta al Greco", slug: "pasta-al-greco", cat: "vegetarian", price: 13.99, img: "images/meals/pasta-al-greco.jpg", cal: 510, pro: 20, carb: 68, fat: 14, desc: "Complete pasta dish tossed with Kalamata olives, sun-dried tomatoes, spinach, garlic, and mizithra cheese (no sides required)." }
    ];

    const catRows = await query(`SELECT id, slug FROM meal_categories`);
    const catMap = {};
    catRows.forEach(c => { catMap[c.slug] = c.id; });

    let orderIdx = 1;
    for (const m of defaultMeals) {
      await run(`
        INSERT INTO meals (name, slug, category_id, description, price_cad, image_url, calories, protein, carbs, fat, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [m.name, m.slug, catMap[m.cat] || 1, m.desc, m.price, m.img, m.cal, m.pro, m.carb, m.fat, orderIdx++]);
    }
  }

  // Sides & Extras
  const sidesCount = await get(`SELECT COUNT(*) as cnt FROM sides`);
  if (sidesCount.cnt === 0) {
    const defaultSides = [
      ['Rice Pilaf with Veggies', 'included', 0.00, 'Long grain rice simmered in vegetable broth with carrots and peas', 1],
      ['Yellow Basmati Rice', 'included', 0.00, 'Fragrant golden basmati rice cooked with turmeric and Greek spices', 2],
      ['Spinach Mushroom Rice', 'included', 0.00, 'Savory rice folded with tender baby spinach and sautÃ©ed mushrooms', 3],
      ['Orzo in Tomato Sauce', 'included', 0.00, 'Traditional Greek kritharaki pasta simmered in rich herb tomato sauce', 4],
      ['Garlic Butter Baked Potatoes', 'included', 0.00, 'Tender oven-roasted potatoes with garlic and creamy butter', 5],
      ['Lemon Roasted Potatoes', 'included', 0.00, 'Authentic Greek roasted potato wedges infused with lemon and oregano', 6],
      ['Sweet Potatoes', 'included', 0.00, 'Clean slow-roasted sweet potato cubes for sustained glycogen replenishment', 7],
      ['Mashed Potatoes', 'included', 0.00, 'Whipped creamy Yukon gold potatoes seasoned with olive oil and garlic', 8],
      ['Quinoa', 'included', 0.00, 'Fluffy organic white quinoa tossed with light fresh herb vinaigrette', 9],
      ['Roasted Veggies', 'included', 0.00, 'Oven-roasted zucchini, bell peppers, eggplant, and Spanish onion', 10],
      ['Broccoli', 'included', 0.00, 'Freshly steamed crisp broccoli florets drizzled with extra virgin olive oil', 11],
      ['Extra Lemon Roasted Potatoes (Large)', 'extra', 4.99, 'Double portion of Greek lemon potatoes', 12],
      ['Extra Roasted Sweet Potatoes (Large)', 'extra', 4.99, 'Double portion of roasted sweet potatoes', 13],
      ['Extra Greek Village Salad (Horiatiki)', 'extra', 4.99, 'Cucumbers, tomatoes, Kalamata olives, feta, red onion, oregano', 14],
      ['Extra Grilled Herb Chicken Breast', 'extra', 6.99, 'Add 200g of pure flame-grilled protein', 15],
      ['Tzatziki Dip Container (4 oz)', 'extra', 2.99, 'Greek yogurt, garlic, cucumber, and dill dip', 16]
    ];
    for (const s of defaultSides) {
      await run(`INSERT INTO sides (name, type, price_cad, description, display_order, is_active) VALUES (?, ?, ?, ?, ?, 1)`, s);
    }
  }

  // Meal Packages
  const pkgCount = await get(`SELECT COUNT(*) as cnt FROM meal_packages`);
  if (pkgCount.cnt === 0) {
    const pkgs = [
      ['6-Meal Package', '6-meal-package', 6, 6, 59.94, 0.0, 'Ideal for Monday through Saturday lunches. Baseline tier.', 'images/meals/grilled-chicken.jpg', 1],
      ['7 to 9 Meals Plan', '7-to-9-meals-plan', 7, 9, 79.99, 10.0, 'Full-week lunches & post-workout dinners with automatic 10% volume discount.', 'images/meals/steak-souvlaki.jpg', 2],
      ['10+ Meals Package', '10-plus-meals-package', 10, 99, 99.99, 10.0, 'Maximum convenience for heavy training households and athletic couples with 10% flat discount.', 'images/meals/lemon-herb-salmon.jpg', 3]
    ];
    for (const p of pkgs) {
      await run(`INSERT INTO meal_packages (name, slug, min_qty, max_qty, base_price_cad, discount_percent, description, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`, p);
    }
  }

  // Delivery Settings
  const delivCount = await get(`SELECT COUNT(*) as cnt FROM delivery_settings`);
  if (delivCount.cnt === 0) {
    const settings = [
      ['base_delivery_fee', '5.99'],
      ['per_km_fee', '0.99'],
      ['free_delivery_km', '2.0'],
      ['tier_2_max_km', '5.0'],
      ['tier_2_flat_fee', '5.00'],
      ['max_delivery_radius_km', '35.0'],
      ['kitchen_address', '3575 Lake Shore Blvd W, Etobicoke, ON M8W 1P5'],
      ['sunday_cutoff', 'Friday 11:59 PM EST'],
      ['wednesday_cutoff', 'Monday 11:59 PM EST'],
      ['pickup_window', 'Sundays & Wednesdays 2:00 PM – 6:00 PM']
    ];
    for (const s of settings) {
      await run(`INSERT INTO delivery_settings (setting_key, setting_value) VALUES (?, ?)`, s);
    }
  }

  // Coupons
  const couponCount = await get(`SELECT COUNT(*) as cnt FROM discounts`);
  if (couponCount.cnt === 0) {
    const coupons = [
      ['GREEK10', 'percent', 10.0, 50.0, 6, 1000, 1],
      ['LEAN15', 'percent', 15.0, 80.0, 7, 500, 1],
      ['FITFREE', 'fixed', 5.99, 60.0, 6, 300, 1],
      ['SAVE5', 'fixed', 5.00, 50.0, 6, 500, 1]
    ];
    for (const c of coupons) {
      await run(`INSERT INTO discounts (code, discount_type, discount_value, min_order_value, min_meals_qty, usage_limit, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`, c);
    }
  }

  // Global Settings
  const settsCount = await get(`SELECT COUNT(*) as cnt FROM global_settings`);
  if (settsCount.cnt === 0) {
    const gSettings = [
      ['general', 'site_name', 'Greek Fit Kitchen'],
      ['general', 'tagline', 'Big Greek Flavour. Zero Meal Prep.'],
      ['general', 'contact_email', 'orders@greekfitkitchen.ca'],
      ['general', 'contact_phone', '(416) 555-GREEK'],
      ['general', 'kitchen_address', '3575 Lake Shore Blvd W, Etobicoke, ON M8W 1P5'],
      ['general', 'currency', 'CAD'],
      ['general', 'timezone', 'America/Toronto'],
      ['design', 'primary_color', '#101D3A'],
      ['design', 'secondary_color', '#0C172E'],
      ['design', 'accent_gold', '#F5C542'],
      ['design', 'font_heading', 'Roboto Slab, serif'],
      ['design', 'font_body', 'Roboto, sans-serif'],
      ['design', 'border_radius', '16px'],
      ['business', 'min_order_meals', '6'],
      ['business', 'volume_discount_threshold', '7'],
      ['business', 'volume_discount_percent', '10.0'],
      ['business', 'hst_tax_rate', '13.0'],
      ['business', 'sides_included_per_plate', '2'],
      ['integrations', 'google_maps_api_key', ''],
      ['integrations', 'stripe_publishable_key', ''],
      ['integrations', 'stripe_secret_key', ''],
      ['seo', 'default_meta_title', 'Greek Fit Kitchen | High Protein Mediterranean Meal Prep Toronto'],
      ['seo', 'default_meta_desc', '21 chef-prepared Mediterranean meals with 2 included fresh sides per plate. Twice-weekly batch prep in Etobicoke.']
    ];
    for (const s of gSettings) {
      await run(`INSERT INTO global_settings (setting_group, setting_key, setting_value) VALUES (?, ?, ?)`, s);
    }
  }

  // Default Pages
  const pagesCount = await get(`SELECT COUNT(*) as cnt FROM pages`);
  if (pagesCount.cnt === 0) {
    const defaultPages = [
      ['Home', 'index', 'published', 'Greek Fit Kitchen | High Protein Mediterranean Meal Prep', 'Authentic Greek fitness meal prep designed for high-protein athletic performance in Toronto & GTA.'],
      ['Meal Plan', 'menu', 'published', 'Chef Prepared Meals & Customizer | Greek Fit Kitchen', 'Explore our 21 chef dishes, customizable with 2 complimentary sides per plate.'],
      ['Delivery Rates', 'delivery-rates', 'published', 'Batch Delivery Rates & GTA Coverage | Greek Fit Kitchen', 'Sunday & Wednesday delivery drops across Greater Toronto with transparent distance rates.'],
      ['About Us', 'about-us', 'published', 'About Greek Fit Kitchen & George the Greek', 'Our philosophy of combining Greek island culinary traditions with athletic sports nutrition.'],
      ['How It Works', 'how-it-works', 'published', 'How Greek Fit Kitchen Works | 3 Simple Steps', 'Order by cutoff, chef batch cooks fresh, delivered refrigerated to your door.'],
      ['Blog Journal', 'blog', 'published', 'Mediterranean Nutrition & Athletic Journal | Greek Fit Kitchen', 'Expert training nutrition, macro breakdowns, and Mediterranean wellness insights.']
    ];
    for (const p of defaultPages) {
      await run(`INSERT INTO pages (title, slug, status, seo_title, meta_description) VALUES (?, ?, ?, ?, ?)`, p);
    }
  }

  // Default Blog Posts
  const blogCount = await get(`SELECT COUNT(*) as cnt FROM blog_posts`);
  if (blogCount.cnt === 0) {
    const posts = [
      ['The Mediterranean Advantage: High-Protein Meal Prep for Athletic Recovery', 'mediterranean-advantage-high-protein-recovery', 'Nutrition', 'George the Greek', 'images/meals/grilled-chicken.jpg', 'Discover why extra virgin olive oil, wild oregano, lean poultry, and clean starches out-perform synthetic bodybuilder diets in long-term muscular endurance.', '<p>When athletes think of meal prep, they often picture dry chicken breast and unseasoned steamed broccoli. But Mediterranean culinary heritage proves that nutrient-dense fuel can be deeply flavorful.</p><p>At Greek Fit Kitchen, every meal is prepared with extra virgin cold-pressed olive oil, fresh lemon, mountain oregano, and clean sea salt.</p>', 'published'],
      ['Clean Carbs vs. Fast Energy: Why Yellow Basmati & Sweet Potatoes Fuel Toronto Workouts', 'clean-carbs-yellow-basmati-sweet-potatoes', 'Fitness', 'George the Greek', 'images/meals/lemon-herb-salmon.jpg', 'Not all carbohydrates are created equal. Learn how complex starch profiles sustain glycogen stores throughout intense training sessions.', '<p>Glycogen depletion is the number one cause of late-workout fatigue. By pairing lean protein with slow-digesting complex carbs like Yellow Basmati rice or roasted sweet potatoes, your muscles enjoy sustained glucose release.</p>', 'published'],
      ['Inside George’s Kitchen: How We Prep 21 Chef Dishes Fresh Every Week', 'inside-georges-kitchen-21-chef-dishes', 'Meal Prep', 'Kitchen Operations', 'images/meals/steak-souvlaki.jpg', 'A behind-the-scenes look at our twice-weekly batch prep cycles at 3575 Lake Shore Blvd W in Etobicoke. Zero freezing, 100% fresh batch cookery.', '<p>We never freeze our food. Orders close Friday at midnight for Sunday batch cooking, and Monday midnight for Wednesday delivery. Our commercial kitchen operates with surgical precision.</p>', 'published'],
      ['Authentic Spanakopita Spinach Pie: Macro Breakdown & Prep', 'authentic-spanakopita-macro-breakdown', 'Recipes', 'George the Greek', 'images/meals/spinach-pie.jpg', 'Crispy flaky phyllo pastry meets mineral-dense wild spinach and creamy Greek feta. Here is why it makes an ideal athletic carbohydrate source.', '<p>Who says comfort food cannot fit into a lean bulking or maintenance diet? Spanakopita offers a balance of complex carbohydrates, calcium, iron, and slow-digesting dietary fiber.</p>', 'published']
    ];
    for (const p of posts) {
      await run(`INSERT INTO blog_posts (title, slug, category, author_name, featured_image, excerpt, content, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, p);
    }
  }

  // Pre-seed Media records for existing meal images
  const mediaCount = await get(`SELECT COUNT(*) as cnt FROM media`);
  if (mediaCount.cnt === 0) {
    const mealImages = [
      'grilled-chicken.jpg', 'chicken-fillet.jpg', 'chicken-souvlaki.jpg', 'chicken-bifteki.jpg',
      'spinach-feta-chicken.jpg', 'chilly-chicken.jpg', 'stuffed-chicken.jpg', 'steak-souvlaki.jpg',
      'beef-souvlaki.jpg', 'beef-bifteki.jpg', 'roast-beef.jpg', 'pork-souvlaki.jpg',
      'pork-chops.jpg', 'turkey-souvlaki.jpg', 'turkey-bifteki.jpg', 'salmon-fillet.jpg',
      'shrimp-skewers.jpg', 'shrimp-saganaki.jpg', 'spinach-pie.jpg', 'veggie-souvlaki.jpg',
      'pasta-al-greco.jpg'
    ];
    for (const img of mealImages) {
      await run(`
        INSERT INTO media (filename, original_name, mime_type, file_size, url, alt_text, folder)
        VALUES (?, ?, 'image/jpeg', 85000, ?, ?, 'meals')
      `, [img, img, `images/meals/${img}`, img.replace('.jpg', '').replace('-', ' ')]);
    }
  }
}

module.exports = {
  db,
  query,
  get,
  run,
  exec,
  initDB
};
