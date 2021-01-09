import { API_GRAPHQL_PATH, API_HOST, API_PORT, API_PROTOCOL, JWT_SECRET } from "env";
import { Role } from "./constants";
import { fetch } from "cross-fetch";
import { getCredentials } from "./get-resolvers";
import { introspectSchema, wrapSchema } from "@graphql-tools/wrap";
import { print } from "graphql";
import { wrapWithRetry } from "utils";
import { sign } from "jsonwebtoken";

type AsyncExecutor = Extract<Parameters<typeof introspectSchema>[0], (...args: any[]) => Promise<any>>;

let hasRetrievedAPISchema = false;

export const getAPISchema = wrapWithRetry(
  async () => {
    const executor = createExecutor();
    return wrapSchema({ executor, schema: await introspectSchema(executor) });
  },
  {
    name: "GraphQL API",
    onComplete: () => {
      hasRetrievedAPISchema = true;
      console.log("Connected to GraphQL API");
    },
  },
);

const url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}${API_GRAPHQL_PATH}`;
const defaultCredentials = { roles: [Role.Server], scopes: [] };
const safeOperationCredentials = { roles: [Role.Server, Role.User], scopes: [] };
const safeOperations = ["SignIn", "SignOut", "SignUp"];

const createExecutor = (): AsyncExecutor => async ({ context, document, info, variables }) => {
  const operationName = info?.operation.selectionSet.selections.length === 1 &&
    info.operation.selectionSet.selections[0].kind === "Field" &&
    info.operation.selectionSet.selections[0].name.value;
  const fallbackCredentials = operationName && safeOperations.includes(operationName) ? safeOperationCredentials : defaultCredentials;
  const credentials = getCredentials(context) || fallbackCredentials;
  try {
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(credentials ? { "Authorization": `Bearer ${sign(credentials, JWT_SECRET)}` } : {}),
      },
      body: JSON.stringify({ query: print(document), variables }),
    });
    return fetchResult.json();
  } catch (error) {
    if (hasRetrievedAPISchema) {
      console.log(error.message);
      throw new Error("Unable to process requests at this time");
    }
    throw error;
  }
};
