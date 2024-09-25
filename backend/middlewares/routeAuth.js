const jwt = require('jsonwebtoken');
const config = require('../config');

const routeAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  if (!accessToken) {
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict', secure: true });
    return res.status(401).json({ message: "Access token is missing" });
  }
  jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });
      return res.status(403).json({ status: 403, message: "Token invalid!" })
    };
    next();
  });
};

module.exports = routeAuth;