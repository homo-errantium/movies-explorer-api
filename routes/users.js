const users = require('express').Router();

const { updateUserInfo, getCurrentUser } = require('../controllers/users');

const {
  validationUpdateUserInfo,
  validationUserID,
} = require('../middlewares/validation/validationUser');

// возвращает информацию о пользователе
users.get('/me', validationUserID, getCurrentUser);

// обновляет информацию о пользователе
users.patch('/me', validationUpdateUserInfo, updateUserInfo);

module.exports = { users };
