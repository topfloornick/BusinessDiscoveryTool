import { useState, useEffect } from 'react';

function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('webscoutSettings');
    return saved ? JSON.parse(saved) : {
      yourName: '',
      yourEmail: '',
      yourPhone: '',
      yourCity: '',
      yourState: '',
      portfolioUrl: '',
      pricingMin: '',
      pricingMax: ''
    };
  });

  const [yelpKey, setYelpKey] = useState(() => localStorage.getItem('yelpApiKey') || '');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('webscoutSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (yelpKey) {
      localStorage.setItem('yelpApiKey', yelpKey);
    }
  }, [yelpKey]);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm('This will clear ALL leads and settings. Are you sure?')) {
      localStorage.removeItem('discoveryLeads');
      localStorage.removeItem('webscoutSettings');
      localStorage.removeItem('yelpApiKey');
      window.location.reload();
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="settings-page">
      {/* Your Info */}
      <div className="settings-section">
        <h3>👤 Your Information</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Used to personalize email templates and call scripts. Personal email and phone are perfectly fine!
        </p>
        <div className="setting-item">
          <label>Your Name</label>
          <input
            value={settings.yourName}
            onChange={(e) => handleChange('yourName', e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="setting-item">
          <label>Email (personal is fine!)</label>
          <input
            value={settings.yourEmail}
            onChange={(e) => handleChange('yourEmail', e.target.value)}
            placeholder="you@gmail.com"
          />
        </div>
        <div className="setting-item">
          <label>Phone (personal works!)</label>
          <input
            value={settings.yourPhone}
            onChange={(e) => handleChange('yourPhone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="setting-item">
          <label>City</label>
          <input
            value={settings.yourCity}
            onChange={(e) => handleChange('yourCity', e.target.value)}
            placeholder="Your city"
          />
        </div>
        <div className="setting-item">
          <label>State</label>
          <input
            value={settings.yourState}
            onChange={(e) => handleChange('yourState', e.target.value)}
            placeholder="Your state"
          />
        </div>
      </div>

      {/* Yelp API */}
      <div className="settings-section" style={{ border: '1px solid rgba(211,35,35,0.2)', background: 'rgba(211,35,35,0.03)' }}>
        <h3>⭐ Yelp API Key</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Get a free API key from <a href="https://www.yelp.com/developers/v3/manage_app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)' }}>Yelp Fusion</a> (500 free searches/day).
          This powers the Yelp Live Search feature.
        </p>
        <div className="setting-item">
          <label>API Key</label>
          <input
            type="password"
            value={yelpKey}
            onChange={(e) => setYelpKey(e.target.value)}
            placeholder="Paste your Yelp Fusion API key..."
          />
        </div>
        {yelpKey && (
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
            ✓ Key saved — Yelp Live Search is active!
          </p>
        )}
      </div>

      {/* Business Details */}
      <div className="settings-section">
        <h3>💼 Service Details</h3>
        <div className="setting-item">
          <label>Portfolio URL (optional)</label>
          <input
            value={settings.portfolioUrl}
            onChange={(e) => handleChange('portfolioUrl', e.target.value)}
            placeholder="https://your-portfolio.com"
          />
        </div>
        <div className="setting-item">
          <label>Starting Price</label>
          <input
            value={settings.pricingMin}
            onChange={(e) => handleChange('pricingMin', e.target.value)}
            placeholder="$500"
          />
        </div>
        <div className="setting-item">
          <label>Max Price</label>
          <input
            value={settings.pricingMax}
            onChange={(e) => handleChange('pricingMax', e.target.value)}
            placeholder="$5,000"
          />
        </div>
      </div>

      {/* Tips */}
      <div className="settings-section" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(99,102,241,0.05))', border: '1px solid rgba(16,185,129,0.2)' }}>
        <h3>💡 Pro Tips for Getting Started</h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>❌ You do NOT need:</strong></p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
            <li>A business domain or business email</li>
            <li>An LLC or business registration</li>
            <li>A fancy phone system</li>
            <li>An office or dedicated workspace</li>
          </ul>
          <p><strong>✅ You DO need:</strong></p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
            <li>Your personal email (Gmail, Outlook, etc.)</li>
            <li>Your personal phone number</li>
            <li>A professional voicemail greeting</li>
            <li>2-3 sample/mockup websites to show</li>
            <li>Confidence and consistency in your outreach</li>
          </ul>
          <p><strong>🎯 Outreach Best Practices:</strong></p>
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li>Reach out to 5-10 leads per day</li>
            <li>Follow up 3 times before moving on</li>
            <li>Call during business hours (9am-5pm their time)</li>
            <li>Personalize every email — mention something specific</li>
            <li>Offer a free mockup — it converts like crazy</li>
            <li>Search covers ALL US states — no zip restrictions</li>
          </ul>
        </div>
      </div>

      {/* Coverage Info */}
      <div className="settings-section">
        <h3>🇺🇸 Search Coverage</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Your discovery workflow covers the <strong>entire United States</strong> — all 50 states with no zip code or radius restrictions.
          Find businesses that need websites anywhere from New York to California, Maine to Texas.
        </p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-elevated)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong>Categories Covered:</strong> Retail, Tech, Lifestyle, Credit/Finance, Gaming, Healthcare, Food & Beverage, Education, Real Estate, Automotive, and any business with an outdated or missing website.
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h3>🗄️ Data Management</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          All data is stored locally in your browser. Export your leads before clearing.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              const data = localStorage.getItem('discoveryLeads');
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'webscout-leads-export.json';
              a.click();
              showToast('Leads exported!');
            }}
          >
            📤 Export Leads (JSON)
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const data = JSON.parse(localStorage.getItem('discoveryLeads') || '[]');
              const csv = [
                'Business Name,Category,Subcategory,Size,Website Status,Contact Name,Phone,Email,Address,Priority,Status,Notes',
                ...data.map(l => [
                  `"${l.businessName}"`, `"${l.category}"`, `"${l.subcategory || ''}"`, l.size,
                  l.websiteStatus, `"${l.contactName || ''}"`, `"${l.contactPhone || ''}"`,
                  `"${l.contactEmail || ''}"`, `"${l.address || ''}"`, l.priority, l.status,
                  `"${(l.notes || '').replace(/"/g, '""')}"`
                ].join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'webscout-leads-export.csv';
              a.click();
              showToast('Leads exported as CSV!');
            }}
          >
            📊 Export Leads (CSV)
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            🗑️ Reset All Data
          </button>
        </div>
      </div>

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

export default Settings;
