import { NextFunction, Request, Response } from 'express';
import { resgiterValidate } from './dto/register.input';
import { userLoginValidate } from './dto/login.input';
import createError from 'http-errors';
import { User } from '../../../model/typeorm';
import UserMongo from '../../../model/mongodb/user';
import {
  signJwt,
  signJwtRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from '../../modules/jwtService';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import IUserService from '../../../utils/interface';
import { CreateUserType, LoginUserType, RefreshTokenType } from '../../../utils/types';
import { Repository } from 'typeorm';
import { myDataSource } from '../../../config/conenctTypeORM';
import redis from '../../../config/connectRedis';
import { refreshValidate } from './dto/refreshToken.input';
import { logoutValidate } from './dto/logout.input';

dotenv.config();

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const isValid = resgiterValidate(req.body);

    if (isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: isValid ? isValid : '',
      });
    }

    const isUserExits = await UserMongo.findOne({ email });

    if (isUserExits) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: createError.Conflict(`${email} is ready has been register`).message,
      });
    }
    const user = new UserMongo({
      firstName,
      lastName,
      email,
      password,
    });

    const saveUser = await user.save();

    return res.json({
      status: StatusCodes.OK,
      data: saveUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const isValid: string = userLoginValidate(req.body);

    if (isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: isValid ? isValid : '',
      });
    }

    const user = await UserMongo.findOne({ email });

    if (!user) {
      return res.json({
        status: StatusCodes.BAD_REQUEST,
        message: createError.NotFound(`User not registed`).message,
      });
    }

    const isValidUser: boolean = await bcrypt.compare(password, user.password);

    if (!isValidUser) {
      return res.json({
        status: StatusCodes.BAD_REQUEST,
        message: createError.Unauthorized(`Password is not correct`).message,
      });
    }

    const accessToken: string = await signJwt(user._id.toString());
    const refreshToken: string = await signJwtRefreshToken(user._id.toString());
    return res.json({
      status: StatusCodes.OK,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    const isValid: string = refreshValidate(req.body);

    if (isValid)
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: isValid ? isValid : '',
      });

    const { userId } = await verifyRefreshToken(refreshToken);

    const accessToken: string = await signJwt(userId.toString());
    const refreshTokenResult: string = await signJwtRefreshToken(userId.toString());

    redis.del(userId);
    await redis.set(userId, refreshTokenResult, {
      EX: 365 * 24 * 60 * 60,
      NX: true,
    });
    return res.json({
      status: 200,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    const isValid: string = logoutValidate(req.body);

    if (isValid)
      return res.status(422).json({
        statusCode: 422,
        message: isValid ? isValid : '',
      });

    const { userId } = await verifyRefreshToken(refreshToken);

    redis.del(userId);

    return res.json({
      status: 200,
      message: 'Logout',
    });
  } catch (error) {
    next(error);
  }
}

export async function getList(req: Request, res: Response, next: NextFunction) {
  try {
    const findAllUser = await UserMongo.find();

    return res.json({
      status: 200,
      data: findAllUser,
    });
  } catch (error) {
    next(error);
  }
}

export default class UserService implements IUserService {
  private readonly userReposity: Repository<User>;
  constructor() {
    this.userReposity = myDataSource.getRepository(User);
  }
  register = async (createUserType: CreateUserType) => {
    const isValid = resgiterValidate(createUserType);

    if (isValid) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: isValid ? isValid : '',
      };
    }
    const existingUser: User = await this.userReposity.findOneBy({
      email: createUserType.email,
    });
    if (existingUser) return { statusCode: StatusCodes.CONFLICT };
    const password: string = await hashPassword(createUserType.password);
    const newUser: User = this.userReposity.create({ ...createUserType, password });
    const saveUser: User = await this.userReposity.save(newUser);
    return { statusCode: StatusCodes.OK, data: saveUser.id };
  };

  loginUser = async (loginUserType: LoginUserType) => {
    const isValid: string = userLoginValidate(loginUserType);

    if (isValid) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: isValid ? isValid : '',
      };
    }
    const existingUser: User = await this.userReposity.findOneBy({
      email: loginUserType.email,
    });
    if (!existingUser) return { statusCode: 404 };
    const isValidUser: boolean = await bcrypt.compare(
      loginUserType.password,
      existingUser.password,
    );

    if (!isValidUser) {
      return {
        statusCode: 400,
        message: createError.Unauthorized(`Password is not correct`).message,
      };
    }
    const accessToken: string = await signJwt(existingUser.id);
    const refreshToken: string = await signJwtRefreshToken(existingUser.id);

    return {
      statusCode: 200,
      data: {
        accessToken,
        refreshToken,
      },
    };
  };

  refreshToken = async (refreshTokenType: RefreshTokenType) => {
    const { refreshToken } = refreshTokenType;

    const isValid: string = refreshValidate(refreshTokenType);

    if (isValid)
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: isValid ? isValid : '',
      };
    const { userId } = await verifyRefreshToken(refreshToken);

    const accessToken: string = await signJwt(userId);
    const refreshTokenResult: string = await signJwtRefreshToken(userId);

    redis.del(userId);
    await redis.set(userId, refreshTokenResult, {
      EX: 365 * 24 * 60 * 60,
      NX: true,
    });
    return {
      statusCode: 200,
      data: {
        accessToken,
        refreshTokenResult,
      },
    };
  };
  logout = async (refreshTokenType: RefreshTokenType) => {
    const { refreshToken } = refreshTokenType;
    const isValid: string = logoutValidate(refreshTokenType);

    if (isValid)
      return {
        statusCode: 422,
        message: isValid ? isValid : '',
      };

    const { userId } = await verifyRefreshToken(refreshToken);

    redis.del(userId);
    return {
      statusCode: 200,
      message: 'Logout',
    };
  };

  findUser = async () => {
    const [result, count] = await this.userReposity.findAndCount();
    return {
      statusCode: StatusCodes.OK,
      data: {
        count,
        result,
      },
    };
  };
}
