import Joi from 'joi';
export const logoutValidate = (data: object) => {
  const userSchema = Joi.object({
    refreshToken: Joi.string().required(),
  });

  const { error } = userSchema.validate(data);
  if (!error) return;
  return error.details[0].message;
};
