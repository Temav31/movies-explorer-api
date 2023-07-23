const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const FoundError = require('../utils/errors/FoundError');
// const { pattern } = require('../utils/constant');
// импорт из файла
const user = require('./user');
const movie = require('./movie');
const { createUser, login } = require('../controllers/user');
const auth = require('../middlwares/auth');
// регистрация
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
// аутенфикация
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.use(auth);
// обозначение роутов
router.use('/users', user);
router.use('/movies', movie);
router.use(errors());
// обработка другого пути
router.use('/*', (req, res, next) => {
  next(new FoundError('Страницы не существует'));
});
// экспорт
module.exports = router;
