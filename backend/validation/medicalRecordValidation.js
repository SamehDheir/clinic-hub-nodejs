const Joi = require("joi");

const validateCreateMedicalRecord = (data) => {
  const schema = Joi.object({
    patientId: Joi.string().required(),
    clinicId: Joi.string().required(),
    bloodType: Joi.string()
      .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown")
      .optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    chronicDiseases: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateAddVisit = (data) => {
  const schema = Joi.object({
    department: Joi.string().required(),
    notes: Joi.string().allow("", null).optional(),
    diagnosis: Joi.string().required(),
    prescription: Joi.string().allow("", null).optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateCreateMedicalRecord,
  validateAddVisit,
};
