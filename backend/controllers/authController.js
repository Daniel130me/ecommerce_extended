
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerCustomer = async (req, res) => {
  const { name, email, password, cart } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'customer',
    });

    if (user) {
      // Merge cart
      if (cart && cart.length > 0) {
        let userCart = await Cart.findOne({ user: user._id });
        if (!userCart) {
          userCart = new Cart({ user: user._id, items: [] });
        }

        cart.forEach(item => {
          const existingItem = userCart.items.find(i => i.productId.toString() === item.productId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            userCart.items.push(item);
          }
        });
        await userCart.save();
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authCustomer = async (req, res) => {
  const { email, password, cart } = req.body;

  try {
    const user = await User.findOne({ email, role: 'customer' });

    if (user && (await user.matchPassword(password))) {
      // Merge cart
      if (cart && cart.length > 0) {
        let userCart = await Cart.findOne({ user: user._id });
        if (!userCart) {
          userCart = new Cart({ user: user._id, items: [] });
        }

        cart.forEach(item => {
          const existingItem = userCart.items.find(i => i.productId.toString() === item.productId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            userCart.items.push(item);
          }
        });
        await userCart.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerCustomer, authCustomer };
