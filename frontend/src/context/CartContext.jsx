import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api'; 

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Fetch user's cart from backend
  const fetchUserCart = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await api.get('/api/cart', config);
      setCartItems(data.items || []);
      localStorage.removeItem('cartItems'); // Clear local storage cart
    } catch (error) {
      console.error('Error fetching user cart:', error);
      toast.error('Failed to load cart.');
    }
  };

  const addToCart = async (product, quantity = 1, isLoggedIn = false) => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product._id);

    let updatedCartItems;
    if (existingItemIndex > -1) {
      updatedCartItems = cartItems.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCartItems = [...cartItems, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
      }];
    }
    setCartItems(updatedCartItems);
    toast.success(`${product.name} added to cart!`);

    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');//obtain token from localstorage
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        await api.post('/api/cart/add', { productId: product._id, quantity }, config);
      } catch (error) {
        console.error('Error adding to server cart:', error);
        toast.error('Failed to add to server cart.');
      }
    }
  };

  const updateCartItemQuantity = async (productId, quantity, isLoggedIn = false) => {
    let updatedCartItems = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    updatedCartItems = updatedCartItems.filter(item => item.quantity > 0); 

    setCartItems(updatedCartItems);
    toast.success('Cart updated!');

    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        await api.put(`/api/cart/${productId}`, { quantity }, config);
      } catch (error) {
        console.error('Error updating server cart:', error);
        toast.error('Failed to update server cart.');
      }
    }
  };

  const removeFromCart = async (productId, isLoggedIn = false) => {
    const updatedCartItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCartItems);
    toast.success('Item removed from cart!');

    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await api.delete(`/api/cart/${productId}`, config);
      } catch (error) {
        console.error('Error removing from server cart:', error);
        toast.error('Failed to remove from server cart.');
      }
    }
  };

  const clearCart = async (isLoggedIn = false) => {
    setCartItems([]);
    toast.success('Cart cleared!');
    if (isLoggedIn) {
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    fetchUserCart,
  };

  return (
    <CartContext.Provider value={value}>
      {!loading && children}
    </CartContext.Provider>
  );
};