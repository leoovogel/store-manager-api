const Joi = require('joi');

const saleSchema = Joi.array().items({
  productId: Joi.number().min(1).required(),
  quantity: Joi.number().min(1).required(),
});

function validateSale(req, res, next) {
  const { error } = saleSchema.validate(req.body);

  if (error) {
    const { type, message } = error.details[0];

    const statusCodes = {
      'any.required': 400,
      'number.min': 422,
    };

    return next({ status: statusCodes[type], message: message.replace(/\[\d]./g, '') });
  }

  next();
}

module.exports = validateSale;
