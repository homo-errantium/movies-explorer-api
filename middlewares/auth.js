const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { secretKey } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : secretKey,
    );
  } catch (err) {
    return new AuthError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
