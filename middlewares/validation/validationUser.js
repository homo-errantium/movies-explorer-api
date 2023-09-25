const { celebrate, Joi } = require('celebrate');

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-].[a-zA-Z0-9-.]+$/;

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validationUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().pattern(EMAIL_REGEX),
  }),
});
