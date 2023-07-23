const router = require('express').Router();
const { errors } = require('celebrate');
const FoundError = require('../utils/errors/FoundError');
const { validationCreateUser, validationLogin } = require('../utils/validation/users');
// const { pattern } = require('../utils/constant');
// текста ошибок
const { ERROR_MESSAGE_PAGE } = require('../utils/constants');
// импорт из файла
const user = require('./user');
const movie = require('./movie');
const { createUser, login } = require('../controllers/user');
const auth = require('../middlwares/auth');
// регистрация
router.post('/signup', validationCreateUser(), createUser);
// аутенфикация
router.post('/signin', validationLogin(), login);
router.use(auth);
// обозначение роутов
router.use('/users', user);
router.use('/movies', movie);
router.use(errors());
// обработка другого пути
router.use('/*', (req, res, next) => {
  next(new FoundError(ERROR_MESSAGE_PAGE));
});
// экспорт
module.exports = router;
