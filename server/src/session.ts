import connectRedis from "connect-redis";
import expressSession from "express-session";
import { DOMAIN, NODE_ENV, SESSION_SECRET } from "env";
import { Express } from "express";
import { NodeEnv } from "utils";
import { redisClient } from "./redis-client";

export const session = (app: Express) => {
  const RedisStore = connectRedis(expressSession);
  if (NODE_ENV !== NodeEnv.Development) {
    app.set("trust proxy", 1);
  }
  app.use(expressSession({
    name: "tlowerison.com",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: NODE_ENV !== NodeEnv.Development,
      domain: NODE_ENV !== NodeEnv.Development ? DOMAIN : undefined,
    },
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
  }));
};
