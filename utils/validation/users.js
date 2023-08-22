const { celebrate, Joi } = require('celebrate');
// проверка создания пользователя
function validationUpdateProfile() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  });
}
// регистрация
function validationCreateUser() {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  });
}
// вход
function validationLogin() {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required(),
    }),
  });
}
module.exports = { validationUpdateProfile, validationCreateUser, validationLogin };
