import { keys } from "ramda";

export class EnvMissingError extends Error {
  constructor(variables: Record<string, any>) {
    super(keys(variables).map((name) => `Missing ${name}`).join("\n"));
  }
}
