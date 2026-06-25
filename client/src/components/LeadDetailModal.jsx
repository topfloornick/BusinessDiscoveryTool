import { useState } from 'react';

function LeadDetailModal({ lead, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(lead.notes || '');
  const [status, setStatus] = useState(lead.status);
  const [priority, setPriority] = useState(lead.priority);
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || '');

  const handleSave = () => {
    onUpdate({
      notes,
      status,
      priority,
      followUpDate: followUpDate || null,
      lastContacted: status !== lead.status && status === 'contacted' ? new Date().toISOString().split('T')[0] : lead.lastContacted
    });
    setEditing(false);
  };

  const copyAllInfo = () => {
    const info = [
      `Business: ${lead.businessName}`,
      `Category: ${lead.category} (${lead.subcategory || 'N/A'})`,
      `Size: ${lead.size}`,
      `Website Status: ${lead.websiteStatus === 'none' ? 'No Website' : 'Outdated'}`,
      lead.currentWebsite ? `Current Site: ${lead.currentWebsite}` : '',
      `Contact: ${lead.contactName || 'N/A'}`,
      `Phone: ${lead.contactPhone || 'N/A'}`,
      `Email: ${lead.contactEmail || 'N/A'}`,
      `Address: ${lead.address || 'N/A'}`,
      `Priority: ${lead.priority}`,
      `Status: ${lead.status}`,
      `Notes: ${lead.notes || 'None'}`,
      `Tags: ${lead.tags?.join(', ') || 'None'}`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(info);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>{lead.businessName}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {lead.category} • {lead.subcategory} • {lead.size} company
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className={`website-status ${lead.websiteStatus}`}>
              {lead.websiteStatus === 'none' ? '❌ No Website' : '⚠️ Outdated'}
            </span>
            <span className={`status-badge ${status}`}>{status}</span>
          </div>
        </div>

        {/* Contact Info Card - HIGHLY VISIBLE */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.25rem'
        }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--primary-light)' }}>
            📞 Contact Information
          </h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Contact Person</label>
              <p style={{ fontWeight: '600', fontSize: '1rem' }}>{lead.contactName || '—'}</p>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <p>
                {lead.contactPhone ? (
                  <a href={`tel:${lead.contactPhone}`} style={{ color: 'var(--secondary)', fontWeight: '600', fontSize: '1rem' }}>
                    {lead.contactPhone}
                  </a>
                ) : '—'}
              </p>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <p>
                {lead.contactEmail ? (
                  <a href={`mailto:${lead.contactEmail}`} style={{ color: 'var(--primary-light)', fontSize: '0.9rem' }}>
                    {lead.contactEmail}
                  </a>
                ) : '—'}
              </p>
            </div>
            <div className="detail-item">
              <label>Location</label>
              <p>{lead.address || '—'}</p>
            </div>
          </div>
          {lead.currentWebsite && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Current Website</label>
              <p style={{ marginTop: '0.2rem' }}>
                <a href={lead.currentWebsite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                  {lead.currentWebsite}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Status & Priority Edit */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="new">🆕 New</option>
              <option value="contacted">📞 Contacted</option>
              <option value="interested">🎯 Interested</option>
              <option value="proposal">📄 Proposal Sent</option>
              <option value="won">✅ Won</option>
              <option value="lost">❌ Lost</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div className="form-group">
            <label>Follow-up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>
        </div>

        {/* Timeline Info */}
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <span>📅 Added: {lead.dateAdded || 'Unknown'}</span>
          {lead.lastContacted && <span>📞 Last Contact: {lead.lastContacted}</span>}
          {lead.followUpDate && <span>⏰ Follow-up: {lead.followUpDate}</span>}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label>Notes & Observations</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ minHeight: '100px' }}
            placeholder="Add notes about this lead..."
          />
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>TAGS</label>
            <div className="lead-card-tags" style={{ marginTop: '0.3rem' }}>
              {lead.tags.map(tag => (
                <span key={tag} className="lead-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-danger" onClick={onDelete}>🗑️ Delete</button>
            <button className="btn btn-secondary" onClick={copyAllInfo}>📋 Copy All Info</button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={handleSave}>💾 Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailModal;
