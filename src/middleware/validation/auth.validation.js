const { z } = require('zod');
const validate = require('../validate');

const registerSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(25, 'Name must be less than 50 characters')
        .trim(),
    email: z.string()
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
});

const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: z.string()
        .min(1, 'Password is required')
});

module.exports = {
    registerValidation: validate(registerSchema),
    loginValidation: validate(loginSchema)
};
