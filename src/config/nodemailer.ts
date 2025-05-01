import nodemailer from 'nodemailer';
import ENV from './env.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // ← tells Nodemailer to use smtp.gmail.com under the hood
  auth: {
    user: ENV.GMAIL_USER, // e.g. your.email@gmail.com
    pass: ENV.GMAIL_APP_PASS, // an App Password if you have 2FA on
  },
});
