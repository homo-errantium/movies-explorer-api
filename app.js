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
    // 'http://my.place.nomoreparties.co',
    'https://my.place.nomoreparties.co',
    // 'http://api.my.place.nomoreparties.co',
    'https://api.my.place.nomoreparties.co',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const app = express();
const auth = require('./middlewares/auth');
const {
  validationLogin,
  validationCreateUser,
} = require('./middlewares/validation/validationUser');

app.use('*', cors(options));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const { users } = require('./routes/users');
const { movies } = require('./routes/movies');
const { wrongRouter } = require('./routes/wrongRoutes');
const { createUser, login } = require('./controllers/users');

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

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use('/users', auth, users);
app.use('/movies', auth, movies);
app.use('*', wrongRouter);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`port is ${PORT}`);
});
