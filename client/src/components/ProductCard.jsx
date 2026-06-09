import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size or M
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    addToCart(product, 1, defaultSize);
  };

  return (
    <div className="product-card animate-fade-in">
      <Link to={`/products/${product._id}`}>
        <div className="card-img-container">
          {product.discount > 0 && (
            <span className="card-discount-tag">{product.discount}% OFF</span>
          )}
          <img src={product.image} alt={product.name} className="card-img" loading="lazy" />
        </div>
      </Link>
      
      <div className="card-info">
        <span className="card-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h4 className="card-name">{product.name}</h4>
        </Link>
        
        <div className="card-prices">
          <span className="card-price">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="card-original-price">₹{product.originalPrice}</span>
          )}
        </div>

        <div className="card-footer">
          <div className="card-rating">
            <Star size={12} fill="currentColor" />
            <span>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
              ({product.reviewsCount})
            </span>
          </div>
          
          <button onClick={handleQuickAdd} className="card-btn" aria-label="Add to cart">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
