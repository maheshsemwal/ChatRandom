import { createClient, RedisClientType } from 'redis';
import dotenv from "dotenv";

dotenv.config();
// Create and export a Redis client instance
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is not defined');
}

// Regular Redis client for commands (write, set, get, etc.)
const redisClient: RedisClientType = createClient({
  url: redisUrl,
});

redisClient.connect().catch((error) => {
  console.error('Error connecting to Redis:', error);
});

// Separate Redis client for Pub/Sub (subscribe, publish, etc.)
const redisSubClient: RedisClientType = redisClient.duplicate();
redisSubClient.connect().catch((error) => {
  console.error('Error connecting to Redis for Pub/Sub:', error);
});

export { redisClient, redisSubClient };
