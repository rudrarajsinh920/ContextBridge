import { createApp } from './app.js';
import { env } from './config/environment.js';
import { connectDatabase, disconnectDatabase, sanitizeMongoUri } from './config/database.js';

const app = createApp();

const startServer = async () => {
  // Attempt database connection on startup
  try {
    await connectDatabase(env.mongodbUri);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[DATABASE WARNING] Could not connect to MongoDB at ${sanitizeMongoUri(
        env.mongodbUri
      )} on startup: ${errorMsg}. Server starting in degraded database mode.`
    );
  }

  const server = app.listen(env.port, () => {
    console.log(`=========================================`);
    console.log(`ContextBridge API Server running`);
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Listening on: http://localhost:${env.port}`);
    console.log(`Health Check: http://localhost:${env.port}/api/health`);
    console.log(`Projects API: http://localhost:${env.port}/api/projects`);
    console.log(`=========================================`);
  });

  // Graceful shutdown handling
  const handleShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    try {
      await disconnectDatabase();
    } catch (err) {
      console.error('[DATABASE SHUTDOWN ERROR]', err);
    }

    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('[FATAL SERVER ERROR]', err);
  process.exit(1);
});
