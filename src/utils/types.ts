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

export type FindUserType = Partial<{
  id: string;
  email: string;
}>;
