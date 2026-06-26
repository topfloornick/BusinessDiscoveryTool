import { useState } from 'react';

function ItemModal({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleModifier = (modifier) => {
    setSelectedModifiers(prev => {
      const exists = prev.find(m => m.name === modifier.name);
      if (exists) {
        return prev.filter(m => m.name !== modifier.name);
      }
      return [...prev, modifier];
    });
  };

  const getItemTotal = () => {
    const modifierTotal = selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
    return (item.price + modifierTotal) * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedModifiers, specialInstructions);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-image">
          <img src={item.image} alt={item.name} />
          {item.popular && <span className="popular-badge">⭐ Popular</span>}
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{item.name}</h2>
          <p className="modal-description">{item.description}</p>
          <p className="modal-price">${item.price.toFixed(2)}</p>

          {item.modifiers && item.modifiers.length > 0 && (
            <div className="modifiers-section">
              <h3 className="modifiers-title">Customize Your Order</h3>
              <div className="modifiers-list">
                {item.modifiers.map((modifier, index) => (
                  <label key={index} className="modifier-item">
                    <input
                      type="checkbox"
                      checked={selectedModifiers.some(m => m.name === modifier.name)}
                      onChange={() => toggleModifier(modifier)}
                    />
                    <span className="modifier-name">{modifier.name}</span>
                    {modifier.price > 0 && (
                      <span className="modifier-price">+${modifier.price.toFixed(2)}</span>
                    )}
                    {modifier.price === 0 && (
                      <span className="modifier-price free">Free</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="special-instructions">
            <h3 className="instructions-title">Special Instructions</h3>
            <textarea
              placeholder="Any allergies or special requests? (e.g., no onions, extra crispy, etc.)"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart — ${getItemTotal().toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
