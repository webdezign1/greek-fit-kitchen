/**
 * Greek Fit Kitchen - Authentication & Authorization Engine
 * BCrypt Hashing, JWT Session Management, and Role-Based Access Control
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { get, run } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'gfk_enterprise_jwt_super_secret_key_2026';
const TOKEN_EXPIRY = '7d';

async function hashPassword(plainText) {
  return bcrypt.hash(plainText, 10);
}

async function verifyPassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_slug,
      role_name: user.role_name
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

async function logActivity(userId, username, action, entityType, entityId = null, details = null, ip = null) {
  try {
    await run(`
      INSERT INTO activity_logs (user_id, username, action, entity_type, entity_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, username, action, entityType, entityId ? String(entityId) : null, details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null, ip]);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

async function authenticateMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No session token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await get(`
      SELECT u.id, u.username, u.email, u.full_name, u.avatar, u.is_active, r.slug as role_slug, r.name as role_name, r.permissions
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [decoded.id]);

    if (!user || user.is_active !== 1) {
      return res.status(401).json({ error: 'User account is inactive or revoked.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Super Admin has universal access
    if (req.user.role_slug === 'super_admin') {
      return next();
    }

    if (allowedRoles.includes(req.user.role_slug)) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied. Insufficient permissions for your role.' });
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  logActivity,
  authenticateMiddleware,
  requireRole
};
