import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Flame, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        // Get first 4 products as trending
        setTrendingProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching trending products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleCategoryNav = (cat) => {
    navigate(`/products?category=${cat}`);
  };

  return (
    <div className="animate-fade-in" style={{ marginTop: '70px' }}>
      {/* Hero Section */}
      <section className="hero-banner" style={heroStyles.banner}>
        <div className="container" style={heroStyles.content}>
          <span style={heroStyles.tag}>WEEKEND SPECIAL SALE</span>
          <h1 style={heroStyles.title}>UP TO <span style={{ color: 'var(--primary)' }}>60% OFF</span> ON STREETWEAR</h1>
          <p style={heroStyles.subtitle}>Explore the new season's drop. Ultra-comfortable combed cotton hoodies, oversized tees, and premium cargo pants.</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Shop Collection <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={badgeStyles.section}>
        <div className="container" style={badgeStyles.container}>
          <div style={badgeStyles.badge}>
            <Truck size={24} />
            <div>
              <h4 style={badgeStyles.badgeTitle}>Free Shipping</h4>
              <p style={badgeStyles.badgeText}>On all orders above ₹499</p>
            </div>
          </div>
          <div style={badgeStyles.badge}>
            <RefreshCw size={24} />
            <div>
              <h4 style={badgeStyles.badgeTitle}>Easy Return</h4>
              <p style={badgeStyles.badgeText}>15 days hassle-free return</p>
            </div>
          </div>
          <div style={badgeStyles.badge}>
            <ShieldCheck size={24} />
            <div>
              <h4 style={badgeStyles.badgeTitle}>Secure Checkout</h4>
              <p style={badgeStyles.badgeText}>100% encrypted payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Selection Grid */}
      <section className="container" style={{ marginTop: '50px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Shop by Category</h2>
        <div style={catStyles.grid}>
          <div onClick={() => handleCategoryNav('men')} style={{ ...catStyles.box, backgroundImage: 'url("https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=60")' }}>
            <div style={catStyles.overlay}>
              <h3>Men's Collection</h3>
              <span>Browse items <ArrowRight size={14} /></span>
            </div>
          </div>
          <div onClick={() => handleCategoryNav('women')} style={{ ...catStyles.box, backgroundImage: 'url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60")' }}>
            <div style={catStyles.overlay}>
              <h3>Women's Collection</h3>
              <span>Browse items <ArrowRight size={14} /></span>
            </div>
          </div>
          <div onClick={() => handleCategoryNav('accessories')} style={{ ...catStyles.box, backgroundImage: 'url("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60")' }}>
            <div style={catStyles.overlay}>
              <h3>Accessories</h3>
              <span>Browse items <ArrowRight size={14} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="container" style={{ marginTop: '60px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={24} color="#EF4444" fill="#EF4444" /> Trending Now
          </h2>
          <button onClick={() => navigate('/products')} style={{ fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All Products <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid-products">
            {trendingProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Inline styles for rich presentation
const heroStyles = {
  banner: {
    height: '480px',
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    maxWidth: '650px',
  },
  tag: {
    background: 'var(--primary)',
    color: 'var(--dark)',
    padding: '4px 12px',
    fontWeight: '800',
    borderRadius: '4px',
    fontSize: '0.8rem',
    letterSpacing: '1px',
  },
  title: {
    fontSize: '3rem',
    color: 'white',
    lineHeight: '1.15',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: '0.9',
    lineHeight: '1.6',
    marginBottom: '8px',
  }
};

const badgeStyles = {
  section: {
    background: 'var(--dark)',
    color: 'white',
    padding: '24px 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '24px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1 1 250px',
  },
  badgeTitle: {
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
  badgeText: {
    color: '#9CA3AF',
    fontSize: '0.85rem',
  }
};

const catStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  box: {
    height: '240px',
    borderRadius: 'var(--radius-md)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    transition: 'var(--transition-normal)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
    padding: '24px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }
};
