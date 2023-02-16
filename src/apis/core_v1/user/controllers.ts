import { register, login, getList } from './services';
import UserService from './services';
import { NextFunction, Request, Response } from 'express';
import IUserService from '../../../utils/interface';
import * as _ from 'lodash';

export async function registerController(req: Request, res: Response) {
  return await register(req, res);
}

export async function loginController(req: Request, res: Response) {
  return await login(req, res);
}

export async function getListUserController(req: Request, res: Response) {
  return await getList(req, res);
}

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
}

export default UserController;