const Joi = require("joi");

exports.validateCreateInvoice = (data) => {
  const schema = Joi.object({
    patientId: Joi.string().length(24).required(),
    doctorId: Joi.string().length(24).required(),
    paymentMethod: Joi.string().valid("cash", "card", "online").required(),
    items: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
          unitPrice: Joi.number().min(0).required(),
        })
      )
      .min(1)
      .required(),
  });

  return schema.validate(data, { abortEarly: false });
};
