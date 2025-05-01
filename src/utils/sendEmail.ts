import { Subscription } from '@prisma/client';
import dayjs from 'dayjs';
import { SentMessageInfo } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport/index.js';
import ENV from '../config/env.js';
import { transporter } from '../config/nodemailer.js';
import prisma from '../database/prisma.js';
import { EmailTemplateEntry, emailTemplates } from './emailTemplate.js';

export interface SendReminderEmailParams {
  to: string;
  type: EmailTemplateEntry['label'];
  subscription: Subscription;
}

export const sendReminderEmail = async ({
  to,
  type,
  subscription,
}: SendReminderEmailParams): Promise<void> => {
  if (!to || !type) {
    throw new Error(
      'Missing required parameters: to and type are both required'
    );
  }

  const template = emailTemplates.find((t) => t.label === type);
  if (!template) {
    throw new Error(`Invalid email type: '${type}'`);
  }

  const user = await prisma.user.findUnique({
    where: { id: subscription.userId },
  });

  const mailInfo = {
    userName: user?.name as string,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  const subject = template.generateSubject(mailInfo);
  const html = template.generateBody(mailInfo);

  const mailOptions: MailOptions = {
    from: ENV.GMAIL_USER,
    to,
    subject,
    html,
  };

  transporter.sendMail(
    mailOptions,
    (err: Error | null, info: SentMessageInfo) => {
      if (err) {
        console.error('Error sending email:', err);
        return;
      }
      console.log('Email sent:', info.response);
    }
  );
};
