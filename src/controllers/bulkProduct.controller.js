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
                if (!product.OemNo || !product.codeOfProduct || !product.image ||
                    !product.priceWithOutKDV || !product.priceWithKDV || !product.codeOfProduct) {
                    errors.push({
                        ID: product.codeOfProduct || 'unknown',
                        error: 'Missing required fields'
                    });
                    continue;
                }

                let manufacturerId = null;
                if (product.manufacturer) {
                    try {
                        let manufacturer = await prisma.manufacturer.findFirst({
                            where: {
                                name: {
                                    equals: product.manufacturer,
                                    mode: 'insensitive'
                                }
                            }
                        });

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

                const createdProduct = await prisma.product.create({
                    data: {
                        OemNo: String(product.OemNo.split("\n")) || 'unknown',
                        codeOfProduct: String(product.codeOfProduct),
                        image: String(product.image),
                        name: String(product.name || 'no name'),
                        priceWithOutKDV: Number(product.priceWithOutKDV.replace(/[^\d.]/g, "")),
                        priceWithKDV: Number(product.priceWithKDV.replace(/[^\d.]/g, "")),
                        discouisnt: Number(product.discouisnt || 0),
                        iskonto: String(product.iskonto.split("\n")),
                        stock: product.stock.includes('var') ? true : false,
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
