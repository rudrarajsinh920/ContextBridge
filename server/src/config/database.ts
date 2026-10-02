import mongoose from 'mongoose';
import { env } from './environment.js';

/**
 * Sanitizes a MongoDB connection URI to prevent credential leakage in logs.
 * Replaces username and password credentials with '***'.
 */
export function sanitizeMongoUri(uri: string): string {
  try {
    const parsed = new URL(uri);
    if (parsed.password) {
      parsed.password = '***';
    }
    if (parsed.username) {
      parsed.username = '***';
    }
    return parsed.toString();
  } catch {
    // If not a standard URL format (e.g. mongodb+srv with special patterns), regex mask credentials
    return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
  }
}

/**
 * ReadyState descriptions for Mongoose connection:
 * 0: disconnected
 * 1: connected
 * 2: connecting
 * 3: disconnecting
 */
const READY_STATE_NAMES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Checks whether Mongoose currently has an active connection (readyState === 1).
 */
export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Returns detailed telemetry regarding the Mongoose connection state.
 */
export function getDatabaseTelemetry() {
  const readyState = mongoose.connection.readyState;
  return {
    connected: readyState === 1,
    readyState,
    status: READY_STATE_NAMES[readyState] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}

/**
 * Connects to MongoDB with error resilience and sanitized logging.
 */
export async function connectDatabase(uri: string = env.mongodbUri): Promise<typeof mongoose> {
  const sanitized = sanitizeMongoUri(uri);

  try {
    // If already connected or connecting, return current instance
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[DATABASE] Connected to MongoDB at ${sanitized}`);
    return mongoose;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[DATABASE ERROR] Failed to connect to MongoDB at ${sanitized}: ${errorMsg}`);
    throw err;
  }
}

/**
 * Disconnects from MongoDB gracefully.
 */
export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      console.log('[DATABASE] Disconnected from MongoDB.');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[DATABASE ERROR] Error during disconnect: ${errorMsg}`);
    }
  }
}
