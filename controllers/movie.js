const Movie = require('../models/movie');
// ошибки для проверки ошибок
const AccessError = require('../utils/errors/AccessError');
const FoundError = require('../utils/errors/FoundError');
const DataError = require('../utils/errors/DataError');
const ServerError = require('../utils/errors/ServerError');
const {
  ERROR_MESSAGE_NOT_FOUND,
  SUCCESSFUL_DELETE_MOVIE,
  ERROR_MESSAGE_ALIEN_MOVIE,
  ERROR_MESSAGE_MOVIE_NOT_FOUND,
  ERROR_MESSAGE_MOVIE_DATA,
  ERROR_MESSAGE_DATA,
} = require('../utils/constants');
// получение карточекreqgweg
module.exports.getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(() => next(new ServerError()));
};
// создать карточку
module.exports.createMovie = (req, res, next) => {
  // console.log(req.body);
  const owner = req.user._id;
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
  // создание карточки и определяет кто пользователь
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
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError(ERROR_MESSAGE_DATA));
      } else {
        next(new ServerError());
      }
      console.log("efrdbsrfgbgfbnr");

    });
};
// удаление карточки
module.exports.deleteMovie = (req, res, next) => {
  // const { movieId } = req.params;
  console.log("delete");
  console.log(req.params.movieId);
  Movie.findById(req.params.movieId)
    .orFail(new Error(ERROR_MESSAGE_NOT_FOUND))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return Promise.reject(new Error(ERROR_MESSAGE_ALIEN_MOVIE));
      }
      return Movie.deleteOne(movie).then(() => {
        res.send({ message: SUCCESSFUL_DELETE_MOVIE });
      });
    })
    .catch((err) => {
      if (err.message === ERROR_MESSAGE_ALIEN_MOVIE) {
        next(new AccessError(ERROR_MESSAGE_ALIEN_MOVIE));
      } else if (err.message === ERROR_MESSAGE_NOT_FOUND) {
        next(new FoundError(ERROR_MESSAGE_MOVIE_NOT_FOUND));
      } else if (err.name === 'CastError') {
        next(new DataError(ERROR_MESSAGE_MOVIE_DATA));
      } else next(new ServerError());
    });
};
