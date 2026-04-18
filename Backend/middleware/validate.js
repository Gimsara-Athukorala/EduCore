/**
 * Generic Joi Validation Middleware
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message.replace(/['"]/g, '')
    }));
    
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }
  
  next();
};

module.exports = validate;
