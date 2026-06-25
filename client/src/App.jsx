import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import BusinessGrid from './components/BusinessGrid';
import BusinessDetail from './components/BusinessDetail';
import Header from './components/Header';
import './App.css';

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    city: '',
    minRating: '',
    priceLevel: '',
    sortBy: 'rating',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/businesses/categories');
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const res = await fetch(`/api/businesses?${params}`);
      const data = await res.json();
      setBusinesses(data.businesses);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      setError('Failed to load businesses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, q: query }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
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
            {loading && <div className="loading">Searching businesses...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && (
              <>
                <div className="results-header">
                  <p className="results-count">
                    {pagination.total} business{pagination.total !== 1 ? 'es' : ''} found
                  </p>
                </div>
                <BusinessGrid
                  businesses={businesses}
                  onSelect={setSelectedBusiness}
                />
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                    <span>Page {pagination.page} of {pagination.totalPages}</span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
