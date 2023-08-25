const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const ConflictError = require('../errors/ConflictError');
const { CREATE_CODE, SUCCES_CODE } = require('../utils/constants');
const { secretKey } = require('../utils/config');

// 400 — Переданы некорректные данные при создании пользователя. 500 — На сервере произошла ошибка.
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATE_CODE).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с данным email уже существует');
      }

      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании пользователя.',
        );
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretKey,
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCES_CODE).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

// 400 — Переданы некорректные данные при обновлении профиля.
// 404 — Пользователь с указанным _id не найден. 500 — На сервере произошла ошибка.
module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true,
    },
  )
    .then((user) => res.status(SUCCES_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        );
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};
