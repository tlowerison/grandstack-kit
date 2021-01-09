import { EnvBadError } from "./bad-error";
import { EnvMissingError } from "./missing-error";

export const domain = (name: string, env: Record<string, string | undefined> = process.env): string => {
  const domain = env[name];
  if (!domain) throw new EnvMissingError({ [name]: name });
  if (!domain.match(new RegExp(/^([a-z]|-)+(\.([a-z]|-)+)+$/g))) throw new EnvBadError({ [name]: domain });
  return domain;
};
