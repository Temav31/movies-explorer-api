const router = require('express').Router();
// валидация
const { validationUpdateProfile } = require('../utils/validation/users');
//  импорт обработчиков
const {
  UpdateProfile,
  getCurrentUser,
} = require('../controllers/user');
// обработка путей
router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateProfile(), UpdateProfile);
// экспорт роута
module.exports = router;
