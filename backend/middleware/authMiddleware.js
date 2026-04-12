const jwt = require('jsonwebtoken');
const config = require('../config/database');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing token.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token.' });
  }
};

module.exports = {
  authenticate,
};
