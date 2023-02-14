import Joi from 'joi';

export const userValidate = (data) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(32).required(),
  });

  return userSchema.validate(data);
};
