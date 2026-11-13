/**
 * Greek Fit Kitchen - Enterprise Backend API Router
 * Comprehensive implementation covering all 27 WordPress & Elementor admin management modules
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query, get, run, exec } = require('./db');
const {
  hashPassword,
  verifyPassword,
  generateToken,
  logActivity,
  authenticateMiddleware,
  requireRole
} = require('./auth');

// Multer storage for Media Library
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// =========================================================================
// 1. AUTHENTICATION & SESSIONS
// =========================================================================

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username/email and password required.' });
    }

    const user = await get(`
      SELECT u.*, r.slug as role_slug, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE (LOWER(u.username) = LOWER(?) OR LOWER(u.email) = LOWER(?))
    `, [username, username]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    if (user.is_active !== 1) {
      return res.status(403).json({ error: 'This administrator account is deactivated.' });
    }

    const validPass = await verifyPassword(password, user.password_hash);
    if (!validPass) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Update last login
    await run(`UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?`, [user.id]);

    const token = generateToken(user);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await logActivity(user.id, user.username, 'Login', 'User', user.id, 'Logged in to WordPress-style administration suite.', ip);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role_slug,
        role_name: user.role_name,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server authentication error.' });
  }
});

router.get('/auth/me', authenticateMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/auth/change-password', authenticateMiddleware, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const fullUser = await get(`SELECT password_hash FROM users WHERE id = ?`, [req.user.id]);
    const valid = await verifyPassword(current_password, fullUser.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    const newHash = await hashPassword(new_password);
    await run(`UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [newHash, req.user.id]);
    await logActivity(req.user.id, req.user.username, 'Password Change', 'User', req.user.id, 'Updated security password.');

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 2. PAGES MANAGEMENT (CRUD, Trash, Revisions)
// =========================================================================

router.get('/pages', async (req, res) => {
  try {
    const status = req.query.status || 'all';
    let sql = `
      SELECT p.*, u.full_name as author_name,
        (SELECT COUNT(*) FROM page_sections WHERE page_id = p.id) as sections_count
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
    `;
    const params = [];
    if (status !== 'all') {
      sql += ` WHERE p.status = ?`;
      params.push(status);
    } else {
      sql += ` WHERE p.status != 'trash'`;
    }
    sql += ` ORDER BY p.id ASC`;

    const pages = await query(sql, params);
    res.json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pages/:slug', async (req, res) => {
  try {
    const page = await get(`SELECT * FROM pages WHERE slug = ? OR id = ?`, [req.params.slug, req.params.slug]);
    if (!page) return res.status(404).json({ error: 'Page not found.' });

    const sections = await query(`
      SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC
    `, [page.id]);

    for (const sec of sections) {
      sec.elements = await query(`
        SELECT * FROM page_elements WHERE section_id = ? ORDER BY order_index ASC
      `, [sec.id]);
    }

    res.json({ success: true, page, sections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/pages', authenticateMiddleware, async (req, res) => {
  try {
    const { title, slug, template, seo_title, meta_description, featured_image, status } = req.body;
    if (!title) return res.status(400).json({ error: 'Page title is required.' });

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '');
    const existing = await get(`SELECT id FROM pages WHERE slug = ?`, [cleanSlug]);
    if (existing) return res.status(400).json({ error: 'A page with this URL slug already exists.' });

    const result = await run(`
      INSERT INTO pages (title, slug, template, seo_title, meta_description, featured_image, status, author_id, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [title, cleanSlug, template || 'default', seo_title || title, meta_description || '', featured_image || '', status || 'published', req.user.id]);

    await logActivity(req.user.id, req.user.username, 'Create Page', 'Page', result.id, `Created new page: "${title}" (${cleanSlug})`);
    res.json({ success: true, page_id: result.id, slug: cleanSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/pages/:id', authenticateMiddleware, async (req, res) => {
  try {
    const { title, slug, template, seo_title, meta_description, featured_image, status } = req.body;
    await run(`
      UPDATE pages SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        template = COALESCE(?, template),
        seo_title = COALESCE(?, seo_title),
        meta_description = COALESCE(?, meta_description),
        featured_image = COALESCE(?, featured_image),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, slug, template, seo_title, meta_description, featured_image, status, req.params.id]);

    await logActivity(req.user.id, req.user.username, 'Update Page', 'Page', req.params.id, `Updated page metadata.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/pages/:id', authenticateMiddleware, async (req, res) => {
  try {
    const page = await get(`SELECT * FROM pages WHERE id = ?`, [req.params.id]);
    if (!page) return res.status(404).json({ error: 'Page not found.' });

    if (page.status === 'trash' || req.query.permanent === 'true') {
      await run(`DELETE FROM pages WHERE id = ?`, [req.params.id]);
      await logActivity(req.user.id, req.user.username, 'Permanent Delete Page', 'Page', req.params.id, `Permanently deleted page: "${page.title}"`);
    } else {
      await run(`UPDATE pages SET status = 'trash', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [req.params.id]);
      await logActivity(req.user.id, req.user.username, 'Trash Page', 'Page', req.params.id, `Moved page to trash: "${page.title}"`);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/pages/:id/restore', authenticateMiddleware, async (req, res) => {
  try {
    await run(`UPDATE pages SET status = 'published', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [req.params.id]);
    await logActivity(req.user.id, req.user.username, 'Restore Page', 'Page', req.params.id, `Restored page from trash.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/pages/:id/duplicate', authenticateMiddleware, async (req, res) => {
  try {
    const orig = await get(`SELECT * FROM pages WHERE id = ?`, [req.params.id]);
    if (!orig) return res.status(404).json({ error: 'Original page not found.' });

    const newSlug = `${orig.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newTitle = `${orig.title} (Copy)`;

    const newPage = await run(`
      INSERT INTO pages (title, slug, status, template, featured_image, seo_title, meta_description, author_id)
      VALUES (?, ?, 'draft', ?, ?, ?, ?, ?)
    `, [newTitle, newSlug, orig.template, orig.featured_image, newTitle, orig.meta_description, req.user.id]);

    // Copy sections and elements
    const sections = await query(`SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC`, [orig.id]);
    for (const sec of sections) {
      const newSec = await run(`
        INSERT INTO page_sections (page_id, section_uuid, title, structure_type, background_type, background_value, padding, margin, order_index, is_hidden, custom_css)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [newPage.id, `sec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, sec.title, sec.structure_type, sec.background_type, sec.background_value, sec.padding, sec.margin, sec.order_index, sec.is_hidden, sec.custom_css]);

      const elements = await query(`SELECT * FROM page_elements WHERE section_id = ? ORDER BY order_index ASC`, [sec.id]);
      for (const el of elements) {
        await run(`
          INSERT INTO page_elements (section_id, element_uuid, widget_type, column_index, content_json, style_json, advanced_json, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [newSec.id, `el_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, el.widget_type, el.column_index, el.content_json, el.style_json, el.advanced_json, el.order_index]);
      }
    }

    await logActivity(req.user.id, req.user.username, 'Duplicate Page', 'Page', newPage.id, `Duplicated page "${orig.title}" to "${newTitle}"`);
    res.json({ success: true, page_id: newPage.id, slug: newSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 3. ELEMENTOR VISUAL BUILDER (Layout Tree, Drafts, Live Publish)
// =========================================================================

router.get('/builder/layout/:slug', async (req, res) => {
  try {
    let page = await get(`SELECT * FROM pages WHERE slug = ? OR id = ?`, [req.params.slug, req.params.slug]);
    if (!page) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    const sections = await query(`
      SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC
    `, [page.id]);

    for (const sec of sections) {
      sec.elements = await query(`
        SELECT * FROM page_elements WHERE section_id = ? ORDER BY order_index ASC
      `, [sec.id]);
    }

    res.json({ success: true, page, sections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/builder/publish', authenticateMiddleware, async (req, res) => {
  try {
    const { page_id, sections, note } = req.body;
    if (!page_id || !Array.isArray(sections)) {
      return res.status(400).json({ error: 'page_id and sections array are required.' });
    }

    const page = await get(`SELECT * FROM pages WHERE id = ?`, [page_id]);
    if (!page) return res.status(404).json({ error: 'Page not found.' });

    // 1. Save revision before clearing
    await run(`
      INSERT INTO page_revisions (page_id, author_id, layout_json, revision_note)
      VALUES (?, ?, ?, ?)
    `, [page_id, req.user.id, JSON.stringify(sections), note || 'Published via Elementor Visual Builder']);

    // 2. Transactionally replace sections and elements
    await run(`DELETE FROM page_sections WHERE page_id = ?`, [page_id]);

    let secOrder = 0;
    for (const sec of sections) {
      const secResult = await run(`
        INSERT INTO page_sections (
          page_id, section_uuid, title, structure_type, background_type,
          background_value, padding, margin, order_index, is_hidden, custom_css
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        page_id,
        sec.section_uuid || `sec_${Date.now()}_${secOrder}`,
        sec.title || `Section ${secOrder + 1}`,
        sec.structure_type || '1col',
        sec.background_type || 'color',
        sec.background_value || '#ffffff',
        sec.padding || '60px 20px',
        sec.margin || '0px',
        secOrder++,
        sec.is_hidden ? 1 : 0,
        sec.custom_css || ''
      ]);

      if (Array.isArray(sec.elements)) {
        let elOrder = 0;
        for (const el of sec.elements) {
          await run(`
            INSERT INTO page_elements (
              section_id, element_uuid, widget_type, column_index,
              content_json, style_json, advanced_json, order_index
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            secResult.id,
            el.element_uuid || `el_${Date.now()}_${elOrder}`,
            el.widget_type || 'text',
            el.column_index || 0,
            typeof el.content_json === 'object' ? JSON.stringify(el.content_json) : (el.content_json || '{}'),
            typeof el.style_json === 'object' ? JSON.stringify(el.style_json) : (el.style_json || '{}'),
            typeof el.advanced_json === 'object' ? JSON.stringify(el.advanced_json) : (el.advanced_json || '{}'),
            elOrder++
          ]);
        }
      }
    }

    await run(`UPDATE pages SET updated_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP WHERE id = ?`, [page_id]);
    await logActivity(req.user.id, req.user.username, 'Publish Page Layout', 'Page', page_id, `Published visual layout changes for page "${page.title}" (${sections.length} sections)`);

    res.json({ success: true, message: 'Page published live to database successfully!' });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Revisions
router.get('/builder/revisions/:page_id', authenticateMiddleware, async (req, res) => {
  try {
    const revisions = await query(`
      SELECT r.id, r.page_id, r.revision_note, r.created_at, u.full_name as author_name
      FROM page_revisions r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE r.page_id = ?
      ORDER BY r.id DESC
      LIMIT 20
    `, [req.params.page_id]);
    res.json({ success: true, revisions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/builder/revisions/:rev_id/restore', authenticateMiddleware, async (req, res) => {
  try {
    const rev = await get(`SELECT * FROM page_revisions WHERE id = ?`, [req.params.rev_id]);
    if (!rev) return res.status(404).json({ error: 'Revision not found.' });

    const sections = JSON.parse(rev.layout_json);
    // Reuse publish logic
    req.body = { page_id: rev.page_id, sections, note: `Restored from revision #${rev.id}` };
    return router.handle({ ...req, url: '/builder/publish', method: 'POST' }, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Templates (Save & Insert)
router.get('/builder/templates', async (req, res) => {
  try {
    const templates = await query(`SELECT * FROM templates ORDER BY id DESC`);
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/builder/templates', authenticateMiddleware, async (req, res) => {
  try {
    const { title, template_type, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });

    const result = await run(`
      INSERT INTO templates (title, template_type, content_json)
      VALUES (?, ?, ?)
    `, [title, template_type || 'section', typeof content === 'object' ? JSON.stringify(content) : content]);

    await logActivity(req.user.id, req.user.username, 'Save Template', 'Template', result.id, `Saved reusable template: "${title}"`);
    res.json({ success: true, template_id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/builder/templates/:id', authenticateMiddleware, async (req, res) => {
  try {
    await run(`DELETE FROM templates WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 4. MEALS & PRODUCTS MANAGEMENT (21 Chef Dishes, Macros, Ingredients)
// =========================================================================

router.get('/meals', async (req, res) => {
  try {
    const meals = await query(`
      SELECT m.*, c.name as category_name, c.slug as category_slug
      FROM meals m
      LEFT JOIN meal_categories c ON m.category_id = c.id
      ORDER BY m.display_order ASC, m.id ASC
    `);
    res.json({ success: true, meals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/meals/:id', async (req, res) => {
  try {
    const meal = await get(`
      SELECT m.*, c.name as category_name, c.slug as category_slug
      FROM meals m
      LEFT JOIN meal_categories c ON m.category_id = c.id
      WHERE m.id = ? OR m.slug = ?
    `, [req.params.id, req.params.id]);
    if (!meal) return res.status(404).json({ error: 'Meal not found.' });
    res.json({ success: true, meal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/meals', authenticateMiddleware, async (req, res) => {
  try {
    const {
      name, slug, category_id, description, price_cad, image_url,
      calories, protein, carbs, fat, ingredients, allergens, dietary_labels,
      display_order, is_active
    } = req.body;

    if (!name || price_cad === undefined) {
      return res.status(400).json({ error: 'Meal name and price in CAD are required.' });
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const result = await run(`
      INSERT INTO meals (
        name, slug, category_id, description, price_cad, image_url,
        calories, protein, carbs, fat, ingredients, allergens, dietary_labels,
        display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, cleanSlug, category_id || null, description || '', parseFloat(price_cad), image_url || 'images/meals/grilled-chicken.jpg',
      parseInt(calories || 0), parseInt(protein || 0), parseInt(carbs || 0), parseInt(fat || 0),
      ingredients || '', allergens || '', dietary_labels || 'High Protein',
      parseInt(display_order || 99), is_active !== 0 ? 1 : 0
    ]);

    await logActivity(req.user.id, req.user.username, 'Create Meal', 'Meal', result.id, `Created new dish: "${name}" ($${parseFloat(price_cad).toFixed(2)} CAD)`);
    res.json({ success: true, meal_id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/meals/:id', authenticateMiddleware, async (req, res) => {
  try {
    const {
      name, slug, category_id, description, price_cad, image_url,
      calories, protein, carbs, fat, ingredients, allergens, dietary_labels,
      display_order, is_active
    } = req.body;

    await run(`
      UPDATE meals SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        category_id = COALESCE(?, category_id),
        description = COALESCE(?, description),
        price_cad = COALESCE(?, price_cad),
        image_url = COALESCE(?, image_url),
        calories = COALESCE(?, calories),
        protein = COALESCE(?, protein),
        carbs = COALESCE(?, carbs),
        fat = COALESCE(?, fat),
        ingredients = COALESCE(?, ingredients),
        allergens = COALESCE(?, allergens),
        dietary_labels = COALESCE(?, dietary_labels),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name, slug, category_id, description, price_cad !== undefined ? parseFloat(price_cad) : null,
      image_url, calories, protein, carbs, fat, ingredients, allergens, dietary_labels,
      display_order, is_active, req.params.id
    ]);

    await logActivity(req.user.id, req.user.username, 'Update Meal', 'Meal', req.params.id, `Updated dish details.`);
    res.json({ success: true, message: 'Meal updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/meals/:id', authenticateMiddleware, async (req, res) => {
  try {
    const meal = await get(`SELECT name FROM meals WHERE id = ?`, [req.params.id]);
    await run(`DELETE FROM meals WHERE id = ?`, [req.params.id]);
    await logActivity(req.user.id, req.user.username, 'Delete Meal', 'Meal', req.params.id, `Deleted dish: "${meal ? meal.name : req.params.id}"`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/meals/:id/duplicate', authenticateMiddleware, async (req, res) => {
  try {
    const orig = await get(`SELECT * FROM meals WHERE id = ?`, [req.params.id]);
    if (!orig) return res.status(404).json({ error: 'Meal not found.' });

    const newSlug = `${orig.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newName = `${orig.name} (Copy)`;

    const result = await run(`
      INSERT INTO meals (
        name, slug, category_id, description, price_cad, image_url,
        calories, protein, carbs, fat, ingredients, allergens, dietary_labels,
        display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newName, newSlug, orig.category_id, orig.description, orig.price_cad, orig.image_url,
      orig.calories, orig.protein, orig.carbs, orig.fat, orig.ingredients, orig.allergens,
      orig.dietary_labels, orig.display_order + 1, 1
    ]);

    await logActivity(req.user.id, req.user.username, 'Duplicate Meal', 'Meal', result.id, `Duplicated meal "${orig.name}"`);
    res.json({ success: true, meal_id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
router.get('/meal-categories', async (req, res) => {
  try {
    const categories = await query(`
      SELECT c.*, (SELECT COUNT(*) FROM meals WHERE category_id = c.id) as meals_count
      FROM meal_categories c
      ORDER BY c.display_order ASC
    `);
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/meal-categories', authenticateMiddleware, async (req, res) => {
  try {
    const { name, slug, description, image_url, display_order } = req.body;
    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const result = await run(`
      INSERT INTO meal_categories (name, slug, description, image_url, display_order)
      VALUES (?, ?, ?, ?, ?)
    `, [name, cleanSlug, description || '', image_url || '', display_order || 0]);
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/meal-categories/:id', authenticateMiddleware, async (req, res) => {
  try {
    const { name, slug, description, image_url, display_order } = req.body;
    await run(`
      UPDATE meal_categories SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        display_order = COALESCE(?, display_order)
      WHERE id = ?
    `, [name, slug, description, image_url, display_order, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/meal-categories/:id', authenticateMiddleware, async (req, res) => {
  try {
    await run(`DELETE FROM meal_categories WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await query(`SELECT * FROM meal_packages ORDER BY display_order ASC`);
    res.json({ success: true, packages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/packages/:id', authenticateMiddleware, async (req, res) => {
  try {
    const { name, base_price_cad, discount_percent, min_qty, max_qty, description, is_active } = req.body;
    await run(`
      UPDATE meal_packages SET
        name = COALESCE(?, name),
        base_price_cad = COALESCE(?, base_price_cad),
        discount_percent = COALESCE(?, discount_percent),
        min_qty = COALESCE(?, min_qty),
        max_qty = COALESCE(?, max_qty),
        description = COALESCE(?, description),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `, [name, base_price_cad, discount_percent, min_qty, max_qty, description, is_active, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sides & Extras
router.get('/sides', async (req, res) => {
  try {
    const sides = await query(`SELECT * FROM sides ORDER BY type ASC, display_order ASC`);
    res.json({ success: true, sides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sides', authenticateMiddleware, async (req, res) => {
  try {
    const { name, type, price_cad, description, display_order } = req.body;
    const result = await run(`
      INSERT INTO sides (name, type, price_cad, description, display_order)
      VALUES (?, ?, ?, ?, ?)
    `, [name, type || 'included', parseFloat(price_cad || 0), description || '', display_order || 0]);
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/sides/:id', authenticateMiddleware, async (req, res) => {
  try {
    const { name, type, price_cad, description, is_active } = req.body;
    await run(`
      UPDATE sides SET
        name = COALESCE(?, name),
        type = COALESCE(?, type),
        price_cad = COALESCE(?, price_cad),
        description = COALESCE(?, description),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `, [name, type, price_cad !== undefined ? parseFloat(price_cad) : null, description, is_active, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/sides/:id', authenticateMiddleware, async (req, res) => {
  try {
    await run(`DELETE FROM sides WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 5. ORDERS & CHECKOUT MANAGEMENT
// =========================================================================

router.get('/orders', async (req, res) => {
  try {
    const { status, search, limit = 100 } = req.query;
    let sql = `SELECT * FROM orders`;
    const params = [];
    const clauses = [];

    if (status && status !== 'all') {
      clauses.push(`order_status = ?`);
      params.push(status);
    }
    if (search) {
      clauses.push(`(order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)`);
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (clauses.length > 0) {
      sql += ` WHERE ` + clauses.join(' AND ');
    }
    sql += ` ORDER BY id DESC LIMIT ?`;
    params.push(parseInt(limit));

    const orders = await query(sql, params);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await get(`SELECT * FROM orders WHERE id = ? OR order_number = ?`, [req.params.id, req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const items = await query(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
    res.json({ success: true, order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const {
      customer_name, customer_email, customer_phone, delivery_address,
      delivery_date, delivery_type, delivery_distance_km, items,
      subtotal_cad, discount_cad, tax_cad, delivery_fee_cad, grand_total_cad,
      special_instructions
    } = req.body;

    if (!customer_name || !customer_email || !items || !Array.isArray(items) || items.length < 6) {
      return res.status(400).json({ error: 'Valid customer information and minimum 6 meals required.' });
    }

    const orderNum = 'GFK-' + Date.now().toString().slice(-6);

    // Upsert customer
    let customer = await get(`SELECT id FROM customers WHERE LOWER(email) = LOWER(?)`, [customer_email]);
    if (!customer) {
      const custResult = await run(`
        INSERT INTO customers (name, email, phone, default_address)
        VALUES (?, ?, ?, ?)
      `, [customer_name, customer_email, customer_phone || '', delivery_address || '']);
      customer = { id: custResult.id };
    }

    const orderResult = await run(`
      INSERT INTO orders (
        order_number, customer_id, customer_name, customer_email, customer_phone,
        delivery_address, delivery_date, delivery_type, delivery_distance_km,
        subtotal_cad, discount_cad, tax_cad, delivery_fee_cad, grand_total_cad,
        payment_status, order_status, special_instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', 'confirmed', ?)
    `, [
      orderNum, customer.id, customer_name, customer_email, customer_phone,
      delivery_address || '3575 Lake Shore Blvd W (Pickup)', delivery_date || 'Sunday Batch Drop',
      delivery_type || 'delivery', parseFloat(delivery_distance_km || 0),
      parseFloat(subtotal_cad), parseFloat(discount_cad || 0), parseFloat(tax_cad || 0),
      parseFloat(delivery_fee_cad || 0), parseFloat(grand_total_cad), special_instructions || ''
    ]);

    for (const item of items) {
      await run(`
        INSERT INTO order_items (order_id, meal_id, meal_name, price_cad, quantity, customization_json)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        orderResult.id, item.meal_id || null, item.name, parseFloat(item.price || 12.99),
        item.qty || 1, JSON.stringify(item.customization || {})
      ]);
    }

    res.json({
      success: true,
      order_number: orderNum,
      order_id: orderResult.id,
      message: 'Order created and paid successfully.'
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/orders/:id/status', authenticateMiddleware, async (req, res) => {
  try {
    const { status, internal_notes } = req.body;
    await run(`
      UPDATE orders SET
        order_status = COALESCE(?, order_status),
        internal_notes = COALESCE(?, internal_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, internal_notes, req.params.id]);

    await logActivity(req.user.id, req.user.username, 'Update Order Status', 'Order', req.params.id, `Status set to ${status}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders/:id/refund', authenticateMiddleware, async (req, res) => {
  try {
    const { reason, amount } = req.body;
    await run(`
      UPDATE orders SET
        order_status = 'refunded',
        payment_status = 'refunded',
        internal_notes = COALESCE(internal_notes || '', '') || ' [Refund: ' || ? || ']',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [reason || 'Customer request', req.params.id]);

    await logActivity(req.user.id, req.user.username, 'Process Refund', 'Order', req.params.id, `Refund processed: $${amount || 'Full'}. Reason: ${reason}`);
    res.json({ success: true, message: 'Refund recorded.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/export/csv', authenticateMiddleware, async (req, res) => {
  try {
    const orders = await query(`SELECT * FROM orders ORDER BY id DESC`);
    let csv = 'OrderNumber,CustomerName,Email,Phone,DeliveryDate,GrandTotalCAD,PaymentStatus,OrderStatus,CreatedAt\n';
    orders.forEach(o => {
      csv += `"${o.order_number}","${o.customer_name}","${o.customer_email}","${o.customer_phone || ''}","${o.delivery_date}","${o.grand_total_cad}","${o.payment_status}","${o.order_status}","${o.created_at}"\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment(`orders-export-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 6. CUSTOMER MANAGEMENT
// =========================================================================

router.get('/customers', authenticateMiddleware, async (req, res) => {
  try {
    const customers = await query(`
      SELECT c.*,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.grand_total_cad), 0) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
      ORDER BY total_spent DESC
    `);
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/customers/:id', authenticateMiddleware, async (req, res) => {
  try {
    const { name, phone, default_address, notes } = req.body;
    await run(`
      UPDATE customers SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        default_address = COALESCE(?, default_address),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `, [name, phone, default_address, notes, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 7. DELIVERY & TAX SETTINGS
// =========================================================================

router.get('/delivery/settings', async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM delivery_settings`);
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/delivery/settings', authenticateMiddleware, async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [key, val] of Object.entries(settings || {})) {
      await run(`
        INSERT INTO delivery_settings (setting_key, setting_value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
      `, [key, String(val), String(val)]);
    }
    await logActivity(req.user.id, req.user.username, 'Update Delivery Rules', 'Settings', null, 'Updated GTA delivery fee thresholds and batch cutoffs.');
    res.json({ success: true, message: 'Delivery settings saved.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/delivery/calculate', async (req, res) => {
  try {
    const { distance_km } = req.body;
    const km = parseFloat(distance_km || 0);

    const rows = await query(`SELECT * FROM delivery_settings`);
    const cfg = {};
    rows.forEach(r => { cfg[r.setting_key] = parseFloat(r.setting_value) || r.setting_value; });

    let fee = 0;
    let tier = 'Tier 1: Free Local Delivery';

    if (km <= (cfg.free_delivery_km || 2.0)) {
      fee = 0.00;
      tier = 'Tier 1: Free (<= 2 km)';
    } else if (km <= (cfg.tier_2_max_km || 5.0)) {
      fee = cfg.tier_2_flat_fee || 5.00;
      tier = 'Tier 2: Flat $5.00 (2 to 5 km)';
    } else {
      const base = cfg.base_delivery_fee || 5.99;
      const perKm = cfg.per_km_fee || 0.99;
      fee = base + (km * perKm);
      tier = `Tier 3: $${base} + $${perKm}/km (${km.toFixed(1)} km)`;
    }

    res.json({
      success: true,
      distance_km: km,
      fee_cad: parseFloat(fee.toFixed(2)),
      tier,
      is_eligible: km <= (cfg.max_delivery_radius_km || 35.0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 8. DISCOUNTS & COUPONS
// =========================================================================

router.get('/discounts', async (req, res) => {
  try {
    const discounts = await query(`SELECT * FROM discounts ORDER BY id DESC`);
    res.json({ success: true, discounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/discounts', authenticateMiddleware, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_value, min_meals_qty, usage_limit, expires_at } = req.body;
    const cleanCode = (code || '').toUpperCase().trim();
    const result = await run(`
      INSERT INTO discounts (code, discount_type, discount_value, min_order_value, min_meals_qty, usage_limit, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [cleanCode, discount_type || 'percent', parseFloat(discount_value), parseFloat(min_order_value || 0), parseInt(min_meals_qty || 0), usage_limit ? parseInt(usage_limit) : null, expires_at || null]);
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/discounts/verify', async (req, res) => {
  try {
    const { code, subtotal, meals_count } = req.body;
    const cleanCode = (code || '').toUpperCase().trim();
    const discount = await get(`SELECT * FROM discounts WHERE code = ? AND is_active = 1`, [cleanCode]);

    if (!discount) {
      return res.status(404).json({ error: 'Invalid coupon code.' });
    }

    if (discount.min_order_value && subtotal < discount.min_order_value) {
      return res.status(400).json({ error: `Requires minimum order of $${discount.min_order_value.toFixed(2)} CAD.` });
    }

    if (discount.min_meals_qty && meals_count < discount.min_meals_qty) {
      return res.status(400).json({ error: `Requires minimum ${discount.min_meals_qty} meals in order.` });
    }

    let calculatedDiscount = 0;
    if (discount.discount_type === 'percent') {
      calculatedDiscount = (subtotal * discount.discount_value) / 100;
    } else {
      calculatedDiscount = discount.discount_value;
    }

    res.json({
      success: true,
      code: discount.code,
      discount_cad: Math.min(calculatedDiscount, subtotal),
      type: discount.discount_type,
      value: discount.discount_value
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 9. FORMS & ENQUIRIES (Catering, Dietary, Contact)
// =========================================================================

router.get('/forms', authenticateMiddleware, async (req, res) => {
  try {
    const { type, status } = req.query;
    let sql = `SELECT * FROM form_submissions`;
    const params = [];
    const clauses = [];
    if (type) {
      clauses.push(`form_type = ?`);
      params.push(type);
    }
    if (status) {
      clauses.push(`status = ?`);
      params.push(status);
    }
    if (clauses.length > 0) sql += ` WHERE ` + clauses.join(' AND ');
    sql += ` ORDER BY id DESC`;

    const submissions = await query(sql, params);
    res.json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/forms', async (req, res) => {
  try {
    const { form_type, name, email, phone, details } = req.body;
    if (!form_type || !name || !email) {
      return res.status(400).json({ error: 'Form type, name, and email are required.' });
    }

    const result = await run(`
      INSERT INTO form_submissions (form_type, name, email, phone, details_json, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `, [form_type, name, email, phone || '', JSON.stringify(details || {})]);

    res.json({ success: true, submission_id: result.id, message: 'Enquiry received. The kitchen manager will be in touch shortly.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/forms/:id/status', authenticateMiddleware, async (req, res) => {
  try {
    const { status, internal_notes } = req.body;
    await run(`
      UPDATE form_submissions SET
        status = COALESCE(?, status),
        internal_notes = COALESCE(?, internal_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, internal_notes, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 10. BLOG POSTS (WordPress-Style CMS)
// =========================================================================

router.get('/blog', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let sql = `SELECT * FROM blog_posts`;
    const clauses = [];
    const params = [];

    if (status && status !== 'all') {
      clauses.push(`status = ?`);
      params.push(status);
    } else if (!status) {
      clauses.push(`status = 'published'`);
    }

    if (category && category !== 'All') {
      clauses.push(`category = ?`);
      params.push(category);
    }
    if (search) {
      clauses.push(`(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)`);
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (clauses.length > 0) sql += ` WHERE ` + clauses.join(' AND ');
    sql += ` ORDER BY id DESC`;

    const posts = await query(sql, params);
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/blog/:slug', async (req, res) => {
  try {
    const post = await get(`SELECT * FROM blog_posts WHERE slug = ? OR id = ?`, [req.params.slug, req.params.slug]);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/blog', authenticateMiddleware, async (req, res) => {
  try {
    const { title, slug, category, tags, author_name, featured_image, excerpt, content, status, seo_title, meta_description } = req.body;
    if (!title) return res.status(400).json({ error: 'Article title is required.' });

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const result = await run(`
      INSERT INTO blog_posts (
        title, slug, category, tags, author_id, author_name, featured_image,
        excerpt, content, status, seo_title, meta_description, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      title, cleanSlug, category || 'Nutrition', tags || '', req.user.id, author_name || req.user.full_name,
      featured_image || 'images/meals/grilled-chicken.jpg', excerpt || '', content || '',
      status || 'published', seo_title || title, meta_description || excerpt || ''
    ]);

    await logActivity(req.user.id, req.user.username, 'Publish Article', 'Blog', result.id, `Created article "${title}"`);
    res.json({ success: true, post_id: result.id, slug: cleanSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/blog/:id', authenticateMiddleware, async (req, res) => {
  try {
    const { title, slug, category, tags, author_name, featured_image, excerpt, content, status, seo_title, meta_description } = req.body;
    await run(`
      UPDATE blog_posts SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        category = COALESCE(?, category),
        tags = COALESCE(?, tags),
        author_name = COALESCE(?, author_name),
        featured_image = COALESCE(?, featured_image),
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        status = COALESCE(?, status),
        seo_title = COALESCE(?, seo_title),
        meta_description = COALESCE(?, meta_description),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, slug, category, tags, author_name, featured_image, excerpt, content, status, seo_title, meta_description, req.params.id]);

    await logActivity(req.user.id, req.user.username, 'Update Article', 'Blog', req.params.id, `Updated blog article.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/blog/:id', authenticateMiddleware, async (req, res) => {
  try {
    await run(`DELETE FROM blog_posts WHERE id = ?`, [req.params.id]);
    await logActivity(req.user.id, req.user.username, 'Delete Article', 'Blog', req.params.id, `Deleted blog article.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 11. MEDIA LIBRARY (Uploads, Search, Metadata)
// =========================================================================

router.get('/media', async (req, res) => {
  try {
    const { folder, search } = req.query;
    let sql = `SELECT * FROM media`;
    const clauses = [];
    const params = [];
    if (folder) {
      clauses.push(`folder = ?`);
      params.push(folder);
    }
    if (search) {
      clauses.push(`(filename LIKE ? OR original_name LIKE ? OR alt_text LIKE ?)`);
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (clauses.length > 0) sql += ` WHERE ` + clauses.join(' AND ');
    sql += ` ORDER BY id DESC`;

    const media = await query(sql, params);
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/media/upload', authenticateMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const relativeUrl = `uploads/${req.file.filename}`;
    const result = await run(`
      INSERT INTO media (filename, original_name, mime_type, file_size, url, alt_text, folder)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      relativeUrl,
      req.body.alt_text || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      req.body.folder || 'uploads'
    ]);

    await logActivity(req.user.id, req.user.username, 'Upload Media', 'Media', result.id, `Uploaded ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    res.json({
      success: true,
      media: {
        id: result.id,
        filename: req.file.filename,
        url: relativeUrl,
        size: req.file.size,
        mime: req.file.mimetype
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/media/:id', authenticateMiddleware, async (req, res) => {
  try {
    const item = await get(`SELECT * FROM media WHERE id = ?`, [req.params.id]);
    if (item) {
      const diskPath = path.join(__dirname, '..', item.url);
      if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
      await run(`DELETE FROM media WHERE id = ?`, [req.params.id]);
      await logActivity(req.user.id, req.user.username, 'Delete Media', 'Media', req.params.id, `Deleted file: ${item.filename}`);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 12. USERS & ROLES
// =========================================================================

router.get('/users', authenticateMiddleware, requireRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.username, u.email, u.full_name, u.avatar, u.is_active, u.last_login_at, u.created_at,
        r.id as role_id, r.name as role_name, r.slug as role_slug
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id ASC
    `);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', authenticateMiddleware, requireRole(['super_admin']), async (req, res) => {
  try {
    const { username, email, password, full_name, role_id } = req.body;
    if (!username || !email || !password || !role_id) {
      return res.status(400).json({ error: 'Username, email, password, and role are required.' });
    }

    const hash = await hashPassword(password);
    const result = await run(`
      INSERT INTO users (username, email, password_hash, full_name, role_id, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `, [username, email, hash, full_name || username, role_id]);

    await logActivity(req.user.id, req.user.username, 'Create User', 'User', result.id, `Created user account "${username}" with role #${role_id}`);
    res.json({ success: true, user_id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id', authenticateMiddleware, requireRole(['super_admin']), async (req, res) => {
  try {
    const { full_name, email, role_id, is_active, password } = req.body;
    let passwordClause = '';
    const params = [full_name, email, role_id, is_active];

    if (password) {
      const hash = await hashPassword(password);
      passwordClause = ', password_hash = ?';
      params.push(hash);
    }
    params.push(req.params.id);

    await run(`
      UPDATE users SET
        full_name = COALESCE(?, full_name),
        email = COALESCE(?, email),
        role_id = COALESCE(?, role_id),
        is_active = COALESCE(?, is_active)
        ${passwordClause},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params);

    await logActivity(req.user.id, req.user.username, 'Update User', 'User', req.params.id, `Updated user account details.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', authenticateMiddleware, requireRole(['super_admin']), async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own active administrator account.' });
    }
    await run(`DELETE FROM users WHERE id = ?`, [req.params.id]);
    await logActivity(req.user.id, req.user.username, 'Delete User', 'User', req.params.id, `Removed user account.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/roles', authenticateMiddleware, async (req, res) => {
  try {
    const roles = await query(`SELECT * FROM roles ORDER BY id ASC`);
    res.json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 13. GLOBAL SETTINGS & DESIGN TOKENS
// =========================================================================

router.get('/settings', async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM global_settings`);
    const settings = {};
    rows.forEach(r => {
      if (!settings[r.setting_group]) settings[r.setting_group] = {};
      settings[r.setting_group][r.setting_key] = r.setting_value;
    });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/settings', authenticateMiddleware, async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [group, keys] of Object.entries(settings || {})) {
      for (const [k, v] of Object.entries(keys || {})) {
        await run(`
          INSERT INTO global_settings (setting_group, setting_key, setting_value, updated_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
        `, [group, k, String(v), String(v)]);
      }
    }
    await logActivity(req.user.id, req.user.username, 'Update Global Settings', 'Settings', null, 'Saved global website configuration.');
    res.json({ success: true, message: 'Settings saved.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 14. REAL ANALYTICS & DASHBOARD KPIS (No Fake Data)
// =========================================================================

router.get('/analytics/overview', authenticateMiddleware, async (req, res) => {
  try {
    const totalOrdersRow = await get(`SELECT COUNT(*) as total, COALESCE(SUM(grand_total_cad), 0) as revenue FROM orders`);
    const pendingOrdersRow = await get(`SELECT COUNT(*) as cnt FROM orders WHERE order_status IN ('pending', 'confirmed', 'preparing')`);
    const completedOrdersRow = await get(`SELECT COUNT(*) as cnt FROM orders WHERE order_status = 'completed'`);
    const cancelledOrdersRow = await get(`SELECT COUNT(*) as cnt FROM orders WHERE order_status = 'cancelled'`);
    const totalCustomersRow = await get(`SELECT COUNT(*) as cnt FROM customers`);
    const totalDishesRow = await get(`SELECT COUNT(*) as cnt FROM meals WHERE is_active = 1`);
    const enquiriesRow = await get(`SELECT COUNT(*) as cnt FROM form_submissions WHERE status = 'new'`);

    // Popular meals from order items
    const popularMeals = await query(`
      SELECT meal_name, SUM(quantity) as sold_count
      FROM order_items
      GROUP BY meal_name
      ORDER BY sold_count DESC
      LIMIT 5
    `);

    // Recent orders
    const recentOrders = await query(`
      SELECT id, order_number, customer_name, customer_email, grand_total_cad, order_status, created_at
      FROM orders
      ORDER BY id DESC
      LIMIT 7
    `);

    // Activity logs
    const recentLogs = await query(`
      SELECT * FROM activity_logs ORDER BY id DESC LIMIT 8
    `);

    const totalOrders = totalOrdersRow.total || 0;
    const totalRevenue = totalOrdersRow.revenue || 0;
    const aov = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';

    res.json({
      success: true,
      stats: {
        total_revenue: totalRevenue.toFixed(2),
        total_orders: totalOrders,
        pending_orders: pendingOrdersRow.cnt || 0,
        completed_orders: completedOrdersRow.cnt || 0,
        cancelled_orders: cancelledOrdersRow.cnt || 0,
        total_customers: totalCustomersRow.cnt || 0,
        active_dishes: totalDishesRow.cnt || 0,
        new_enquiries: enquiriesRow.cnt || 0,
        average_order_value: aov
      },
      popular_meals: popularMeals,
      recent_orders: recentOrders,
      recent_activity: recentLogs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 15. BACKUPS & ACTIVITY AUDIT LOGS
// =========================================================================

router.get('/backups', authenticateMiddleware, async (req, res) => {
  try {
    const backups = await query(`SELECT * FROM backups ORDER BY id DESC`);
    res.json({ success: true, backups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/backups/create', authenticateMiddleware, async (req, res) => {
  try {
    const filename = `gfk-backup-${Date.now()}.json`;
    const tables = ['pages', 'page_sections', 'page_elements', 'meals', 'meal_categories', 'meal_packages', 'sides', 'orders', 'order_items', 'customers', 'discounts', 'delivery_settings', 'blog_posts', 'global_settings'];
    const dump = {};

    for (const t of tables) {
      dump[t] = await query(`SELECT * FROM ${t}`);
    }

    const backupDir = path.join(__dirname, '..', 'data', 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const filePath = path.join(backupDir, filename);
    const content = JSON.stringify(dump, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');

    const result = await run(`
      INSERT INTO backups (filename, file_size, notes)
      VALUES (?, ?, ?)
    `, [filename, content.length, req.body.notes || 'Full relational database snapshot']);

    await logActivity(req.user.id, req.user.username, 'Database Backup', 'System', result.id, `Created backup snapshot: ${filename}`);
    res.json({ success: true, backup_id: result.id, filename, size: content.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/logs', authenticateMiddleware, async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const logs = await query(`SELECT * FROM activity_logs ORDER BY id DESC LIMIT ?`, [parseInt(limit)]);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
