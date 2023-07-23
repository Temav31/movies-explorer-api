const router = require('express').Router();
const { validationMovieCreate, validationMovieDelete } = require('../utils/validation/movie');
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
router.post('/', validationMovieCreate(), createMovie);
// удаление карточек
router.delete('/:movieId', validationMovieDelete(), deleteMovie);
module.exports = router;
