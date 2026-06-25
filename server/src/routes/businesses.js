const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/businesses - Search and list businesses
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const {
      q,          // search query
      category,   // filter by category
      city,       // filter by city
      state,      // filter by state
      minRating,  // minimum rating
      priceLevel, // price level (1-4)
      sortBy,     // sort field
      order,      // sort order (asc/desc)
      page = 1,
      limit = 20
    } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (q) {
      whereClause += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ? OR subcategory LIKE ?)';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (city) {
      whereClause += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }

    if (state) {
      whereClause += ' AND state = ?';
      params.push(state);
    }

    if (minRating) {
      whereClause += ' AND rating >= ?';
      params.push(parseFloat(minRating));
    }

    if (priceLevel) {
      whereClause += ' AND price_level = ?';
      params.push(parseInt(priceLevel));
    }

    // Count total results
    const countQuery = `SELECT COUNT(*) as total FROM businesses ${whereClause}`;
    const { total } = db.prepare(countQuery).get(...params);

    // Sort
    const validSortFields = ['name', 'rating', 'review_count', 'price_level', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    // Paginate
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const query = `
      SELECT * FROM businesses 
      ${whereClause} 
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    params.push(parseInt(limit), offset);

    const businesses = db.prepare(query).all(...params);

    // Parse JSON fields
    const parsed = businesses.map(b => ({
      ...b,
      hours: b.hours ? JSON.parse(b.hours) : null,
      tags: b.tags ? JSON.parse(b.tags) : []
    }));

    res.json({
      businesses: parsed,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// GET /api/businesses/categories - Get all categories
router.get('/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM businesses 
      GROUP BY category 
      ORDER BY count DESC
    `).all();

    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/businesses/cities - Get all cities
router.get('/cities', (req, res) => {
  try {
    const db = getDb();
    const cities = db.prepare(`
      SELECT city, state, COUNT(*) as count 
      FROM businesses 
      GROUP BY city, state 
      ORDER BY count DESC
    `).all();

    res.json({ cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// GET /api/businesses/:id - Get single business
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const business = db.prepare('SELECT * FROM businesses WHERE id = ?').get(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const parsed = {
      ...business,
      hours: business.hours ? JSON.parse(business.hours) : null,
      tags: business.tags ? JSON.parse(business.tags) : []
    };

    res.json({ business: parsed });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

module.exports = router;
