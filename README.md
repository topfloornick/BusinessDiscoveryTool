# WebScout — Website Discovery Workflow

A modern lead discovery tool for web designers to find businesses that need new or updated websites. Search Yelp's live database, verify leads, and manage your cold outreach — all from one app.

## 🚀 Quick Start (2 Steps)

### Step 1: Install
```bash
npm run install:all
```

### Step 2: Run
Open **two terminals:**

**Terminal 1 — Start the server (Yelp proxy):**
```bash
cd server
npm run dev
```

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```

Then open `http://localhost:5173` in your browser.

> **That's it!** The server handles Yelp API calls so you never hit CORS issues.

---

## 🔑 Yelp API Setup (Free, 2 Minutes)

1. Go to [https://www.yelp.com/developers/v3/manage_app](https://www.yelp.com/developers/v3/manage_app)
2. Sign in or create a free Yelp account
3. App name: `WebScout` / Description: `Lead research`
4. Copy the **API Key**
5. Paste it in WebScout → Settings or on the Yelp Live Search page

**Free tier = 500 searches/day** — more than enough for lead generation.

---

## ✨ Features

- **⭐ Yelp Live Search** — Search Yelp's database directly for real businesses with real phone numbers
- **🔬 Research Workflow** — Step-by-step guided research with Google Maps & Yelp links
- **📁 Lead Manager** — Table view + folder view to organize clients by category
- **📊 Sales Pipeline** — Track leads from discovery to closed deal
- **✉️ Email Templates** — 6 professional cold outreach templates
- **📞 Call Scripts** — 3 proven scripts for cold calls, follow-ups, and discovery calls
- **📤 Export** — Download leads as CSV or JSON

## 🏷️ Categories (200+ Subcategories)

| Category | Examples |
|----------|----------|
| 🚗 Automotive | Auto Repair, Body Shops, Oil Change, Tires, Towing, Car Wash, Detailing, Dealers, Junkyards |
| 💆 Health & Beauty | Dentists, Doctors, Chiropractors, Optometrists, Dermatologists, Massage, Hair, Nails, Barbers, Spas, PT |
| 🍽️ Food & Beverage | Restaurants, Bakeries, Coffee, Pizza, Food Trucks, Bars, Catering |
| 🏡 Home Services | Contractors, Plumbers, Electricians, HVAC, Roofing, Painters, Landscaping, Movers |
| 💪 Fitness & Gyms | Gyms, Yoga, Pilates, CrossFit, Boxing, Personal Trainers |
| 🐾 Pets | Groomers, Pet Stores, Vets, Dog Walkers, Boarding |
| 🏦 Banks & Finance | Credit Repair, Tax, Accounting, Insurance, Mortgage |
| 🏠 Real Estate | Agents, Property Management, Inspectors, Storage |
| 🛍️ Retail | Clothing, Electronics, Furniture, Jewelry, Hardware |
| 💻 Tech | IT Services, Computer Repair, Web Design, Marketing |
| ⚖️ Legal | All attorney types |
| 📚 Education | Tutoring, Driving School, Music, Dance, Daycare |
| 🎮 Gaming | Gaming Lounges, Arcades, VR, Escape Rooms |
| ✨ Lifestyle | Tattoo, Photography, Events, Florists |

## 💡 No Business Domain Required

- ✅ Use your personal email (Gmail, Outlook)
- ✅ Use your personal phone number
- ✅ No LLC, no business registration needed
- ✅ Start getting clients TODAY

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Express.js (lightweight Yelp proxy only)
- **Storage:** localStorage (no database needed)
- **API:** Yelp Fusion (free tier)

## 📂 Project Structure

```
BusinessDiscoveryTool/
├── client/           # React frontend (Vite)
│   └── src/
│       ├── components/   # All UI components
│       └── data/         # Email templates, call scripts
├── server/           # Express proxy server
│   └── src/
│       └── index.js      # Yelp API proxy (that's it!)
└── package.json      # Root scripts
```

## License

MIT
