import { useState, useMemo } from 'react';
import AddLeadModal from './AddLeadModal';

const CATEGORIES = [
  'All',
  'Automotive',
  'Health & Beauty',
  'Food & Beverage',
  'Home Services',
  'Local Services',
  'Fitness & Gyms',
  'Pets',
  'Banks & Finance',
  'Real Estate',
  'Retail',
  'Tech',
  'Credit & Finance',
  'Legal',
  'Education',
  'Gaming',
  'Lifestyle'
];

const SIZES = ['all', 'small', 'medium', 'large'];

const US_REGIONS = [
  'All US',
  'Northeast',
  'Southeast',
  'Midwest',
  'Southwest',
  'West Coast',
  'Pacific Northwest'
];

function LeadDiscovery({ leads, addLead }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All US');
  const [websiteFilter, setWebsiteFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredLeads = useMemo(() => {
    let results = [...leads];

    if (selectedCategory !== 'All') {
      results = results.filter(l => l.category === selectedCategory);
    }

    if (selectedSize !== 'all') {
      results = results.filter(l => l.size === selectedSize);
    }

    if (websiteFilter === 'none') {
      results = results.filter(l => l.websiteStatus === 'none');
    } else if (websiteFilter === 'outdated') {
      results = results.filter(l => l.websiteStatus === 'outdated');
    }

    if (selectedRegion !== 'All US') {
      results = results.filter(l => {
        const addr = l.address || '';
        switch (selectedRegion) {
          case 'Northeast': return /NY|NJ|CT|MA|PA|VT|NH|ME|RI/.test(addr);
          case 'Southeast': return /FL|GA|NC|SC|VA|TN|AL|MS|LA|AR/.test(addr);
          case 'Midwest': return /OH|IL|MI|IN|WI|MN|IA|MO|KS|NE|ND|SD/.test(addr);
          case 'Southwest': return /TX|AZ|NM|OK|NV/.test(addr);
          case 'West Coast': return /CA|OR|WA/.test(addr);
          case 'Pacific Northwest': return /OR|WA|ID|MT/.test(addr);
          default: return true;
        }
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(l =>
        l.businessName.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.subcategory?.toLowerCase().includes(q) ||
        l.address?.toLowerCase().includes(q) ||
        l.notes?.toLowerCase().includes(q) ||
        l.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return results;
  }, [leads, selectedCategory, selectedSize, selectedRegion, websiteFilter, searchQuery]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="discovery-page">
      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search leads across all US states..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '350px' }}
        />
        <select
          className="toolbar-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {US_REGIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          className="toolbar-select"
          value={websiteFilter}
          onChange={(e) => setWebsiteFilter(e.target.value)}
        >
          <option value="all">All Website Status</option>
          <option value="none">❌ No Website</option>
          <option value="outdated">⚠️ Outdated Website</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Lead
        </button>
      </div>

      {/* Category Filters */}
      <div className="discovery-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {getCategoryEmoji(cat)} {cat}
          </button>
        ))}
      </div>

      {/* Size Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Company Size:</span>
        {SIZES.map(size => (
          <button
            key={size}
            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
            onClick={() => setSelectedSize(size)}
          >
            {size === 'all' ? 'All Sizes' : size.charAt(0).toUpperCase() + size.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found nationwide
        </span>
      </div>

      {/* Lead Cards Grid */}
      {filteredLeads.length === 0 ? (
        <div className="empty-state">
          <h3>No leads match your filters</h3>
          <p>Try adjusting your search or add a new lead manually.</p>
        </div>
      ) : (
        <div className="discovery-grid">
          {filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} onToast={showToast} />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={(lead) => { addLead(lead); setShowAddModal(false); showToast('Lead added successfully!'); }}
        />
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

function LeadCard({ lead, onToast }) {
  const copyContact = () => {
    const info = `${lead.businessName}\n${lead.contactName || 'N/A'}\n${lead.contactPhone || 'N/A'}\n${lead.contactEmail || 'N/A'}\n${lead.address || 'N/A'}`;
    navigator.clipboard.writeText(info);
    onToast('Contact info copied!');
  };

  return (
    <div className="lead-card">
      <div className="lead-card-header">
        <div>
          <h3>{lead.businessName}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.subcategory}</span>
        </div>
        <span className="category-tag">{lead.category}</span>
      </div>

      <div className="lead-card-meta">
        <span>
          <span className={`priority-dot ${lead.priority}`} />
          {lead.priority} priority
        </span>
        <span>📏 {lead.size}</span>
        <span className={`website-status ${lead.websiteStatus}`}>
          {lead.websiteStatus === 'none' ? '❌ No Site' : '⚠️ Outdated'}
        </span>
      </div>

      {/* Contact Info - Highly Visible */}
      <div style={{ background: 'var(--surface-elevated)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem' }}>
        {lead.contactName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span>👤</span> <strong>{lead.contactName}</strong>
          </div>
        )}
        {lead.contactPhone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span>📱</span> <a href={`tel:${lead.contactPhone}`} style={{ color: 'var(--secondary)' }}>{lead.contactPhone}</a>
          </div>
        )}
        {lead.contactEmail && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span>✉️</span> <a href={`mailto:${lead.contactEmail}`} style={{ color: 'var(--primary-light)' }}>{lead.contactEmail}</a>
          </div>
        )}
        {lead.address && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📍</span> <span style={{ color: 'var(--text-secondary)' }}>{lead.address}</span>
          </div>
        )}
      </div>

      {lead.notes && <p className="lead-card-notes">{lead.notes}</p>}

      {lead.tags && lead.tags.length > 0 && (
        <div className="lead-card-tags">
          {lead.tags.map(tag => (
            <span key={tag} className="lead-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="lead-card-actions">
        <button onClick={copyContact}>📋 Copy Info</button>
        {lead.currentWebsite && (
          <button onClick={() => window.open(lead.currentWebsite, '_blank')}>🌐 View Site</button>
        )}
        <button className="primary-action" onClick={() => onToast('Added to your client folder!')}>📁 Save to Folder</button>
      </div>
    </div>
  );
}

function getCategoryEmoji(cat) {
  const emojis = {
    'All': '🌐',
    'Automotive': '🚗',
    'Health & Beauty': '💆',
    'Food & Beverage': '🍽️',
    'Home Services': '🏡',
    'Local Services': '🧺',
    'Fitness & Gyms': '💪',
    'Pets': '🐾',
    'Banks & Finance': '🏦',
    'Real Estate': '🏠',
    'Retail': '🛍️',
    'Tech': '💻',
    'Credit & Finance': '💳',
    'Legal': '⚖️',
    'Education': '📚',
    'Gaming': '🎮',
    'Lifestyle': '✨'
  };
  return emojis[cat] || '📌';
}

export default LeadDiscovery;
