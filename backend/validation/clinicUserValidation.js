const Joi = require("joi");

const addClinicUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(
      "super-admin",
      "admin",
      "doctor",
      "receptionist",
      "patient",
      "nurse",
      "lab",
      "pharmacy"
    )
    .required(),
});

function validateAddClinicUser(data) {
  return addClinicUserSchema.validate(data, { abortEarly: false });
}

module.exports = { validateAddClinicUser };
