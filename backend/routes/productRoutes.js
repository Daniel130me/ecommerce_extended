
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/').post(protect, admin, upload, createProduct).get(getProducts);
router.route('/:slug').get(getProductBySlug);
router
  .route('/:id')
  .put(protect, admin, upload, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
