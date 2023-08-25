require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('cors');
const limiter = require('./middlewares/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_URL_DEV } = require('./utils/config');

const { PORT = 4000 } = process.env;
const { DB_URL = DB_URL_DEV } = process.env;
const errorHandler = require('./middlewares/errorHandler');

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
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
