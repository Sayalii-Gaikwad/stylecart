import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingBag, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product details:', err.message);
        setError(err.response?.data?.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQtyChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    addToCart(product, quantity, selectedSize);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', marginTop: '70px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container animate-fade-in" style={{ marginTop: '120px', textAlign: 'center', marginBottom: '80px' }}>
        <ShieldAlert size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h2>Product not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{error}</p>
        <button onClick={() => navigate('/products')} className="btn btn-dark" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '100px', marginBottom: '80px' }}>
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main product view */}
      <div style={styles.grid}>
        {/* Left: Product image */}
        <div style={styles.gallery}>
          {product.discount > 0 && (
            <span style={styles.discountBadge}>{product.discount}% OFF</span>
          )}
          <img src={product.image} alt={product.name} style={styles.mainImg} />
        </div>

        {/* Right: Product details and actions */}
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.title}>{product.name}</h1>

          {/* Rating */}
          <div style={styles.ratingRow}>
            <div style={styles.stars}>
              <Star size={16} fill="currentColor" />
              <span>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {product.reviewsCount} verified customer reviews
            </span>
          </div>

          {/* Prices */}
          <div style={styles.priceRow}>
            <span style={styles.price}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <>
                <span style={styles.originalPrice}>₹{product.originalPrice}</span>
                <span style={styles.discountPercent}>({product.discount}% OFF)</span>
              </>
            )}
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 700, marginBottom: '20px' }}>
            Inclusive of all taxes
          </p>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '24px' }}></div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Select Size
              </h4>
              <div style={styles.sizeGrid}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      ...styles.sizeButton,
                      borderColor: selectedSize === size ? 'var(--dark)' : 'var(--border-color)',
                      backgroundColor: selectedSize === size ? 'var(--dark)' : 'transparent',
                      color: selectedSize === size ? 'white' : 'var(--text-primary)',
                      fontWeight: selectedSize === size ? 700 : 500,
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector and Add to Cart */}
          <div style={styles.actionRow}>
            <div className="qty-selector" style={{ height: '48px' }}>
              <button 
                className="qty-btn" 
                style={{ width: '40px', height: '100%', fontSize: '1.2rem' }}
                onClick={() => handleQtyChange(quantity - 1)}
              >
                -
              </button>
              <span className="qty-value" style={{ width: '50px', fontSize: '1rem' }}>{quantity}</span>
              <button 
                className="qty-btn" 
                style={{ width: '40px', height: '100%', fontSize: '1.2rem' }}
                onClick={() => handleQtyChange(quantity + 1)}
              >
                +
              </button>
            </div>

            <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, height: '48px' }}>
              <ShoppingBag size={18} /> Add to Cart
            </button>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Product Description
            </h4>
            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '24px',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '50px',
  },
  gallery: {
    position: 'relative',
    aspectRatio: '3/4',
    background: '#f3f4f6',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: '#EF4444',
    color: 'white',
    padding: '6px 12px',
    fontWeight: 800,
    fontSize: '0.85rem',
    borderRadius: 'var(--radius-sm)',
    zIndex: 1,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    fontWeight: 800,
    color: 'var(--text-muted)',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: '1.2',
    color: 'var(--dark)',
    marginBottom: '16px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  stars: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'var(--primary-light)',
    color: '#827717',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '4px',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--dark)',
  },
  originalPrice: {
    fontSize: '1.25rem',
    textDecoration: 'line-through',
    color: 'var(--text-muted)',
  },
  discountPercent: {
    color: '#EF4444',
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  sizeGrid: {
    display: 'flex',
    gap: '12px',
  },
  sizeButton: {
    width: '46px',
    height: '46px',
    borderRadius: 'var(--radius-sm)',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  actionRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '10px',
  },
};

// Add responsive rules if needed (fallback handled in media queries)
