import { AuthorizationError, Context, neo4jgraphql } from "@tlowerison/neo4j-graphql-js";
import { GraphQLResolveInfo } from "graphql";
import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 10;

const asserRequestorIsServer = (cypherParams: Context["cypherParams"]) => {
  if (!cypherParams?._credentials?.roles?.includes("SERVER")) {
    throw new AuthorizationError();
  }
};

const createUser = async (source: any, args: any, context: Context, info: GraphQLResolveInfo) => neo4jgraphql(
  source,
  { ...args, password: await hash(args.password, SALT_ROUNDS) },
  context,
  info,
);

export const resolvers = {
  Mutation: {
    CreateUser: createUser,
    SignIn: async (_source: any, { password, ...args }: { password: string }, { cypherParams, getMe, query }: Context) => {
      asserRequestorIsServer(cypherParams);
      if (cypherParams?._credentials?.uuid) {
        return await getMe();
      }
      const [{ me }] = await query("MATCH (me:User { email: $email }) RETURN me { .* }", args, ["me"] as const);
      if (!me || !await compare(password, me.password)) {
        return null;
      }
      return { ...me, password: null };
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
