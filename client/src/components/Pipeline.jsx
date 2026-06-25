import { useMemo } from 'react';

const STAGES = [
  { id: 'new', label: 'New Leads', emoji: '🆕' },
  { id: 'contacted', label: 'Contacted', emoji: '📞' },
  { id: 'interested', label: 'Interested', emoji: '🎯' },
  { id: 'proposal', label: 'Proposal', emoji: '📄' },
  { id: 'won', label: 'Won', emoji: '✅' },
  { id: 'lost', label: 'Lost', emoji: '❌' }
];

function Pipeline({ leads, updateLead }) {
  const leadsByStage = useMemo(() => {
    const groups = {};
    STAGES.forEach(s => { groups[s.id] = []; });
    leads.forEach(lead => {
      if (groups[lead.status]) {
        groups[lead.status].push(lead);
      } else {
        groups['new'].push(lead);
      }
    });
    return groups;
  }, [leads]);

  const moveToStage = (leadId, newStage) => {
    const updates = { status: newStage };
    if (newStage === 'contacted') {
      updates.lastContacted = new Date().toISOString().split('T')[0];
    }
    updateLead(leadId, updates);
  };

  const getNextStage = (currentStage) => {
    const idx = STAGES.findIndex(s => s.id === currentStage);
    if (idx < STAGES.length - 2) return STAGES[idx + 1]; // Don't auto-advance to 'lost'
    return null;
  };

  return (
    <div className="pipeline-page">
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Track your leads through the sales process. Click a lead to advance it to the next stage.
      </p>

      {/* Pipeline Stats */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {STAGES.map(stage => (
          <div key={stage.id} style={{
            padding: '0.4rem 0.85rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {stage.emoji} {stage.label}: <strong>{leadsByStage[stage.id]?.length || 0}</strong>
          </div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="pipeline-board">
        {STAGES.map(stage => (
          <div key={stage.id} className="pipeline-column">
            <div className="pipeline-column-header">
              <h3>{stage.emoji} {stage.label}</h3>
              <span className="count">{leadsByStage[stage.id]?.length || 0}</span>
            </div>
            <div>
              {(leadsByStage[stage.id] || []).map(lead => {
                const nextStage = getNextStage(lead.status);
                return (
                  <div key={lead.id} className="pipeline-card">
                    <h4>{lead.businessName}</h4>
                    <p>{lead.category} • {lead.size}</p>
                    {lead.contactPhone && (
                      <p style={{ color: 'var(--secondary)', marginTop: '0.2rem' }}>📱 {lead.contactPhone}</p>
                    )}
                    <div className="pipeline-card-footer">
                      <span className={`priority-dot ${lead.priority}`} style={{ width: '6px', height: '6px' }} />
                      {nextStage && (
                        <button
                          style={{
                            padding: '0.2rem 0.4rem',
                            fontSize: '0.65rem',
                            background: 'rgba(99,102,241,0.1)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: '4px',
                            color: 'var(--primary-light)',
                            cursor: 'pointer'
                          }}
                          onClick={() => moveToStage(lead.id, nextStage.id)}
                        >
                          → {nextStage.label}
                        </button>
                      )}
                      {stage.id !== 'lost' && stage.id !== 'won' && (
                        <button
                          style={{
                            padding: '0.2rem 0.4rem',
                            fontSize: '0.65rem',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '4px',
                            color: '#f87171',
                            cursor: 'pointer'
                          }}
                          onClick={() => moveToStage(lead.id, 'lost')}
                        >
                          ✗ Lost
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {(leadsByStage[stage.id] || []).length === 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0.5rem' }}>
                  No leads in this stage
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pipeline;
