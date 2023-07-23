const { celebrate, Joi } = require('celebrate');
const { pattern } = require('../constants');
// создание карточки фильма
function validationMovieCreate() {
  return celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(pattern),
      trailerLink: Joi.string().required().pattern(pattern),
      thumbnail: Joi.string().required().pattern(pattern),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  });
}
// удаление фильма
function validationMovieDelete() {
  return celebrate({
    body: Joi.object().keys({
      movieId: Joi.string().length(24).required().hex(),
    }),
  });
}
//
module.exports = { validationMovieCreate, validationMovieDelete };
