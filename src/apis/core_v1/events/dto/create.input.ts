import Joi from 'joi';
export const createValidate = (data: object) => {
  const voucherSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    description: Joi.string(),
    discount: Joi.number().required(),
    quantity: Joi.number().required(),
    startTimeAt: Joi.string().required(),
    endTimeAt: Joi.string().required(),
    isInactive: Joi.boolean().required(),
    isDelete: Joi.boolean().required(),
  });

  const { error } = voucherSchema.validate(data);
  if (!error) return;
  return error.details[0].message;
};
