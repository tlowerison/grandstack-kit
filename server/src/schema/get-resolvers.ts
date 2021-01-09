import { GraphQLField, GraphQLFieldMap, GraphQLFieldResolver, GraphQLSchema } from "graphql";
import { Role, Scope } from "./constants";
import { pick } from "ramda";

type BasicResolver = GraphQLFieldResolver<any, any, { [key: string]: any }>;

const allScopes = Object.values(Scope);

export const getCredentials = (context: any) => context?.session?.me;
const addCredentials = (context: any, me: { uuid: string; roles: string[]; scopes: string[] }) => {
  if (context?.session && me && me.uuid) {
    context.session.me = pick(["uuid", "roles", "scopes"], me);
    if (context.session.me.roles) {
      context.session.me.roles.push(Role.Server);
    } else {
      context.session.me.roles = [Role.Server, Role.User];
    }
    context.session.me.scopes = allScopes;
  }
};

export const getResolvers = async (schema: GraphQLSchema) => {
  const Mutation: { SignIn?: BasicResolver; SignOut?: BasicResolver; SignUp?: BasicResolver } = {
    SignOut: (_parent, _params, context, _resolveInfo) => new Promise(
      resolve => context.session?.destroy((err: any) => resolve(Boolean(err))),
    ),
  };
  const mutationType = schema.getMutationType();
  const {
    SignIn: { resolve: SignIn } = {} as GraphQLField<any, any>,
    SignUp: { resolve: SignUp } = {} as GraphQLField<any, any>,
  } = mutationType ? mutationType.getFields() : {} as GraphQLFieldMap<any, any>;
  if (SignIn) {
    Mutation.SignIn = async (parent, params, context, resolveInfo) => {
      const me = await SignIn(parent, params, context, resolveInfo);
      addCredentials(context, me);
      return me;
    };
  }
  if (SignUp) {
    Mutation.SignUp = async (parent, params, context, resolveInfo) => {
      const me = await SignUp(parent, params, context, resolveInfo);
      addCredentials(context, me);
      return me;
    };
  }
  return { Mutation };
};
