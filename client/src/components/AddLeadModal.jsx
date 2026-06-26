import { useState } from 'react';

const CATEGORIES = [
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

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    businessName: '',
    category: 'Retail',
    subcategory: '',
    size: 'small',
    websiteStatus: 'none',
    currentWebsite: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    city: '',
    state: '',
    notes: '',
    priority: 'medium',
    tags: ''
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.businessName.trim()) return;

    onAdd({
      ...form,
      address: form.city && form.state ? `${form.city}, ${form.state}` : form.city || '',
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      currentWebsite: form.currentWebsite || null,
      contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>➕ Add New Lead</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Add any business across the US that needs a website or website update.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Business Name *</label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder="e.g. Joe's Barber Shop"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Subcategory</label>
              <input
                type="text"
                value={form.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                placeholder="e.g. Barbershop, Clothing Store"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Size</label>
              <select value={form.size} onChange={(e) => handleChange('size', e.target.value)}>
                <option value="small">Small (1-10 employees)</option>
                <option value="medium">Medium (11-100 employees)</option>
                <option value="large">Large (100+ employees)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website Status</label>
              <select value={form.websiteStatus} onChange={(e) => handleChange('websiteStatus', e.target.value)}>
                <option value="none">❌ No Website</option>
                <option value="outdated">⚠️ Outdated Website</option>
              </select>
            </div>
            <div className="form-group">
              <label>Current Website (if any)</label>
              <input
                type="url"
                value={form.currentWebsite}
                onChange={(e) => handleChange('currentWebsite', e.target.value)}
                placeholder="http://..."
              />
            </div>
          </div>

          <h3 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '1rem 0 0.75rem', color: 'var(--primary-light)' }}>
            📞 Contact Information
          </h3>

          <div className="form-group">
            <label>Contact Name</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              placeholder="Owner / Manager name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="their@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Any US city"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <select value={form.state} onChange={(e) => handleChange('state', e.target.value)}>
                <option value="">Select State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Why is this a good lead? What's wrong with their current site? Any specific observations..."
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="e.g. no-website, needs-ecommerce, instagram-active"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLeadModal;
