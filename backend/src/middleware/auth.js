const { verifyToken } = require('../utils/jwt');

// Middleware to protect routes - requires valid JWT
const protect = (req, res, next) => {
  let token;

  // Check for token in httpOnly cookies first, then Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7); // Remove 'Bearer ' prefix
  }

  // Ensure token format is correct
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }

  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  req.token = token; // Store token for potential later use
  next();
};

// Middleware to restrict routes to admin only
const adminOnly = (req, res, next) => {
  const User = require('../models/User');

  // This will be called after protect middleware
  User.findById(req.userId)
    .then((user) => {
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Server error' });
    });
};

module.exports = { protect, adminOnly };
