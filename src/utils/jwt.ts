import jwt from 'jsonwebtoken';
import ENV from '../config/env.js';

interface TokenPayload {
  userId: string;
  role?: string;
}

export const generateTokens = (payload: TokenPayload) => ({
  accessToken: jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: '1d',
  }),
  refreshToken: jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: '7d',
  }),
});

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, ENV.JWT_REFRESH_SECRET) as TokenPayload;
