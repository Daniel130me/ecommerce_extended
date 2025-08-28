import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CategoryForm = ({ editingCategory, onCategoryAdded, onCategoryUpdated }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory._id}`, { name }, config);
        toast.success('Category updated successfully!');
        onCategoryUpdated();
      } else {
        await api.post('/api/categories', { name }, config);
        toast.success('Category added successfully!');
        onCategoryAdded();
      }
      setName('');
    } catch (error) {
      toast.error('Failed to save category.');
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        {editingCategory ? 'Edit Category' : 'Add New Category'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">Category Name</label>
            <input
              type="text"
              className="form-control"
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;