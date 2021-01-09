import { GraphQLSchema } from "graphql";
import { addResolversToSchema } from "@graphql-tools/schema";
import { getAPISchema } from "./get-api-schema";
import { getResolvers } from "./get-resolvers";

export const schema = async (): Promise<GraphQLSchema> => {
  const apiSchema = await getAPISchema();
  const resolvers = await getResolvers(apiSchema);
  return addResolversToSchema({ resolvers, schema: apiSchema });
};
