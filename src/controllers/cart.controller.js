const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getCart = async (req, res) => {
    try {
        const cart = await prisma.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: {
                    include: {
                        manufacturer: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        const total = cart.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        const totalWithKDV = cart.reduce((sum, item) => {
            return sum + (item.product.priceWithKDV * item.quantity);
        }, 0);

        res.json({
            items: cart,
            total,
            totalWithKDV
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Check if product exists and is in stock
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.stock) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        // Check if item already exists in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: req.user.id,
                    productId
                }
            }
        });

        let cartItem;

        if (existingItem) {
            // Update quantity if item exists
            cartItem = await prisma.cartItem.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity + quantity
                },
                include: {
                    product: true
                }
            });
        } else {
            // Create new cart item if it doesn't exist
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: req.user.id,
                    productId,
                    quantity
                },
                include: {
                    product: true
                }
            });
        }

        res.json(cartItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const updated = await prisma.cartItem.update({
            where: { id },
            data: { quantity },
            include: {
                product: true
            }
        });

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await prisma.cartItem.delete({
            where: { id }
        });

        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const clearCart = async (req, res) => {
    try {
        await prisma.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        });

        res.json({ message: 'Cart cleared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
