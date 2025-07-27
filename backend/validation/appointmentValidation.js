const Joi = require("joi");

// Create Appointment
exports.validateCreateAppointment = (data) => {
  const schema = Joi.object({
    patientId: Joi.string().required().messages({
      "any.required": "Patient ID is required",
      "string.empty": "Patient ID is required",
    }),
    date: Joi.date().iso().required().messages({
      "any.required": "Appointment date is required",
      "date.base": "Invalid date format",
    }),
    reason: Joi.string().min(3).max(255).optional().allow("").messages({
      "string.min": "Reason must be at least 3 characters",
      "string.max": "Reason must be less than 255 characters",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Update Appointment
exports.validateUpdateAppointment = (data) => {
  const schema = Joi.object({
    date: Joi.date().iso().optional().messages({
      "date.base": "Invalid date format",
    }),
    reason: Joi.string().min(3).max(255).optional().allow("").messages({
      "string.min": "Reason must be at least 3 characters",
      "string.max": "Reason must be less than 255 characters",
    }),
    status: Joi.string()
      .valid("scheduled", "completed", "cancelled")
      .optional()
      .messages({
        "any.only": "Status must be one of: scheduled, completed, cancelled",
      }),
  }).unknown(true);

  return schema.validate(data, { abortEarly: false });
};
