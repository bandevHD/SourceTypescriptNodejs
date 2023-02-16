import Joi from 'joi';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export const userValidate = (data) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(32).required(),
  });
  return userSchema.validate(data);
};

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MaxLength(32)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(32)
  lastName: string;

  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}
