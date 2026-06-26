import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadDiscovery from './components/LeadDiscovery';
import ResearchWorkflow from './components/ResearchWorkflow';
import LeadManager from './components/LeadManager';
import OutreachHub from './components/OutreachHub';
import Pipeline from './components/Pipeline';
import Settings from './components/Settings';
import sampleLeads from './data/leads';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('discoveryLeads');
    return saved ? JSON.parse(saved) : sampleLeads;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('discoveryLeads', JSON.stringify(leads));
  }, [leads]);

  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'new',
      lastContacted: null,
      followUpDate: null
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id, updates) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard leads={leads} setActiveView={setActiveView} />;
      case 'discover':
        return <LeadDiscovery leads={leads} addLead={addLead} />;
      case 'research':
        return <ResearchWorkflow addLead={addLead} />;
      case 'leads':
        return <LeadManager leads={leads} updateLead={updateLead} deleteLead={deleteLead} />;
      case 'outreach':
        return <OutreachHub leads={leads} updateLead={updateLead} />;
      case 'pipeline':
        return <Pipeline leads={leads} updateLead={updateLead} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard leads={leads} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-area">
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="top-bar-title">
            <h2>{getViewTitle(activeView)}</h2>
          </div>
          <div className="top-bar-actions">
            <span className="lead-count-badge">{leads.length} leads</span>
          </div>
        </header>
        <main className="content-area">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function getViewTitle(view) {
  const titles = {
    dashboard: 'Dashboard',
    discover: 'Discover Leads',
    research: 'Research Workflow',
    leads: 'Lead Manager',
    outreach: 'Outreach Hub',
    pipeline: 'Sales Pipeline',
    settings: 'Settings'
  };
  return titles[view] || 'Dashboard';
}

export default App;
