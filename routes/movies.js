const movies = require('express').Router(); // создали роутер
const {
  createMovie,
  deleteMovie,
  getAllMovies,
} = require('../controllers/movies');
const {
  validationCreateMovie,
  validationMovieID,
} = require('../middlewares/validation/validationMovie');

// возвращает все карточки
movies.get('/', getAllMovies);

// создаёт карточку
movies.post('/', validationCreateMovie, createMovie);

// удаляет карточку по _id
movies.delete('/:movieId', validationMovieID, deleteMovie);

module.exports = { movies }; // экспортировали роутер
