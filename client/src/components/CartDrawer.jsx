import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/auth?redirect=checkout');
    }
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        className={`drawer-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} /> My Cart
          </h3>
          <button className="drawer-close" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} />
              <div>
                <h4>Your cart is empty</h4>
                <p style={{ fontSize: '0.875rem', marginTop: '6px' }}>
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/products'); }} 
                className="btn btn-dark btn-small"
                style={{ marginTop: '10px' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.product._id}-${item.size}-${idx}`} className="cart-drawer-item">
                <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <div className="cart-item-meta">
                    Size: <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{item.size}</span>
                  </div>
                  
                  <div className="cart-item-qty-price">
                    {/* Quantity selectors */}
                    <div className="qty-selector">
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {/* Price */}
                    <span className="cart-item-price">₹{item.product.price * item.quantity}</span>
                  </div>
                </div>
                
                {/* Delete button */}
                <button 
                  className="cart-item-remove" 
                  onClick={() => removeFromCart(item.product._id, item.size)}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Shipping and taxes calculated at checkout.
            </p>
            <button 
              onClick={handleCheckoutClick} 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </>
  );
};
