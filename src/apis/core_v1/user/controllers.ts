import { register, login, getList, refreshToken, logout } from './services';
import UserService from './services';
import { NextFunction, Request, Response } from 'express';
import IUserService from '../../../utils/interface';
import * as _ from 'lodash';

export const registerController = async (req: Request, res: Response, next: NextFunction) =>
  await register(req, res, next);

export const loginController = async (req: Request, res: Response, next: NextFunction) =>
  await login(req, res, next);

export const getListUserController = async (req: Request, res: Response, next: NextFunction) =>
  await getList(req, res, next);

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) =>
  await refreshToken(req, res, next);

export const logoutController = async (req: Request, res: Response, next: NextFunction) =>
  await logout(req, res, next);

class UserController {
  userservice: IUserService;
  constructor() {
    this.userservice = new UserService();
  }
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userservice.register(req.body);
      if (!result.data) res.status(parseInt(result.statusCode));
      res.json({
        statusCode: result.statusCode,
        message: result.message ? result.message : '',
        data: result.data ? result.data : null,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const result = await this.userservice.loginUser(body);
      if (!result.data) res.status(parseInt(result.statusCode));
      res.json({
        statusCode: result.statusCode,
        message: result.message ? result.message : '',
        data: result.data ? result.data : '',
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userservice.refreshToken(req.body);
      if (!result.data) res.status(parseInt(result.statusCode));
      res.json({
        statusCode: result.statusCode,
        message: result.message ? result.message : '',
        data: result.data ? result.data : '',
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userservice.logout(req.body);
      if (!result.data) res.status(parseInt(result.statusCode));
      res.json({
        statusCode: result.statusCode,
        message: result.message ? result.message : '',
        data: result.data ? result.data : '',
      });
    } catch (error) {
      next(error);
    }
  };

  getListUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userservice.findUser();
      if (!result.data) res.status(parseInt(result.statusCode));
      res.json({
        statusCode: result.statusCode,
        message: result.message ? result.message : '',
        data: result.data ? result.data : '',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
