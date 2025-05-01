import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const ENV = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  ARCJET_KEY: process.env.ARCJET_KEY || '',
  ARCJET_ENV: process.env.ARCJET_ENV || 'staging',
  ARCJET_LIMIT: process.env.ARCJET_LIMIT || '1000',
  QSTASH_URL: process.env.QSTASH_URL || '',
  QSTASH_TOKEN: process.env.QSTASH_TOKEN || '',
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD || '',
  GMAIL_USER: process.env.GMAIL_USER || 'seniorwizard10@gmail.com',
  GMAIL_APP_PASS: process.env.GMAIL_APP_PASS || '',
};

export default ENV;
