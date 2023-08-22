// монго
const { NODE_ENV, DATABASE } = process.env;
const DATABASE_ADDRESS = NODE_ENV === 'production' ? DATABASE : 'mongodb://localhost:27017/moviesdb';
const pattern = /^(https?:\/\/)+[^\s]*/;
const avatarPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const ERROR_MESSAGE_NOT_FOUND = 'Not Found';
const ERROR_MESSAGE_ALIEN_MOVIE = 'Нельзя удаить чужой фильм';
const ERROR_MESSAGE_MOVIE_NOT_FOUND = 'Пользователь не найден';
const ERROR_MESSAGE_MOVIE_DATA = 'Некоректные данные карточки';
const ERROR_MESSAGE_DATA = 'Некоректные данные';
const ERROR_MESSAGE_USER_DATA = 'Некоректные данные пользователя';
const ERROR_MESSAGE_FOUND_USER = 'Пользователь не найден';
const ERROR_MESSAGE_USER = 'Такого пользователя не существует';
const ERROR_MESSAGE_PAGE = 'Страницы не существует';
const EXIT = 'Выход из аккаунта';
// успешная обработка
const SUCCESSFUL_DELETE_MOVIE = 'Карточка удалена';
// экспорт
module.exports = {
  pattern,
  avatarPattern,
  ERROR_MESSAGE_NOT_FOUND,
  ERROR_MESSAGE_ALIEN_MOVIE,
  ERROR_MESSAGE_MOVIE_NOT_FOUND,
  ERROR_MESSAGE_MOVIE_DATA,
  ERROR_MESSAGE_DATA,
  ERROR_MESSAGE_USER_DATA,
  ERROR_MESSAGE_FOUND_USER,
  ERROR_MESSAGE_USER,
  ERROR_MESSAGE_PAGE,
  SUCCESSFUL_DELETE_MOVIE,
  EXIT,
  DATABASE_ADDRESS,
};
