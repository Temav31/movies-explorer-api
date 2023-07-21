const Movie = require('../models/movie');
// ошибки для проверки ошибок
const AccessError = require('../utils/errors/AccessError');
const FoundError = require('../utils/errors/FoundError');
const DataError = require('../utils/errors/DataError');
const ServerError = require('../utils/errors/ServerError');
// получение карточекreqgweg
module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => next(new ServerError()));
};
// создать карточку
module.exports.createMovie = (req, res, next) => {
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
    nameRU,
    nameEN,
    owner,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Некоректные данные'));
      } else {
        next(new ServerError());
      }
    });
};
// удаление карточки
module.exports.deleteMovie = (req, res, next) => {
  // const { movieId } = req.params;
  Movie.findById(req.params.movieId)
    .orFail(new Error('Not Found'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new Error('Нельзя удалить чужую карточку'));
      }
      return Movie.deleteOne(card).then(() => {
        res.send({ message: 'Карточка удалена' });
      });
    })
    .catch((err) => {
      if (err.message === 'Нельзя удалить чужую карточку') {
        next(new AccessError('Нельзя удалить чужую карточку'));
      } else if (err.message === 'Not Found') {
        next(new FoundError('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new DataError('Некоректные данные карточки'));
      } else next(new ServerError());
    });
};
