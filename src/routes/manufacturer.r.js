const express = require('express');
const router = express.Router();
const { 
  createManufacturer,
  getAllManufacturers,
  getManufacturerById,  
  deleteManufacturer
} = require('../controllers/manufacturer.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

router.get('/', auth, getAllManufacturers);
router.get('/:id',auth, getManufacturerById);

router.post('/', auth, isAdmin, createManufacturer);
router.delete('/:id', auth, isAdmin, deleteManufacturer);

module.exports = router;
