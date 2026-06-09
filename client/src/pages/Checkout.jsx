import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });
  
  const [paymentCard, setPaymentCard] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Guard route - must have items and user
  useEffect(() => {
    if (!token) {
      navigate('/auth?redirect=checkout');
    } else if (cartItems.length === 0 && !checkoutComplete) {
      navigate('/products');
    }
  }, [token, cartItems, navigate, checkoutComplete]);

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCardChange = (e) => {
    setPaymentCard({
      ...paymentCard,
      [e.target.name]: e.target.value
    });
  };

  // Calculations
  const shippingCharge = cartTotal >= 499 ? 0 : 99;
  const finalTotal = cartTotal + shippingCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { name, address, city, zip, phone } = shippingAddress;
    if (!name || !address || !city || !zip || !phone) {
      setError('Please provide complete shipping details.');
      setSubmitting(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size
        })),
        totalAmount: finalTotal,
        shippingAddress
      };

      const res = await axios.post('http://localhost:5000/api/orders', orderPayload, config);
      setCreatedOrder(res.data);
      clearCart();
      setCheckoutComplete(true);
    } catch (err) {
      console.error('Order creation error:', err.message);
      setError(err.response?.data?.message || 'Order execution failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkoutComplete && createdOrder) {
    return (
      <div className="container animate-fade-in" style={{ marginTop: '120px', textAlign: 'center', maxWidth: '500px', marginBottom: '80px' }}>
        <div style={successStyles.iconBox}>
          <CheckCircle size={64} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1rem', lineHeight: '1.6' }}>
          Thank you for shopping with StyleCart! Your payment has been received and order <strong>#{createdOrder._id}</strong> has been logged.
        </p>
        
        <div style={successStyles.summaryCard}>
          <h4>Delivery Summary</h4>
          <p style={{ marginTop: '8px' }}>Recipient: {createdOrder.shippingAddress.name}</p>
          <p>Address: {createdOrder.shippingAddress.address}, {createdOrder.shippingAddress.city} - {createdOrder.shippingAddress.zip}</p>
          <p style={{ fontWeight: 700, marginTop: '8px', color: 'var(--dark)' }}>Total Paid: ₹{createdOrder.totalAmount}</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '30px' }}>
          <button onClick={() => navigate('/orders')} className="btn btn-dark">
            View My Orders
          </button>
          <button onClick={() => navigate('/products')} className="btn btn-outline">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '100px', marginBottom: '80px' }}>
      <button onClick={() => navigate('/products')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', background: 'none', border: 'none', marginBottom: '24px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div style={layoutStyles.grid}>
        {/* Left: Forms (Address & Payment) */}
        <div>
          <form onSubmit={handlePlaceOrder}>
            {/* Shipping Address */}
            <div className="admin-section" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px' }}>Shipping Address</h3>
              
              {error && (
                <div style={{ color: 'var(--danger)', background: '#FEE2E2', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleAddressChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  className="form-input"
                  placeholder="Apartment, suite, unit, street"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode / ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={shippingAddress.zip}
                    onChange={handleAddressChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="admin-section">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} /> Simulated Payment Card
              </h3>

              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  name="number"
                  placeholder="4111 2222 3333 4444"
                  value={paymentCard.number}
                  onChange={handleCardChange}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={paymentCard.expiry}
                    onChange={handleCardChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    maxLength={4}
                    value={paymentCard.cvv}
                    onChange={handleCardChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', marginTop: '24px', height: '52px' }}
              disabled={submitting}
            >
              {submitting ? 'Processing Order...' : `Pay & Place Order • ₹${finalTotal}`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
          <div className="admin-section">
            <h3 style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              Order Items
            </h3>
            
            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '20px' }}>
              {cartItems.map((item, idx) => (
                <div key={`${item.product._id}-${item.size}-${idx}`} style={summaryStyles.itemRow}>
                  <img src={item.product.image} alt={item.product.name} style={summaryStyles.itemImg} />
                  <div style={{ flex: 1 }}>
                    <h5 style={summaryStyles.itemName}>{item.product.name}</h5>
                    <span style={summaryStyles.itemMeta}>Size: {item.size} × {item.quantity}</span>
                  </div>
                  <span style={summaryStyles.itemPrice}>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '16px 0' }}></div>

            <div style={summaryStyles.calcRow}>
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>

            <div style={summaryStyles.calcRow}>
              <span>Shipping Cost</span>
              <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '16px 0' }}></div>

            <div style={summaryStyles.totalRow}>
              <span>Grand Total</span>
              <span>₹{finalTotal}</span>
            </div>

            <div style={summaryStyles.badgeRow}>
              <ShieldCheck size={18} color="var(--success)" />
              <span>Tested Secure Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const layoutStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '40px',
  }
};

const summaryStyles = {
  itemRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '14px',
  },
  itemImg: {
    width: '46px',
    aspectRatio: '3/4',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px',
  },
  itemMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  itemPrice: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: 'var(--dark)',
  },
  calcRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--dark)',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: '#ECFDF5',
    color: '#065F46',
    borderRadius: '6px',
    padding: '8px',
    fontSize: '0.8rem',
    marginTop: '20px',
    fontWeight: 600,
  }
};

const successStyles = {
  iconBox: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: '#ECFDF5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  summaryCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    marginTop: '30px',
    textAlign: 'left',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  }
};
