const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBulkProducts = async (req, res) => {
    try {
        const products = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ message: 'Request body must be an array of products' });
        }

        const results = [];
        const errors = [];

        for (const product of products) {
            try {
                // Validate required fields
                if (!product.OemNo || !product.codeOfProduct || !product.image || 
                    !product.priceWithOutKDV || !product.priceWithKDV) {
                    errors.push({
                        OemNo: product.OemNo || 'unknown',
                        error: 'Missing required fields'
                    });
                    continue;
                }

                // Handle manufacturer
                let manufacturerId = null;
                if (product.manufacturer) {
                    try {
                        // Try to find existing manufacturer by name
                        let manufacturer = await prisma.manufacturer.findFirst({
                            where: { 
                                name: {
                                    equals: product.manufacturer,
                                    mode: 'insensitive'
                                }
                            }
                        });

                        // If manufacturer doesn't exist, create it
                        if (!manufacturer) {
                            manufacturer = await prisma.manufacturer.create({
                                data: {
                                    name: product.manufacturer
                                }
                            });
                        }
                        manufacturerId = manufacturer.id;
                    } catch (error) {
                        console.error('Manufacturer processing error:', error);
                        errors.push({
                            OemNo: product.OemNo,
                            error: 'Error processing manufacturer'
                        });
                        continue;
                    }
                }

                // Create product with validated data
                const createdProduct = await prisma.product.create({
                    data: {
                        OemNo: String(product.OemNo),
                        codeOfProduct: String(product.codeOfProduct),
                        image: String(product.image),
                        name: String(product.name || 'no name'),
                        priceWithOutKDV: Number(product.priceWithOutKDV),
                        priceWithKDV: Number(product.priceWithKDV),
                        discouisnt: Number(product.discouisnt || 0),
                        iskonto: product.iskonto ? String(product.iskonto) : null,
                        stock: product.stock === false ? false : true,
                        manufacturerId: manufacturerId,
                    },
                    include: {
                        Manufacturer: true
                    }
                });

                results.push(createdProduct);
            } catch (error) {
                console.error('Error creating product:', error);
                errors.push({
                    OemNo: product.OemNo || 'unknown',
                    error: error.message
                });
            }
        }

        res.status(201).json({
            message: 'Bulk product creation completed',
            totalProcessed: products.length,
            successCount: results.length,
            errorCount: errors.length,
            successfulProducts: results,
            errors: errors
        });
    } catch (error) {
        console.error('Bulk operation error:', error);
        res.status(500).json({ message: 'Error processing bulk product creation', error: error.message });
    }
};

module.exports = {
    createBulkProducts
};
