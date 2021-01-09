import { toPairs } from "ramda";

export class EnvBadError extends Error {
  constructor(variables: Record<string, string>) {
    super(toPairs(variables).map(([name, variable]) => `Bad ${name}: ${variable}`).join("\n"));
  }
}
