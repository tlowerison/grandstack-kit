import { compare, hash } from "bcrypt";
import { createError } from "apollo-errors";
import { neo4jgraphql } from "@tlowerison/neo4j-graphql-js";

const AuthorizationError = createError("AuthorizationError", { message: "You are not authorized." });

const SALT_ROUNDS = 10;

const createUser = async (parent: any, params: any, context: any, resolveInfo: any) => neo4jgraphql(
  parent,
  { ...params, password: await hash(params.password, SALT_ROUNDS) },
  context,
  resolveInfo,
);

const getMe = async ({ email, getTx, username, uuid }: { email?: string; getTx: any; username?: string; uuid?: string }) => {
  let result: any;
  if (uuid) {
    result = await getTx().run(`MATCH (user:User) WHERE user.uuid = $uuid RETURN user { .* }`, { uuid });
  } else if (email && username) {
    result = await getTx().run(`MATCH (user:User) WHERE user.email = $email AND user.username = $username RETURN user { .* }`, { email, username });
  } else if (email) {
    result = await getTx().run(`MATCH (user:User) WHERE user.email = $email RETURN user { .* }`, { email });
  } else if (username) {
    result = await getTx().run(`MATCH (user:User) WHERE user.username = $username RETURN user { .* }`, { username });
  } else {
    return null;
  }
  return (result.records.length === 1 && result.records[0].get("user")) || null;
};

export const resolvers = {
  Mutation: {
    CreateUser: createUser,
    SignIn: async (_parent: any, { password, ...params }: { email: string; password: string; username: string }, { cypherParams, getTx }: any) => {
      if (!cypherParams?._credentials?.roles?.includes("SERVER")) {
        throw new AuthorizationError({ message: "Unauthorized: Cannot access Mutation.SignIn" });
      }
      if (cypherParams?._credentials?.uuid) return await getMe({ getTx, uuid: cypherParams._credentials.uuid });
      const { password: passwordHash, ...me } = await getMe({ getTx, ...params });
      if (!me || !await compare(password, passwordHash)) return null;
      return { ...me, password: null };
    },
    SignOut: (_parent: any, _params: any, { cypherParams }: any) => {
      if (!cypherParams?._credentials?.scopes?.includes("SERVER")) {
        throw new AuthorizationError({ message: "Unauthorized: Cannot access Mutation.SignIn" });
      }
    },
    SignUp: createUser,
  },
};
