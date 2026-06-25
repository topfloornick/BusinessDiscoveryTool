import { useState, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import BusinessGrid from './components/BusinessGrid';
import BusinessDetail from './components/BusinessDetail';
import Header from './components/Header';
import allBusinesses from './data/businesses';
import './App.css';

function App() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    minRating: '',
    priceLevel: '',
    sortBy: 'rating',
    order: 'desc'
  });

  // Get categories from data
  const categories = useMemo(() => {
    const counts = {};
    allBusinesses.forEach(b => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    let results = [...allBusinesses];

    // Search
    if (filters.q) {
      const search = filters.q.toLowerCase();
      results = results.filter(b =>
        b.name.toLowerCase().includes(search) ||
        (b.description && b.description.toLowerCase().includes(search)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(search))) ||
        (b.subcategory && b.subcategory.toLowerCase().includes(search))
      );
    }

    // Category filter
    if (filters.category) {
      results = results.filter(b => b.category === filters.category);
    }

    // Rating filter
    if (filters.minRating) {
      results = results.filter(b => b.rating >= parseFloat(filters.minRating));
    }

    // Price filter
    if (filters.priceLevel) {
      results = results.filter(b => b.price_level === parseInt(filters.priceLevel));
    }

    // Sort
    const sortField = filters.sortBy || 'rating';
    const sortOrder = filters.order === 'asc' ? 1 : -1;
    results.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });

    return results;
  }, [filters]);

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, q: query }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (selectedBusiness) {
    return (
      <div className="app">
        <Header />
        <BusinessDetail
          business={selectedBusiness}
          onBack={() => setSelectedBusiness(null)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="search-section">
          <SearchBar onSearch={handleSearch} initialQuery={filters.q} />
        </div>
        <div className="content-layout">
          <aside className="sidebar">
            <FilterPanel
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </aside>
          <section className="results-section">
            <div className="results-header">
              <p className="results-count">
                {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
              </p>
            </div>
            <BusinessGrid
              businesses={filteredBusinesses}
              onSelect={setSelectedBusiness}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
