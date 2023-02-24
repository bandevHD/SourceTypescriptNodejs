import { AuthenticationError } from 'apollo-server-core';
import { Secret, verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { TypeJWTPayload } from '../../utils/types';
import { expressInterface } from './simpleMiddleware';

export { expressInterface } from '../../utils/interface';

export const middleWareAuhth: MiddlewareFn<expressInterface> = ({ context }, next) => {
  try {
    const authHeader = context.req.header('Authorization');
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) throw new AuthenticationError('Not authentication to GraphQL');

    const decodeUser = verify(
      accessToken,
      process.env.JWT_KEY_ACCESS_TOKEN as Secret,
    ) as TypeJWTPayload;

    context.user = decodeUser;
    return next();
  } catch (error) {
    throw new AuthenticationError(`Error authentication user, ${JSON.stringify(error)}`);
  }

  return next();
};
