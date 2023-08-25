const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { CREATE_CODE, SUCCES_CODE } = require('../utils/constants');

// 400 — Переданы некорректные данные при создании карточки. 500 — На сервере произошла ошибка.
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATE_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании карточки фильма.',
        );
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

// 404 — Карточка с указанным _id не найдена.
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id !== owner) {
        return next(
          new ForbiddenError(
            'У Вас недостаточно прав для совершения данной операции',
          ),
        );
      }
      return Movie.deleteOne(movie)
        .then(() => {
          res.status(SUCCES_CODE).send(movie);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(SUCCES_CODE).send(movies))
    .catch((err) => {
      throw new ServerError(err.message);
    })
    .catch(next);
};
