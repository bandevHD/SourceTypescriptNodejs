import Joi from 'joi';

export const userLoginValidate = (data) => {
  const userSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(32).required(),
  });

  return userSchema.validate(data);
};
