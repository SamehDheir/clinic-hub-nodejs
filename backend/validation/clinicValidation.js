const Joi = require("joi");

const createClinicSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().max(255).optional(),
  phone: Joi.string()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .optional(),
  email: Joi.string().email().optional(),
  subscriptionPlan: Joi.string()
    .valid("basic", "pro", "enterprise")
    .default("basic"),
});

const updateClinicSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  address: Joi.string().max(255).optional(),
  phone: Joi.string()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .optional(),
  email: Joi.string().email().optional(),
  subscriptionPlan: Joi.string().valid("basic", "pro", "enterprise").optional(),
});

function validateCreateClinic(data) {
  return createClinicSchema.validate(data, { abortEarly: false });
}

function validateUpdateClinic(data) {
  return updateClinicSchema.validate(data, { abortEarly: false });
}

module.exports = { validateCreateClinic, validateUpdateClinic };
