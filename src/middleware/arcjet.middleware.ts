import { ArcjetNodeRequest } from '@arcjet/node';
import { NextFunction, Response } from 'express';
import aj from '../config/arcjet.js';

const arcjetMiddleware = async (
  req: ArcjetNodeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: 'Rate limit exceeded' });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: 'No bots allowed' });
      } else {
        res.status(403).json({ error: 'Access denied' });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default arcjetMiddleware;
