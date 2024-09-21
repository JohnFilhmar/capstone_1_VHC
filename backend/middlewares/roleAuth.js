const jwt = require('jsonwebtoken');
require('dotenv').config();

const roleAuth = (req, res, next) => {
  const pathname = (req.originalUrl).split('/')[2];
  // console.log(pathname);
  next();  
};

module.exports = roleAuth;