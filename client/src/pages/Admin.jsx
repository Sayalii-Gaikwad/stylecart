import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  ShoppingBag, 
  ClipboardList, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  PackageCheck
} from 'lucide-react';

export const Admin = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    category: 'men',
    sizes: 'S,M,L,XL',
    description: '',
    stock: '10'
  });

  // Fetch Data
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const productsRes = await axios.get('http://localhost:5000/api/products');
      setProducts(productsRes.data);

      const ordersRes = await axios.get('http://localhost:5000/api/orders/all', config);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      // Direct access check
      const checkAdmin = setTimeout(() => {
        if (!user || !user.isAdmin) {
          navigate('/');
        }
      }, 1000);
      return () => clearTimeout(checkAdmin);
    }
    fetchData();
  }, [user, token, navigate]);

  // Handle forms
  const handleInputChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      discount: '0',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
      category: 'men',
      sizes: 'S,M,L,XL',
      description: '',
      stock: '10'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: (product.originalPrice || product.price).toString(),
      discount: (product.discount || 0).toString(),
      image: product.image,
      category: product.category,
      sizes: product.sizes.join(','),
      description: product.description,
      stock: product.stock.toString()
    });
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      originalPrice: parseFloat(productForm.originalPrice || productForm.price),
      discount: parseInt(productForm.discount || 0),
      stock: parseInt(productForm.stock || 10),
      sizes: productForm.sizes.split(',').map(s => s.trim())
    };

    try {
      if (editingProduct) {
        // Edit product
        const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, payload, config);
        setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
      } else {
        // Create product
        const res = await axios.post('http://localhost:5000/api/products', payload, config);
        setProducts([res.data, ...products]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error updating product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Error deleting product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { orderStatus: newStatus }, config);
      setOrders(orders.map(o => o._id === orderId ? res.data : o));
    } catch (err) {
      alert('Error updating order status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Security guard view
  if (!user || !user.isAdmin) {
    return (
      <div className="container animate-fade-in" style={{ marginTop: '120px', textAlign: 'center', marginBottom: '80px' }}>
        <ShieldAlert size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          This page is reserved for administrator accounts only. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-container animate-fade-in">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)' }}>
            <PackageCheck size={18} /> Admin Dashboard
          </h4>
        </div>
        <button 
          onClick={() => setActiveTab('products')} 
          className={`admin-sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
        >
          <ShoppingBag size={18} /> Manage Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`admin-sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ClipboardList size={18} /> Manage Orders
        </button>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-content">
        {/* Statistics block */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon"><ShoppingBag size={24} /></div>
            <div className="stat-info">
              <h3>{products.length}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
              <ClipboardList size={24} />
            </div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <h3>₹{totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* 1. PRODUCTS MANAGEMENT SECTION */}
            {activeTab === 'products' && (
              <div className="admin-section">
                <div className="admin-header-row">
                  <h3>Catalog Inventory</h3>
                  <button onClick={openAddModal} className="btn btn-dark btn-small">
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id}>
                          <td>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ width: '40px', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '4px' }} 
                            />
                          </td>
                          <td style={{ fontWeight: 600 }}>{product.name}</td>
                          <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                          <td>₹{product.price}</td>
                          <td>
                            <span 
                              style={{ 
                                fontWeight: 700, 
                                color: product.stock <= 5 ? 'var(--danger)' : 'var(--text-primary)' 
                              }}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button onClick={() => openEditModal(product)} className="admin-action-icon" aria-label="Edit product">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product._id)} className="admin-action-icon delete" aria-label="Delete product">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. ORDERS MANAGEMENT SECTION */}
            {activeTab === 'orders' && (
              <div className="admin-section">
                <div className="admin-header-row">
                  <h3>Customer Orders</h3>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Total Paid</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>#{order._id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td style={{ fontWeight: 600 }}>{order.shippingAddress.name}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.zip}
                          </td>
                          <td style={{ fontWeight: 700 }}>₹{order.totalAmount}</td>
                          <td>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                background: order.orderStatus === 'Delivered' ? '#D1FAE5' : order.orderStatus === 'Dispatched' ? '#FEF3C7' : '#DBEAFE',
                                color: order.orderStatus === 'Delivered' ? '#065F46' : order.orderStatus === 'Dispatched' ? '#92400E' : '#1E40AF'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>{editingProduct ? 'Edit Product Details' : 'Add New Catalog Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={productForm.originalPrice}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={productForm.discount}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={productForm.image}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ padding: '10px' }}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    value={productForm.sizes}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="S,M,L,XL"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows={3}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark" style={{ width: '100%', padding: '12px' }}>
                {editingProduct ? 'Save Product Changes' : 'Publish Product to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
