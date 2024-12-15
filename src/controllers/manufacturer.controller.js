const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new manufacturer
const createManufacturer = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Manufacturer name is required' });
    }

    const manufacturer = await prisma.manufacturer.create({
      data: { name }
    });

    res.status(201).json(manufacturer);
  } catch (error) {
    res.status(500).json({ error: 'Error creating manufacturer' });
  }
};

// Get all manufacturers
const getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await prisma.manufacturer.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(manufacturers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching manufacturers' });
  }
};

// Get manufacturer by ID
const getManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id },
      include: {
        products: true
      }
    });

    if (!manufacturer) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }

    res.json(manufacturer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching manufacturer' });
  }
};

// Delete manufacturer
const deleteManufacturer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.manufacturer.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }
    res.status(500).json({ error: 'Error deleting manufacturer' });
  }
};

module.exports = {
  createManufacturer,
  getAllManufacturers,
  getManufacturerById,  
  deleteManufacturer
};
