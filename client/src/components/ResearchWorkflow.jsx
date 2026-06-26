import { useState, useCallback } from 'react';

const RESEARCH_CATEGORIES = [
  { id: 'retail', label: 'Retail', emoji: '🛍️', searches: ['clothing store', 'boutique', 'gift shop', 'hardware store', 'electronics store', 'furniture store', 'pet store', 'jewelry store', 'thrift store', 'shoe store'] },
  { id: 'tech', label: 'Tech', emoji: '💻', searches: ['IT services', 'computer repair', 'app developer', 'web hosting', 'tech startup', 'software company', 'managed IT', 'cybersecurity firm', 'digital marketing agency', 'SEO company'] },
  { id: 'lifestyle', label: 'Lifestyle', emoji: '✨', searches: ['yoga studio', 'hair salon', 'nail salon', 'barbershop', 'tattoo shop', 'photography studio', 'florist', 'wedding planner', 'personal trainer', 'spa'] },
  { id: 'credit', label: 'Credit & Finance', emoji: '💳', searches: ['credit repair', 'tax preparer', 'accountant', 'insurance agent', 'mortgage broker', 'financial advisor', 'bookkeeper', 'payroll service', 'debt consolidation', 'loan officer'] },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', searches: ['gaming lounge', 'internet cafe', 'retro game store', 'tabletop game shop', 'esports venue', 'comic book store', 'card game shop', 'VR arcade', 'gaming PC builder', 'board game cafe'] },
  { id: 'healthcare', label: 'Healthcare', emoji: '🏥', searches: ['dentist', 'chiropractor', 'physical therapy', 'optometrist', 'dermatologist', 'pediatrician', 'veterinarian', 'mental health counselor', 'acupuncture', 'urgent care'] },
  { id: 'food', label: 'Food & Beverage', emoji: '🍽️', searches: ['restaurant', 'bakery', 'food truck', 'catering company', 'coffee shop', 'brewery', 'juice bar', 'pizzeria', 'ice cream shop', 'deli'] },
  { id: 'education', label: 'Education', emoji: '📚', searches: ['tutoring center', 'driving school', 'music lessons', 'dance studio', 'martial arts', 'language school', 'daycare', 'preschool', 'art classes', 'cooking classes'] },
  { id: 'realestate', label: 'Real Estate', emoji: '🏠', searches: ['real estate agent', 'property management', 'home inspector', 'moving company', 'storage facility', 'cleaning service', 'landscaping', 'roofing contractor', 'plumber', 'electrician'] },
  { id: 'automotive', label: 'Automotive', emoji: '🚗', searches: ['auto repair', 'auto body shop', 'car wash', 'tire shop', 'oil change', 'auto detailing', 'towing service', 'transmission repair', 'muffler shop', 'window tinting'] },
];

const US_STATES_WITH_CITIES = {
  'Alabama': ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile'],
  'Alaska': ['Anchorage', 'Fairbanks', 'Juneau'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler'],
  'Arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Oakland', 'Long Beach'],
  'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Boulder', 'Fort Collins'],
  'Connecticut': ['Hartford', 'New Haven', 'Stamford', 'Bridgeport'],
  'Delaware': ['Wilmington', 'Dover', 'Newark'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'St. Petersburg'],
  'Georgia': ['Atlanta', 'Savannah', 'Augusta', 'Columbus'],
  'Hawaii': ['Honolulu', 'Maui', 'Kailua'],
  'Idaho': ['Boise', 'Nampa', 'Meridian'],
  'Illinois': ['Chicago', 'Springfield', 'Naperville', 'Rockford'],
  'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville'],
  'Iowa': ['Des Moines', 'Cedar Rapids', 'Iowa City'],
  'Kansas': ['Wichita', 'Overland Park', 'Kansas City'],
  'Kentucky': ['Louisville', 'Lexington', 'Bowling Green'],
  'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport'],
  'Maine': ['Portland', 'Bangor', 'Lewiston'],
  'Maryland': ['Baltimore', 'Annapolis', 'Rockville', 'Frederick'],
  'Massachusetts': ['Boston', 'Worcester', 'Cambridge', 'Springfield'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing'],
  'Minnesota': ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth'],
  'Mississippi': ['Jackson', 'Gulfport', 'Hattiesburg'],
  'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
  'Montana': ['Billings', 'Missoula', 'Great Falls'],
  'Nebraska': ['Omaha', 'Lincoln', 'Bellevue'],
  'Nevada': ['Las Vegas', 'Reno', 'Henderson', 'North Las Vegas'],
  'New Hampshire': ['Manchester', 'Nashua', 'Concord'],
  'New Jersey': ['Newark', 'Jersey City', 'Trenton', 'Paterson'],
  'New Mexico': ['Albuquerque', 'Santa Fe', 'Las Cruces'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Durham', 'Greensboro', 'Wilmington'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks'],
  'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Dayton', 'Toledo'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman'],
  'Oregon': ['Portland', 'Eugene', 'Salem', 'Bend'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Harrisburg'],
  'Rhode Island': ['Providence', 'Warwick', 'Cranston'],
  'South Carolina': ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach'],
  'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
  'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington'],
  'Utah': ['Salt Lake City', 'Provo', 'Ogden', 'St. George'],
  'Vermont': ['Burlington', 'Montpelier', 'Rutland'],
  'Virginia': ['Virginia Beach', 'Richmond', 'Norfolk', 'Arlington'],
  'Washington': ['Seattle', 'Tacoma', 'Spokane', 'Bellevue'],
  'West Virginia': ['Charleston', 'Huntington', 'Morgantown'],
  'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay'],
  'Wyoming': ['Cheyenne', 'Casper', 'Laramie'],
};

