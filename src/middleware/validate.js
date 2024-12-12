const { z } = require('zod');

const validate = (schema) => async (req, res, next) => {
    try {
        if (req.params && Object.keys(req.params).length > 0) {
            await schema.partial().parseAsync(req.params);
        }
        if (req.body && Object.keys(req.body).length > 0) {
            await schema.partial().parseAsync(req.body);
        }
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        next(error);
    }
};

module.exports = validate;
