
const express = require('express');
const router = express.Router();
const { registerAdmin, authAdmin } = require('../controllers/adminAuthController');

router.post('/signup', registerAdmin);
router.post('/login', authAdmin);

module.exports = router;
