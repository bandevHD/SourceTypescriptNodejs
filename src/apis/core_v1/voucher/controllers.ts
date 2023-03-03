import VoucherService, {
  createVoucherMongoose,
  createVoucherMongooseWithTransaction,
  createVoucherTest,
  deleteVoucherMongoose,
  getListVoucherMongoose,
  getOneVoucherMongoose,
  updateOneVoucherMongoose,
  updatePatchVoucherMongoose,
} from './services';
import { NextFunction, Request, Response } from 'express';
import { createValidate } from './dto/create.input';
import { createVoucher } from '../../../utils/constant';
import * as _ from 'lodash';
import { updatePutValidate } from './dto/updatePut.input';
import { StatusCodes } from 'http-status-codes';
import { RESPONSES } from '../../../utils/HttpStatusResponseCode';

export const createVoucherMongooseController = async (req: Request, res: Response) => {
  try {
    const time = new Date().getTime();
    console.log(`Time request-----------${time}`);
    const data = await createVoucherMongooseWithTransaction(req.body);
    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Tạo voucher thành công',
      data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const createVoucherController = async (req: Request, res: Response) => {
  try {
    const data = await createVoucherTest(req.body);
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Tạo voucher thành công',
      data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getListVoucherMongooseController = async (req: Request, res: Response) => {
  try {
    const data = await getListVoucherMongoose();
    res.status(RESPONSES.OK.CODE).json({
      statusCode: RESPONSES.OK.GET_LIST_VOUCHER_SUCCESS,
      data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getOneVoucherMongooseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await getOneVoucherMongoose(id);
    if (!data)
      return res.status(RESPONSES.NOT_FOUND.CODE).json({
        statusCode: RESPONSES.NOT_FOUND.VOUCHER_NOT_FOUND,
      });
    return res.status(RESPONSES.OK.CODE).json({
      statusCode: RESPONSES.OK.GET_ONE_VOUCHER_SUCCESS,
      data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const updateVoucherController = async (req: Request, res: Response) => {
  try {
    const data = await updateOneVoucherMongoose(req.body);
    if (_.isNull(data)) {
      return res.status(RESPONSES.NOT_FOUND.CODE).json({
        statusCode: RESPONSES.NOT_FOUND.VOUCHER_NOT_FOUND,
      });
    }
    res.status(RESPONSES.OK.CODE).json({
      statusCode: RESPONSES.OK.UPDATE_VOUCHER_SUCCESS,
      data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const updateVoucherPatchController = async (req: Request, res: Response) => {
  try {
    const data = await updatePatchVoucherMongoose(req.body);
    if (_.isNull(data)) {
      return res.status(RESPONSES.NOT_FOUND.CODE).json({
        statusCode: RESPONSES.NOT_FOUND.VOUCHER_NOT_FOUND,
      });
    }
    res.status(RESPONSES.OK.CODE).json({
      statusCode: RESPONSES.OK.UPDATE_VOUCHER_SUCCESS,
      data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteVoucherController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const data = await deleteVoucherMongoose(_id);
    if (_.isNull(data)) {
      return res.status(RESPONSES.NOT_FOUND.CODE).json({
        statusCode: RESPONSES.NOT_FOUND.VOUCHER_NOT_FOUND,
      });
    }
    res.status(RESPONSES.OK.CODE).json({
      statusCode: RESPONSES.OK.DELETE_VOUCHER_SUCCESS,
      data,
    });
  } catch (error) {
    throw new Error(error);
  }
};
class VoucherController {
  voucherservice;
  constructor() {
    this.voucherservice = new VoucherService();
  }
  createController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isValid: string = createValidate(req.body);
      if (isValid)
        return res.status(422).json({
          statusCode: 422,
          message: isValid ? isValid : '',
        });
      const body: object = _.pick(req.body, createVoucher);
      const result = await this.voucherservice.createVoucher(body);
      if (!result.data) res.status(parseInt(result.statusCode));
      return res.json({
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
      const result = await this.voucherservice.readListVoucher(req.params);
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

  editVoucherByMe = async (req: Request, res: Response, next: NextFunction) => {
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

export default VoucherController;
