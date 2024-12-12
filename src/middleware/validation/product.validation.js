const { z } = require('zod');
const validate = require('../validate');

const productSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters')
        .trim()
        .optional(),
    oemNumber: z.string()
        .min(3, 'OEM number must be at least 3 characters')
        .max(50, 'OEM number must be less than 50 characters')
        .regex(/^[A-Z0-9-]+$/, 'OEM number must contain only uppercase letters, numbers, and hyphens')
        .trim(),
    price: z.number()
        .positive('Price must be positive')
        .min(0.01, 'Price must be at least 0.01'),
    priceWithKDV: z.number()
        .positive('Price with KDV must be positive')
        .min(0.01, 'Price with KDV must be at least 0.01'),
    stockQuantity: z.number()
        .int('Stock quantity must be an integer')
        .min(0, 'Stock quantity cannot be negative'),
    manufacturerId: z.string()
        .uuid('Invalid manufacturer ID')
});

const productQuerySchema = z.object({
    page: z.string()
        .regex(/^\d+$/, 'Page must be a number')
        .transform(Number)
        .optional(),
    limit: z.string()
        .regex(/^\d+$/, 'Limit must be a number')
        .transform(Number)
        .optional(),
    search: z.string()
        .min(1, 'Search term must not be empty')
        .optional(),
    manufacturerId: z.string()
        .uuid('Invalid manufacturer ID')
        .optional(),
    minPrice: z.string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
        .transform(Number)
        .optional(),
    maxPrice: z.string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
        .transform(Number)
        .optional(),
    inStock: z.enum(['true', 'false'])
        .transform(val => val === 'true')
        .optional()
});

const idSchema = z.object({
    id: z.string().uuid('Invalid product ID')
});

module.exports = {
    createProductValidation: validate(productSchema),
    updateProductValidation: validate(z.object({
        ...productSchema.partial().shape,
        ...idSchema.shape
    })),
    productIdValidation: validate(idSchema),
    productQueryValidation: validate(productQuerySchema)
};
