import redis from "redis";
import { REDIS_HOST, REDIS_PORT } from "env";

const maxRetryAttempts = 1000;
const maxRetryTimeInMs = 1000 * 60 * 60;
const retryWaitTimeInMs = 1000;

const retry_strategy = ({ attempt, error, total_retry_time }) => {
  if (error && error.code === "ECONNREFUSED") {
    console.error(`Redis refused the connection, retrying...`);
    return retryWaitTimeInMs;
  }
  if (total_retry_time > maxRetryTimeInMs) {
    // End reconnecting after a specific timeout and flush all commands with an individual error
    return new Error(`Redis connection retry time exhausted`);
  }
  if (attempt > maxRetryAttempts) {
    // End reconnecting with built in error
    return new Error(`Redis connection retry attempts exhausted`);
  }
  // reconnect after
  return Math.min(attempt * 100, retryWaitTimeInMs);
};

export const redisClient = redis.createClient(
  REDIS_PORT,
  REDIS_HOST,
  {
    retry_strategy,
    enable_offline_queue: false,
  },
);

redisClient.on("connect", () => console.log("Connected to Redis"));
