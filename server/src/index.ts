import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import { CLIENT_PORT, DOMAIN, GRAPHQL_PATH, NODE_ENV, PORT } from "env";
import { ApolloServer } from "apollo-server-express";
import { NodeEnv } from "utils";
import { rateLimiter } from "./rate-limiter";
import { schema } from "./schema";
import { session } from "./session";

(async () => {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: NODE_ENV !== NodeEnv.Development ? undefined : false }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  session(app);
  rateLimiter(app);

  const apolloServer = new ApolloServer({
    context: ({ req }) => ({ req, session: req.session }),
    playground: NODE_ENV !== NodeEnv.Development ? false : {
      settings: {
        "request.credentials": "same-origin",
      },
    },
    schema: await schema(),
    subscriptions: false,
  });
  apolloServer.applyMiddleware({
    app,
    cors: {
      allowedHeaders: ["Authorization", "Content-Type"],
      credentials: true,
      origin: NODE_ENV === NodeEnv.Development
        ? [PORT, CLIENT_PORT].filter(Boolean).map(port => `http://localhost:${port}`)
        : [`https://${DOMAIN}`],
    },
    path: GRAPHQL_PATH,
  });

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})();
