import React, { useEffect } from "react";
import styles from "./styles.module.scss";
import { NavTree } from "@tlowerison/common-components";
import { Route, Switch } from "react-router-dom";
import { useHistory } from "react-router";
import { useMeQuery } from "generated/graphql";

export const Dashboard = () => {
  const { data: { Me: me } = {}, loading } = useMeQuery({ fetchPolicy: "cache-and-network" });
  const history = useHistory();

  useEffect(
    () => {
      if (!loading && !me?.uuid) {
        history.push("/sign-in");
      }
    },
    [history, loading, me],
  );

  if (!me?.uuid) return null;

  return (
    <div className={styles.dashboard}>
      <NavTree
        label="GRAND Stack Kit"
        values={[
          { label: "Explore", value: "explore" },
          {
            label: "Sign Out",
            link: true,
            value: "sign-out",
          }
        ]}
      />
      <div className={styles.content}>
        <Switch>
          <Route path="/explore">
            Explore!
          </Route>
          <Route>
            {`Hello, ${me.username}!`}
          </Route>
        </Switch>
      </div>
    </div>
  );
};
