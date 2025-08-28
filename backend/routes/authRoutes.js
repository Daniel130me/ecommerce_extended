
const express = require('express');
const router = express.Router();
const { registerCustomer, authCustomer } = require('../controllers/authController');

router.post('/signup', registerCustomer);
router.post('/login', authCustomer);

module.exports = router;
