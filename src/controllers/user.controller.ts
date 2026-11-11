import { NextFunction, Response } from 'express';
import prisma from '../database/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

function isOwnAccount(req: AuthenticatedRequest, res: Response): boolean {
  if (req.params.id !== req.user?.id) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return false;
  }
  return true;
}

export async function getUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnAccount(req, res)) return;

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      omit: { password: true },
    });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnAccount(req, res)) return;

    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email },
      omit: { password: true },
    });
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnAccount(req, res)) return;

    await prisma.user.delete({ where: { id: req.params.id } });
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}
