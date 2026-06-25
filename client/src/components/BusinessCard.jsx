function BusinessCard({ business, onClick }) {
  const priceLabel = '$'.repeat(business.price_level);

  return (
    <div className="business-card" onClick={onClick}>
      <div className="card-image">
        <img
          src={business.image_url}
          alt={business.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
          }}
        />
        <span className="card-category">{business.subcategory || business.category}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{business.name}</h3>
        <p className="card-description">{business.description}</p>
        <div className="card-meta">
          <div className="card-rating">
            <span className="stars">{'★'.repeat(Math.floor(business.rating))}</span>
            <span className="rating-number">{business.rating}</span>
            <span className="review-count">({business.review_count})</span>
          </div>
          <span className="card-price">{priceLabel}</span>
        </div>
        <div className="card-location">
          <span>{business.city}, {business.state}</span>
        </div>
        {business.tags && business.tags.length > 0 && (
          <div className="card-tags">
            {business.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessCard;
