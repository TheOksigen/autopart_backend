const { PrismaClient } = require('@prisma/client');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '',
            manufacturerId = '',
            inStock
        } = req.query;

        const skip = (page - 1) * Number(limit);
        
        const where = {
            AND: [
                {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { OemNo: { contains: search, mode: 'insensitive' } },
                        { codeOfProduct: { contains: search, mode: 'insensitive' } }
                    ]
                }
            ]
        };

        if (manufacturerId) {
            where.AND.push({ manufacturerId });
        }

        if (inStock !== undefined) {
            where.AND.push({ stock: inStock === 'true' });
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                skip,
                take: Number(limit),
                where,
                orderBy: {
                    name: 'asc'
                },
                include: {
                    Manufacturer: true
                }
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            products,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: {
                Manufacturer: true
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            OemNo,
            codeOfProduct,
            image,
            name,
            priceWithOutKDV,
            priceWithKDV,
            discouisnt,
            iskonto,
            manufacturerId,
            stock
        } = req.body;       

        if (!OemNo || !codeOfProduct || !image || !priceWithOutKDV || !priceWithKDV) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        try {
            const imageUrl = await uploadToCloudinary(image);

            // Validate manufacturer if provided
            if (manufacturerId) {
                const manufacturer = await prisma.manufacturer.findUnique({
                    where: { id: manufacturerId }
                });
                if (!manufacturer) {
                    await deleteFromCloudinary(imageUrl);
                    return res.status(400).json({ message: 'Invalid manufacturer ID' });
                }
            }

            const product = await prisma.product.create({
                data: {
                    OemNo: String(OemNo),
                    codeOfProduct: String(codeOfProduct),
                    image: imageUrl,
                    name: String(name || 'no name'),
                    priceWithOutKDV: Number(priceWithOutKDV),
                    priceWithKDV: Number(priceWithKDV),
                    discouisnt: Number(discouisnt || 0),
                    iskonto: iskonto ? String(iskonto) : null,
                    manufacturerId,
                    stock: stock === false ? false : true
                },
                include: {
                    Manufacturer: true
                }
            });

            res.status(201).json(product);
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            res.status(500).json({ message: 'Error uploading image' });
        }
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            OemNo,
            codeOfProduct,
            image,
            name,
            priceWithOutKDV,
            priceWithKDV,
            discouisnt,
            iskonto,
            manufacturerId,
            stock
        } = req.body;
        
        const existingProduct = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validate manufacturer if provided
        if (manufacturerId) {
            const manufacturer = await prisma.manufacturer.findUnique({
                where: { id: manufacturerId }
            });
            if (!manufacturer) {
                return res.status(400).json({ message: 'Invalid manufacturer ID' });
            }
        }

        let imageUrl;
        if (image) {
            imageUrl = await uploadToCloudinary(image);
            if (existingProduct.image) {
                await deleteFromCloudinary(existingProduct.image);
            }
        }

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                ...(OemNo && { OemNo: String(OemNo) }),
                ...(codeOfProduct && { codeOfProduct: String(codeOfProduct) }),
                ...(imageUrl && { image: imageUrl }),
                ...(name && { name: String(name) }),
                ...(priceWithOutKDV && { priceWithOutKDV: Number(priceWithOutKDV) }),
                ...(priceWithKDV && { priceWithKDV: Number(priceWithKDV) }),
                ...(discouisnt && { discouisnt: Number(discouisnt) }),
                ...(iskonto && { iskonto: String(iskonto) }),
                ...(manufacturerId && { manufacturerId }),
                ...(stock !== undefined && { stock: Boolean(stock) })
            },
            include: {
                Manufacturer: true
            }
        });

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.image) {
            await deleteFromCloudinary(product.image);
        }

        await prisma.product.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
