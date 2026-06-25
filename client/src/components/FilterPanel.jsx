function FilterPanel({ filters, categories, onFilterChange }) {
  return (
    <div className="filter-panel">
      <h3 className="filter-title">Filters</h3>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.category} value={cat.category}>
              {cat.category} ({cat.count})
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Minimum Rating</label>
        <select
          value={filters.minRating}
          onChange={(e) => onFilterChange('minRating', e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3.5">3.5+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Level</label>
        <select
          value={filters.priceLevel}
          onChange={(e) => onFilterChange('priceLevel', e.target.value)}
        >
          <option value="">Any Price</option>
          <option value="1">$ - Budget</option>
          <option value="2">$$ - Moderate</option>
          <option value="3">$$$ - Upscale</option>
          <option value="4">$$$$ - Fine Dining</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          <option value="rating">Rating</option>
          <option value="review_count">Most Reviewed</option>
          <option value="name">Name</option>
          <option value="price_level">Price</option>
        </select>
      </div>

      <button
        className="clear-filters"
        onClick={() => {
          onFilterChange('category', '');
          onFilterChange('minRating', '');
          onFilterChange('priceLevel', '');
          onFilterChange('sortBy', 'rating');
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}

export default FilterPanel;
