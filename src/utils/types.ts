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

export type FindUserType = Partial<{
  id: string;
  email: string;
}>;
