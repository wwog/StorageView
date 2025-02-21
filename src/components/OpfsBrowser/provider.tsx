import { useEffect, useState } from "react";
import {
  OpfsBrowser,
  OpfsBrowserContext,
} from "../../contexts/OpfsBrowserContext";
import type { OpfsNode } from "../../utils/opfs/types";

export const OpfsBrowserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [opfsBrowser, setOpfsBrowser] = useState<OpfsBrowser | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>(["/"]);
  const [currentDirItems, setCurrentDirItems] = useState<OpfsNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const initOpfsBrowser = async () => {
      const browser = await OpfsBrowser.getInstance();
      browser.onCurrentPathChange(() => {
        setCurrentPath(browser.currentPath);
        setCanGoBack(browser.canGoBack);
      });
      browser.onCurrentDirItemsChange(() => {
        setCurrentDirItems(browser.currentDirItems);
      });
      setCurrentDirItems(browser.currentDirItems);
      setCurrentPath(browser.currentPath);
      setOpfsBrowser(browser);
      setLoading(false);
    };
    initOpfsBrowser();
  }, []);

  const goTo = (path: string[], joinCurrent: boolean = false) => {
    opfsBrowser?.goTo(path, joinCurrent);
  };

  const goBack = () => {
    opfsBrowser?.goBack();
  };

  const test = () => {
    opfsBrowser?.test();
  };

  const refresh = () => {
    opfsBrowser?.refresh();
  };

  const goToRoot = () => {
    opfsBrowser?.goToRoot();
  };

  return (
    <OpfsBrowserContext.Provider
      value={{
        opfsBrowser,
        loading,
        currentPath,
        currentDirItems,
        canGoBack,
        goTo,
        goBack,
        test,
        refresh,
        goToRoot,
      }}
    >
      {children}
    </OpfsBrowserContext.Provider>
  );
};
