import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import fetch from "cross-fetch";
import { ApolloClient, HttpLink, InMemoryCache, defaultDataIdFromObject, from } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { App } from "app";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
  if (graphQLErrors || networkError) {
    const { operationName, variables } = operation;
    const { shouldSuppressDefaultGqlErrorLogging } = operation.getContext();
    if (graphQLErrors && !shouldSuppressDefaultGqlErrorLogging && process.env?.NODE_ENV !== "production") {
      console.error(
        `[GraphQL error] [Operation: ${operationName}] Failed with variables:`,
        variables,
        ", Errors:",
        graphQLErrors,
      );
    } else if (networkError && process.env?.NODE_ENV !== "production") {
      // If Error Code 400, did you set --use-external-services in running your local ui server?
      // If Error Code 422, did you configure the gql proxy in src/setupProxy.js correctly?
      // If Error Code 503, are you running the ui server to host the gql federated endpoint?
      const { message, name, stack } = networkError;
      console.error(
        `[Network error] [Operation: ${operationName}] Failed with variables:`,
        variables,
        `${message}, Name: ${name}, Stack: ${stack}`,
      );
    }
  }
  return forward(operation);
});

export const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: responseObject => responseObject.uuid
      ? `${responseObject.uuid}`
      : defaultDataIdFromObject(responseObject),
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  link: from([errorLink, new HttpLink({
    fetch,
    uri: "/graphql",
    credentials: "include",
  })]),
});

const root = document.getElementById("root");
root && ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider> as ReactElement,
  root,
);
