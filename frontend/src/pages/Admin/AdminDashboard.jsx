import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import CategoryForm from '../../components/Admin/CategoryForm.jsx';
import ProductForm from '../../components/Admin/ProductForm.jsx';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories.');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products.');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleDeleteCategory = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await api.delete(`/api/categories/${id}`, config);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category.');
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await api.delete(`/api/products/${id}`, config);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product.');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row">
        <div className="col-md-6">
          <CategoryForm
            editingCategory={editingCategory}
            onCategoryAdded={() => { fetchCategories(); setEditingCategory(null); }}
            onCategoryUpdated={() => { fetchCategories(); setEditingCategory(null); }}
          />
          <div className="card mb-4">
            <div className="card-header">Manage Categories</div>
            <ul className="list-group list-group-flush">
              {categories.map(category => (
                <li key={category._id} className="list-group-item d-flex justify-content-between align-items-center">
                  {category.name}
                  <div>
                    <button className="btn btn-sm btn-info me-2" onClick={() => setEditingCategory(category)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <ProductForm
            editingProduct={editingProduct}
            onProductAdded={() => { fetchProducts(); setEditingProduct(null); }}
            onProductUpdated={() => { fetchProducts(); setEditingProduct(null); }}
          />
          <div className="card mb-4">
            <div className="card-header">Manage Products</div>
            <ul className="list-group list-group-flush">
              {products.map(product => (
                <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                  {product.name}
                  <div>
                    <button className="btn btn-sm btn-info me-2" onClick={() => setEditingProduct(product)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;