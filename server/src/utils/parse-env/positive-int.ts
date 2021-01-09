import { EnvBadError } from "./bad-error";
import { EnvMissingError } from "./missing-error";

export const positiveInt = (name: string, env: Record<string, string | undefined> = process.env): number => {
  const string = env[name];
  if (!string) throw new EnvMissingError({ [name]: name });
  const positiveInt = parseInt(string, 10);
  if (string.indexOf(".") >= 0 || Number.isNaN(positiveInt) || positiveInt <= 0) throw new EnvBadError({ [name]: string });
  return positiveInt;
};
