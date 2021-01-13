import { GraphQLError } from "graphql";
import { fromPairs, omit, pick, unnest, zip } from "ramda";
import { useCallback, useMemo, useState } from "react";

export const useErrors = <T extends readonly string[]>(codes: T) => {
  type Errors = { [K in T[number]]: string | undefined };
  const noErrors = useMemo<Errors>(
    () => fromPairs<string | undefined>(codes.map(code => [code, undefined])) as Errors,
    [codes],
  );
  const [errors, setErrors] = useState(noErrors);
  const clearErrors = useCallback(
    (...codes: T[number][]) => !codes
      ? setErrors(noErrors)
      : setErrors(errors => ({ ...omit(codes, errors), ...fromPairs(codes.map(code => [code, undefined])) }) as Errors),
    [noErrors],
  );
  const handleGraphQLErrors = useCallback(
    (graphQLErrors: readonly GraphQLError[] | undefined, refetch: () => void) => {
      if (graphQLErrors && graphQLErrors.length > 0) {
        // @ts-ignore
        setErrors(errors => pick(codes, {
          ...errors, // @ts-ignore
          ...fromPairs(unnest(graphQLErrors.map(graphQLError => zip(
            graphQLError?.extensions?.code.split(";") || [],
            graphQLError?.message?.split(";") || [],
          )))),
        }) as Errors);
      } else {
        refetch();
      }
    },
    [codes, setErrors],
  );
  return [errors, clearErrors, handleGraphQLErrors] as const;
};
