import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token, API_BASE_URL } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Initial Load: Load from local storage for guests, or fetch from server for logged-in users
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (user && token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const res = await axios.get(`${API_BASE_URL}/cart`, config);
          
          // Map backend items. Backend returns productId as the populated product object
          const items = res.data.items.map(item => ({
            product: item.productId,
            quantity: item.quantity,
            size: item.size
          }));
          setCartItems(items);
        } catch (err) {
          console.error('Error fetching cart from server:', err.message);
        }
      } else {
        // Load from local storage for guest
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            setCartItems(JSON.parse(localCart));
          } catch (e) {
            localStorage.removeItem('cart');
          }
        } else {
          setCartItems([]);
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [user, token]);

  // 2. Sync to local storage for guests or sync to server for logged-in users
  const syncCart = async (newItems) => {
    if (user && token) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const payload = {
          items: newItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            size: item.size
          }))
        };
        await axios.post(`${API_BASE_URL}/cart`, payload, config);
      } catch (err) {
        console.error('Error syncing cart to server:', err.message);
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  // Helper to update state and sync
  const updateCartStateAndSync = (updatedItems) => {
    setCartItems(updatedItems);
    syncCart(updatedItems);
  };

  const addToCart = (product, quantity, size) => {
    const existingIndex = cartItems.findIndex(
      item => item.product._id === product._id && item.size === size
    );

    let updatedItems = [...cartItems];
    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems.push({ product, quantity, size });
    }

    updateCartStateAndSync(updatedItems);
    setIsCartOpen(true); // Auto-open cart drawer when item is added
  };

  const removeFromCart = (productId, size) => {
    const updatedItems = cartItems.filter(
      item => !(item.product._id === productId && item.size === size)
    );
    updateCartStateAndSync(updatedItems);
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    const updatedItems = cartItems.map(item => {
      if (item.product._id === productId && item.size === size) {
        return { ...item, quantity };
      }
      return item;
    });

    updateCartStateAndSync(updatedItems);
  };

  const clearCart = () => {
    updateCartStateAndSync([]);
  };

  // Calculations
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
