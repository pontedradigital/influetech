-- Migration: Create Trending Products Tables
-- Created: 2024-12-08
-- Description: Tables for storing trending products from AliExpress, Temu, and Shein

-- Main trending products table
CREATE TABLE IF NOT EXISTS trending_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  platform TEXT NOT NULL CHECK(platform IN ('aliexpress', 'temu', 'shein', 'outros')),
  price_min REAL,
  price_max REAL,
  currency TEXT DEFAULT 'USD',
  search_volume INTEGER DEFAULT 0,
  growth_percentage REAL DEFAULT 0,
  sentiment_score INTEGER DEFAULT 0 CHECK(sentiment_score >= 0 AND sentiment_score <= 100),
  hype_level TEXT DEFAULT 'Médio' CHECK(hype_level IN ('Baixo', 'Médio', 'Alto', 'Altíssimo')),
  image_url TEXT,
  product_url TEXT,
  keywords TEXT, -- JSON array stored as text
  description TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trend history for tracking changes over time
CREATE TABLE IF NOT EXISTS trend_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  search_volume INTEGER DEFAULT 0,
  growth_percentage REAL DEFAULT 0,
  sentiment_score INTEGER DEFAULT 0,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES trending_products(id) ON DELETE CASCADE
);

-- Product categories specific to tech/gadgets
CREATE TABLE IF NOT EXISTS product_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  parent_category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_trending_platform ON trending_products(platform);
CREATE INDEX IF NOT EXISTS idx_trending_category ON trending_products(category);
CREATE INDEX IF NOT EXISTS idx_trending_hype ON trending_products(hype_level);
CREATE INDEX IF NOT EXISTS idx_trending_updated ON trending_products(last_updated);
CREATE INDEX IF NOT EXISTS idx_history_product ON trend_history(product_id);
CREATE INDEX IF NOT EXISTS idx_history_recorded ON trend_history(recorded_at);

-- Insert default categories for tech/gadgets
INSERT OR IGNORE INTO product_categories (name, icon, description, parent_category) VALUES
  ('Fones e Áudio', 'headphones', 'Fones de ouvido, earbuds, headsets e acessórios de áudio', 'Tecnologia'),
  ('Smartwatches', 'watch', 'Relógios inteligentes e fitness trackers', 'Tecnologia'),
  ('Carregadores', 'battery_charging_full', 'Power banks, carregadores wireless e cabos', 'Tecnologia'),
  ('Câmeras', 'photo_camera', 'Action cameras, webcams e acessórios fotográficos', 'Tecnologia'),
  ('Acessórios Mobile', 'phone_iphone', 'Capas, suportes, lentes e acessórios para smartphone', 'Tecnologia'),
  ('Smart Home', 'home', 'Dispositivos inteligentes para casa', 'Tecnologia'),
  ('Gaming', 'sports_esports', 'Controles, periféricos e acessórios para games', 'Tecnologia'),
  ('Wearables', 'watch', 'Dispositivos vestíveis e fitness', 'Tecnologia'),
  ('Iluminação', 'lightbulb', 'Ring lights, LED strips e iluminação inteligente', 'Tecnologia'),
  ('Armazenamento', 'storage', 'SSDs, pendrives e dispositivos de armazenamento', 'Tecnologia'),
  ('Teclados e Mouse', 'keyboard', 'Teclados mecânicos, mouse gaming e mousepads', 'Gaming'),
  ('Cabos e Adaptadores', 'cable', 'Cabos USB-C, adaptadores e hubs', 'Tecnologia'),
  ('Projetores', 'videocam', 'Mini projetores e acessórios', 'Tecnologia'),
  ('Microfones', 'mic', 'Microfones para streaming e gravação', 'Tecnologia'),
  ('Outros/Diversos', 'category', 'Outros produtos tech e gadgets', 'Tecnologia');
