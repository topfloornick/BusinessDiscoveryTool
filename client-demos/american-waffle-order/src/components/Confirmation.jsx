function Confirmation({ order, onNewOrder }) {
  if (!order) return null;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <div className="confirmation-check">✓</div>
          <h2>Order Confirmed!</h2>
          <p className="confirmation-subtitle">Thank you for your order</p>
        </div>

        <div className="confirmation-details">
          <div className="confirmation-order-num">
            <span className="label">Order #</span>
            <span className="value">{order.orderNumber}</span>
          </div>

          <div className="confirmation-info-grid">
            <div className="confirmation-info-item">
              <span className="info-icon">{order.orderType === 'pickup' ? '🏪' : '🚗'}</span>
              <span className="info-label">{order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</span>
            </div>
            <div className="confirmation-info-item">
              <span className="info-icon">⏰</span>
              <span className="info-label">Est. {order.estimatedTime}</span>
            </div>
            <div className="confirmation-info-item">
              <span className="info-icon">🕐</span>
              <span className="info-label">Placed at {order.placedAt}</span>
            </div>
          </div>

          {order.orderType === 'pickup' && (
            <div className="pickup-info">
              <h4>Pickup Location</h4>
              <p>1540 E March Ln Ste 5</p>
              <p>Stockton, CA 95210</p>
              <p className="pickup-note">Please bring your order confirmation</p>
            </div>
          )}

          {order.orderType === 'delivery' && (
            <div className="delivery-info">
              <h4>Delivering to</h4>
              <p>{order.customerInfo.address}</p>
              {order.customerInfo.apt && <p>Apt/Suite: {order.customerInfo.apt}</p>}
              <p>{order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zip}</p>
            </div>
          )}

          <div className="confirmation-items">
            <h4>Order Items</h4>
            {order.items.map(item => (
              <div key={item.id} className="confirmation-item">
                <span className="item-qty">{item.quantity}x</span>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  {item.modifiers.length > 0 && (
                    <span className="item-mods">{item.modifiers.map(m => m.name).join(', ')}</span>
                  )}
                </div>
                <span className="item-price">
                  ${((item.price + item.modifiers.reduce((s, m) => s + m.price, 0)) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="confirmation-total">
            <div className="total-row">
              <span>Total Charged</span>
              <span className="total-amount">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-status">
          <h4>Order Status</h4>
          <div className="status-tracker">
            <div className="status-step active">
              <div className="status-dot"></div>
              <span>Order Received</span>
            </div>
            <div className="status-step">
              <div className="status-dot"></div>
              <span>Preparing</span>
            </div>
            <div className="status-step">
              <div className="status-dot"></div>
              <span>{order.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery'}</span>
            </div>
            <div className="status-step">
              <div className="status-dot"></div>
              <span>{order.orderType === 'pickup' ? 'Picked Up' : 'Delivered'}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-contact">
          <p>Questions about your order?</p>
          <a href="tel:2099511175" className="contact-phone">📞 (209) 951-1175</a>
        </div>

        <button className="new-order-btn" onClick={onNewOrder}>
          Start New Order
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
