import React from "react";
import ReactDOM from "react-dom";
import fetch from "cross-fetch";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { App } from "app";

export const client = new ApolloClient({
  link: new HttpLink({
    fetch,
    uri: "/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

const root = document.getElementById("root");
root && ReactDOM.render( // @ts-ignore
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  root,
);
