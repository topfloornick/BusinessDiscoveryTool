const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'businesses.json');

let data = null;

function getDb() {
  if (!data) {
    if (!fs.existsSync(DB_PATH)) {
      console.error('Database file not found. Run "npm run seed" first.');
      process.exit(1);
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    data = JSON.parse(raw);
  }
  return data;
}

function queryBusinesses(options = {}) {
  const db = getDb();
  let results = [...db.businesses];

  const { q, category, city, state, minRating, priceLevel, sortBy, order, page = 1, limit = 20 } = options;

  // Search
  if (q) {
    const search = q.toLowerCase();
    results = results.filter(b =>
      b.name.toLowerCase().includes(search) ||
      (b.description && b.description.toLowerCase().includes(search)) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(search))) ||
      (b.subcategory && b.subcategory.toLowerCase().includes(search))
    );
  }

  // Filters
  if (category) {
    results = results.filter(b => b.category === category);
  }
  if (city) {
    results = results.filter(b => b.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (state) {
    results = results.filter(b => b.state === state);
  }
  if (minRating) {
    results = results.filter(b => b.rating >= parseFloat(minRating));
  }
  if (priceLevel) {
    results = results.filter(b => b.price_level === parseInt(priceLevel));
  }

  // Sort
  const validSortFields = ['name', 'rating', 'review_count', 'price_level'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
  const sortOrder = order === 'asc' ? 1 : -1;

  results.sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1 * sortOrder;
    if (a[sortField] > b[sortField]) return 1 * sortOrder;
    return 0;
  });

  // Pagination
  const total = results.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  const paged = results.slice(offset, offset + limitNum);

  return {
    businesses: paged,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
}

function getBusinessById(id) {
  const db = getDb();
  return db.businesses.find(b => b.id === parseInt(id)) || null;
}

function getCategories() {
  const db = getDb();
  const counts = {};
  db.businesses.forEach(b => {
    counts[b.category] = (counts[b.category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

function getCities() {
  const db = getDb();
  const counts = {};
  db.businesses.forEach(b => {
    const key = `${b.city}|${b.state}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([key, count]) => {
      const [city, state] = key.split('|');
      return { city, state, count };
    })
    .sort((a, b) => b.count - a.count);
}

module.exports = { getDb, queryBusinesses, getBusinessById, getCategories, getCities };
