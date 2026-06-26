import { useState, useEffect } from 'react';

const YELP_CATEGORIES = [
  { group: 'Automotive', items: ['autorepair', 'bodyshops', 'oilchange', 'tires', 'towing', 'carwash', 'auto_detailing', 'parking', 'car_dealers', 'junkyards'] },
  { group: 'Health & Beauty', items: ['dentists', 'doctors', 'chiropractors', 'optometrists', 'dermatologists', 'podiatrists', 'massage', 'hair', 'othersalons', 'barbers', 'spas', 'physicaltherapy'] },
  { group: 'Retail', items: ['shopping', 'fashion', 'electronics', 'furniture', 'jewelry', 'petstore', 'hardware', 'giftshops', 'sportgoods', 'thrift_stores'] },
  { group: 'Food & Beverage', items: ['restaurants', 'food_delivery', 'hotandnew', 'newrestaurants', 'breakfast_brunch', 'lunch', 'dinner', 'coffee', 'pizza', 'chinese', 'mexican', 'bakeries', 'italian', 'foodtrucks', 'sportsbars', 'pubs', 'juicebars', 'icecream', 'delis', 'catering'] },
  { group: 'Home Services', items: ['contractors', 'handyman', 'plumbing', 'electricians', 'hvac', 'appliances', 'roofing', 'locksmiths', 'painters', 'landscaping', 'nurseries', 'florists', 'treeservices', 'homecleaning', 'furniture', 'movers', 'junkremovalandhauling'] },
  { group: 'Local Services', items: ['dryclean', 'laundromat', 'thrift_stores', 'tailors', 'apartments', 'junkremovalandhauling', 'parking'] },
  { group: 'Fitness & Wellness', items: ['gyms', 'yoga', 'pilates', 'personaltrainers', 'bootcamps', 'martialarts', 'swimming', 'boxing', 'crossfit', 'dancestudio'] },
  { group: 'Pets', items: ['petgroomers', 'petstore', 'vet', 'dogwalkers', 'pet_training', 'petboarding', 'petadoption'] },
  { group: 'Financial', items: ['banks', 'creditunions', 'financialadvising', 'taxservices', 'accountants', 'insurance', 'mortgagebrokers', 'bookkeepers', 'payroll'] },
  { group: 'Real Estate', items: ['realestateagents', 'propertymgmt', 'homeinspectors', 'movers', 'selfstorage', 'apartments'] },
  { group: 'Legal', items: ['lawyers', 'bankruptcy', 'criminal_defense_law', 'dui', 'estateplanning', 'divorce', 'immigration', 'personal_injury', 'employment', 'realestatelaw'] },
  { group: 'Education', items: ['tutoring', 'driving_schools', 'musiclessons', 'dancestudio', 'martialarts', 'languageschools', 'childcare', 'preschools', 'artclasses', 'cookingschools'] },
  { group: 'Tech', items: ['itservices', 'computerrepair', 'datarecovery', 'webdesign', 'marketing', 'software_development', 'networking', 'security_systems'] },
  { group: 'Lifestyle', items: ['tattoo', 'photographers', 'florists', 'eventplanning', 'meditation', 'dogwalkers'] },
  { group: 'Gaming & Entertainment', items: ['arcades', 'escapegames', 'lasertag', 'bowling', 'mini_golf', 'comicbooks', 'hobbyshops', 'virtualrealitycenters'] },
];

const CORS_PROXIES = [
  { url: 'https://api.allorigins.win/raw?url=', passHeaders: false },
  { url: 'https://corsproxy.io/?', passHeaders: true },
  { url: 'https://api.codetabs.com/v1/proxy?quest=', passHeaders: false },
];

