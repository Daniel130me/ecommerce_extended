import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, getCartTotal } = useCart();
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartItemQuantity(productId, newQuantity, isLoggedIn);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId, isLoggedIn);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info" role="alert">
          Your cart is empty. <Link to="/shop">Go to Shop</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <ul className="list-group mb-3">
              {cartItems.map(item => (
                <li key={item.productId} className="list-group-item d-flex justify-content-between lh-sm">
                  <div className="d-flex align-items-center">
                    <img src={`http://localhost:5000/${item.image}`} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }} />
                    <div>
                      <h6 className="my-0">{item.name}</h6>
                      <small className="text-muted">${item.price.toFixed(2)}</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      type="number"
                      className="form-control me-2"
                      style={{ width: '70px' }}
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                    />
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.productId)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cart Summary</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total (USD)</span>
                    <strong>${getCartTotal().toFixed(2)}</strong>
                  </li>
                </ul>
                <Link to="/checkout" className="btn btn-primary w-100 mt-3">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;