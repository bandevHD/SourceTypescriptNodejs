import { Response } from 'express';

export class BaseController {
  throwError = (name: string) => {
    throw `${name}`;
  };

  resultResponse = (res: Response, code: number, statusCode: string, data: object) => {
    return res.status(code).json({
      statusCode,
      data: data ? data : null,
    });
  };
}
