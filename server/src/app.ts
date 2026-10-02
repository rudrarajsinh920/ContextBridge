import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/environment.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

export const createApp = (): Application => {
  const app: Application = express();

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  );

  // Body Parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request Logging Middleware
  app.use(requestLogger);

  // Root Welcome Endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'ContextBridge API Server',
      status: 'active',
      documentation: '/api/health',
    });
  });

  // Mount API Endpoints
  app.use('/api', apiRouter);

  // 404 Route Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
