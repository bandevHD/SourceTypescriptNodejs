import Joi from 'joi';

export const resgiterValidate = (data: object) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(32).required(),
  });
  const { error } = userSchema.validate(data);
  if (!error) return;
  return error.details[0].message;
};
