import { useMemo } from 'react';

function Dashboard({ leads, setActiveView }) {
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const contacted = leads.filter(l => l.status === 'contacted').length;
    const interested = leads.filter(l => l.status === 'interested').length;
    const noWebsite = leads.filter(l => l.websiteStatus === 'none').length;
    const outdated = leads.filter(l => l.websiteStatus === 'outdated').length;
    const highPriority = leads.filter(l => l.priority === 'high').length;

    return { total, newLeads, contacted, interested, noWebsite, outdated, highPriority };
  }, [leads]);

  const recentLeads = leads.slice(0, 5);

  const categoryBreakdown = useMemo(() => {
    const counts = {};
    leads.forEach(l => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const stateBreakdown = useMemo(() => {
    const counts = {};
    leads.forEach(l => {
      const state = l.address?.split(',').pop()?.trim().split(' ')[0] || 'Unknown';
      counts[state] = (counts[state] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [leads]);

  return (
    <div className="dashboard">
      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📋</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Leads</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🆕</div>
          <div className="stat-info">
            <h3>{stats.newLeads}</h3>
            <p>New (Uncontacted)</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">📞</div>
          <div className="stat-info">
            <h3>{stats.contacted}</h3>
            <p>Contacted</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🎯</div>
          <div className="stat-info">
            <h3>{stats.interested}</h3>
            <p>Interested</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">🚫</div>
          <div className="stat-info">
            <h3>{stats.noWebsite}</h3>
            <p>No Website</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">⚠️</div>
          <div className="stat-info">
            <h3>{stats.outdated}</h3>
            <p>Outdated Sites</p>
          </div>
        </div>
      </div>

      {/* Coverage Banner */}
      <div className="dash-card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>🇺🇸</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Nationwide US Coverage</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
              Discovering leads across all 50 states — no zip code restrictions. Find businesses with outdated or missing websites anywhere in the country.
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dash-card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => setActiveView('discover')}>
              <span>🔍</span>
              Discover Leads
            </button>
            <button className="quick-action-btn" onClick={() => setActiveView('leads')}>
              <span>📁</span>
              Client Folders
            </button>
            <button className="quick-action-btn" onClick={() => setActiveView('outreach')}>
              <span>✉️</span>
              Email Templates
            </button>
            <button className="quick-action-btn" onClick={() => setActiveView('pipeline')}>
              <span>📊</span>
              View Pipeline
            </button>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="dash-card">
          <h3>🕐 Recent Leads</h3>
          <div className="recent-leads-list">
            {recentLeads.map(lead => (
              <div key={lead.id} className="recent-lead-item">
                <div className="recent-lead-info">
                  <h4>{lead.businessName}</h4>
                  <p>{lead.category} • {lead.address?.split(',').slice(-1)[0]?.trim()}</p>
                </div>
                <span className={`status-badge ${lead.status}`}>{lead.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="dash-card">
          <h3>📂 Categories</h3>
          <div className="recent-leads-list">
            {categoryBreakdown.map(([cat, count]) => (
              <div key={cat} className="recent-lead-item">
                <div className="recent-lead-info">
                  <h4>{cat}</h4>
                </div>
                <span className="lead-count-badge" style={{ background: 'var(--surface-elevated)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  {count} leads
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Coverage */}
        <div className="dash-card">
          <h3>📍 US Coverage (Top States)</h3>
          <div className="recent-leads-list">
            {stateBreakdown.map(([state, count]) => (
              <div key={state} className="recent-lead-item">
                <div className="recent-lead-info">
                  <h4>{state}</h4>
                </div>
                <span className="lead-count-badge" style={{ background: 'var(--surface-elevated)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  {count} leads
                </span>
              </div>
            ))}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
              Coverage: All 50 US States
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
