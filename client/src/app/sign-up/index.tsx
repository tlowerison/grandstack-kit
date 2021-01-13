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
import { useErrors } from "../use-errors";
import { useHistory } from "react-router";
import { useMiniMeQuery, useSignUpMutation } from "generated/graphql";

const errorCodes = ["EMAIL", "PASSWORD", "USERNAME"] as const;

export const SignUp = () => {
  const history = useHistory();
  const { data, loading, refetch } = useMiniMeQuery({ fetchPolicy: "network-only" });
  const [signUp] = useSignUpMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [errors, clearErrors, handleGraphQLErrors] = useErrors(errorCodes);

  const onSubmit = useCallback(
    async () => {
      if (email.length > 0 && password.length > 0 && username.length > 0) {
        const { errors } = await signUp({ variables: { email, password, username } });
        handleGraphQLErrors(errors, refetch);
      }
    },
    [clearErrors, email, handleGraphQLErrors, password, refetch, signUp, username],
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
      <Grid
        item
        className={styles.image}
        xs={false}
        sm={4}
        md={7}
      />
      <Grid
        item
        component={Paper}
        elevation={6}
        square
        xs={12}
        sm={8}
        md={5}
      >
        <div className={styles.paper}>
          <Avatar className={styles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <div className={styles.form}>
            <TextField
              id="email"
              name="email"
              label="Email"
              autoFocus
              disabled={loading}
              error={Boolean(errors.EMAIL)}
              fullWidth
              helperText={errors.EMAIL}
              margin="normal"
              onChange={({ target: { value } }) => {
                setEmail(value);
                if (errors.EMAIL) {
                  clearErrors("EMAIL");
                }
              }}
              onKeyDown={onKeyDown}
              variant="outlined"
            />
            <TextField
              id="username"
              name="username"
              label="Username"
              disabled={loading}
              error={Boolean(errors.USERNAME)}
              fullWidth
              helperText={errors.USERNAME}
              margin="normal"
              onChange={({ target: { value } }) => {
                setUsername(value);
                if (errors.USERNAME) {
                  clearErrors("USERNAME");
                }
              }}
              onKeyDown={onKeyDown}
              type="username"
              variant="outlined"
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              disabled={loading}
              error={Boolean(errors.PASSWORD)}
              fullWidth
              helperText={errors.PASSWORD}
              margin="normal"
              onChange={({ target: { value } }) => {
                setPassword(value);
                if (errors.PASSWORD) {
                  clearErrors("PASSWORD");
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
              Sign Up
            </Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};
