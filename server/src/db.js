const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'businesses.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      description TEXT,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip TEXT NOT NULL,
      phone TEXT,
      website TEXT,
      email TEXT,
      latitude REAL,
      longitude REAL,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      price_level INTEGER DEFAULT 1,
      hours TEXT,
      image_url TEXT,
      tags TEXT,
      is_open INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
    CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
    CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating);
    CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);
  `);
}

module.exports = { getDb };
