const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'businesses.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Remove old db if exists
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');


// Create schema
db.exec(`
  CREATE TABLE businesses (
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

  CREATE INDEX idx_businesses_category ON businesses(category);
  CREATE INDEX idx_businesses_city ON businesses(city);
  CREATE INDEX idx_businesses_rating ON businesses(rating);
  CREATE INDEX idx_businesses_name ON businesses(name);
`);


const defaultHours = JSON.stringify({
  monday: '9:00 AM - 9:00 PM',
  tuesday: '9:00 AM - 9:00 PM',
  wednesday: '9:00 AM - 9:00 PM',
  thursday: '9:00 AM - 9:00 PM',
  friday: '9:00 AM - 10:00 PM',
  saturday: '10:00 AM - 10:00 PM',
  sunday: '10:00 AM - 8:00 PM'
});

const restaurantHours = JSON.stringify({
  monday: '11:00 AM - 10:00 PM',
  tuesday: '11:00 AM - 10:00 PM',
  wednesday: '11:00 AM - 10:00 PM',
  thursday: '11:00 AM - 10:00 PM',
  friday: '11:00 AM - 11:00 PM',
  saturday: '10:00 AM - 11:00 PM',
  sunday: '10:00 AM - 9:00 PM'
});


const businesses = [
  {
    name: 'The Golden Fork',
    category: 'Restaurant',
    subcategory: 'Italian',
    description: 'Authentic Italian cuisine with handmade pasta and wood-fired pizzas in a cozy atmosphere.',
    address: '124 Main Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0101',
    website: 'https://thegoldenfork.example.com',
    email: 'info@thegoldenfork.example.com',
    latitude: 30.2672,
    longitude: -97.7431,
    rating: 4.7,
    review_count: 342,
    price_level: 3,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    tags: JSON.stringify(['italian', 'pasta', 'pizza', 'wine', 'date night', 'fine dining']),
    is_open: 1
  },
  {
    name: 'Smoky Pit BBQ',
    category: 'Restaurant',
    subcategory: 'BBQ',
    description: 'Slow-smoked Texas BBQ with house-made sauces. Brisket, ribs, and pulled pork done right.',
    address: '789 Oak Avenue',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    phone: '(512) 555-0102',
    website: 'https://smokypitbbq.example.com',
    email: 'hello@smokypitbbq.example.com',
    latitude: 30.2621,
    longitude: -97.7253,
    rating: 4.8,
    review_count: 567,
    price_level: 2,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800',
    tags: JSON.stringify(['bbq', 'brisket', 'ribs', 'texas', 'casual', 'family friendly']),
    is_open: 1
  },

  {
    name: 'Sakura Sushi',
    category: 'Restaurant',
    subcategory: 'Japanese',
    description: 'Fresh sushi and sashimi crafted by experienced chefs. Omakase available nightly.',
    address: '456 Elm Street',
    city: 'Austin',
    state: 'TX',
    zip: '78703',
    phone: '(512) 555-0103',
    website: 'https://sakurasushi.example.com',
    email: 'contact@sakurasushi.example.com',
    latitude: 30.2749,
    longitude: -97.7544,
    rating: 4.6,
    review_count: 289,
    price_level: 3,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    tags: JSON.stringify(['sushi', 'japanese', 'sashimi', 'omakase', 'seafood']),
    is_open: 1
  },
  {
    name: 'Taco Libre',
    category: 'Restaurant',
    subcategory: 'Mexican',
    description: 'Street-style tacos with fresh tortillas and bold flavors. Best margaritas in town.',
    address: '321 Congress Ave',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0104',
    website: 'https://tacolibre.example.com',
    email: 'hola@tacolibre.example.com',
    latitude: 30.2660,
    longitude: -97.7427,
    rating: 4.5,
    review_count: 412,
    price_level: 1,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    tags: JSON.stringify(['tacos', 'mexican', 'margaritas', 'casual', 'quick bite']),
    is_open: 1
  },

  {
    name: 'Green Leaf Cafe',
    category: 'Restaurant',
    subcategory: 'Healthy',
    description: 'Plant-based meals and organic smoothies. Farm-to-table ingredients sourced locally.',
    address: '567 South Lamar',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    phone: '(512) 555-0105',
    website: 'https://greenleafcafe.example.com',
    email: 'eat@greenleafcafe.example.com',
    latitude: 30.2513,
    longitude: -97.7658,
    rating: 4.4,
    review_count: 198,
    price_level: 2,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    tags: JSON.stringify(['vegan', 'healthy', 'organic', 'smoothies', 'salads', 'brunch']),
    is_open: 1
  },
  {
    name: 'The Burger Joint',
    category: 'Restaurant',
    subcategory: 'American',
    description: 'Gourmet burgers with premium beef, creative toppings, and hand-cut fries.',
    address: '890 East 6th Street',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    phone: '(512) 555-0106',
    website: 'https://theburgerjoint.example.com',
    email: 'info@theburgerjoint.example.com',
    latitude: 30.2663,
    longitude: -97.7307,
    rating: 4.3,
    review_count: 523,
    price_level: 2,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    tags: JSON.stringify(['burgers', 'american', 'fries', 'milkshakes', 'casual']),
    is_open: 1
  },

  {
    name: 'Pho King Delicious',
    category: 'Restaurant',
    subcategory: 'Vietnamese',
    description: 'Traditional Vietnamese pho with rich bone broth simmered for 24 hours. Banh mi and spring rolls too.',
    address: '234 North Loop',
    city: 'Austin',
    state: 'TX',
    zip: '78751',
    phone: '(512) 555-0107',
    website: 'https://phokingdelicious.example.com',
    email: 'info@phokingdelicious.example.com',
    latitude: 30.3191,
    longitude: -97.7243,
    rating: 4.6,
    review_count: 276,
    price_level: 1,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
    tags: JSON.stringify(['pho', 'vietnamese', 'soup', 'banh mi', 'noodles']),
    is_open: 1
  },
  {
    name: 'Craft & Pour',
    category: 'Restaurant',
    subcategory: 'Gastropub',
    description: 'Elevated pub fare with 40 craft beers on tap. Live music on weekends.',
    address: '678 Rainey Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0108',
    website: 'https://craftandpour.example.com',
    email: 'cheers@craftandpour.example.com',
    latitude: 30.2580,
    longitude: -97.7387,
    rating: 4.2,
    review_count: 345,
    price_level: 2,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    tags: JSON.stringify(['beer', 'gastropub', 'live music', 'bar food', 'nightlife']),
    is_open: 1
  },

  {
    name: 'Bluebonnet Books',
    category: 'Retail',
    subcategory: 'Bookstore',
    description: 'Independent bookstore with curated selections, local author events, and a cozy reading nook.',
    address: '112 South Congress',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    phone: '(512) 555-0201',
    website: 'https://bluebonnetbooks.example.com',
    email: 'read@bluebonnetbooks.example.com',
    latitude: 30.2489,
    longitude: -97.7489,
    rating: 4.9,
    review_count: 187,
    price_level: 2,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800',
    tags: JSON.stringify(['books', 'independent', 'local authors', 'reading', 'gifts']),
    is_open: 1
  },
  {
    name: 'Iron & Thread',
    category: 'Retail',
    subcategory: 'Clothing',
    description: 'Locally designed and sustainably made clothing. Unique pieces you won\'t find anywhere else.',
    address: '445 East 2nd Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0202',
    website: 'https://ironandthread.example.com',
    email: 'style@ironandthread.example.com',
    latitude: 30.2635,
    longitude: -97.7380,
    rating: 4.5,
    review_count: 134,
    price_level: 3,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    tags: JSON.stringify(['clothing', 'sustainable', 'local', 'fashion', 'boutique']),
    is_open: 1
  },

  {
    name: 'Pawsitive Vibes Pet Grooming',
    category: 'Services',
    subcategory: 'Pet Care',
    description: 'Full-service pet grooming with organic products. Walk-ins welcome for nail trims.',
    address: '901 Burnet Road',
    city: 'Austin',
    state: 'TX',
    zip: '78756',
    phone: '(512) 555-0301',
    website: 'https://pawsitivevibes.example.com',
    email: 'woof@pawsitivevibes.example.com',
    latitude: 30.3234,
    longitude: -97.7513,
    rating: 4.8,
    review_count: 223,
    price_level: 2,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
    tags: JSON.stringify(['pets', 'grooming', 'dogs', 'cats', 'organic']),
    is_open: 1
  },
  {
    name: 'Spark Fitness Studio',
    category: 'Services',
    subcategory: 'Fitness',
    description: 'Boutique fitness studio offering HIIT, yoga, and spin classes. First class free.',
    address: '333 West 5th Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0302',
    website: 'https://sparkfitness.example.com',
    email: 'sweat@sparkfitness.example.com',
    latitude: 30.2676,
    longitude: -97.7488,
    rating: 4.6,
    review_count: 312,
    price_level: 2,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    tags: JSON.stringify(['fitness', 'yoga', 'hiit', 'spin', 'classes', 'wellness']),
    is_open: 1
  },

  {
    name: 'Lone Star Auto Repair',
    category: 'Services',
    subcategory: 'Automotive',
    description: 'Honest and affordable auto repair. ASE certified mechanics with same-day service.',
    address: '2100 East Riverside',
    city: 'Austin',
    state: 'TX',
    zip: '78741',
    phone: '(512) 555-0303',
    website: 'https://lonestarauto.example.com',
    email: 'fix@lonestarauto.example.com',
    latitude: 30.2399,
    longitude: -97.7256,
    rating: 4.4,
    review_count: 456,
    price_level: 2,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
    tags: JSON.stringify(['auto repair', 'mechanic', 'oil change', 'brakes', 'affordable']),
    is_open: 1
  },
  {
    name: 'Pixel Perfect Photography',
    category: 'Services',
    subcategory: 'Photography',
    description: 'Professional photography for weddings, portraits, and events. Award-winning team.',
    address: '567 West 6th Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0304',
    website: 'https://pixelperfect.example.com',
    email: 'shoot@pixelperfect.example.com',
    latitude: 30.2693,
    longitude: -97.7501,
    rating: 4.9,
    review_count: 167,
    price_level: 3,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800',
    tags: JSON.stringify(['photography', 'weddings', 'portraits', 'events', 'professional']),
    is_open: 1
  },

  {
    name: 'Bean There Coffee Roasters',
    category: 'Restaurant',
    subcategory: 'Coffee Shop',
    description: 'Small-batch roasted coffee beans. Pour-over, espresso, and cold brew. Pastries baked daily.',
    address: '890 Manor Road',
    city: 'Austin',
    state: 'TX',
    zip: '78722',
    phone: '(512) 555-0109',
    website: 'https://beanthere.example.com',
    email: 'brew@beanthere.example.com',
    latitude: 30.2756,
    longitude: -97.7189,
    rating: 4.7,
    review_count: 398,
    price_level: 1,
    hours: restaurantHours,
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    tags: JSON.stringify(['coffee', 'espresso', 'pastries', 'wifi', 'workspace']),
    is_open: 1
  },
  {
    name: 'The Plant Parent',
    category: 'Retail',
    subcategory: 'Garden & Plants',
    description: 'Indoor plants, succulents, and plant care supplies. Workshops every Saturday.',
    address: '234 South 1st Street',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    phone: '(512) 555-0203',
    website: 'https://theplantparent.example.com',
    email: 'grow@theplantparent.example.com',
    latitude: 30.2510,
    longitude: -97.7530,
    rating: 4.7,
    review_count: 145,
    price_level: 2,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    tags: JSON.stringify(['plants', 'garden', 'succulents', 'workshops', 'indoor plants']),
    is_open: 1
  },

  {
    name: 'Vinyl Revival Records',
    category: 'Retail',
    subcategory: 'Music',
    description: 'New and used vinyl records, turntables, and music accessories. In-store listening stations.',
    address: '678 Guadalupe Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0204',
    website: 'https://vinylrevival.example.com',
    email: 'spin@vinylrevival.example.com',
    latitude: 30.2700,
    longitude: -97.7467,
    rating: 4.8,
    review_count: 201,
    price_level: 2,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800',
    tags: JSON.stringify(['vinyl', 'records', 'music', 'turntables', 'vintage']),
    is_open: 1
  },
  {
    name: 'Zen Den Massage & Wellness',
    category: 'Services',
    subcategory: 'Wellness',
    description: 'Therapeutic massage, acupuncture, and wellness services in a tranquil setting.',
    address: '456 West Lynn',
    city: 'Austin',
    state: 'TX',
    zip: '78703',
    phone: '(512) 555-0305',
    website: 'https://zendenaustin.example.com',
    email: 'relax@zendenaustin.example.com',
    latitude: 30.2780,
    longitude: -97.7600,
    rating: 4.7,
    review_count: 189,
    price_level: 3,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    tags: JSON.stringify(['massage', 'wellness', 'spa', 'acupuncture', 'relaxation']),
    is_open: 1
  },

  {
    name: 'Code & Create Coworking',
    category: 'Services',
    subcategory: 'Coworking',
    description: 'Modern coworking space with private offices, hot desks, and meeting rooms. Fast wifi and free coffee.',
    address: '100 East 4th Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0306',
    website: 'https://codecreate.example.com',
    email: 'work@codecreate.example.com',
    latitude: 30.2660,
    longitude: -97.7410,
    rating: 4.5,
    review_count: 278,
    price_level: 2,
    hours: defaultHours,
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    tags: JSON.stringify(['coworking', 'office', 'wifi', 'meeting rooms', 'startup']),
    is_open: 1
  }
];


// Insert all businesses
const insert = db.prepare(`
  INSERT INTO businesses (name, category, subcategory, description, address, city, state, zip, phone, website, email, latitude, longitude, rating, review_count, price_level, hours, image_url, tags, is_open)
  VALUES (@name, @category, @subcategory, @description, @address, @city, @state, @zip, @phone, @website, @email, @latitude, @longitude, @rating, @review_count, @price_level, @hours, @image_url, @tags, @is_open)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) {
    insert.run(item);
  }
});

insertMany(businesses);

console.log(`Seeded ${businesses.length} businesses successfully!`);
db.close();
