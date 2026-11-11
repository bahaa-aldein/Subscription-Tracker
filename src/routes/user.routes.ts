import { Router } from 'express';
import { deleteUser, getUser, updateUser } from '../controllers/user.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const userRouter = Router();

// Users are created through POST /auth/sign-up
userRouter.use(authenticate);

userRouter.get('/:id', getUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
