const { celebrate, Joi } = require('celebrate');
const { validationUrl, validationID } = require('./validationFunctions');

module.exports.validationCreateMovie = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().custom(validationUrl),
  }),
});

module.exports.validationMovieID = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(validationID),
  }),
});
