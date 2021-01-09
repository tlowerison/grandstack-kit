import { EnvBadError } from "./bad-error";
import { EnvMissingError } from "./missing-error";

export const boolean = (name: string, env: Record<string, string | undefined> = process.env): boolean => {
  const string = env[name];
  if (!string) throw new EnvMissingError({ [name]: name });
  if (string !== "true" && string !== "false") throw new EnvBadError({ [name]: string });
  try {
    const boolean = JSON.parse(string);
    if (typeof boolean !== "boolean") throw new EnvBadError({ [name]: string });
    return boolean as boolean;
  } catch (err) {
    throw new EnvBadError({ [name]: string });
  }
};
