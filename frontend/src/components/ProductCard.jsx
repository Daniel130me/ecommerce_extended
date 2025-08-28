import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  const handleAddToCart = () => {
    addToCart(product, 1, isLoggedIn);
  };

  return (
    <div className="card h-100">
      <Link to={`/product/${product.slug}`}>
        <img src={`http://localhost:5000/${product.images[0]}`} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
      </Link>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">${product.price.toFixed(2)}</p>
        <div className="mt-auto">
          <Link to={`/product/${product.slug}`} className="btn btn-info btn-sm me-2">View Details</Link>
          <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;