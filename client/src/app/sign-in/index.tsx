import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { useErrors } from "../use-errors";
import { useHistory } from "react-router";
import { useMiniMeQuery, useSignInMutation } from "generated/graphql";

const errorCodes = ["EMAIL_PASSWORD"] as const;

export const SignIn = () => {
  const history = useHistory();
  const { data, loading, refetch } = useMiniMeQuery({ fetchPolicy: "network-only" });
  const [signIn] = useSignInMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, clearErrors, handleGraphQLErrors] = useErrors(errorCodes);

  const onSubmit = useCallback(
    async () => {
      if (email.length > 0 && password.length > 0) {
        const { errors } = await signIn({ variables: { email, password } });
        handleGraphQLErrors(errors, refetch);
      }
    },
    [clearErrors, email, handleGraphQLErrors, password, refetch, signIn],
  );

  const onKeyDown = useCallback((event: KeyboardEvent) => event.key === "Enter" && onSubmit(), [onSubmit]);

  useEffect(() => {
    if (data?.Me?.uuid) {
      history.push("/");
    }
  }, [data, history]);

  return (
    <Grid container component="main" className={styles.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={styles.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={styles.paper}>
          <Avatar className={styles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div className={styles.form}>
            <TextField
              id="email"
              name="email"
              label="Email"
              autoFocus
              disabled={loading}
              error={Boolean(errors.EMAIL_PASSWORD)}
              fullWidth
              margin="normal"
              onChange={({ target: { value } }) => {
                setEmail(value);
                if (errors.EMAIL_PASSWORD) {
                  clearErrors("EMAIL_PASSWORD");
                }
              }}
              onKeyDown={onKeyDown}
              variant="outlined"
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              disabled={loading}
              error={Boolean(errors.EMAIL_PASSWORD)}
              fullWidth
              helperText={errors.EMAIL_PASSWORD}
              margin="normal"
              onChange={({ target: { value } }) => {
                setPassword(value);
                if (errors.EMAIL_PASSWORD) {
                  clearErrors("EMAIL_PASSWORD");
                }
              }}
              onKeyDown={onKeyDown}
              variant="outlined"
              type="password"
            />
            <Button
              type="submit"
              className={styles.submit}
              color="primary"
              disabled={loading}
              fullWidth
              onClick={onSubmit}
              variant="contained"
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="#">
                  <Typography variant="body2">
                    Forgot password?
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/sign-up">
                  <Typography variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};
