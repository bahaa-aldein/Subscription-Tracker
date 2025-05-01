import { NextFunction, Request, Response } from 'express';
import prisma from '../database/prisma.js';
import { generateTokens } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';

interface CustomError extends Error {
  statusCode?: number;
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      const error = new Error('User not found') as CustomError;
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid password') as CustomError;
      error.statusCode = 401;
      throw error;
    }

    const token = generateTokens({ userId: user.id });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      const error = new Error('User already exists') as CustomError;
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateTokens({ userId: newUser.id });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({
      success: true,
      message: 'User signed out successfully',
    });
  } catch (error) {
    next(error);
  }
}
