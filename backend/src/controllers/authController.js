const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password
const isValidPassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

// Helper function to sanitize inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// Helper function to set secure cookie
const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure = process.env.SECURE_COOKIES === 'true' || isProduction;
  const sameSite = process.env.SAMESITE_COOKIES || (isProduction ? 'strict' : 'lax');

  res.cookie('token', token, {
    httpOnly: true, // Prevents XSS attacks
    secure: isSecure, // Only send over HTTPS in production
    sameSite: sameSite, // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

// @desc    Sign up a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email).toLowerCase();
    password = sanitizeInput(password);

    // Comprehensive validation
    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    if (name.length > 100) {
      return res.status(400).json({ error: 'Name cannot exceed 100 characters' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!password || !isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (password.length > 128) {
      return res.status(400).json({ error: 'Password is too long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: 'User with that email already exists' });
    }

    // Create user object
    const user = new User({
      name,
      email,
      passwordHash: password,
      role: 'user',
    });

    // Save user (this triggers the pre-save hook for bcrypt hashing)
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Set secure httpOnly cookie
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      token, // Also return token for clients that can't use httpOnly cookies
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed. Please try again later.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Sanitize inputs
    email = sanitizeInput(email).toLowerCase();
    password = sanitizeInput(password);

    // Validation
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!password || !isValidPassword(password)) {
      return res.status(400).json({ error: 'Please provide a valid password' });
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set secure httpOnly cookie
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      token, // Also return token for clients that can't use httpOnly cookies
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again later.' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user. Please try again later.' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Clear httpOnly cookie
    res.clearCookie('token', { path: '/' });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};
