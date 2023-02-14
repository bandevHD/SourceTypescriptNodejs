import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

dotenv.config();

export async function signJwt(userId: string): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const { JWT_KEY_ACCESS_TOKEN } = process.env;
      const payload: object = { userId };

      const secret: string = JWT_KEY_ACCESS_TOKEN;

      const option: object = {
        expiresIn: '1m',
      };
      JWT.sign(payload, secret, option, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function verifyToken(req, res: Response, next: NextFunction) {
  try {
    if (!req.headers['authorization']) return next(createError.Unauthorized());
    const { JWT_KEY_ACCESS_TOKEN } = process.env;
    const header: string = req.headers['authorization'];
    const bearerToken = header.split(' ');
    const token = bearerToken[1];
    const secret: string = JWT_KEY_ACCESS_TOKEN;
    JWT.verify(token, secret, (err, payload) => {
      if (err) next(err);
      req.payload = payload;
      next();
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function signJwtRefreshToken(userId: string): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const { JWT_KEY_RESHER_TOKEN } = process.env;
      const payload: object = { userId };

      const secret: string = JWT_KEY_RESHER_TOKEN;

      const option: object = {
        expiresIn: '1y',
      };
      JWT.sign(payload, secret, option, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}