const INITIAL_CHECKLIST = [
  { id: 'name', label: 'Business name confirmed', checked: false },
  { id: 'phone', label: 'Phone number verified (called or checked Google)', checked: false },
  { id: 'email', label: 'Email found (website, Facebook, or Yelp)', checked: false },
  { id: 'address', label: 'Physical address confirmed', checked: false },
  { id: 'website', label: 'Checked current website (or confirmed no website)', checked: false },
  { id: 'mobile', label: 'Tested website on mobile (if they have one)', checked: false },
  { id: 'reviews', label: 'Checked Google/Yelp reviews & rating', checked: false },
  { id: 'social', label: 'Found social media (Instagram, Facebook, etc.)', checked: false },
  { id: 'owner', label: 'Identified owner/decision-maker name', checked: false },
  { id: 'competitors', label: 'Checked if competitors have better websites', checked: false },
];

function ResearchWorkflow({ addLead }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [toast, setToast] = useState(null);
  const [websiteToCheck, setWebsiteToCheck] = useState('');
  const [websiteAnalysis, setWebsiteAnalysis] = useState(null);

  // Quick Entry Form State
  const [form, setForm] = useState({
    businessName: '',
    category: '',
    subcategory: '',
    size: 'small',
    websiteStatus: 'none',
    currentWebsite: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    notes: '',
    priority: 'medium',
    tags: '',
    googleRating: '',
    yelpRating: '',
    reviewCount: '',
    socialMedia: ''
  });

  const targetCity = customCity || selectedCity;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Generate search URLs
  const generateGoogleMapsUrl = (query) => {
    return `https://www.google.com/maps/search/${encodeURIComponent(query + ' ' + targetCity + ' ' + selectedState)}`;
  };

  const generateYelpUrl = (query) => {
    const location = encodeURIComponent(targetCity + ', ' + selectedState);
    const searchTerm = encodeURIComponent(query);
    return `https://www.yelp.com/search?find_desc=${searchTerm}&find_loc=${location}`;
  };

  const generateGoogleSearchUrl = (query) => {
    const searchQuery = `${query} ${targetCity} ${selectedState} -site:yelp.com -site:facebook.com`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const generateNoWebsiteSearchUrl = (query) => {
    // Search specifically for businesses that might not have websites
    const searchQuery = `"${query}" "${targetCity}" "${selectedState}" site:yelp.com OR site:yellowpages.com OR site:google.com/maps`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  // Phone number validation
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `(${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
    }
    return phone; // Return as-is if can't format
  };

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleFormChange = (field, value) => {
    if (field === 'contactPhone' && value.length > 3) {
      value = validatePhone(value);
    }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleChecklistToggle = (id) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const resetChecklist = () => {
    setChecklist(INITIAL_CHECKLIST);
  };

  const checklistProgress = checklist.filter(c => c.checked).length;

  // Website age/quality checker
  const analyzeWebsite = () => {
    if (!websiteToCheck) return;

    const url = websiteToCheck.startsWith('http') ? websiteToCheck : `http://${websiteToCheck}`;

    // Open the website
    window.open(url, '_blank');

    // Provide analysis prompts
    setWebsiteAnalysis({
      url,
      checks: [
        { question: 'Is it mobile responsive?', hint: 'Resize your browser window or check on your phone' },
        { question: 'Does it have HTTPS (padlock icon)?', hint: 'Look at the URL bar — "Not Secure" = no SSL' },
        { question: 'Does it load fast (under 3 seconds)?', hint: 'If it takes long to load, clients are bouncing' },
        { question: 'Is the design modern (post-2020 look)?', hint: 'Rounded corners, good spacing, clean fonts = modern' },
        { question: 'Does it have a clear call-to-action?', hint: 'Can you easily find "Contact Us" or "Book Now"?' },
        { question: 'Is the content up to date?', hint: 'Check copyright year in footer, look for recent posts/updates' },
        { question: 'Are there broken images or links?', hint: 'Click around — any 404 pages or missing images?' },
        { question: 'Is it built on a free platform?', hint: 'Look for Wix/Weebly/WordPress.com branding in footer' },
      ]
    });
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!form.businessName.trim()) {
      showToast('⚠️ Business name is required!');
      return;
    }

    // Validate email if provided
    if (form.contactEmail && !validateEmail(form.contactEmail)) {
      showToast('⚠️ Please check the email address format');
      return;
    }

    // Build the lead
    const newLead = {
      businessName: form.businessName.trim(),
      category: form.category || (selectedCategory?.label) || 'Other',
      subcategory: form.subcategory || '',
      size: form.size,
      websiteStatus: form.websiteStatus,
      currentWebsite: form.currentWebsite || null,
      contactName: form.contactName || null,
      contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null,
      address: form.address || (targetCity && selectedState ? `${targetCity}, ${selectedState}` : ''),
      notes: [
        form.notes,
        form.googleRating ? `Google: ${form.googleRating}⭐` : '',
        form.yelpRating ? `Yelp: ${form.yelpRating}⭐` : '',
        form.reviewCount ? `${form.reviewCount} reviews` : '',
        form.socialMedia ? `Social: ${form.socialMedia}` : '',
      ].filter(Boolean).join(' | '),
      priority: form.priority,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    addLead(newLead);
    showToast('✅ Lead saved with verified info!');

    // Reset form
    setForm({
      businessName: '', category: '', subcategory: '', size: 'small',
      websiteStatus: 'none', currentWebsite: '', contactName: '',
      contactEmail: '', contactPhone: '', address: '', notes: '',
      priority: 'medium', tags: '', googleRating: '', yelpRating: '',
      reviewCount: '', socialMedia: ''
    });
    resetChecklist();
  };

  return (
    <div className="discovery-page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.3rem' }}>🔬 Smart Research Workflow</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Find real businesses on Google Maps & Yelp, verify their info, then save 100% accurate leads.
          Every lead you save here is <strong>real, verified data</strong> — no guessing.
        </p>
      </div>

      {/* Step 1: Choose Location */}
      <div className="dash-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>1</span>
          Choose Your Target Location
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          <div className="form-group" style={{ flex: '1', minWidth: '200px', margin: 0 }}>
            <label>State</label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); setCustomCity(''); }}
              style={{ width: '100%', padding: '0.6rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.85rem' }}
            >
              <option value="">Select a state...</option>
              {Object.keys(US_STATES_WITH_CITIES).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          {selectedState && (
            <div className="form-group" style={{ flex: '1', minWidth: '200px', margin: 0 }}>
              <label>City (choose or type custom)</label>
              <select
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setCustomCity(''); }}
                style={{ width: '100%', padding: '0.6rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.85rem' }}
              >
                <option value="">Select a city...</option>
                {(US_STATES_WITH_CITIES[selectedState] || []).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          )}
          {selectedState && (
            <div className="form-group" style={{ flex: '1', minWidth: '200px', margin: 0 }}>
              <label>Or type any city</label>
              <input
                type="text"
                value={customCity}
                onChange={(e) => { setCustomCity(e.target.value); setSelectedCity(''); }}
                placeholder="Any city in the state..."
                style={{ width: '100%', padding: '0.6rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.85rem' }}
              />
            </div>
          )}
        </div>
        {targetCity && selectedState && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--secondary)' }}>
            ✓ Targeting: <strong>{targetCity}, {selectedState}</strong>
          </p>
        )}
      </div>

      {/* Step 2: Choose Category & Search */}
      <div className="dash-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>2</span>
          Search for Businesses
          {!targetCity && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>(select location first)</span>}
        </h3>

        {targetCity && selectedState ? (
          <>
            {/* Category selection */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
              {RESEARCH_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Search Links */}
            {selectedCategory && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Click any search below to find <strong>{selectedCategory.label}</strong> businesses in <strong>{targetCity}, {selectedState}</strong>. Look for ones with bad/no websites!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {selectedCategory.searches.map(query => (
                    <div key={query} style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.85rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                        {query}
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <a
                          href={generateGoogleMapsUrl(query)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: '0.3rem 0.6rem', background: 'rgba(66,133,244,0.15)', border: '1px solid rgba(66,133,244,0.3)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600', color: '#4285f4', textDecoration: 'none' }}
                        >
                          📍 Google Maps
                        </a>
                        <a
                          href={generateYelpUrl(query)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: '0.3rem 0.6rem', background: 'rgba(211,35,35,0.15)', border: '1px solid rgba(211,35,35,0.3)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600', color: '#d32323', textDecoration: 'none' }}
                        >
                          ⭐ Yelp
                        </a>
                        <a
                          href={generateGoogleSearchUrl(query)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: '0.3rem 0.6rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600', color: '#10b981', textDecoration: 'none' }}
                        >
                          🔍 Google
                        </a>
                        <a
                          href={generateNoWebsiteSearchUrl(query)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: '0.3rem 0.6rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600', color: '#f59e0b', textDecoration: 'none' }}
                        >
                          🚫 No-Website Hunt
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '600', marginBottom: '0.3rem' }}>💡 What to look for:</p>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.7' }}>
                    <li>Businesses with <strong>no website link</strong> in their Google Maps listing</li>
                    <li>Sites that look old, have broken links, or say "Not Secure"</li>
                    <li>Sites built on free platforms (Wix free, Weebly, Blogspot)</li>
                    <li>High-rated businesses (4+ stars) with bad/no websites — they clearly have demand!</li>
                    <li>Businesses that are active on social media but have no proper website</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            👆 Select a state and city above to generate search links.
          </p>
        )}
      </div>

      {/* Step 3: Website Checker */}
      <div className="dash-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>3</span>
          Check Their Website (Is It Outdated?)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem' }}>
          Paste a business's website URL to open it and use the checklist to determine if they need a redesign.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={websiteToCheck}
            onChange={(e) => setWebsiteToCheck(e.target.value)}
            placeholder="Paste website URL (e.g. joesbarber.com)"
            className="search-input"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={analyzeWebsite} disabled={!websiteToCheck}>
            🌐 Open & Check
          </button>
        </div>

        {websiteAnalysis && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-elevated)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: '600', marginBottom: '0.75rem' }}>
              🔍 Website opened in new tab. Answer these questions:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {websiteAnalysis.checks.map((check, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem', background: 'var(--bg)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.85rem' }}>❓</span>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>{check.question}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{check.hint}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.75rem', fontWeight: '500' }}>
              ⚡ If 3+ answers are negative → This is a great lead! Save them below.
            </p>
          </div>
        )}
      </div>

      {/* Step 4: Research Checklist */}
      <div className="dash-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>4</span>
          Research Checklist
          <span style={{ fontSize: '0.75rem', color: checklistProgress >= 7 ? 'var(--secondary)' : 'var(--text-muted)', marginLeft: 'auto', fontWeight: '400' }}>
            {checklistProgress}/{checklist.length} verified
          </span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem' }}>
          Check off each item as you verify it. Complete at least 7/10 before saving for best cold call results.
        </p>

        {/* Progress bar */}
        <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(checklistProgress / checklist.length) * 100}%`, background: checklistProgress >= 7 ? 'var(--secondary)' : 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.4rem' }}>
          {checklist.map(item => (
            <label
              key={item.id}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: item.checked ? 'rgba(16,185,129,0.08)' : 'var(--surface-elevated)', border: `1px solid ${item.checked ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleChecklistToggle(item.id)}
                style={{ accentColor: 'var(--secondary)' }}
              />
              <span style={{ color: item.checked ? 'var(--secondary)' : 'var(--text-secondary)', textDecoration: item.checked ? 'line-through' : 'none' }}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
        <button className="btn btn-secondary" style={{ marginTop: '0.75rem', fontSize: '0.75rem' }} onClick={resetChecklist}>
          🔄 Reset Checklist
        </button>
      </div>

      {/* Step 5: Quick Entry Form */}
      <div className="dash-card" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: 'var(--secondary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>5</span>
          Save Verified Lead
          {checklistProgress < 7 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: '400' }}>
              (Tip: Complete checklist first for best results)
            </span>
          )}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem' }}>
          Paste the real, verified information you found. Phone numbers auto-format. This goes directly to your leads.
        </p>

        <form onSubmit={handleSaveLead}>
          {/* Business Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Business Name *</label>
              <input type="text" value={form.businessName} onChange={(e) => handleFormChange('businessName', e.target.value)} placeholder="Exact name from Google/Yelp" required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Category</label>
              <select value={form.category} onChange={(e) => handleFormChange('category', e.target.value)}>
                <option value="">Select...</option>
                {RESEARCH_CATEGORIES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Subcategory / Type</label>
              <input type="text" value={form.subcategory} onChange={(e) => handleFormChange('subcategory', e.target.value)} placeholder="e.g. Pizza Restaurant" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Company Size</label>
              <select value={form.size} onChange={(e) => handleFormChange('size', e.target.value)}>
                <option value="small">Small (1-10)</option>
                <option value="medium">Medium (11-100)</option>
                <option value="large">Large (100+)</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-light)', margin: '1rem 0 0.5rem' }}>📞 Contact Info (from Google/Yelp/Website)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Owner / Manager Name</label>
              <input type="text" value={form.contactName} onChange={(e) => handleFormChange('contactName', e.target.value)} placeholder="From About page, Yelp, LinkedIn" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Phone Number</label>
              <input type="tel" value={form.contactPhone} onChange={(e) => handleFormChange('contactPhone', e.target.value)} placeholder="Auto-formats: 5551234567" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Email</label>
              <input type="email" value={form.contactEmail} onChange={(e) => handleFormChange('contactEmail', e.target.value)} placeholder="From website contact page" />
              {form.contactEmail && !validateEmail(form.contactEmail) && (
                <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>⚠️ Invalid email format</span>
              )}
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Full Address</label>
              <input type="text" value={form.address} onChange={(e) => handleFormChange('address', e.target.value)} placeholder="123 Main St, City, ST" />
            </div>
          </div>

          {/* Website Status */}
          <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-light)', margin: '1rem 0 0.5rem' }}>🌐 Website Status</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Website Status</label>
              <select value={form.websiteStatus} onChange={(e) => handleFormChange('websiteStatus', e.target.value)}>
                <option value="none">❌ No Website At All</option>
                <option value="outdated">⚠️ Has Website But Outdated</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Current Website (if any)</label>
              <input type="text" value={form.currentWebsite} onChange={(e) => handleFormChange('currentWebsite', e.target.value)} placeholder="http://..." />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Priority</label>
              <select value={form.priority} onChange={(e) => handleFormChange('priority', e.target.value)}>
                <option value="high">🔴 High (great opportunity)</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Ratings & Social Proof */}
          <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-light)', margin: '1rem 0 0.5rem' }}>⭐ Ratings & Social (Optional)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Google Rating</label>
              <input type="text" value={form.googleRating} onChange={(e) => handleFormChange('googleRating', e.target.value)} placeholder="e.g. 4.5" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Yelp Rating</label>
              <input type="text" value={form.yelpRating} onChange={(e) => handleFormChange('yelpRating', e.target.value)} placeholder="e.g. 4.0" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Total Reviews</label>
              <input type="text" value={form.reviewCount} onChange={(e) => handleFormChange('reviewCount', e.target.value)} placeholder="e.g. 150" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Social Media</label>
              <input type="text" value={form.socialMedia} onChange={(e) => handleFormChange('socialMedia', e.target.value)} placeholder="e.g. @joesbarber (IG)" />
            </div>
          </div>

          {/* Notes & Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Notes (why this is a good lead)</label>
              <textarea value={form.notes} onChange={(e) => handleFormChange('notes', e.target.value)} placeholder="e.g. No website, 4.8 stars on Google, 200+ reviews, active on Instagram..." style={{ minHeight: '70px' }} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Tags (comma-separated)</label>
              <textarea value={form.tags} onChange={(e) => handleFormChange('tags', e.target.value)} placeholder="e.g. no-website, high-reviews, instagram-active, needs-booking" style={{ minHeight: '70px' }} />
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              ✅ Save Verified Lead
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => {
              setForm({ businessName: '', category: '', subcategory: '', size: 'small', websiteStatus: 'none', currentWebsite: '', contactName: '', contactEmail: '', contactPhone: '', address: '', notes: '', priority: 'medium', tags: '', googleRating: '', yelpRating: '', reviewCount: '', socialMedia: '' });
            }}>
              🗑️ Clear Form
            </button>
            {checklistProgress >= 7 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '500' }}>
                ✓ Checklist complete — this lead is well-researched!
              </span>
            )}
          </div>
        </form>
      </div>

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

export default ResearchWorkflow;
