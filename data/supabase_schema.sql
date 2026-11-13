-- =========================================================================
-- Greek Fit Kitchen - Enterprise Supabase / PostgreSQL Database Schema
-- Provides exact schema compatibility with all 27 WordPress & Elementor modules
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Admin, Editors, Staff, Customers)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  avatar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pages & Elementor Visual Builder Hierarchy
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'trash')),
  template VARCHAR(100) DEFAULT 'default',
  featured_image TEXT,
  seo_title VARCHAR(255),
  meta_description TEXT,
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS page_sections (
  id SERIAL PRIMARY KEY,
  page_id INT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_uuid VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  structure_type VARCHAR(50) DEFAULT '1col',
  background_type VARCHAR(50) DEFAULT 'color',
  background_value TEXT DEFAULT '#ffffff',
  padding VARCHAR(50),
  margin VARCHAR(50),
  order_index INT DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  custom_css TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_elements (
  id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES page_sections(id) ON DELETE CASCADE,
  element_uuid VARCHAR(100) NOT NULL,
  widget_type VARCHAR(100) NOT NULL,
  column_index INT DEFAULT 0,
  content_json JSONB DEFAULT '{}'::jsonb,
  style_json JSONB DEFAULT '{}'::jsonb,
  advanced_json JSONB DEFAULT '{}'::jsonb,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_revisions (
  id SERIAL PRIMARY KEY,
  page_id INT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  layout_json JSONB NOT NULL,
  revision_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Reusable Elementor Templates
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  content_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Media Library
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  folder VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Meals, Categories, Packages & Sides
CREATE TABLE IF NOT EXISTS meal_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category_id INT REFERENCES meal_categories(id) ON DELETE SET NULL,
  description TEXT,
  price_cad NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  calories INT DEFAULT 0,
  protein INT DEFAULT 0,
  carbs INT DEFAULT 0,
  fat INT DEFAULT 0,
  ingredients TEXT,
  allergens TEXT,
  dietary_labels VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meal_packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  min_qty INT NOT NULL DEFAULT 6,
  max_qty INT,
  base_price_cad NUMERIC(10, 2) DEFAULT 59.94,
  discount_percent NUMERIC(5, 2) DEFAULT 0.0,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sides (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50) DEFAULT 'included',
  price_cad NUMERIC(10, 2) DEFAULT 0.00,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Orders & Customers
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  default_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  delivery_address TEXT,
  delivery_date VARCHAR(100),
  delivery_type VARCHAR(50) DEFAULT 'delivery',
  delivery_distance_km NUMERIC(6, 2) DEFAULT 0.0,
  subtotal_cad NUMERIC(10, 2) NOT NULL,
  discount_cad NUMERIC(10, 2) DEFAULT 0.0,
  tax_cad NUMERIC(10, 2) DEFAULT 0.0,
  delivery_fee_cad NUMERIC(10, 2) DEFAULT 0.0,
  grand_total_cad NUMERIC(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'paid',
  payment_method VARCHAR(100) DEFAULT 'Credit Card (Simulated)',
  order_status VARCHAR(50) DEFAULT 'confirmed',
  special_instructions TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  meal_id INT REFERENCES meals(id) ON DELETE SET NULL,
  meal_name VARCHAR(200) NOT NULL,
  price_cad NUMERIC(10, 2) NOT NULL,
  quantity INT DEFAULT 1,
  customization_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Discounts, Forms, Blog, Settings & Logs
CREATE TABLE IF NOT EXISTS discounts (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(20) DEFAULT 'percent',
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_value NUMERIC(10, 2) DEFAULT 0.0,
  min_meals_qty INT DEFAULT 0,
  usage_limit INT,
  times_used INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id SERIAL PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  details_json JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Nutrition',
  tags VARCHAR(255),
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(150) DEFAULT 'George the Greek',
  featured_image TEXT,
  excerpt TEXT,
  content TEXT,
  status VARCHAR(20) DEFAULT 'published',
  seo_title VARCHAR(255),
  meta_description TEXT,
  read_time VARCHAR(50) DEFAULT '5 min read',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS global_settings (
  id SERIAL PRIMARY KEY,
  setting_group VARCHAR(50) NOT NULL,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  username VARCHAR(100),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
