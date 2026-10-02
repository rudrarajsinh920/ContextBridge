import { Request, Response } from 'express';
import { env } from '../config/environment.js';
import { getDatabaseTelemetry } from '../config/database.js';

/**
 * Controller to handle API health check requests.
 * Reports server uptime, environment, and accurate database connectivity.
 * Returns HTTP 200 when all subsystems are operational, or HTTP 503 when the database is disconnected.
 */
export const getHealth = (req: Request, res: Response): void => {
  const dbTelemetry = getDatabaseTelemetry();
  const isHealthy = dbTelemetry.connected;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    service: 'ContextBridge API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    database: {
      status: dbTelemetry.status,
      connected: dbTelemetry.connected,
      readyState: dbTelemetry.readyState,
    },
  });
};
