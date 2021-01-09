import { GraphQLSchema, printSchema } from "graphql";
import { IS_GRAPHQL_BUILD } from "env";
import { join } from "path";
import { makeAugmentedSchema } from "@tlowerison/neo4j-graphql-js";
import { readFileSync, writeFileSync } from "fs";
import { resolvers } from "./resolvers";
import { sync } from "glob";

const readFiles = (pattern: string) => sync(join(__dirname, pattern)).map(filename => readFileSync(filename, "utf-8")).join("\n");

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
