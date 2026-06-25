import { useState, useMemo } from 'react';
import LeadDetailModal from './LeadDetailModal';

function LeadManager({ leads, updateLead, deleteLead }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'folders'
  const [toast, setToast] = useState(null);

  const filteredLeads = useMemo(() => {
    let results = [...leads];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(l =>
        l.businessName.toLowerCase().includes(q) ||
        l.contactName?.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.address?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      results = results.filter(l => l.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      results = results.filter(l => l.category === categoryFilter);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded': return (b.dateAdded || '').localeCompare(a.dateAdded || '');
        case 'priority': {
          const order = { high: 0, medium: 1, low: 2 };
          return (order[a.priority] || 1) - (order[b.priority] || 1);
        }
        case 'name': return a.businessName.localeCompare(b.businessName);
        case 'status': return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

    return results;
  }, [leads, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Group leads by category for folder view
  const leadsByCategory = useMemo(() => {
    const groups = {};
    filteredLeads.forEach(lead => {
      if (!groups[lead.category]) groups[lead.category] = [];
      groups[lead.category].push(lead);
    });
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [filteredLeads]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const categories = [...new Set(leads.map(l => l.category))].sort();

  return (
    <div className="lead-manager">
      {/* Toolbar */}
      <div className="manager-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search clients by name, contact, city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="toolbar-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="new">🆕 New</option>
          <option value="contacted">📞 Contacted</option>
          <option value="interested">🎯 Interested</option>
          <option value="proposal">📄 Proposal Sent</option>
          <option value="won">✅ Won</option>
          <option value="lost">❌ Lost</option>
        </select>
        <select className="toolbar-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="toolbar-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dateAdded">Sort: Newest</option>
          <option value="priority">Sort: Priority</option>
          <option value="name">Sort: Name</option>
          <option value="status">Sort: Status</option>
        </select>
        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
          <button
            className={`size-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            📋 List
          </button>
          <button
            className={`size-btn ${viewMode === 'folders' ? 'active' : ''}`}
            onClick={() => setViewMode('folders')}
            title="Folder View"
          >
            📁 Folders
          </button>
        </div>
      </div>

      {/* View Mode: Table */}
      {viewMode === 'table' && (
        <div className="leads-table">
          <div className="leads-table-header">
            <span>Business</span>
            <span>Category</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Contact</span>
            <span>Actions</span>
          </div>
          {filteredLeads.length === 0 ? (
            <div className="empty-state">
              <h3>No leads found</h3>
              <p>Adjust your filters or discover new leads.</p>
            </div>
          ) : (
            filteredLeads.map(lead => (
              <div key={lead.id} className="leads-table-row" onClick={() => setSelectedLead(lead)}>
                <div className="lead-name-cell">
                  <h4>{lead.businessName}</h4>
                  <p>{lead.address}</p>
                </div>
                <span style={{ fontSize: '0.8rem' }}>{lead.category}</span>
                <span className={`status-badge ${lead.status}`}>{lead.status}</span>
                <span style={{ fontSize: '0.8rem' }}>
                  <span className={`priority-dot ${lead.priority}`} />
                  {lead.priority}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {lead.contactPhone || lead.contactEmail || '—'}
                </span>
                <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setSelectedLead(lead)}>👁️</button>
                  <button className="delete" onClick={() => { deleteLead(lead.id); showToast('Lead removed'); }}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View Mode: Folders */}
      {viewMode === 'folders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leadsByCategory.length === 0 ? (
            <div className="empty-state">
              <h3>No leads found</h3>
              <p>Adjust your filters or discover new leads.</p>
            </div>
          ) : (
            leadsByCategory.map(([category, categoryLeads]) => (
              <div key={category} className="dash-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📁 {category}
                  <span style={{ fontSize: '0.75rem', background: 'var(--surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: '10px', color: 'var(--text-muted)' }}>
                    {categoryLeads.length} client{categoryLeads.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {categoryLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="pipeline-card"
                      onClick={() => setSelectedLead(lead)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4>{lead.businessName}</h4>
                        <span className={`status-badge ${lead.status}`}>{lead.status}</span>
                      </div>
                      <p style={{ marginTop: '0.3rem' }}>{lead.subcategory} • {lead.size}</p>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {lead.contactName && <div>👤 {lead.contactName}</div>}
                        {lead.contactPhone && <div>📱 {lead.contactPhone}</div>}
                        {lead.address && <div>📍 {lead.address}</div>}
                      </div>
                      <div className="pipeline-card-footer" style={{ marginTop: '0.5rem' }}>
                        <span className={`website-status ${lead.websiteStatus}`}>
                          {lead.websiteStatus === 'none' ? '❌ No Site' : '⚠️ Outdated'}
                        </span>
                        <span className={`priority-dot ${lead.priority}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={(updates) => {
            updateLead(selectedLead.id, updates);
            setSelectedLead({ ...selectedLead, ...updates });
            showToast('Lead updated!');
          }}
          onDelete={() => {
            deleteLead(selectedLead.id);
            setSelectedLead(null);
            showToast('Lead removed');
          }}
        />
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

export default LeadManager;
