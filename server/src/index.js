const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Yelp API Proxy
 * This proxies requests to Yelp's API to avoid CORS issues in the browser.
 * The client sends the API key in the Authorization header.
 */
app.get('/api/yelp/search', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Yelp API key. Add it in Settings or on the Yelp Live Search page.' });
    }

    // Build Yelp API URL from query params
    const params = new URLSearchParams();
    if (req.query.location) params.set('location', req.query.location);
    if (req.query.term) params.set('term', req.query.term);
    if (req.query.categories) params.set('categories', req.query.categories);
    if (req.query.limit) params.set('limit', req.query.limit);
    if (req.query.sort_by) params.set('sort_by', req.query.sort_by);
    if (req.query.offset) params.set('offset', req.query.offset);
    if (req.query.radius) params.set('radius', req.query.radius);

    const yelpUrl = `https://api.yelp.com/v3/businesses/search?${params.toString()}`;

    const response = await fetch(yelpUrl, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Yelp proxy error:', err.message);
    res.status(500).json({ error: 'Failed to reach Yelp API. Check your internet connection.' });
  }
});

/**
 * Yelp Business Details Proxy
 * Get detailed info about a specific business by ID
 */
app.get('/api/yelp/business/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Yelp API key.' });
    }

    const yelpUrl = `https://api.yelp.com/v3/businesses/${req.params.id}`;

    const response = await fetch(yelpUrl, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Yelp business detail error:', err.message);
    res.status(500).json({ error: 'Failed to reach Yelp API.' });
  }
});

/**
 * Yelp Reviews Proxy
 * Get reviews for a specific business
 */
app.get('/api/yelp/business/:id/reviews', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Yelp API key.' });
    }

    const yelpUrl = `https://api.yelp.com/v3/businesses/${req.params.id}/reviews?limit=5&sort_by=yelp_sort`;

    const response = await fetch(yelpUrl, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Yelp reviews error:', err.message);
    res.status(500).json({ error: 'Failed to reach Yelp API.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('===========================================');
  console.log('  WebScout Yelp Proxy Server');
  console.log('===========================================');
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Health:     http://localhost:${PORT}/api/health`);
  console.log(`  Yelp:       http://localhost:${PORT}/api/yelp/search`);
  console.log('');
  console.log('  The frontend connects to this automatically.');
  console.log('  Keep this terminal open while using WebScout.');
  console.log('===========================================');
  console.log('');
});

module.exports = app;
