const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(5).required(),
  quantity: Joi.number().min(1).required(),
});

function validateProduct(req, res, next) {
  const { error } = productSchema.validate(req.body);

  if (error) {
    const { type, message } = error.details[0];

    const statusCodes = {
      'any.required': 400,
      'string.min': 422,
      'number.min': 422,
    };
    return next({ status: statusCodes[type], message });
  }

  next();
}

module.exports = validateProduct;
