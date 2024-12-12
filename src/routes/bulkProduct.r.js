const express = require('express');
const router = express.Router();
const { createBulkProducts } = require('../controllers/bulkProduct.controller');

router.post('/bulk', createBulkProducts);

module.exports = router;
