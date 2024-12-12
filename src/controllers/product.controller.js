const { PrismaClient } = require('@prisma/client');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '',
            manufacturer = '',
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

        if (manufacturer) {
            where.AND.push({ 
                manufacturer: { contains: manufacturer, mode: 'insensitive' }
            });
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
            where: { id: req.params.id }
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
            price,
            priceWithKDV,
            discount,
            iskonto,
            manufacturer,
            stock
        } = req.body;       
            
        console.log(req.body)

        if (!image) {
            return res.status(400).json({ message: 'Image is required' });
        }

        try {
            const imageUrl = await uploadToCloudinary(image);

            const existingProduct = await prisma.product.findUnique({
                where: { OemNo }
            });

            if (existingProduct) {
                await deleteFromCloudinary(imageUrl);
                return res.status(400).json({ message: 'Product with this OEM number already exists' });
            }

            const product = await prisma.product.create({
                data: {
                    OemNo: String(OemNo),
                    codeOfProduct: String(codeOfProduct),
                    image: imageUrl,
                    name: String(name || 'no name'),
                    price: Number(price),
                    priceWithKDV: Number(priceWithKDV),
                    discount: Number(discount || 0),
                    iskonto: iskonto ? String(iskonto) : null,
                    manufacturer: manufacturer ? String(manufacturer) : '',
                    stock: Boolean(stock)
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
            price,
            priceWithKDV,
            discount,
            iskonto,
            manufacturer,
            stock
        } = req.body;
        
        const existingProduct = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
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
                ...(price && { price: Number(price) }),
                ...(priceWithKDV && { priceWithKDV: Number(priceWithKDV) }),
                ...(discount && { discount: Number(discount) }),
                ...(iskonto && { iskonto: String(iskonto) }),
                ...(manufacturer && { manufacturer: String(manufacturer) }),
                ...(stock !== undefined && { stock: Boolean(stock) })
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
