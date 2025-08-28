import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before checking out.');
      return;
    }
    // In a real application, you would send this data to your backend
    // and integrate with a payment gateway.
    console.log('Order submitted:', { formData, cartItems });
    toast.success('Order placed successfully! (Simulated)');
    clearCart(); // Clear cart after successful order
    // Redirect to a success page or order history
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Checkout</h2>
      <div className="row">
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Shipping Address</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="address">Address</label>
              <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>

            <div className="row">
              <div className="col-md-5 mb-3">
                <label htmlFor="country">Country</label>
                <select className="form-select" id="country" name="country" value={formData.country} onChange={handleInputChange} required>
                  <option value="">Choose...</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Nigeria</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="city">City</label>
                <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="postalCode">Postal Code</label>
                <input type="text" className="form-control" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
              </div>
            </div>

            <hr className="mb-4" />

            <h4 className="mb-3">Payment (Simulated)</h4>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="credit" name="paymentMethod" checked required />
              <label className="form-check-label" htmlFor="credit">Credit card</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="debit" name="paymentMethod" />
              <label className="form-check-label" htmlFor="debit">Debit card</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="paypal" name="paymentMethod" />
              <label className="form-check-label" htmlFor="paypal">PayPal</label>
            </div>

            <hr className="mb-4" />

            <button className="btn btn-primary btn-lg w-100" type="submit">Continue to checkout</button>
          </form>
        </div>
        <div className="col-md-4 order-md-2 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Your cart</span>
            <span className="badge bg-secondary rounded-pill">{cartItems.length}</span>
          </h4>
          <ul className="list-group mb-3">
            {cartItems.map(item => (
              <li className="list-group-item d-flex justify-content-between lh-sm" key={item.productId}>
                <div>
                  <h6 className="my-0">{item.name}</h6>
                  <small className="text-muted">Quantity: {item.quantity}</small>
                </div>
                <span className="text-muted">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <span>Total (USD)</span>
              <strong>${getCartTotal().toFixed(2)}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;