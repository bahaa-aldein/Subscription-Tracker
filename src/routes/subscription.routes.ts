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

subscriptionRouter.use(authenticate);

// Static paths must come before '/:id', or Express matches them as an id
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);
subscriptionRouter.get('/user/:id', getSubscriptionsByUser);

subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/:id', getSubscription);
subscriptionRouter.post('/', createSubscription);
subscriptionRouter.put('/:id', updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);
subscriptionRouter.put('/:id/cancel', cancelSubscription);

export default subscriptionRouter;
