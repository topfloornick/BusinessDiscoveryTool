function BusinessDetail({ business, onBack }) {
  const priceLabel = '$'.repeat(business.price_level);

  return (
    <div className="business-detail">
      <button className="back-button" onClick={onBack}>
        &larr; Back to results
      </button>

      <div className="detail-header">
        <img
          src={business.image_url}
          alt={business.name}
          className="detail-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
          }}
        />
      </div>

      <div className="detail-content">
        <div className="detail-top">
          <div>
            <h1 className="detail-name">{business.name}</h1>
            <p className="detail-subcategory">
              {business.subcategory || business.category} &middot; {priceLabel}
            </p>
          </div>
          <div className="detail-rating">
            <span className="detail-stars">
              {'★'.repeat(Math.floor(business.rating))}
            </span>
            <span className="detail-rating-number">{business.rating}</span>
            <span className="detail-review-count">
              ({business.review_count} reviews)
            </span>
          </div>
        </div>

        <p className="detail-description">{business.description}</p>

        <div className="detail-info-grid">
          <div className="info-card">
            <h3>Contact</h3>
            {business.phone && <p><strong>Phone:</strong> {business.phone}</p>}
            {business.email && <p><strong>Email:</strong> {business.email}</p>}
            {business.website && (
              <p>
                <strong>Website:</strong>{' '}
                <a href={business.website} target="_blank" rel="noreferrer">
                  Visit Website
                </a>
              </p>
            )}
          </div>

          <div className="info-card">
            <h3>Location</h3>
            <p>{business.address}</p>
            <p>{business.city}, {business.state} {business.zip}</p>
          </div>
        </div>


        {business.hours && (
          <div className="info-card hours-card">
            <h3>Hours</h3>
            <div className="hours-grid">
              {Object.entries(business.hours).map(([day, time]) => (
                <div key={day} className="hours-row">
                  <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  <span className="time">{time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {business.tags && business.tags.length > 0 && (
          <div className="detail-tags">
            <h3>Tags</h3>
            <div className="tags-list">
              {business.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessDetail;
