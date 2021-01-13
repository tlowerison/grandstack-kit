import React, { Suspense, lazy } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

const Dashboard = lazy(() => import("./dashboard").then(module => ({ default: module.Dashboard })));
const ErrorPage = lazy(() => import("./error-page").then(module => ({ default: module.ErrorPage })));
const SignIn = lazy(() => import("./sign-in").then(module => ({ default: module.SignIn })));
const SignOut = lazy(() => import("./sign-out").then(module => ({ default: module.SignOut })));
const SignUp = lazy(() => import("./sign-up").then(module => ({ default: module.SignUp })));

export const App = () => (
  <HashRouter>
    <Suspense fallback={null}>
      <Switch>
        <Route path="/sign-in">
          <SignIn />
        </Route>
        <Route path="/sign-out">
          <SignOut />
        </Route>
        <Route path="/sign-up">
          <SignUp />
        </Route>
        <Route exact path="/error/:code">
          <ErrorPage />
        </Route>
        <Route>
          <Dashboard />
        </Route>
      </Switch>
    </Suspense>
  </HashRouter>
);
