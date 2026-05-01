const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Please provide your email or username'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} already in use` });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({
      username,
      email,
      passwordHash: password,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email: identifier, password } = req.body;

    // Support both email and username login
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });

    if (!user) {
      console.log(`Login failed: Identity not found for ${identifier}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Login failed: Wrong password for ${identifier}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
};
