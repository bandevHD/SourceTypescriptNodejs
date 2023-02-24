import { register, login, getList, refreshToken, logout } from './services';
import UserService from './services';
import { NextFunction, Request, Response } from 'express';
import IUserService from '../../../utils/interface';
import * as _ from 'lodash';
import path from 'path';
import { BaseController } from '../../base/base_controller';
import { RESPONSES } from '../../../utils/HttpStatusResponseCode';
import { resgiterValidate } from './dto/register.input';

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

class UserController extends BaseController {
  userservice: IUserService;
  constructor() {
    super();
    this.userservice = new UserService();
  }
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isValid = resgiterValidate(req.body);
      if (isValid) {
        this.resultResponse(
          res,
          RESPONSES.BAD_REQUEST.CODE,
          RESPONSES.BAD_REQUEST.REGISTER_MISSING_PARAMATER,
          {
            message: isValid ? isValid : null,
          },
        );
      }

      let result = await this.userservice.register(req.body);
      let code = RESPONSES.OK.CODE;
      let statusCode = RESPONSES.OK.REGISTER_SUCCESS;
      if (result.statusCode) {
        code = result.statusCode.slice(0, 3);
        statusCode = result.statusCode;
        result = {};
      }
      this.resultResponse(res, code, statusCode, result);
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

  getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await this.userservice.findOneUser(id);
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

  getListUserHtml = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.sendFile(path.join(__dirname, '../../../../../public/template/listUser.html'));
    } catch (error) {
      next(error);
    }
  };

  editTableByMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      return res.json({
        data: ip,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
