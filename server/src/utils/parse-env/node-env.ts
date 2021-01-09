import { EnvBadError } from "./bad-error";
import { EnvMissingError } from "./missing-error";

export enum NodeEnv {
  Development = "development",
  Sandbox = "sandbox",
  Staging = "staging",
  Production = "production",
};

export const nodeEnv = (env: Record<string, string | undefined> = process.env): NodeEnv => {
  const { NODE_ENV } = env;
  if (!NODE_ENV) throw new EnvMissingError({ NODE_ENV }); // @ts-ignore
  if (!Object.values(NodeEnv).includes(NODE_ENV)) throw new EnvBadError({ NODE_ENV });
  return NODE_ENV as NodeEnv;
};
