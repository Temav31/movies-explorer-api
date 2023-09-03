const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
// ошибки для проверки ошибок
const FoundError = require('../utils/errors/FoundError');
const ConflictError = require('../utils/errors/ConflictError');
const DataError = require('../utils/errors/DataError');
const ServerError = require('../utils/errors/ServerError');
// токены
const { NODE_ENV, JWT_SECRET } = process.env;
// текста ошибок
const {
  ERROR_MESSAGE_NOT_FOUND,
  ERROR_MESSAGE_USER_DATA,
  ERROR_MESSAGE_DATA,
  ERROR_MESSAGE_FOUND_USER,
  ERROR_MESSAGE_USER,
  EXIT,
} = require('../utils/constants');
// регистрация
module.exports.createUser = (req, res, next) => {
  console.log(req.body);
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
          console.log("регистрация");
          res.send({
            data: {
              name,
              email,
            },
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(ERROR_MESSAGE_USER));
          } else if (err.name === 'ValidationError') {
            next(new DataError(ERROR_MESSAGE_DATA));
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
        // 'SECRET',
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
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
// выход из аккаунта
module.exports.logout = (req, res, next) => {
  res
    .clearCookie('authToken')
    .send({
      message: EXIT,
    });
  return next();
};
// получить текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error(ERROR_MESSAGE_NOT_FOUND))
    .then((user) => {
      res.send(user);
      // res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError(ERROR_MESSAGE_DATA));
      } else if (err.message === ERROR_MESSAGE_NOT_FOUND) {
        next(new FoundError(ERROR_MESSAGE_FOUND_USER));
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
    .orFail(new Error(ERROR_MESSAGE_NOT_FOUND))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err)
      if (err.name === 'CastError') {
        next(new FoundError(ERROR_MESSAGE_USER_DATA));
      } else if (err.name === 'ValidationError') {
        next(new DataError(ERROR_MESSAGE_DATA));
      } else if (err.message === ERROR_MESSAGE_NOT_FOUND) {
        next(new DataError(ERROR_MESSAGE_FOUND_USER));
      } else if (err.code === 11000) {
        console.log("hi")
        next(new ConflictError(ERROR_MESSAGE_USER));
      } else {
        next(new ServerError());
      }
    });
};
