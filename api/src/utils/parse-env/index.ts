import dotenv from "dotenv";
import { NodeEnv, nodeEnv } from "./node-env";
import { boolean } from "./boolean";
import { domain } from "./domain";
import { fromPairs, map, toPairs } from "ramda";
import { path } from "./path";
import { positiveInt } from "./positive-int";
import { string } from "./string";

export { NodeEnv } from "./node-env";

interface W {
  boolean: boolean;
  "?boolean": boolean | undefined;
  domain: string;
  "?domain": string | undefined;
  nodeEnv: NodeEnv;
  "?nodeEnv": NodeEnv | undefined;
  path: string;
  "?path": string | undefined;
  positiveInt: number;
  "?positiveInt": number | undefined;
  string: string;
  "?string": string | undefined;
}

type F<T> = T & {
  NODE_ENV: NodeEnv;
}

export const parseEnv = <T extends { [index: string]: keyof W }>(expected: T): F<{ [K in keyof T]: W[T[K]] }> => {
  dotenv.config({ path: "./.env" });
  const env = JSON.parse(JSON.stringify(process.env));
  const NODE_ENV = nodeEnv(env);

  const errs: Error[] = []; // @ts-ignore
  const result: { [K in keyof T]: W[T[K]] } = fromPairs(map(
    <U extends keyof W>([name, preType]: [string, U]): [string, W[U]] => {
      let value: W[U];
      const [first, second] = preType.split("?");
      const type = second ? second : first;
      const isOptional = Boolean(second);
      try {
        switch (type) {
          case "boolean": { // @ts-ignore
            value = boolean(name, env);
            break;
          }
          case "domain": { // @ts-ignore
            value = domain(name, env);
            break;
          }
          case "path": { // @ts-ignore
            value = path(name, env);
            break;
          }
          case "positiveInt": { // @ts-ignore
            value = positiveInt(name, env);
            break;
          }
          case "string": { // @ts-ignore
            value = string(name, env);
            break;
          }
          default: break;
        }
      } catch (err) {
        !isOptional && errs.push(err);
      }
      // @ts-ignore
      return [name, value];
    },
    toPairs(expected),
  ));
  if (errs.length > 0) {
    throw new Error(errs.map(err => err.message).join("\n"));
  }
  return { ...result, NODE_ENV };
};
