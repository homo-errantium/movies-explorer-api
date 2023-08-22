const users = require('express').Router();

const { updateUserInfo, getCurrentUser } = require('../controllers/users');

const {
  validationUpdateUserInfo,
  validationUserID,
} = require('../middlewares/validation/validationUser');

// возвращает информацию о пользователе
users.get('/users/me', validationUserID, getCurrentUser);

// обновляет информацию о пользователе
users.patch('/users/me', validationUpdateUserInfo, updateUserInfo);

module.exports = { users };
