import mongoose from "mongoose";

/**
 * Global namespace augmentation for TypeScript to recognize our cached connection.
 * This prevents multiple connections in development mode due to hot reloading.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache object for the MongoDB connection.
 * In development, Next.js hot reloading can cause multiple connections.
 * We cache the connection to reuse it across hot reloads.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and returns a MongoDB connection using Mongoose.
 * Uses caching to prevent multiple connections during development.
 *
 * @returns {Promise<mongoose.Connection>} A promise that resolves to the Mongoose connection
 */
async function connectDB(): Promise<mongoose.Connection> {
  // If connection already exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
      );
    }

    const opts = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maximum number of socket connections
      serverSelectionTimeoutMS: 5000, // Timeout for initial connection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Create a new connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise on error to allow retry
    throw error;
  }

  return cached.conn;
}

export default connectDB;
