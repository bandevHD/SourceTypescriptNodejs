import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Response } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import client from '../../config/connectRedis';

dotenv.config();

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt: string = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
}

export async function verifyRefreshToken(refreshToken: string) {
  try {
    return new Promise((resolve, reject) => {
      const { JWT_KEY_REFRESH_TOKEN } = process.env;
      const secret: string = JWT_KEY_REFRESH_TOKEN;
      JWT.verify(refreshToken, secret, async (err, payload: any) => {
        if (err) return reject(err);
        await client.get(payload.userId).then((result: string) => {
          if (refreshToken === result) {
            return resolve(payload);
          }
        });
        return reject(createError.Unauthorized());
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

export async function signJwtRefreshToken(userId: string): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const { JWT_KEY_REFRESH_TOKEN } = process.env;
      const payload: object = { userId };

      const secret: string = JWT_KEY_REFRESH_TOKEN;

      const option: object = {
        expiresIn: '1y',
      };
      JWT.sign(payload, secret, option, async (err, token) => {
        if (err) reject(err);
        await client.set(userId, token, {
          EX: 365 * 24 * 60 * 60,
          NX: true,
        });
        resolve(token);
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}
