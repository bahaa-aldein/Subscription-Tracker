import { Subscription } from '@prisma/client';
import { WorkflowContext } from '@upstash/workflow';
import dayjs from 'dayjs';
import { createRequire } from 'module';
import prisma from '../database/prisma.js';
import { sendReminderEmail } from '../utils/sendEmail.js';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

interface CustomWorkflowContext extends WorkflowContext<unknown> {
  requestPayload: { subscriptionId: string };
  run<T>(task: string, fn: () => Promise<T>): Promise<T>;
  sleepUntil(label: string, date: Date): Promise<void>;
}

const REMINDERS = [1, 2, 5, 7];

const sendReminders = serve(async (rawContext: WorkflowContext<unknown>) => {
  const context = rawContext as CustomWorkflowContext;
  const { subscriptionId } = context.requestPayload;

  console.log(`▶️ Workflow started for subscription ${subscriptionId}`);

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription) {
    console.warn(`⚠️ No subscription found with ID ${subscriptionId}.`);
    return;
  }
  console.log(
    `✅ Subscription fetched: user=${subscription.user.email}, status=${subscription.status}`
  );

  if (subscription.status !== 'active') {
    console.info(`ℹ️ Skipping inactive subscription ${subscriptionId}.`);
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);
  const today = dayjs();
  if (renewalDate.isBefore(today, 'day')) {
    console.info(
      `ℹ️ Subscription ${subscriptionId} already expired on ${renewalDate.format(
        'YYYY-MM-DD'
      )}.`
    );
    return;
  }

  for (const days of REMINDERS) {
    const label = `${days}-day reminder`;
    const reminderDate = renewalDate.subtract(days, 'day');

    if (reminderDate.isAfter(today, 'day')) {
      console.log(
        `⏰ Scheduling ${label} for ${reminderDate.format('YYYY-MM-DD')}`
      );
      await sleepUntilReminder(context, label, reminderDate);
    }

    if (today.isSame(reminderDate, 'day')) {
      console.log(`🚀 Today is ${label}. Triggering now.`);
      await triggerReminder(context, label, subscription);
    }
  }

  console.log(`🏁 Workflow completed for subscription ${subscriptionId}`);
});

const fetchSubscription = async (
  context: CustomWorkflowContext,
  subscriptionId: string
): Promise<
  (Subscription & { user: { name: string; email: string } }) | null
> => {
  return await context.run('get subscription', async () => {
    return await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: { select: { name: true, email: true } } },
    });
  });
};

const sleepUntilReminder = async (
  context: CustomWorkflowContext,
  label: string,
  date: dayjs.Dayjs
): Promise<void> => {
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (
  context: CustomWorkflowContext,
  label: string,
  subscription: Subscription & { user: { name: string; email: string } }
): Promise<void> => {
  return await context.run(label, async () => {
    try {
      console.log(`✉️ Sending email (${label}) to ${subscription.user.email}`);
      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
      });
      console.log(`✅ Email (${label}) sent to ${subscription.user.email}`);
    } catch (err: unknown) {
      console.error(
        `❌ Failed to send ${label} to ${subscription.user.email}:`,
        err
      );
    }
  });
};

export default sendReminders;
