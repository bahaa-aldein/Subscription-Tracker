import { Client as WorkflowClient } from '@upstash/workflow';
import ENV from './env.js';

export const workflowClient = new WorkflowClient({
  baseUrl: ENV.QSTASH_URL,
  token: ENV.QSTASH_TOKEN,
});
