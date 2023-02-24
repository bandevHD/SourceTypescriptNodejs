import { Request, Response } from 'express';
import {
  CreateUserType,
  LoginUserType,
  RefreshTokenType,
  LogoutType,
  TypeJWTPayload,
} from './types';
export default interface IUserService {
  register(createUserType: CreateUserType);
  loginUser(loginUserType: LoginUserType);
  refreshToken(refreshTokenType: RefreshTokenType);
  logout(logoutType: LogoutType);
  findUser();
  findOneUser(id: string | number);
}

export interface expressInterface {
  req: Request;
  res: Response;
  user: TypeJWTPayload;
}
