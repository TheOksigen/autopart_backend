const express = require('express');
const router = express.Router();

const cartRoutes = require('./cart.r.js');
const authRouter = require('./auth.r.js');
const productRouter = require('./product.r.js');
const manufacturerRouter = require('./manufacturer.r.js');

router.use('/auth', authRouter);
router.use('/cart', cartRoutes);
router.use('/products', productRouter);
router.use('/manufacturers', manufacturerRouter);

module.exports = router;