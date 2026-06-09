import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, User, Search, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span>Style</span>Cart
        </Link>

        {/* Category Links */}
        <ul className="nav-links">
          <li>
            <Link to="/products?category=all" className="nav-link">
              Shop All
            </Link>
          </li>
          <li>
            <button onClick={() => handleCategoryClick('men')} className="nav-link">
              Men
            </button>
          </li>
          <li>
            <button onClick={() => handleCategoryClick('women')} className="nav-link">
              Women
            </button>
          </li>
          <li>
            <button onClick={() => handleCategoryClick('accessories')} className="nav-link">
              Accessories
            </button>
          </li>
        </ul>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <input
            type="text"
            placeholder="Search products, brands..."
            className="nav-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="nav-search-icon" />
        </form>

        {/* Actions */}
        <div className="nav-actions">
          {/* Cart Trigger */}
          <button onClick={() => setIsCartOpen(true)} className="nav-action-btn" aria-label="Open Cart">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </button>

          {/* Profile Dropdown */}
          <div className="profile-menu">
            <button className="nav-action-btn" aria-label="User profile">
              <User size={22} />
            </button>
            <div className="dropdown-menu">
              {user ? (
                <>
                  <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--dark)' }}>
                    Hi, {user.name}
                  </div>
                  <div className="dropdown-divider"></div>
                  {user.isAdmin && (
                    <Link to="/admin" className="dropdown-item">
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/orders" className="dropdown-item">
                    <ClipboardList size={16} /> My Orders
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={logout} className="dropdown-item" style={{ width: '100%', border: 'none', background: 'none' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth?tab=login" className="dropdown-item">
                    Login
                  </Link>
                  <Link to="/auth?tab=signup" className="dropdown-item">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
