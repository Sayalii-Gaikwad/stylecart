const jwt = require('jsonwebtoken');
const dbService = require('../models/dbService');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stylecart_jwt_secret_key');
      
      const user = await dbService.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, administrator role required' });
  }
};

module.exports = { protect, admin };
