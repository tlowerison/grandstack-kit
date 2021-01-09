import { parseEnv } from "utils";

export const {
  API_KEY_SECRET,
  GRAPHQL_PATH = "/graphql",
  IS_GRAPHQL_BUILD,
  NEO4J_HOST = "localhost",
  NEO4J_PASSWORD,
  NEO4J_PORT,
  NEO4J_PROTOCOL,
  NEO4J_USERNAME,
  NODE_ENV,
  PORT,
} = parseEnv({
  API_KEY_SECRET: "string",
  DOMAIN: "?domain",
  GRAPHQL_PATH: "?string",
  IS_GRAPHQL_BUILD: "?boolean",
  NEO4J_HOST: "?string",
  NEO4J_PASSWORD: "string",
  NEO4J_PORT: "positiveInt",
  NEO4J_PROTOCOL: "string",
  NEO4J_USERNAME: "string",
  PORT: "positiveInt",
});
