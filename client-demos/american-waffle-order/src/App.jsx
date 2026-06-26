import { useState, useCallback } from 'react';
import Header from './components/Header';
import MenuCategories from './components/MenuCategories';
import MenuGrid from './components/MenuGrid';
import ItemModal from './components/ItemModal';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Confirmation from './components/Confirmation';
import { menuItems, categories, restaurantInfo } from './data/menu';

function App() {
  // App state
  const [currentView, setCurrentView] = useState('menu'); // menu, checkout, confirmation
  const [orderType, setOrderType] = useState('pickup'); // pickup or delivery
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Filter menu items by category
  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  // Cart functions
  const addToCart = useCallback((item, quantity, selectedModifiers, specialInstructions) => {
    const cartItem = {
      id: Date.now(), // unique cart item id
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      modifiers: selectedModifiers,
      specialInstructions,
      image: item.image,
    };
    setCart(prev => [...prev, cartItem]);
    setSelectedItem(null);
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  }, []);

  const updateCartItemQuantity = useCallback((cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
  }, [removeFromCart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const modifierTotal = item.modifiers.reduce((sum, mod) => sum + mod.price, 0);
      return total + (item.price + modifierTotal) * item.quantity;
    }, 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Place order
  const placeOrder = useCallback((customerInfo) => {
    const order = {
      orderNumber: Math.floor(1000 + Math.random() * 9000),
      items: cart,
      orderType,
      customerInfo,
      subtotal: getCartTotal(),
      tax: getCartTotal() * 0.0875, // CA sales tax
      deliveryFee: orderType === 'delivery' ? restaurantInfo.deliveryFee : 0,
      total: getCartTotal() + (getCartTotal() * 0.0875) + (orderType === 'delivery' ? restaurantInfo.deliveryFee : 0),
      estimatedTime: orderType === 'pickup' ? restaurantInfo.estimatedPickupTime : restaurantInfo.estimatedDeliveryTime,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setOrderDetails(order);
    setCart([]);
    setCartOpen(false);
    setCurrentView('confirmation');
  }, [cart, orderType, getCartTotal]);

  // Start new order
  const startNewOrder = useCallback(() => {
    setCurrentView('menu');
    setOrderDetails(null);
    setSelectedCategory('featured');
  }, []);

  return (
    <div className="app">
      <Header
        orderType={orderType}
        setOrderType={setOrderType}
        cartItemCount={getCartItemCount()}
        onCartClick={() => setCartOpen(true)}
        currentView={currentView}
        onBackToMenu={() => setCurrentView('menu')}
      />

      {currentView === 'menu' && (
        <main className="main-content">
          <MenuCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <MenuGrid
            items={filteredItems}
            onSelectItem={setSelectedItem}
          />
        </main>
      )}

      {currentView === 'checkout' && (
        <Checkout
          cart={cart}
          orderType={orderType}
          subtotal={getCartTotal()}
          tax={getCartTotal() * 0.0875}
          deliveryFee={orderType === 'delivery' ? restaurantInfo.deliveryFee : 0}
          total={getCartTotal() + (getCartTotal() * 0.0875) + (orderType === 'delivery' ? restaurantInfo.deliveryFee : 0)}
          onPlaceOrder={placeOrder}
          onBack={() => setCurrentView('menu')}
        />
      )}

      {currentView === 'confirmation' && (
        <Confirmation
          order={orderDetails}
          onNewOrder={startNewOrder}
        />
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Slide-out */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        orderType={orderType}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartItemQuantity}
        subtotal={getCartTotal()}
        deliveryFee={orderType === 'delivery' ? restaurantInfo.deliveryFee : 0}
        onCheckout={() => { setCartOpen(false); setCurrentView('checkout'); }}
      />
    </div>
  );
}

export default App;
