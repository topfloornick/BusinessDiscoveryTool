import { useState } from 'react';

function Checkout({ cart, orderType, subtotal, tax, deliveryFee, total, onPlaceOrder, onBack }) {
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Delivery fields
    address: '',
    apt: '',
    city: 'Stockton',
    state: 'CA',
    zip: '',
    deliveryInstructions: '',
    // Pickup time
    pickupTime: 'asap',
    // Payment
    cardNumber: '',
    expiry: '',
    cvc: '',
    tip: 15,
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'Required';
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Required';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Required';
    if (!customerInfo.email.trim()) newErrors.email = 'Required';

    if (orderType === 'delivery') {
      if (!customerInfo.address.trim()) newErrors.address = 'Required';
      if (!customerInfo.zip.trim()) newErrors.zip = 'Required';
    }

    if (!customerInfo.cardNumber.trim()) newErrors.cardNumber = 'Required';
    if (!customerInfo.expiry.trim()) newErrors.expiry = 'Required';
    if (!customerInfo.cvc.trim()) newErrors.cvc = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onPlaceOrder(customerInfo);
    }
  };

  const tipAmount = (subtotal * customerInfo.tip / 100);
  const finalTotal = total + tipAmount;

  // Generate time slots
  const timeSlots = [];
  const now = new Date();
  const startMinutes = Math.ceil((now.getHours() * 60 + now.getMinutes() + 20) / 15) * 15;
  for (let i = 0; i < 8; i++) {
    const minutes = startMinutes + (i * 15);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 15) { // Before 3 PM close
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours > 12 ? hours - 12 : hours;
      timeSlots.push(`${displayHour}:${mins.toString().padStart(2, '0')} ${period}`);
    }
  }

  return (
    <div className="checkout-page">
      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Order Type Banner */}
        <div className="checkout-order-type">
          <span className="checkout-type-icon">{orderType === 'pickup' ? '🏪' : '🚗'}</span>
          <span className="checkout-type-label">
            {orderType === 'pickup' ? 'Pickup Order' : 'Delivery Order'}
          </span>
        </div>

        {/* Time Selection */}
        <section className="checkout-section">
          <h3>{orderType === 'pickup' ? '⏰ Pickup Time' : '⏰ Delivery Time'}</h3>
          <div className="time-options">
            <label className={`time-option ${customerInfo.pickupTime === 'asap' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="pickupTime"
                value="asap"
                checked={customerInfo.pickupTime === 'asap'}
                onChange={() => updateField('pickupTime', 'asap')}
              />
              <span className="time-option-label">
                <strong>ASAP</strong>
                <small>{orderType === 'pickup' ? '15-25 min' : '30-45 min'}</small>
              </span>
            </label>
            {timeSlots.map(time => (
              <label key={time} className={`time-option ${customerInfo.pickupTime === time ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="pickupTime"
                  value={time}
                  checked={customerInfo.pickupTime === time}
                  onChange={() => updateField('pickupTime', time)}
                />
                <span className="time-option-label">
                  <strong>{time}</strong>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <section className="checkout-section">
          <h3>👤 Contact Information</h3>
          <div className="form-row">
            <div className="form-field">
              <input
                type="text"
                placeholder="First Name"
                value={customerInfo.firstName}
                onChange={e => updateField('firstName', e.target.value)}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>
            <div className="form-field">
              <input
                type="text"
                placeholder="Last Name"
                value={customerInfo.lastName}
                onChange={e => updateField('lastName', e.target.value)}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={e => updateField('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="form-field">
              <input
                type="email"
                placeholder="Email Address"
                value={customerInfo.email}
                onChange={e => updateField('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        {orderType === 'delivery' && (
          <section className="checkout-section">
            <h3>📍 Delivery Address</h3>
            <div className="form-field full-width">
              <input
                type="text"
                placeholder="Street Address"
                value={customerInfo.address}
                onChange={e => updateField('address', e.target.value)}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-field">
                <input
                  type="text"
                  placeholder="Apt/Suite (optional)"
                  value={customerInfo.apt}
                  onChange={e => updateField('apt', e.target.value)}
                />
              </div>
              <div className="form-field">
                <input
                  type="text"
                  placeholder="City"
                  value={customerInfo.city}
                  onChange={e => updateField('city', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <input type="text" value="CA" disabled />
              </div>
              <div className="form-field">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={customerInfo.zip}
                  onChange={e => updateField('zip', e.target.value)}
                  className={errors.zip ? 'error' : ''}
                />
                {errors.zip && <span className="field-error">{errors.zip}</span>}
              </div>
            </div>
            <div className="form-field full-width">
              <textarea
                placeholder="Delivery instructions (e.g., gate code, leave at door)"
                value={customerInfo.deliveryInstructions}
                onChange={e => updateField('deliveryInstructions', e.target.value)}
                rows={2}
              />
            </div>
          </section>
        )}

        {/* Payment */}
        <section className="checkout-section">
          <h3>💳 Payment</h3>
          <div className="payment-badges">
            <span className="payment-badge">Visa</span>
            <span className="payment-badge">Mastercard</span>
            <span className="payment-badge">Amex</span>
          </div>
          <div className="form-field full-width">
            <input
              type="text"
              placeholder="Card Number"
              value={customerInfo.cardNumber}
              onChange={e => updateField('cardNumber', e.target.value)}
              className={errors.cardNumber ? 'error' : ''}
              maxLength={19}
            />
            {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
          </div>
          <div className="form-row">
            <div className="form-field">
              <input
                type="text"
                placeholder="MM/YY"
                value={customerInfo.expiry}
                onChange={e => updateField('expiry', e.target.value)}
                className={errors.expiry ? 'error' : ''}
                maxLength={5}
              />
              {errors.expiry && <span className="field-error">{errors.expiry}</span>}
            </div>
            <div className="form-field">
              <input
                type="text"
                placeholder="CVC"
                value={customerInfo.cvc}
                onChange={e => updateField('cvc', e.target.value)}
                className={errors.cvc ? 'error' : ''}
                maxLength={4}
              />
              {errors.cvc && <span className="field-error">{errors.cvc}</span>}
            </div>
          </div>
        </section>

        {/* Tip */}
        <section className="checkout-section">
          <h3>💝 Add a Tip</h3>
          <div className="tip-options">
            {[10, 15, 18, 20, 25].map(pct => (
              <button
                key={pct}
                type="button"
                className={`tip-btn ${customerInfo.tip === pct ? 'active' : ''}`}
                onClick={() => updateField('tip', pct)}
              >
                {pct}%
                <small>${(subtotal * pct / 100).toFixed(2)}</small>
              </button>
            ))}
            <button
              type="button"
              className={`tip-btn ${customerInfo.tip === 0 ? 'active' : ''}`}
              onClick={() => updateField('tip', 0)}
            >
              None
            </button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="checkout-section order-summary">
          <h3>📋 Order Summary</h3>
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <span className="summary-item-qty">{item.quantity}x</span>
                <span className="summary-item-name">{item.name}</span>
                <span className="summary-item-price">
                  ${((item.price + item.modifiers.reduce((s, m) => s + m.price, 0)) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8.75%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            {customerInfo.tip > 0 && (
              <div className="summary-row">
                <span>Tip ({customerInfo.tip}%)</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <button type="submit" className="place-order-btn">
          Place Order — ${finalTotal.toFixed(2)}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
