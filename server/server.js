/**
 * Greek Fit Kitchen - Production Web Server & Backend API
 * Connects the WordPress-style Admin Dashboard and Elementor-style Builder
 * to the persistent SQLite Database and Public Website.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');
const apiRoutes = require('./api');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount API
app.use('/api', apiRoutes);

// Admin dedicated routes
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Visual Builder route
app.get('/builder', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'builder.html'));
});

// Public Website Static Assets & Pages
app.use(express.static(path.join(__dirname, '..')));

// Fallback for custom page slugs (e.g. /vip-catering)
app.get('/:slug', (req, res, next) => {
  const file = path.join(__dirname, '..', `${req.params.slug}.html`);
  const fs = require('fs');
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start Server
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🇬🇷 Greek Fit Kitchen Enterprise Platform Live!`);
      console.log(`🌐 Public Website:     http://localhost:${PORT}/`);
      console.log(`🔐 WordPress Admin:    http://localhost:${PORT}/admin`);
      console.log(`🔑 Admin Login:        http://localhost:${PORT}/admin/login`);
      console.log(`🎨 Elementor Builder:  http://localhost:${PORT}/builder`);
      console.log(`📡 Backend API:        http://localhost:${PORT}/api/`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
