function Cart({ isOpen, onClose, cart, orderType, onRemoveItem, onUpdateQuantity, subtotal, deliveryFee, onCheckout }) {
  const tax = subtotal * 0.0875;
  const total = subtotal + tax + deliveryFee;

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose} />}
      <div className={`cart-panel ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <p className="cart-empty-sub">Browse the menu and add items to get started!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    {item.modifiers.length > 0 && (
                      <p className="cart-item-mods">
                        {item.modifiers.map(m => m.name).join(', ')}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="cart-item-instructions">📝 {item.specialInstructions}</p>
                    )}
                    <div className="cart-item-bottom">
                      <div className="cart-item-qty">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">
                        ${((item.price + item.modifiers.reduce((s, m) => s + m.price, 0)) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => onRemoveItem(item.id)}>🗑️</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Tax (8.75%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="cart-summary-row">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout — ${total.toFixed(2)}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
