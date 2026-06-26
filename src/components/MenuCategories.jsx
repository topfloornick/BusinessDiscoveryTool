function MenuCategories({ categories, selectedCategory, onSelectCategory }) {
  return (
    <nav className="menu-categories">
      <div className="categories-scroll">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default MenuCategories;
