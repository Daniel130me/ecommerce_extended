import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productRes = await api.get('/api/products?limit=8'); // Fetch some featured products
        setProducts(productRes.data.products);

        const categoryRes = await api.get('/api/categories');
        setCategories(categoryRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load products or categories.');
      }
    };
    fetchProductsAndCategories();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Featured Products</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {products.map(product => (
          <div className="col" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <h2 className="mt-5 mb-4">Shop by Category</h2>
      <div className="list-group">
        {categories.map(category => (
          <Link key={category._id} to={`/shop?categories=${category.slug}`} className="list-group-item list-group-item-action">
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;