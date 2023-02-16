import { Request, Response } from 'express';
import { userValidate } from './dto/register.input';
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
import {
  CreateUserType,
  FindUserType,
  LoginUserType,
  RefreshTokenType,
} from '../../../utils/types';
import { Repository } from 'typeorm';
import { myDataSource } from '../../../config/conenctTypeORM';
import redis from '../../../config/connectRedis';

dotenv.config();

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { error } = await userValidate(req.body);

    if (error) {
      throw createError(error.details[0].message);
    }

    const isExits = await UserMongo.findOne({ email });

    if (isExits) {
      return res.json({
        status: 400,
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

    const user = await UserMongo.findOne({ email });

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
    const findAllUser = await UserMongo.find();

    console.log(findAllUser);

    return res.json({
      status: 200,
      data: findAllUser,
    });
  } catch (error) {
    console.log(error);
  }
}

export default class UserService implements IUserService {
  private readonly userReposity: Repository<User>;
  constructor() {
    this.userReposity = myDataSource.getRepository(User);
  }
  register = async (createUserType: CreateUserType) => {
    const existingUser: User = await this.userReposity.findOneBy({
      email: createUserType.email,
    });
    if (existingUser) return { statusCode: 409 };
    const password: string = await hashPassword(createUserType.password);
    const newUser: User = this.userReposity.create({ ...createUserType, password });
    const saveUser: User = await this.userReposity.save(newUser);
    return { statusCode: 200, data: saveUser.id };
  };
  async findUser(findUserType: FindUserType) {
    return this.userReposity.findOneBy(findUserType);
  }
  loginUser = async (loginUserType: LoginUserType) => {
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

    if (!refreshToken)
      return {
        statusCode: 400,
        message: createError.BadRequest(`Refresh token is not correct`).message,
      };

    const userId: string = await verifyRefreshToken(refreshToken);

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
    if (!refreshToken)
      return {
        statusCode: 400,
        message: createError.BadRequest(`Refresh token is not correct`).message,
      };

    const userId: string = await verifyRefreshToken(refreshToken);

    redis.del(userId);
    return {
      statusCode: 200,
      message: 'Logout',
    };
  };
}
