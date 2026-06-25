import { useState } from 'react';
import emailTemplates from '../data/emailTemplates';
import callScripts from '../data/callScripts';

function OutreachHub({ leads, updateLead }) {
  const [activeTab, setActiveTab] = useState('emails');
  const [expandedScript, setExpandedScript] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const copyTemplate = (template) => {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    showToast('Email template copied to clipboard!');
  };

  const copyScript = (script) => {
    const text = script.steps.map(s => `[${s.label}]\n${s.script}`).join('\n\n');
    navigator.clipboard.writeText(`${script.name}\n${'='.repeat(40)}\n\n${text}`);
    showToast('Call script copied to clipboard!');
  };

  // Leads that need follow-up
  const followUpLeads = leads.filter(l => {
    if (!l.followUpDate) return false;
    return new Date(l.followUpDate) <= new Date();
  });

  return (
    <div className="outreach-hub">
      {/* Tabs */}
      <div className="outreach-tabs">
        <button className={`outreach-tab ${activeTab === 'emails' ? 'active' : ''}`} onClick={() => setActiveTab('emails')}>
          ✉️ Email Templates
        </button>
        <button className={`outreach-tab ${activeTab === 'calls' ? 'active' : ''}`} onClick={() => setActiveTab('calls')}>
          📞 Call Scripts
        </button>
        <button className={`outreach-tab ${activeTab === 'followups' ? 'active' : ''}`} onClick={() => setActiveTab('followups')}>
          ⏰ Follow-Ups {followUpLeads.length > 0 && (
            <span style={{ background: 'var(--danger)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '10px', fontSize: '0.7rem', marginLeft: '0.4rem' }}>
              {followUpLeads.length}
            </span>
          )}
        </button>
      </div>

      {/* Email Templates */}
      {activeTab === 'emails' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Professional email templates ready to customize. Use your personal email — no business domain required!
          </p>
          <div className="templates-grid">
            {emailTemplates.map(template => (
              <div key={template.id} className="template-card">
                <h3>{template.name}</h3>
                <p className="template-subject">📧 {template.subject}</p>
                <p className="template-preview">{template.body.substring(0, 150)}...</p>
                <p className="template-best-for">✓ Best for: {template.bestFor}</p>
                <div className="template-actions">
                  <button onClick={() => copyTemplate(template)}>📋 Copy</button>
                  <button onClick={() => setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)}>
                    {selectedTemplate?.id === template.id ? '▲ Close' : '👁️ Preview'}
                  </button>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-secondary)', maxHeight: '300px', overflowY: 'auto' }}>
                    <strong>Subject:</strong> {template.subject}
                    {'\n\n'}
                    {template.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call Scripts */}
      {activeTab === 'calls' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Proven call scripts for every stage. Use your personal phone number — confidence matters more than the number you call from!
          </p>
          {callScripts.map(script => (
            <div key={script.id} className="script-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>{script.name}</h3>
                  <div className="script-meta">
                    <span>⏱️ {script.duration}</span>
                    <span>✓ {script.bestFor}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => copyScript(script)}>
                    📋 Copy
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                  >
                    {expandedScript === script.id ? '▲ Collapse' : '▼ Expand'}
                  </button>
                </div>
              </div>
              {expandedScript === script.id && (
                <div className="script-steps">
                  {script.steps.map((step, i) => (
                    <div key={i} className="script-step">
                      <h4>{step.label}</h4>
                      <p>{step.script}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Follow-Ups */}
      {activeTab === 'followups' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Leads with follow-up dates that are due. Stay on top of your outreach!
          </p>
          {followUpLeads.length === 0 ? (
            <div className="empty-state">
              <h3>🎉 No follow-ups due!</h3>
              <p>All caught up. Set follow-up dates on your leads to see them here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {followUpLeads.map(lead => (
                <div key={lead.id} className="lead-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem' }}>{lead.businessName}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {lead.category} • Due: {lead.followUpDate} • {lead.contactPhone || lead.contactEmail || 'No contact'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {lead.contactPhone && (
                      <a href={`tel:${lead.contactPhone}`} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                        📞 Call
                      </a>
                    )}
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        updateLead(lead.id, { status: 'contacted', lastContacted: new Date().toISOString().split('T')[0], followUpDate: null });
                        showToast(`Marked ${lead.businessName} as contacted!`);
                      }}
                    >
                      ✓ Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

export default OutreachHub;
