/*
  Rutas de Usuarios / Auth
  host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldsValidate } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/token-validator');

router.post('/new', 
  [ // Middlewares
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'The email is required').isEmail(),
    check('password', 'The password must be 6 characters').isLength({min: 6}),
    fieldsValidate
  ], createUser);

router.post('/', [
  check('email', 'The email is required').isEmail(),
  check('password', 'The password must be 6 length').isLength({min:6}),
  fieldsValidate
], loginUser);

router.get('/renew', validateJWT, renewToken);

module.exports = router;