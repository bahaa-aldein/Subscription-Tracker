import cookieParser from 'cookie-parser';
import express from 'express';
import ENV from './config/env.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import userRouter from './routes/user.routes.js';
import workflowRouter from './routes/workflow.route.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorHandler);
app.use(arcjetMiddleware);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/subscriptions', subscriptionRouter);
app.use('/workflows', workflowRouter);

// Start the server
app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
});

export default app;
