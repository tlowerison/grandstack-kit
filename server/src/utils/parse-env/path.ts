import { EnvBadError } from "./bad-error";
import { EnvMissingError } from "./missing-error";

export const path = (name: string, env: Record<string, string | undefined> = process.env): string => {
  const path = env[name];
  if (!path) throw new EnvMissingError({ [name]: name });
  if (!path.match(new RegExp(/(^\/$|^(\/([A-z]|[0-9]|-)+)+(\/)?$)/g))) throw new EnvBadError({ [name]: path });
  return path;
};
