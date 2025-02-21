export const clsx = (
  ...args: (string | undefined | null | Record<string, boolean>)[]
) => {
  return args
    .filter(Boolean)
    .flatMap((arg) => {
      if (arg !== null && arg !== undefined) {
        if (typeof arg === "string") {
          return arg;
        } else {
          return Object.entries(arg)
            .filter(([, value]) => value)
            .map(([key]) => key);
        }
      }
      return [];
    })
    .join(" ");
};
