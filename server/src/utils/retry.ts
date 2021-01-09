import { RetryStrategy } from "redis";

export type MakeRetryStrategyOptions = {
  maxRetryAttempts?: number;
  maxRetryTimeInMs?: number;
  name: string;
  onComplete?: boolean | string | Function;
  retryWaitTimeInMs?: number;
};

export const makeRetryStrategy = ({
  maxRetryAttempts = 1000,
  maxRetryTimeInMs = 1000 * 60 * 60,
  name,
  retryWaitTimeInMs = 1000,
}: MakeRetryStrategyOptions): RetryStrategy => ({ attempt, error, total_retry_time }) => {
  if (error && error.code === "ECONNREFUSED") {
    console.error(`${name} refused the connection, retrying...`);
    return retryWaitTimeInMs;
  }
  if (total_retry_time > maxRetryTimeInMs) {
    // End reconnecting after a specific timeout and flush all commands with an individual error
    return new Error(`${name} connection retry time exhausted`);
  }
  if (attempt > maxRetryAttempts) {
    // End reconnecting with built in error
    return new Error(`${name} connection retry attempts exhausted`);
  }
  // reconnect after
  return Math.min(attempt * 100, retryWaitTimeInMs);
};

export const wrapWithRetry = <T extends any[], K = any>(
  fn: (...args: T) => PromiseLike<K>,
  makeRetryStrategyOptions: MakeRetryStrategyOptions,
  attempt: number = 1,
  start: number = Date.now(),
) => async (...args: T) => {
  try {
    const result = await fn(...args);
    const { onComplete } = makeRetryStrategyOptions;
    if (onComplete) {
      if (onComplete === true) {
        console.log(`Connected to ${makeRetryStrategyOptions.name}`);
      } else if (typeof onComplete === "string") {
        console.log(onComplete);
      } else {
        onComplete();
      }
    }
    return result;
  } catch (error) {
    if (error.code !== "ECONNREFUSED") {
      console.log(error.message);
      throw error;
    }
    const timeoutInMs = makeRetryStrategy(makeRetryStrategyOptions)({
      attempt,
      error,
      total_retry_time: Date.now() - start,
      times_connected: NaN,
    }) as number;
    return new Promise<K>((resolve, reject) => setTimeout(
      async () => {
        try {
          resolve(wrapWithRetry(fn, makeRetryStrategyOptions, attempt + 1, start)(...args));
        } catch (error) {
          reject(error);
        }
      },
      timeoutInMs,
    ));
  }
};
