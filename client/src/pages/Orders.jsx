import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Calendar, MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export const Orders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/auth?redirect=orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const res = await axios.get('http://localhost:5000/api/orders/mine', config);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 size={16} color="var(--success)" />;
      case 'Dispatched':
        return <Truck size={16} color="var(--warning)" />;
      default:
        return <AlertCircle size={16} color="#3B82F6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#D1FAE5'; // soft green
      case 'Dispatched':
        return '#FEF3C7'; // soft yellow
      default:
        return '#DBEAFE'; // soft blue
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#065F46';
      case 'Dispatched':
        return '#92400E';
      default:
        return '#1E40AF';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', marginTop: '70px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '100px', marginBottom: '80px', maxWidth: '800px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <ClipboardList size={28} /> My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="admin-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h4>No orders found</h4>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            You haven't placed any orders yet.
          </p>
          <button onClick={() => navigate('/products')} className="btn btn-dark" style={{ marginTop: '20px' }}>
            Browse Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div key={order._id} className="admin-section" style={{ borderLeft: '5px solid var(--dark)' }}>
              {/* Order top bar */}
              <div style={styles.topBar}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORDER ID</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>#{order._id}</h4>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={styles.metaCol}>
                    <span style={styles.metaLabel}><Calendar size={12} /> Placed On</span>
                    <span style={styles.metaVal}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.metaCol}>
                    <span style={styles.metaLabel}>Total Paid</span>
                    <span style={{ ...styles.metaVal, fontWeight: 800 }}>₹{order.totalAmount}</span>
                  </div>
                  <div 
                    style={{ 
                      ...styles.statusBadge, 
                      backgroundColor: getStatusColor(order.orderStatus),
                      color: getStatusTextColor(order.orderStatus)
                    }}
                  >
                    {getStatusIcon(order.orderStatus)}
                    <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{order.orderStatus}</span>
                  </div>
                </div>
              </div>

              {/* Shipping address details */}
              <div style={styles.shippingDetails}>
                <MapPin size={14} style={{ color: 'var(--text-muted)', marginTop: '3px' }} />
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--dark)' }}>
                    Shipped to: {order.shippingAddress.name}
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.zip} | Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '16px 0' }}></div>

              {/* Order Items */}
              <div>
                {order.items.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} style={styles.itemRow}>
                    <img src={item.image} alt={item.name} style={styles.itemImg} />
                    <div style={{ flex: 1 }}>
                      <h5 style={styles.itemName}>{item.name}</h5>
                      <span style={styles.itemMeta}>Size: {item.size} • Qty: {item.quantity}</span>
                    </div>
                    <span style={styles.itemPrice}>₹{item.price} each</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  metaCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metaLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  metaVal: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--dark)',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    height: 'fit-content',
  },
  shippingDetails: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    backgroundColor: 'var(--bg-primary)',
    padding: '12px',
    borderRadius: '6px',
    marginTop: '16px',
    fontSize: '0.85rem',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  itemImg: {
    width: '40px',
    aspectRatio: '3/4',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--dark)',
  },
  itemMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  itemPrice: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--dark)',
  }
};
