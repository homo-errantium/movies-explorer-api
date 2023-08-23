const router = require('express').Router();

const auth = require('../middlewares/auth');
const { users } = require('./users');
const { movies } = require('./movies');
const { wrongRouter } = require('./wrongRoutes');
const { createUser, login } = require('../controllers/users');
const {
  validationLogin,
  validationCreateUser,
} = require('../middlewares/validation/validationUser');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use('/users', auth, users);
router.use('/movies', auth, movies);
router.use('*', wrongRouter);

module.exports = router;
