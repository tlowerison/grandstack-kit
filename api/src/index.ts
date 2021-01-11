import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import neo4j from "neo4j-driver";
import { ApolloServer } from "apollo-server-express";
import {
  GRAPHQL_PATH,
  IS_GRAPHQL_BUILD,
  NEO4J_HOST,
  NEO4J_PASSWORD,
  NEO4J_PORT,
  NEO4J_PROTOCOL,
  NEO4J_USERNAME,
  NODE_ENV,
  PORT,
} from "env";
import { Neo4jPlugin, buildContext } from "@tlowerison/neo4j-graphql-js";
import { NodeEnv } from "utils";
import { rateLimiter } from "./redis";
import { schema } from "./schema";

if (!IS_GRAPHQL_BUILD) {
  const app = express();
  const driver = neo4j.driver(
    `${NEO4J_PROTOCOL}://${NEO4J_HOST}:${NEO4J_PORT}`,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
  );

  app.use(helmet({ contentSecurityPolicy: NODE_ENV !== NodeEnv.Development ? undefined : false }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  rateLimiter(app);

  const apolloServer = new ApolloServer({
    schema,
    context: buildContext(driver, { credentials: { keys: ["uuid"] } }),
    introspection: true,
    playground: NODE_ENV !== NodeEnv.Development ? false : {
      settings: {
        "request.credentials": "same-origin",
      },
    },
    plugins: [Neo4jPlugin],
    subscriptions: false,
  });
  apolloServer.applyMiddleware({
    app,
    cors: {
      allowedHeaders: ["Authorization", "Content-Type"],
    },
    path: GRAPHQL_PATH,
  });

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  process.on("exit", async () => driver.close());
}
