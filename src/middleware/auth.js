const jwt = require('jsonwebtoken');
const { ROLE_PERMISSIONS } = require('../utils/constants');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const authorize = (action) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole || !ROLE_PERMISSIONS[userRole]?.[action]) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }
    
    next();
  };
};

const checkUserStatus = async (req, res, next) => {
  const db = require('../config/database');
  
  try {
    const users = await db.query(
      'SELECT status FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0 || users[0].status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { authenticate, authorize, checkUserStatus };