import { restaurantInfo } from '../data/menu';

function Header({ orderType, setOrderType, cartItemCount, onCartClick, currentView, onBackToMenu }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand">
          <h1 className="restaurant-name">{restaurantInfo.name}</h1>
          <p className="restaurant-tagline">{restaurantInfo.tagline}</p>
        </div>
        {currentView === 'menu' && (
          <button className="cart-button" onClick={onCartClick}>
            <span className="cart-icon">🛒</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
        )}
        {currentView === 'checkout' && (
          <button className="back-button" onClick={onBackToMenu}>
            ← Back to Menu
          </button>
        )}
      </div>

      {currentView === 'menu' && (
        <div className="order-type-toggle">
          <button
            className={`toggle-btn ${orderType === 'pickup' ? 'active' : ''}`}
            onClick={() => setOrderType('pickup')}
          >
            <span className="toggle-icon">🏪</span>
            Pickup
            <span className="toggle-time">{restaurantInfo.estimatedPickupTime}</span>
          </button>
          <button
            className={`toggle-btn ${orderType === 'delivery' ? 'active' : ''}`}
            onClick={() => setOrderType('delivery')}
          >
            <span className="toggle-icon">🚗</span>
            Delivery
            <span className="toggle-time">{restaurantInfo.estimatedDeliveryTime}</span>
          </button>
        </div>
      )}

      {currentView === 'menu' && (
        <div className="header-info">
          <span className="info-item">📍 {restaurantInfo.address}</span>
          <span className="info-item">📞 {restaurantInfo.phone}</span>
        </div>
      )}
    </header>
  );
}

export default Header;
