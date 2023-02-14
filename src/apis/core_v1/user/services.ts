import { Request, Response } from 'express';
import { userValidate } from './dto/register.input';
import { userLoginValidate } from './dto/login.input';
import createError from 'http-errors';
import User from '../../../model/mongodb/user';
import { signJwt, signJwtRefreshToken } from '../../modules/jwtService';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { error } = await userValidate(req.body);

    if (error) {
      throw createError(error.details[0].message);
    }

    const isExits = await User.findOne({ email });

    if (isExits) {
      return res.json({
        status: 400,
        message: createError.Conflict(`${email} is ready has been register`).message,
      });
    }
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    const saveUser = await user.save();

    return res.json({
      status: 200,
      data: saveUser,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const { error } = userLoginValidate(req.body);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 404,
        message: createError(error).message,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        status: 404,
        message: createError.NotFound(`User not registed`).message,
      });
    }

    const isValidUser: boolean = await bcrypt.compare(password, user.password);

    if (!isValidUser) {
      return res.json({
        status: 400,
        message: createError.Unauthorized(`Password is not correct`).message,
      });
    }

    const accessToken: string = await signJwt(user._id.toString());
    const refreshToken: string = await signJwtRefreshToken(user._id.toString());
    return res.json({
      status: 200,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getList(req: Request, res: Response) {
  try {
    const findAllUser = await User.find();

    console.log(findAllUser);

    return res.json({
      status: 200,
      data: findAllUser,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function registerTypeORM(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { error } = await userValidate(req.body);

    if (error) {
      throw createError(error.details[0].message);
    }

    const isExits = await User.findOne({ email });

    if (isExits) {
      return res.json({
        status: 400,
        message: createError.Conflict(`${email} is ready has been register`).message,
      });
    }
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    const saveUser = await user.save();

    return res.json({
      status: 200,
      data: saveUser,
    });
  } catch (error) {
    console.log(error);
  }
}

// class UserService {
//   // constructor() {}
//   userRegister = (req: Request, res: Response) => {
//     try {
//       console.log(req.body);
//       return 'Ok';
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }

// export default UserService;
