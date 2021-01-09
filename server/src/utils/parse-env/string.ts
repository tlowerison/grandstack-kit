import { EnvMissingError } from "./missing-error";

export const string = (name: string, env: Record<string, string | undefined> = process.env): string => {
  const string = env[name];
  if (!string) throw new EnvMissingError({ [name]: name });
  return string;
};
