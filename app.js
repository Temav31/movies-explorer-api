const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorHandler = require('./middlwares/error');
const { requestLogger, errorLogger } = require('./middlwares/logger');
// константы
const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: [
    'https://work.tema.nomoredomains.work',
    'http://work.tema.nomoredomains.work',
    'https://localhost:3000',
    'http://localhost:3000',
  ],
}));
const { PORT = 3000 } = process.env;
// // подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
// роуты
app.use(cookieParser());
app.use(requestLogger);
// обработка запросов
app.use(router);
// логер
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
// порт
app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
