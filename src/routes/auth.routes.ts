import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/sign-in', signIn);
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-out', authenticate, signOut);

export default authRouter;
