import connectRedis from "connect-redis";
import redis from "redis";
import expressSession from "express-session";
import { DOMAIN, NODE_ENV, REDIS_HOST, REDIS_PORT, SESSION_SECRET } from "env";
import { Express } from "express";
import { NodeEnv, makeRetryStrategy } from "utils";
import { RateLimiterRedis } from "rate-limiter-flexible";

export const session = (app: Express) => {
  const RedisStore = connectRedis(expressSession);
  const client = redis.createClient(
    REDIS_PORT,
    REDIS_HOST,
    {
      retry_strategy: makeRetryStrategy({ name: "Redis" }),
      enable_offline_queue: false,
    },
  );

  const rateLimiterRedis = new RateLimiterRedis({
    storeClient: client,
    keyPrefix: "rate-limiter",
    points: 10,
    duration: 3,
    execEvenly: false,
    blockDuration: 15 * 60,
  });

  app.use((req, res, next) => rateLimiterRedis.consume(req.ip, 1)
    .then(() => next())
    .catch((rejRes) => {
      if (!(rejRes instanceof Error)) {
        res.set("Retry-After", `${Math.round(rejRes.msBeforeNext / 1000) || 1}`);
        res.status(429).send("Too Many Requests");
      }
    })
  );

  client.on("connect", () => console.log("Connected to Redis"));
  if (NODE_ENV !== NodeEnv.Development) {
    app.set("trust proxy", 1);
  }
  app.use(expressSession({
    name: "grandstack-kit",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: NODE_ENV !== NodeEnv.Development,
      domain: DOMAIN,
    },
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: new RedisStore({ client }),
  }));
};
