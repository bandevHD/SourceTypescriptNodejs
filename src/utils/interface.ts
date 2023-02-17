import { CreateUserType, LoginUserType, RefreshTokenType, LogoutType } from './types';
export default interface IUserService {
  register(createUserType: CreateUserType);
  loginUser(loginUserType: LoginUserType);
  refreshToken(refreshTokenType: RefreshTokenType);
  logout(logoutType: LogoutType);
  findUser();
}
