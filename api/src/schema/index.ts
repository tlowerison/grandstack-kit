import { GraphQLSchema, printSchema } from "graphql";
import { IS_GRAPHQL_BUILD } from "env";
import { join } from "path";
import { makeAugmentedSchema, readFiles } from "@tlowerison/neo4j-graphql-js";
import { writeFileSync } from "fs";
import { resolvers } from "./resolvers";

export const schema: GraphQLSchema = makeAugmentedSchema({
  resolvers,
  config: {
    auth: {
      typeDefs: readFiles("./**/*.auth"),
    },
    mutation: false,
  },
  typeDefs: readFiles("./**/*.graphql"),
});

if (IS_GRAPHQL_BUILD) writeFileSync(join(__dirname, "../db/schema.graphql"), printSchema(schema));
