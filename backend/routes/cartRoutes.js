
const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getCart);
router.route('/add').post(protect, addToCart);
router.route('/:id').put(protect, updateCartItem).delete(protect, deleteCartItem);

module.exports = router;
