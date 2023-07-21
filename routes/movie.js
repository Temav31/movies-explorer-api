const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { pattern } = require('../utils/constants');
//  импорт обработчиков
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');
// обработка путей
// получение карточек
router.get('/', getMovie);
// создание карточки
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(pattern).required(),
    }),
  }),
  createMovie,
);
// удаление карточек
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).required().hex(),
    }),
  }),
  deleteMovie,
);
