import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${slug}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, isLoggedIn);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading product...</div>;
  }

  if (!product) {
    return <div className="container mt-4">Product not found.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          {product.images && product.images.length > 0 && (
            <img src={`http://localhost:5000/${product.images[0]}`} alt={product.name} className="img-fluid" />
          )}
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <h3 className="text-muted">${product.price.toFixed(2)}</h3>
          <p>{product.description}</p>
          <div className="mb-3">
            <strong>Categories: </strong>
            {product.categories.map(cat => (
              <span key={cat._id} className="badge bg-secondary me-1">{cat.name}</span>
            ))}
          </div>
          <div className="d-flex align-items-center mb-3">
            <input
              type="number"
              className="form-control me-2"
              style={{ width: '80px' }}
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;