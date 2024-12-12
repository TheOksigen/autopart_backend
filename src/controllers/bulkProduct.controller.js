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
                const existingProduct = await prisma.product.findUnique({
                    where: { OemNo: product.OemNo }
                });

                if (existingProduct) {
                    errors.push({
                        OemNo: product.OemNo,
                        error: 'Product with this OEM number already exists'
                    });
                    continue;
                }

                const createdProduct = await prisma.product.create({
                    data: {
                        OemNo: String(product.OemNo),
                        codeOfProduct: String(product.codeOfProduct),
                        image: String(product.image),
                        name: String(product.name || 'no name'),
                        price: Number(product.price),
                        priceWithKDV: Number(product.priceWithKDV),
                        discount: Number(product.discount || 0),
                        iskonto: product.iskonto ? String(product.iskonto) : null,
                        manufacturer: product.manufacturer ? String(product.manufacturer) : '',
                        stock: Boolean(product.stock)
                    }
                });

                results.push(createdProduct);
            } catch (error) {
                console.error('Error creating product:', error);
                errors.push({
                    OemNo: product.OemNo,
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
