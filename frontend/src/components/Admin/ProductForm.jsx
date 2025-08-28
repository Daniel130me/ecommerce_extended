import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ProductForm = ({ editingProduct, onProductAdded, onProductUpdated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setAllCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setImages(editingProduct.images);
      setCategories(editingProduct.categories.map(cat => cat._id));
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setImages([]);
      setCategories([]);
    }
  }, [editingProduct]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.options).filter(option => option.selected).map(option => option.value);
    setCategories(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    categories.forEach(cat => formData.append('categories[]', cat));
    images.forEach(image => formData.append('images', image));

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Product updated successfully!');
        onProductUpdated();
      } else {
        await api.post('/api/products', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Product added successfully!');
        onProductAdded();
      }
      setName('');
      setDescription('');
      setPrice('');
      setImages([]);
      setCategories([]);
    } catch (error) {
      toast.error('Failed to save product.');
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input type="text" className="form-control" id="productName" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="productDescription" className="form-label">Description</label>
            <textarea className="form-control" id="productDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="productPrice" className="form-label">Price</label>
            <input type="number" className="form-control" id="productPrice" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="productImages" className="form-label">Images</label>
            <input type="file" className="form-control" id="productImages" multiple onChange={handleImageChange} />
            {editingProduct && images.length > 0 && (
              <div className="mt-2">
                <h6>Current Images:</h6>
                {images.map((img, index) => (
                  <img key={index} src={`http://localhost:5000/${img}`} alt="product" style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
                ))}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="productCategories" className="form-label">Categories</label>
            <select multiple className="form-select" id="productCategories" value={categories} onChange={handleCategoryChange} required>
              {allCategories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;