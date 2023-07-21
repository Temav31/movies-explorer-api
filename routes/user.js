const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const { pattern } = require('../utils/constants');
//  импорт обработчиков
const {
  UpdateProfile,
  getCurrentUser,
} = require('../controllers/user');
// обработка путей
router.get('/me', getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  UpdateProfile,
);
// экспорт роута
module.exports = router;
