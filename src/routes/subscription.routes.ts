import { Router } from 'express';
import {
  cancelSubscription,
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getSubscription,
  getSubscriptionsByUser,
  getUpcomingRenewals,
  updateSubscription,
} from '../controllers/subscription.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/:id', getSubscription);
subscriptionRouter.post('/', authenticate, createSubscription);
subscriptionRouter.put('/:id', authenticate, updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);
subscriptionRouter.get('/user/:id', authenticate, getSubscriptionsByUser);
subscriptionRouter.put('/:id/cancel', authenticate, cancelSubscription);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);

export default subscriptionRouter;
