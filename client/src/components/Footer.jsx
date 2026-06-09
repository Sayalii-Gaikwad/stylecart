import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer animate-fade-in">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3><span>Style</span>Cart</h3>
          <p>
            StyleCart is your ultimate destination for premium clothing and accessories inspired by the latest streetwear and trends. Experience premium quality apparel and fast delivery.
          </p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            © {new Date().getFullYear()} StyleCart Inc. Built with React and Node.
          </p>
        </div>

        <div className="footer-links-col">
          <h4>Need Help?</h4>
          <ul className="footer-links">
            <li><Link to="/products" className="footer-link">Track Order</Link></li>
            <li><Link to="/products" className="footer-link">Returns & Exchanges</Link></li>
            <li><Link to="/products" className="footer-link">Customer Service</Link></li>
            <li><Link to="/products" className="footer-link">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=men" className="footer-link">Men's Wear</Link></li>
            <li><Link to="/products?category=women" className="footer-link">Women's Wear</Link></li>
            <li><Link to="/products?category=accessories" className="footer-link">Accessories</Link></li>
            <li><Link to="/products" className="footer-link">New Arrivals</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Subscribe to our newsletter</h4>
          <p>Get all the latest details on new products, sales, and special offers.</p>
          <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="btn btn-primary btn-small">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>StyleCart Clone - Sayalii Gaikwad Github Account Integration Ready</p>
      </div>
    </footer>
  );
};
