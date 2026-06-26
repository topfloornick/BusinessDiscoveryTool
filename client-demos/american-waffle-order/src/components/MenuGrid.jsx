function MenuGrid({ items, onSelectItem }) {
  if (items.length === 0) {
    return (
      <div className="menu-grid-empty">
        <p>No items in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {items.map(item => (
        <div
          key={item.id}
          className="menu-card"
          onClick={() => onSelectItem(item)}
        >
          <div className="menu-card-image">
            <img src={item.image} alt={item.name} loading="lazy" />
            {item.popular && <span className="popular-badge">Popular</span>}
          </div>
          <div className="menu-card-info">
            <h3 className="menu-card-name">{item.name}</h3>
            <p className="menu-card-description">{item.description}</p>
            <div className="menu-card-footer">
              <span className="menu-card-price">${item.price.toFixed(2)}</span>
              <button className="add-btn">+</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuGrid;
