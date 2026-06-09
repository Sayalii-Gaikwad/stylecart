import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, User, Mail, Lock } from 'lucide-react';

export const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, signup, authError } = useAuth();

  const redirectParam = searchParams.get('redirect') || '';
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      navigate(redirectParam ? `/${redirectParam}` : '/');
    }
  }, [user, navigate, redirectParam]);

  // Sync tab state when URL changes
  useEffect(() => {
    setActiveTab(initialTab);
    setValidationError('');
  }, [initialTab]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTabChange = (tab) => {
    navigate(`/auth?tab=${tab}${redirectParam ? `&redirect=${redirectParam}` : ''}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSubmitting(true);

    const { name, email, password, confirmPassword } = formData;

    if (!email || !password) {
      setValidationError('Please fill in all credentials.');
      setSubmitting(false);
      return;
    }

    if (activeTab === 'signup') {
      if (!name) {
        setValidationError('Please enter your name.');
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        setSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        setSubmitting(false);
        return;
      }
    }

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      // Redirect handled in useEffect
    } catch (err) {
      // Error is stored in context and displayed
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Tab Headers */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabChange('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Errors */}
        {(validationError || authError) && (
          <div style={errorStyles.container}>
            <ShieldAlert size={18} />
            <span>{validationError || authError}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'signup' && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div style={inputStyles.container}>
                <User size={18} style={inputStyles.icon} />
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={inputStyles.container}>
              <Mail size={18} style={inputStyles.icon} />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="yourname@example.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={inputStyles.container}>
              <Lock size={18} style={inputStyles.icon} />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={inputStyles.container}>
                <Lock size={18} style={inputStyles.icon} />
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-dark" 
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            disabled={submitting}
          >
            {submitting ? 'Please wait...' : activeTab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {/* Fast-fill buttons for testing */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Fast-fill Test Accounts:
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button 
              onClick={() => setFormData({ email: 'admin@stylecart.com', password: 'admin123', name: '', confirmPassword: '' })}
              className="btn btn-outline btn-small"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Fill Admin
            </button>
            <button 
              onClick={() => {
                const randomMail = `test_${Math.floor(Math.random()*1000)}@stylecart.com`;
                setFormData({ email: randomMail, password: 'password123', name: 'Test Customer', confirmPassword: 'password123' });
                setActiveTab('signup');
              }}
              className="btn btn-outline btn-small"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Fill Demo Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const errorStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    color: 'var(--danger)',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    marginBottom: '20px',
  }
};

const inputStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  }
};
