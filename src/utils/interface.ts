import { User } from '../model/typeorm';
import { CreateUserType, FindUserType, LoginUserType, RefreshTokenType, LogoutType } from './types';
export default interface IUserService {
  register(createUserType: CreateUserType);
  loginUser(loginUserType: LoginUserType);
  refreshToken(refreshTokenType: RefreshTokenType);
  logout(logoutType: LogoutType);
  findUser(findUserType: FindUserType): Promise<User>;
}
