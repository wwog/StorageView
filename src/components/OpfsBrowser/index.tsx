import { FC, ReactNode } from "react";
import { Content } from "./content";
import { useOpfsBrowser } from "../../hooks/useOpfsBrowser";
import { Header } from "./header";

interface OpfsBrowserProps {
  fallback?: ReactNode;
}

export const OpfsBrowser: FC<OpfsBrowserProps> = ({
  fallback = "Loading...",
}) => {
  const { loading } = useOpfsBrowser();
  if (loading) {
    return fallback;
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <Header />
      </div>

      <div className="flex-1">
        <Content />
      </div>
    </div>
  );
};
