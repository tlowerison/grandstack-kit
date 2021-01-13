import { useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { useSignOutMutation } from "generated/graphql";

export const SignOut = () => {
  const history = useHistory();
  const [signOut] = useSignOutMutation();
  const onSignOut = useCallback(async () => {
    await signOut();
    history.push("/sign-in");
  }, [history, signOut]);
  useEffect(() => { onSignOut(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};
