require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const options = {
  origin: [
    'http://localhost:4000',
    // 'http://my.films.nomoredomainsicu.ru',
    'https://my.films.nomoredomainsicu.ru',
    // 'http://api.my.films.nomoredomainsicu.ru',
    'https://api.my.films.nomoredomainsicu.ru',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const app = express();
// const auth = require('./middlewares/auth');
// const {
//   validationLogin,
//   validationCreateUser,
// } = require('./middlewares/validation/validationUser');

app.use('*', cors(options));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const router = require('./routes/index');

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Подключение к БД настроено');
  })
  .catch(() => {
    console.log('Подключения к БД нет');
  });

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {});
