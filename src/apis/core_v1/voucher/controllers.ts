import UserService from './services';
import { NextFunction, Request, Response } from 'express';
import IUserService from '../../../utils/interface';

class VoucherController {
  userservice: IUserService;
  constructor() {
    this.userservice = new UserService();
  }
  createController = async (req: Request, res: Response, next: NextFunction) => {
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

  updatePutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userservice.loginUser(req.body);
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

  updatePathController = async (req: Request, res: Response, next: NextFunction) => {
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

  readListController = async (req: Request, res: Response, next: NextFunction) => {
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

  readOneController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const result = await this.userservice.createUser(req.body);
      // if (!result.data) res.status(parseInt(result.statusCode));
      // res.json({
      //   statusCode: result.statusCode,
      //   data: result.data ? result.data : null,
      // });
    } catch (error) {
      next(error);
    }
  };

  deleteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const result = await this.userservice.createUser(req.body);
      // if (!result.data) res.status(parseInt(result.statusCode));
      // res.json({
      //   statusCode: result.statusCode,
      //   data: result.data ? result.data : null,
      // });
    } catch (error) {
      next(error);
    }
  };
}

export default VoucherController;
