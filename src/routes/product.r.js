const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth.middleware');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');


router.get('/', auth, getAllProducts);
router.get('/:id', auth, getProductById);
router.post('/', auth, isAdmin, createProduct);
router.put('/:id', auth, isAdmin, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;