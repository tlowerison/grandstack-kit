import { ApolloError } from "apollo-server-express";
import { AuthorizationError, Context, neo4jgraphql } from "@tlowerison/neo4j-graphql-js";
import { GraphQLResolveInfo } from "graphql";
import { compare, hash } from "bcrypt";

const saltRounds = 10;
const symbols = "!@#\\$%\\^&*\\(\\)-_+=`~\\{\\}\\[\\]\\|;:'\",./\\\\<>\\?";
const pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[" + symbols + "])[A-Za-z\\d" + symbols + "]{8,32}$";
const passwordRegex = new RegExp(pattern);

const asserRequestorIsServer = (cypherParams: Context["cypherParams"]) => {
  if (!cypherParams?._credentials?.roles?.includes("SERVER")) {
    throw new AuthorizationError();
  }
};

const createUser = async (source: any, args: any, context: Context, info: GraphQLResolveInfo) => {
  if (!args.password?.match(passwordRegex)) {
    throw new ApolloError(
      `Invalid password: must be 8-32 characters long, contain a lowercase letter, an uppercase letter, a number, and a symbol`,
      "PASSWORD",
    );
  }
  return neo4jgraphql(
    source,
    { ...args, password: await hash(args.password, saltRounds) },
    context,
    info,
  );
};

export const resolvers = {
  Mutation: {
    CreateUser: createUser,
    SignIn: async (_source: any, { password, ...args }: { password: string }, { cypherParams, getMe, query }: Context) => {
      asserRequestorIsServer(cypherParams);
      if (cypherParams?._credentials?.uuid) {
        return await getMe();
      }
      const [record] = await query("MATCH (me:User { email: $email }) RETURN me { .* }", args, ["me"] as const);
      if (!record || !record.me || !await compare(password, record.me.password)) {
        throw new ApolloError(
          `Incorrect email/password`,
          "EMAIL_PASSWORD",
        );
      }
      return { ...record.me, password: null };
    },
    SignOut: (_source: any, _args: any, { cypherParams }: Context) => {
      asserRequestorIsServer(cypherParams);
    },
    SignUp: (source: any, args: any, context: Context, info: GraphQLResolveInfo) => {
      asserRequestorIsServer(context.cypherParams);
      return createUser(source, args, context, info);
    },
  },
};
