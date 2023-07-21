const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
// ошибки для проверки ошибок
const FoundError = require('../utils/errors/FoundError');
const ConflictError = require('../utils/errors/ConflictError');
const DataError = require('../utils/errors/DataError');
const ServerError = require('../utils/errors/ServerError');
// регистрация
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt
    // .hash(String(password), 10)
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        email,
        password: hashedPassword,
      })
        .then(() => {
          res.send({
            data: {
              name,
              email,
            },
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Такого пользователя не существует'));
          } else if (err.name === 'ValidationError') {
            next(new DataError('Переданы некоректные данные'));
          } else {
            next(new ServerError());
          }
        });
    })
    .catch(next);
};
// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jsonWebToken.sign(
        { _id: user._id },
        'SECRET',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ token });
    })
    .catch(next);
};
// получить текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('Not Found'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некоректные данные'));
      } else if (err.message === 'Not Found') {
        next(new FoundError('Пользователь не найден'));
      } else {
        next(new ServerError());
      }
    });
};
// обновление профиля
module.exports.UpdateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('Not Found'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new FoundError('Некоректный идентификатор'));
      } else if (err.name === 'ValidationError') {
        next(new DataError('Переданы некоректные данные'));
      } else if (err.message === 'Not Found') {
        next(new DataError('Пользователь не найден'));
      } else {
        next(new ServerError());
      }
    });
};
