export const assertNever = (value: never): never => {
  throw new Error(
    `Discriminated union member ${JSON.stringify(value)} is not handled!`
  );
};
