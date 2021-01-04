import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import { ApolloClient, HttpLink, InMemoryCache, defaultDataIdFromObject } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import fetch from "cross-fetch";
import { ApolloProvider } from "@apollo/react-hooks";
import { App } from "app";

const newLocal = "/graphql";
export const client = new ApolloClient({
  link: new HttpLink({
    fetch,
    uri: newLocal,
    credentials: "include",
  }),
  cache: new InMemoryCache({
    dataIdFromObject: responseObject => responseObject.uuid
      ? `${responseObject.uuid}`
      : defaultDataIdFromObject(responseObject),
  }),
});

const reactRoot = document.getElementById("root");
reactRoot && ReactDOM.render( // @ts-ignore
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  reactRoot,
);
