import { StatusCodes } from 'http-status-codes';
import { Mutation, Resolver, Arg } from 'type-graphql';
import { Repository } from 'typeorm';
import { hashPassword, signJwt, signJwtRefreshToken } from '../../apis/modules/jwtService';
import { User } from '../../model/typeorm/postgressql';
import { LoginUserGraphqlType, RegisterUserType, UserResponse } from '../../utils/types';
import { myDataSourcePostgres } from '../../config/connectPostgresql';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
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

    const userNew = await saveUser.save();

    return {
      statusCode: StatusCodes.OK,
      message: 'Register successfully!',
      data: userNew ? userNew : undefined,
    };
  }
}
