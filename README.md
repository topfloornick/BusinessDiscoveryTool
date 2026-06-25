# Business Discovery Tool

A modern web application for discovering and researching local restaurants and small businesses. Search, filter, and explore businesses in your area.

## Features

- **Search** - Find businesses by name, description, or tags
- **Filter** - Filter by category (Restaurant, Retail, Services), price level, and minimum rating
- **Sort** - Sort by rating, review count, name, or price
- **Detail Views** - View full business profiles with hours, contact info, and more
- **Responsive** - Works great on desktop and mobile

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)
- **Styling:** Custom CSS with CSS variables

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install all dependencies
npm run install:all

# Seed the database with sample data
npm run seed
```

### Development

Run the backend and frontend in separate terminals:

```bash
# Terminal 1 - Start the API server (port 3001)
npm run dev:server

# Terminal 2 - Start the React dev server (port 5173)
npm run dev:client
```

Then open http://localhost:5173 in your browser.

### Production Build

```bash
# Build the frontend
npm run build

# Start the server
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/businesses` | Search/list businesses with filters |
| GET | `/api/businesses/:id` | Get a single business |
| GET | `/api/businesses/categories` | List all categories |
| GET | `/api/businesses/cities` | List all cities |
| GET | `/api/health` | Health check |

### Query Parameters for `/api/businesses`

| Param | Description |
|-------|-------------|
| `q` | Search query (name, description, tags) |
| `category` | Filter by category |
| `city` | Filter by city |
| `state` | Filter by state |
| `minRating` | Minimum rating (e.g., 4.0) |
| `priceLevel` | Price level (1-4) |
| `sortBy` | Sort field (rating, review_count, name, price_level) |
| `order` | Sort order (asc, desc) |
| `page` | Page number |
| `limit` | Results per page |

## Project Structure

```
BusinessDiscoveryTool/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── db.js          # Database connection
│   │   ├── index.js       # Server entry point
│   │   └── seed.js        # Database seeder
│   └── package.json
├── package.json           # Root scripts
└── README.md
```

## Sample Data

The seeder populates the database with 18 businesses across Austin, TX:
- **8 Restaurants** - Italian, BBQ, Japanese, Mexican, Vietnamese, and more
- **4 Retail Shops** - Bookstore, clothing boutique, plant shop, record store
- **6 Service Businesses** - Pet grooming, fitness, auto repair, photography, wellness, coworking

## License

MIT
