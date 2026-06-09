import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Sliders, CheckCircle } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL parameters
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const priceMinParam = searchParams.get('priceMin') || '';
  const priceMaxParam = searchParams.get('priceMax') || '';

  // Input states (un-debounced price states)
  const [priceMinInput, setPriceMinInput] = useState(priceMinParam);
  const [priceMaxInput, setPriceMaxInput] = useState(priceMaxParam);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (categoryParam && categoryParam !== 'all') queryParams.append('category', categoryParam);
        if (searchParam) queryParams.append('search', searchParam);
        if (sortParam) queryParams.append('sort', sortParam);
        if (priceMinParam) queryParams.append('priceMin', priceMinParam);
        if (priceMaxParam) queryParams.append('priceMax', priceMaxParam);

        const res = await axios.get(`http://localhost:5000/api/products?${queryParams.toString()}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [categoryParam, searchParam, sortParam, priceMinParam, priceMaxParam]);

  // Sync inputs if URL params change
  useEffect(() => {
    setPriceMinInput(priceMinParam);
    setPriceMaxInput(priceMaxParam);
  }, [priceMinParam, priceMaxParam]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (priceMinInput) newParams.set('priceMin', priceMinInput);
    else newParams.delete('priceMin');

    if (priceMaxInput) newParams.set('priceMax', priceMaxInput);
    else newParams.delete('priceMax');

    setSearchParams(newParams);
  };

  const handleCategorySelect = (category) => {
    updateParam('category', category);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams({ category: 'all', sort: 'newest' }));
    setPriceMinInput('');
    setPriceMaxInput('');
  };

  return (
    <div className="container shop-layout animate-fade-in" style={{ marginBottom: '80px' }}>
      {/* Sidebar Filter Panel */}
      <aside className="shop-sidebar">
        <h3 className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} /> Filters
        </h3>

        {/* Categories */}
        <div className="filter-section">
          <h4 className="filter-title">Category</h4>
          <ul className="filter-list">
            {['all', 'men', 'women', 'accessories'].map((cat) => (
              <li 
                key={cat} 
                onClick={() => handleCategorySelect(cat)}
                className="filter-item"
                style={{ 
                  fontWeight: categoryParam === cat ? 700 : 400,
                  color: categoryParam === cat ? 'var(--dark)' : 'var(--text-secondary)'
                }}
              >
                <span 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    border: '1px solid var(--text-muted)',
                    backgroundColor: categoryParam === cat ? 'var(--dark)' : 'transparent',
                    display: 'inline-block' 
                  }} 
                />
                <span style={{ textTransform: 'capitalize' }}>
                  {cat === 'all' ? 'Show All' : cat}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price filter */}
        <div className="filter-section">
          <h4 className="filter-title">Price Range (₹)</h4>
          <form onSubmit={handleApplyPriceFilter} className="filter-list">
            <div className="filter-range">
              <input
                type="number"
                placeholder="Min"
                value={priceMinInput}
                onChange={(e) => setPriceMinInput(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceMaxInput}
                onChange={(e) => setPriceMaxInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-dark btn-small" style={{ width: '100%', marginTop: '6px' }}>
              Apply Price
            </button>
          </form>
        </div>

        {/* Clear filter */}
        <button 
          onClick={clearAllFilters} 
          className="btn btn-outline btn-small" 
          style={{ width: '100%', padding: '8px' }}
        >
          Reset Filters
        </button>
      </aside>

      {/* Main product listing area */}
      <main style={{ marginTop: '30px' }}>
        {/* Header toolbar */}
        <div style={toolbarStyles.container}>
          <div>
            <h2 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
              {categoryParam === 'all' ? 'All Clothing' : `${categoryParam}'s Collection`}
            </h2>
            {searchParam && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                Search results for: "{searchParam}"
              </p>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              Showing {products.length} products
            </p>
          </div>

          {/* Sort selection */}
          <div style={toolbarStyles.sortBlock}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort By:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              style={toolbarStyles.select}
            >
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Catalog grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div style={emptyStyles.container}>
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Try adjusting your price filters or search queries.
            </p>
            <button onClick={clearAllFilters} className="btn btn-dark btn-small" style={{ marginTop: '16px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-products" style={{ marginTop: '20px' }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const toolbarStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  sortBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  }
};

const emptyStyles = {
  container: {
    textAlign: 'center',
    padding: '80px 20px',
    border: '2px dashed var(--border-color)',
    borderRadius: 'var(--radius-md)',
    marginTop: '20px',
  }
};
