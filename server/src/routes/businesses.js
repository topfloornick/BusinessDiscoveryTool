const express = require('express');
const router = express.Router();
const { queryBusinesses, getBusinessById, getCategories, getCities } = require('../db');

// GET /api/businesses - Search and list businesses
router.get('/', (req, res) => {
  try {
    const result = queryBusinesses(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// GET /api/businesses/categories - Get all categories
router.get('/categories', (req, res) => {
  try {
    const categories = getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/businesses/cities - Get all cities
router.get('/cities', (req, res) => {
  try {
    const cities = getCities();
    res.json({ cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// GET /api/businesses/:id - Get single business
router.get('/:id', (req, res) => {
  try {
    const business = getBusinessById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ business });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

module.exports = router;
