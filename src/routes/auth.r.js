const express = require('express');
const router = express.Router();
const { register, login, verify } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../middleware/validation/auth.validation');
const { auth, isAdmin } = require('../middleware/auth.middleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/verify', auth, isAdmin, verify)

module.exports = router;