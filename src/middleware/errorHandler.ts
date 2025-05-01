import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.error(err);

    const customError = err as CustomError;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        customError.message = 'Duplicate field value entered';
        customError.statusCode = 400;
      }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      customError.message = 'Validation error: ' + err.message;
      customError.statusCode = 400;
    }

    res.status(customError.statusCode || 500).json({
      success: false,
      error: customError.message || 'Internal Server Error',
    });
  } catch (error) {
    next(error);
  }
};

export default errorHandler;
