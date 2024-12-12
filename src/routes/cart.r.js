const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cart.controller.js');


router.use(auth);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartItem);
router.delete('/item/:id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
