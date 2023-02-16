import VoucherService from './services';
import { NextFunction, Request, Response } from 'express';
import { createValidate } from './dto/create.input';
import { createVoucher } from '../../../utils/constant';
import * as _ from 'lodash';
import { updatePutValidate } from './dto/updatePut.input';

class VoucherController {
  voucherservice;
  constructor() {
    this.voucherservice = new VoucherService();
  }
  createController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isValid: string = createValidate(req.body);
      if (isValid)
        res.status(422).json({
          statusCode: 422,
          message: isValid ? isValid : '',
        });
      const body: object = _.pick(req.body, createVoucher);
      const result = await this.voucherservice.createVoucher(body);
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
      const { id } = req.body;
      const isValid: string = updatePutValidate(req.body);
      if (isValid)
        res.status(422).json({
          statusCode: 422,
          message: isValid ? isValid : '',
        });
      const result = await this.voucherservice.updatePutVoucher({ id }, req.body);
      if (!result.data) {
        res.status(parseInt(result.statusCode));
        return;
      }
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
      const result = await this.voucherservice.refreshToken(req.body);
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
      const result = await this.voucherservice.readListVoucher();
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
      const { id } = req.params;
      const result = await this.voucherservice.readOneVoucher({ id });
      if (!result.data) res.status(parseInt(result.statusCode));
      res.json({
        statusCode: result.statusCode,
        data: result.data ? result.data : null,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isDelete = true;
      const result = await this.voucherservice.deleteVoucher(req.body, { isDelete });
      if (!result.data) res.status(parseInt(result.statusCode));
      res.json({
        statusCode: result.statusCode,
        data: result.data ? result.data : null,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default VoucherController;
