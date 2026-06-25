const express = require('express');
const cors = require('cors');
const businessRoutes = require('./routes/businesses');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/businesses', businessRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Business Discovery API running on http://localhost:${PORT}`);
});

module.exports = app;
