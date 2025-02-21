import { useContext } from "react";
import { OpfsBrowserContext } from "../contexts/OpfsBrowserContext";

export const useOpfsBrowser = () => {
  const context = useContext(OpfsBrowserContext);
  if (!context) {
    throw new Error(
      "useOpfsBrowser must be used within an OpfsBrowserProvider"
    );
  }
  return context;
};
