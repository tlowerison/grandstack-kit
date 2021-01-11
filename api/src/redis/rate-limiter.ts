import { Express } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "./redis-client";

const getFibonacciBlockDurationSeconds = (countConsecutiveOutOfLimits: number) => countConsecutiveOutOfLimits <= 1
  ? 1
  : getFibonacciBlockDurationSeconds(countConsecutiveOutOfLimits - 1) + getFibonacciBlockDurationSeconds(countConsecutiveOutOfLimits - 2);

// based off this strategy https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#dynamic-block-duration
export const rateLimiter = (app: Express) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate_limiter",
    points: 50,
    duration: 10,
  });

  const limiterConsecutiveOutOfLimits = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "consecutive_out_of_limits",
    points: 99999,
    duration: 0,
  });

  app.use((req, res, next) => rateLimiter.consume(req.ip, 1)
    .then(() => next())
    .catch(async (rejRes) => {
      if (!(rejRes instanceof Error)) {
        let retrySecs = 0;
        const resById = await rateLimiter.get(req.ip);
        if (resById !== null && resById.remainingPoints <= 0) {
          retrySecs = Math.round(resById.msBeforeNext / 1000) || 1;
        }
        if (retrySecs > 0) {
          res.set("Retry-After", `${retrySecs}`);
          res.status(429).send("Too Many Requests");
        } else {
          try {
            const resConsume = await rateLimiter.consume(req.ip);
            if (resConsume.remainingPoints <= 0) {
              const resPenalty = await limiterConsecutiveOutOfLimits.penalty(req.ip);
              await rateLimiter.block(req.ip, 10 * getFibonacciBlockDurationSeconds(resPenalty.consumedPoints));
            }
          } catch (rlRejected) {
            if (rlRejected instanceof Error) {
              throw rlRejected;
            } else {
              res.set("Retry-After", `${Math.round(rlRejected.msBeforeNext / 1000) || 1}`);
              res.status(429).send("Too Many Requests");
            }
          }
        }
      }
    })
  );
};
