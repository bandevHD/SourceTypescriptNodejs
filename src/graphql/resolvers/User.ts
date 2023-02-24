import { StatusCodes } from 'http-status-codes';
import { Mutation, Resolver, Arg, Query } from 'type-graphql';
import { Repository } from 'typeorm';
import {
  hashPassword,
  signJwt,
  signJwtRefreshToken,
  verifyRefreshToken,
} from '../../apis/modules/jwtService';
import { User } from '../../model/typeorm/postgressql';
import {
  GetOneUserGraphqlType,
  LoginResponse,
  LoginUserGraphqlType,
  LogoutUserGraphqlType,
  RefreshtokeUserGraphqlType,
  RegisterUserType,
  UserResponse,
  // VerytokenGraphqlType,
} from '../../utils/types';
import { myDataSourcePostgres } from '../../config/connectPostgresql';
import bcrypt from 'bcrypt';
import { refreshValidate } from '../../apis/core_v1/user/dto/refreshToken.input';
import redis from '../../config/connectRedis';
import { logoutValidate } from '../../apis/core_v1/user/dto/logout.input';
@Resolver()
export class UserResolver {
  private readonly reposity: Repository<User>;
  constructor() {
    this.reposity = myDataSourcePostgres.getRepository(User);
  }
  @Mutation((_return) => UserResponse)
  async register(
    @Arg('registerUserType') registerUserType: RegisterUserType,
  ): Promise<UserResponse> {
    const { email, password } = registerUserType;
    const existingUser = await this.reposity.findOneBy({ email });

    if (existingUser) return { statusCode: StatusCodes.CONFLICT, message: 'User đã được đăng ký' };

    const passwordNew: string = await hashPassword(password);

    const saveUser: User = this.reposity.create({ ...registerUserType, password: passwordNew });

    const userNew: User = await saveUser.save();

    return {
      statusCode: StatusCodes.OK,
      message: 'Register successfully!',
      data: userNew ? userNew : undefined,
    };
  }

  @Mutation((_return) => LoginResponse)
  async login(
    @Arg('loginUserGraphqlType') loginUserGraphqlType: LoginUserGraphqlType,
  ): Promise<LoginResponse> {
    const { email, password } = loginUserGraphqlType;
    const existingUser = await this.reposity.findOneBy({ email });

    if (!existingUser)
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User chưa đăng ký tài khoản',
      };

    const isValidUser: boolean = await bcrypt.compare(password, existingUser.password);

    if (!isValidUser) {
      return {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: `Password is not correct`,
      };
    }

    const accessToken: string = await signJwt(existingUser.id);
    const refreshToken: string = await signJwtRefreshToken(existingUser.id);
    return {
      statusCode: StatusCodes.OK,
      message: 'Login successfully!',
      accessToken,
      refreshToken,
    };
  }

  @Mutation((_return) => LoginResponse)
  async refreshToken(
    @Arg('refreshtokeUserGraphqlType') refreshtokeUserGraphqlType: RefreshtokeUserGraphqlType,
  ): Promise<LoginResponse> {
    const { refreshToken } = refreshtokeUserGraphqlType;

    const isValid: string = refreshValidate(refreshtokeUserGraphqlType);

    if (isValid)
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: isValid ? isValid : '',
      };
    const { userId } = await verifyRefreshToken(refreshToken);

    const accessToken: string = await signJwt(userId);
    const refreshTokenResult: string = await signJwtRefreshToken(userId);

    redis.del(userId);
    await redis.set(userId, refreshTokenResult, {
      EX: 365 * 24 * 60 * 60,
      NX: true,
    });
    return {
      statusCode: StatusCodes.OK,
      message: 'Refresh Token successfully!',
      accessToken,
      refreshToken,
    };
  }

  @Mutation((_return) => UserResponse)
  async logout(
    @Arg('logoutUserGraphqlType') logoutUserGraphqlType: LogoutUserGraphqlType,
  ): Promise<UserResponse> {
    const { refreshToken } = logoutUserGraphqlType;

    const isValid: string = logoutValidate(logoutUserGraphqlType);

    if (isValid)
      return {
        statusCode: 422,
        message: isValid ? isValid : '',
      };

    const { userId } = await verifyRefreshToken(refreshToken);

    redis.del(userId);

    return {
      statusCode: StatusCodes.OK,
      message: 'Logout successfully!',
    };
  }

  @Query((_return) => [User])
  async getListUser(): Promise<User[]> {
    return await this.reposity.find();
  }

  @Query((_return) => User)
  async getOneUser(
    @Arg('getOneUserGraphqlType') getOneUserGraphqlType: GetOneUserGraphqlType,
  ): Promise<User> {
    return await this.reposity.findOneBy({ id: getOneUserGraphqlType.id });
  }
}
