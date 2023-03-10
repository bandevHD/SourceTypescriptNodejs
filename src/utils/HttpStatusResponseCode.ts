import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
export const RESPONSES = {
  //Successful responses
  OK: {
    CODE: StatusCodes.OK,
    REGISTER_SUCCESS: '200a',
    LOGIN_SUCCESS: '200b',
    REFRESHTOKEN_SUCCESS: '200c',
    LOGOUT_SUCCESS: '200d',
    GET_LIST_USER_SUCCESS: '200e',
    CREATE_VOUCHER_USER_SUCCESS: '200f',
    GET_LIST_VOUCHER_SUCCESS: '200g',
    GET_ONE_VOUCHER_SUCCESS: '200h',
    UPDATE_VOUCHER_SUCCESS: '200i',
    ALLOWED_ACCESS_EDIT_EVENT: '200j',
    RELEASE_EDITTABLE_EVENT: '200k',
    MAINTAIN_EDITTABLE_EVENT_SUCCESS: '200l',
    DELETE_VOUCHER_SUCCESS: '200m',
  },

  //Client error responses
  BAD_REQUEST: {
    CODE: StatusCodes.BAD_REQUEST,
    REGISTER_MISSING_PARAMATER: '400a',
    LOGIN_MISSING_PARAMATER: '400b',
    REFRESHTOKEN_MISSING_PARAMATER: '400c',
    LOGOUT_MISSING_PARAMATER: '400d',
    MORE_THAN_ONE_10_VOUCHER: '456a',
  },

  NOT_FOUND: {
    CODE: StatusCodes.NOT_FOUND,
    API_NOT_FOUND: '404a',
    USER_NOT_FOUND: '404b',
    VOUCHER_NOT_FOUND: '404c',
    EVENT_NOT_FOUND: '404d',
  },

  UNAUTHORIZED: {
    CODE: StatusCodes.UNAUTHORIZED,
    PASSWORD_NOT_CORRECT: '401a',
    NOT_ALLOWED_EDIT_EVENT: '401b',
  },

  FORBIDDEN: {
    CODE: StatusCodes.FORBIDDEN,
  },

  CONFLICT: {
    CODE: StatusCodes.CONFLICT,
    EMAIL_EXIST: '409a',
    NOT_ALLOWED_ACCESS_EDIT_EVENT: '409b',
  },

  //server error responses
  INTERNAL_SERVER_ERROR: {
    CODE: StatusCodes.INTERNAL_SERVER_ERROR,
    SOMETHING_WENT_WRONG: '500a',
  },
};

export const resultResponse = (res: Response, code: number, statusCode: string, data: object) => {
  return res.status(code).json({
    statusCode,
    data: data ? data : null,
  });
};