function YelpSearch({ addLead }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('yelpApiKey') || '');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('yelpApiKey', apiKey);
    }
  }, [apiKey]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const searchYelp = async () => {
    if (!apiKey) {
      setError('Please add your Yelp API key in the field above (or in Settings).');
      return;
    }
    if (!location) {
      setError('Please enter a city & state to search.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const params = new URLSearchParams({
        location: location,
        limit: '20',
        sort_by: 'rating',
      });

      if (selectedCategory) {
        params.set('categories', selectedCategory);
      }
      if (searchTerm) {
        params.set('term', searchTerm);
      }

      const yelpUrl = `https://api.yelp.com/v3/businesses/search?${params.toString()}`;
      let data = null;
      let lastErr = null;

      // Try each CORS proxy until one works
      for (const proxy of CORS_PROXIES) {
        try {
          // Some proxies pass headers, some don't — for those that don't, we embed the key in the URL
          let proxyUrl;
          let fetchOptions = { headers: { 'Accept': 'application/json' } };

          if (proxy.passHeaders) {
            proxyUrl = `${proxy.url}${encodeURIComponent(yelpUrl)}`;
            fetchOptions.headers['Authorization'] = `Bearer ${apiKey}`;
          } else {
            // Embed authorization in the encoded URL as a header hint for the proxy
            const separator = yelpUrl.includes('?') ? '&' : '?';
            const urlWithAuth = yelpUrl;
            proxyUrl = `${proxy.url}${encodeURIComponent(urlWithAuth)}`;
            fetchOptions.headers['Authorization'] = `Bearer ${apiKey}`;
            fetchOptions.headers['x-requested-with'] = 'XMLHttpRequest';
          }

          const response = await fetch(proxyUrl, fetchOptions);

          if (response.status === 401) {
            throw new Error('Invalid API key. Please check your Yelp Fusion API key. Make sure you copied the full key from https://www.yelp.com/developers/v3/manage_app');
          }
          if (response.status === 429) {
            throw new Error('Rate limit reached. Yelp allows 500 searches/day on the free tier. Try again tomorrow.');
          }

          if (response.ok) {
            data = await response.json();
            break;
          }
        } catch (proxyErr) {
          lastErr = proxyErr;
          if (proxyErr.message.includes('Invalid API key') || proxyErr.message.includes('Rate limit')) {
            throw proxyErr;
          }
          // Try next proxy
          continue;
        }
      }

      if (data && data.businesses && data.businesses.length > 0) {
        setResults(data.businesses);
      } else if (data && data.businesses && data.businesses.length === 0) {
        setError('No results found for this location/category. Try a different city or broader category.');
      } else if (!data) {
        setError(
          'All CORS proxies are currently down. This is a known limitation of browser-only apps.\n\n' +
          '✅ WORKAROUND: Use the "Research Workflow" tab instead — it opens Yelp directly in your browser where you can find the same businesses and save them manually.\n\n' +
          '💡 TIP: Try again in a few minutes — proxies often come back online quickly.'
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveLead = (biz) => {
    const lead = {
      businessName: biz.name,
      category: selectedGroup || 'Other',
      subcategory: biz.categories?.[0]?.title || '',
      size: biz.review_count > 200 ? 'medium' : 'small',
      websiteStatus: biz.url ? 'outdated' : 'none',
      currentWebsite: biz.url || null,
      contactName: null,
      contactEmail: null,
      contactPhone: biz.display_phone || biz.phone || null,
      address: [
        ...(biz.location?.display_address || [])
      ].join(', '),
      notes: [
        `Yelp Rating: ${biz.rating}⭐ (${biz.review_count} reviews)`,
        biz.price ? `Price: ${biz.price}` : '',
        biz.is_closed ? '⚠️ Marked as closed on Yelp' : '✅ Open',
        biz.categories?.map(c => c.title).join(', '),
      ].filter(Boolean).join(' | '),
      priority: biz.rating >= 4 && biz.review_count > 50 ? 'high' : 'medium',
      tags: [
        `yelp-${biz.rating}star`,
        `${biz.review_count}-reviews`,
        ...(biz.categories?.map(c => c.alias) || []),
        biz.price ? biz.price.length === 1 ? 'budget' : biz.price.length >= 3 ? 'premium' : 'mid-range' : '',
      ].filter(Boolean),
    };

    addLead(lead);
    setSavedIds(prev => new Set([...prev, biz.id]));
    showToast(`✅ Saved "${biz.name}" to your leads!`);
  };

  const groupCategories = YELP_CATEGORIES.find(g => g.group === selectedGroup)?.items || [];

  return (
    <div className="discovery-page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(211,35,35,0.1), rgba(245,158,11,0.1))', border: '1px solid rgba(211,35,35,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⭐</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Yelp Live Search</h3>
          <span style={{ fontSize: '0.7rem', background: 'rgba(16,185,129,0.15)', color: 'var(--secondary)', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: '600' }}>LIVE DATA</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Search Yelp's database directly. Results show real business names, phone numbers, addresses, ratings, and review counts. Save any lead with one click.
        </p>
      </div>

      {/* API Key Setup */}
      {!apiKey && (
        <div className="dash-card" style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>🔑 Setup: Add Your Yelp API Key</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
            Get your free API key in 2 minutes:
          </p>
          <ol style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '2', marginBottom: '1rem' }}>
            <li>Go to <a href="https://www.yelp.com/developers/v3/manage_app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Yelp Fusion → Create App</a></li>
            <li>Sign in with any Yelp account (or create one free)</li>
            <li>Fill in app name: "WebScout" and description: "Lead research"</li>
            <li>Copy the <strong>API Key</strong> and paste it below</li>
          </ol>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            💡 Free tier = 500 searches/day — more than enough for lead generation.
          </p>
        </div>
      )}

      {/* API Key Input (always visible for changing) */}
      <div className="dash-card">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              🔑 Yelp API Key
              {apiKey && <span style={{ color: 'var(--secondary)', fontSize: '0.7rem' }}>✓ Saved</span>}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Yelp Fusion API key here..."
              style={{ width: '100%', padding: '0.6rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.85rem' }}
            />
          </div>
          {apiKey && (
            <button className="btn btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }} onClick={() => { setApiKey(''); localStorage.removeItem('yelpApiKey'); }}>
              Clear Key
            </button>
          )}
        </div>
      </div>

      {/* Search Controls */}
      <div className="dash-card">
        <h3 style={{ marginBottom: '1rem' }}>🔍 Search Yelp</h3>

        {/* Location */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: '1', minWidth: '250px', margin: 0 }}>
            <label>Location (City, State) *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Houston, TX or 90210"
              style={{ width: '100%', padding: '0.6rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.85rem' }}
            />
          </div>
          <div className="form-group" style={{ flex: '1', minWidth: '200px', margin: 0 }}>
            <label>Custom Search Term (optional)</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. oil change, dentist, barber"
              style={{ width: '100%', padding: '0.6rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Category Group */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Category Group</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {YELP_CATEGORIES.map(group => (
              <button
                key={group.group}
                className={`filter-chip ${selectedGroup === group.group ? 'active' : ''}`}
                onClick={() => { setSelectedGroup(selectedGroup === group.group ? '' : group.group); setSelectedCategory(''); }}
              >
                {group.group}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory */}
        {selectedGroup && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Specific Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              <button
                className={`size-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All in {selectedGroup}
              </button>
              {groupCategories.map(cat => (
                <button
                  key={cat}
                  className={`size-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          className="btn btn-primary"
          onClick={searchYelp}
          disabled={loading || !location}
          style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}
        >
          {loading ? '⏳ Searching Yelp...' : '🔍 Search Yelp Now'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#f87171' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Found <strong>{results.length}</strong> businesses in <strong>{location}</strong>
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ⭐ Sorted by rating • Click "Save" to add to your leads
            </span>
          </div>

          <div className="discovery-grid">
            {results.map(biz => (
              <div key={biz.id} className="lead-card">
                {/* Header */}
                <div className="lead-card-header">
                  <div>
                    <h3>{biz.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {biz.categories?.map(c => c.title).join(', ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent)' }}>
                      {'⭐'.repeat(Math.round(biz.rating))} {biz.rating}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{biz.review_count} reviews</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ background: 'var(--surface-elevated)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem' }}>
                  {biz.display_phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span>📱</span>
                      <a href={`tel:${biz.phone}`} style={{ color: 'var(--secondary)', fontWeight: '600' }}>{biz.display_phone}</a>
                    </div>
                  )}
                  {biz.location?.display_address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span>📍</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{biz.location.display_address.join(', ')}</span>
                    </div>
                  )}
                  {biz.price && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>💰</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{biz.price}</span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                  {biz.is_closed && (
                    <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Permanently Closed
                    </span>
                  )}
                  {!biz.is_closed && (
                    <span style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Open
                    </span>
                  )}
                  {biz.rating >= 4 && biz.review_count > 50 && (
                    <span style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      🔥 High Potential
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="lead-card-actions">
                  {biz.url && (
                    <button onClick={() => window.open(biz.url, '_blank')}>⭐ Yelp Page</button>
                  )}
                  <button
                    className={savedIds.has(biz.id) ? '' : 'primary-action'}
                    onClick={() => saveLead(biz)}
                    disabled={savedIds.has(biz.id)}
                  >
                    {savedIds.has(biz.id) ? '✓ Saved' : '💾 Save Lead'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</p>
          <p>Searching Yelp in {location}...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
          <p style={{ fontSize: '0.9rem' }}>Enter a location and category, then hit Search to find real businesses on Yelp.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Every result has a real phone number and address you can call today.</p>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default YelpSearch;
