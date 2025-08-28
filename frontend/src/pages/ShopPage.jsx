import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || '';
    const cats = queryParams.get('categories') ? queryParams.get('categories').split(',') : [];
    const pageNum = queryParams.get('page') || 1;

    setSearchKeyword(search);
    setSelectedCategories(cats);
    setPage(parseInt(pageNum));

    const fetchProducts = async () => {
      try {
        let url = `/api/products?pageNumber=${pageNum}`;
        if (search) url += `&search=${search}`;
        if (cats.length > 0) url += `&categories=${cats.join(',')}`;

        const { data } = await api.get(url);
        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products.');
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      }
    };

    fetchProducts();
    fetchCategories();
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('search', searchKeyword);
    queryParams.set('page', 1);
    window.history.pushState({}, '', `${location.pathname}?${queryParams.toString()}`);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    let newSelectedCategories;
    if (e.target.checked) {
      newSelectedCategories = [...selectedCategories, value];
    } else {
      newSelectedCategories = selectedCategories.filter(cat => cat !== value);
    }
    setSelectedCategories(newSelectedCategories);

    const queryParams = new URLSearchParams(location.search);
    if (newSelectedCategories.length > 0) {
      queryParams.set('categories', newSelectedCategories.join(','));
    } else {
      queryParams.delete('categories');
    }
    queryParams.set('page', 1);
    window.history.pushState({}, '', `${location.pathname}?${queryParams.toString()}`);
  };

  const handlePageChange = (pageNum) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', pageNum);
    window.history.pushState({}, '', `${location.pathname}?${queryParams.toString()}`);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header">Search</div>
            <div className="card-body">
              <form onSubmit={handleSearchSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="submit">Search</button>
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Categories</div>
            <div className="card-body">
              {categories.map(category => (
                <div className="form-check" key={category._id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={category.slug}
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category.slug)}
                    onChange={handleCategoryChange}
                  />
                  <label className="form-check-label" htmlFor={`category-${category._id}`}>
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <h2 className="mb-4">Products</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {products.length > 0 ? (
              products.map(product => (
                <div className="col" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>

          {pages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {[...Array(pages).keys()].map(x => (
                  <li key={x + 1} className={`page-item ${x + 1 === page ? 'active' : ''}`}>
                    <button onClick={() => handlePageChange(x + 1)} className="page-link">
                      {x + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;