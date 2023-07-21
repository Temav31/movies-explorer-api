const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const SignInError = require('../utils/errors/SignInError');
// создание модели пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректная почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
// проверка пользователя
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new SignInError('Неправильные данные');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new SignInError('Неправильные данные');
          }
          return user;
        });
    });
};
// экспорт
module.exports = mongoose.model('user', userSchema);
