import BusinessCard from './BusinessCard';

function BusinessGrid({ businesses, onSelect }) {
  if (businesses.length === 0) {
    return (
      <div className="empty-state">
        <p>No businesses found matching your criteria.</p>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="business-grid">
      {businesses.map(business => (
        <BusinessCard
          key={business.id}
          business={business}
          onClick={() => onSelect(business)}
        />
      ))}
    </div>
  );
}

export default BusinessGrid;
