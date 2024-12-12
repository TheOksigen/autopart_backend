const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../middleware/validation/auth.validation');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;