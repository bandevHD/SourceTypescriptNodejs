import { BaseEntity } from 'typeorm';
import { User } from '../model/typeorm/postgressql';
import { InterfaceType, Field, InputType, ObjectType } from 'type-graphql';
import { JobAttributesData } from 'agenda';

export type CreateUserType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginUserType = {
  email: string;
  password: string;
};

export type RefreshTokenType = {
  refreshToken: string;
};

export type LogoutType = {
  refreshToken: string;
};

//Types voucher
export type CreateVoucherType = {
  title: string;
  content: string;
  description: string;
  discount: number;
  quantity: number;
  startTimeAt: string;
  endTimeAt: string;
  isInactive: boolean;
  isDelete: boolean;
};

export type ReadOneVoucherType = {
  id: string | number;
  isDelete: boolean | string | number;
};

export type UpdatePutVoucherType = {
  id?: string | number;
  title: string;
  content: string;
  description: string;
  discount: number;
  quantity: number;
  startTimeAt: string;
  endTimeAt: string;
  isInactive: boolean;
  isDelete: boolean;
};

export type DeleteBaseType = {
  isDelete: string | number | boolean;
};

export type DeepPartial<T> =
  | T
  | (T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends Map<infer K, infer V>
      ? Map<DeepPartial<K>, DeepPartial<V>>
      : T extends Set<infer M>
      ? Set<DeepPartial<M>>
      : T extends object
      ? {
          [K in keyof T]?: DeepPartial<T[K]>;
        }
      : T);

export type FindUserType = Partial<{
  id: string;
  email: string;
}>;

export abstract class CoreEntity extends BaseEntity {}

//Types response
@InterfaceType({ isAbstract: true })
export abstract class ResultResponse {
  @Field()
  statusCode!: number;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ implements: ResultResponse })
export class UserResponse implements ResultResponse {
  @Field({ nullable: true })
  data?: User;

  @Field({ nullable: false })
  statusCode!: number;

  @Field({ nullable: true })
  message?: string;
}

@InputType()
export class RegisterUserType {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;
}

@InputType()
export class LoginUserGraphqlType {
  @Field({ nullable: false })
  email!: string;

  @Field({ nullable: false })
  password!: string;
}

//Types job

export interface SendMailContaxt extends JobAttributesData {
  to: string;
}
