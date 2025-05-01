import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import ENV from '../config/env.js';
import { workflowClient } from '../config/upstash.js';
import prisma from '../database/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  CreateSubscriptionInput,
  CreateSubscriptionSchema,
} from '../schemas/subscription.js';

export async function getAllSubscriptions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const subscriptions = await prisma.subscription.findMany();

    res.status(200).json({
      success: true,
      message: 'Subscriptions retrieved successfully',
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) {
      res
        .status(404)
        .json({ success: false, message: 'Subscription not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Subscription retrieved successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSubscription(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // 1) Parse & validate
    const data: CreateSubscriptionInput = CreateSubscriptionSchema.parse(
      req.body
    );

    // 2) Create in DB (converting strings to Date)
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user.id,
        status: 'active',
        name: data.name,
        price: data.price,
        currency: data.currency,
        frequency: data.frequency,
        category: data.category,
        paymentMethod: data.paymentMethod,
        startDate: new Date(data.startDate),
        renewalDate: data.renewalDate
          ? new Date(data.renewalDate)
          : dayjs(data.startDate).add(1, 'month').toDate(),
      },
    });

    // 3) Trigger workflow, respond
    const { workflowRunId } = await workflowClient.trigger({
      url: `${ENV.SERVER_URL}/workflows/subscription/reminder`,
      body: { subscriptionId: subscription.id },
      headers: { 'content-type': 'application/json' },
      retries: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
}

export async function updateSubscription(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { id: userId } = req.user;

    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!existingSubscription) {
      res
        .status(404)
        .json({ success: false, message: 'Subscription not found' });
      return;
    }

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id,
        userId,
      },
      data: {
        ...req.body,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    await prisma.subscription.delete({ where: { id } });

    res
      .status(200)
      .json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getSubscriptionsByUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    if (userId !== req.user?.id) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Subscriptions retrieved successfully',
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelSubscription(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { id: userId } = req.user;

    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingSubscription) {
      res
        .status(404)
        .json({ success: false, message: 'Subscription not found' });
      return;
    }

    await prisma.subscription.update({
      where: {
        id,
      },
      data: {
        status: 'cancelled',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getUpcomingRenewals(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active',
        renewalDate: {
          gte: dayjs().toDate(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Upcoming renewals retrieved successfully',
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}
