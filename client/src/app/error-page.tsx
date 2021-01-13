import React from "react";
import { useParams } from "react-router";

interface Params {
  code: string;
}

export const ErrorPage = () => {
  const { code } = useParams<Params>();
  return (<>{code}</>);
};
