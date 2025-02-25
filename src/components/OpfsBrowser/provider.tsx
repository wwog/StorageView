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

  const goTo = async (path: string[], joinCurrent: boolean = false) => {
    await opfsBrowser?.goTo(path, joinCurrent);
  };

  const goBack = async () => {
    await opfsBrowser?.goBack();
  };

  const test = async () => {
    await opfsBrowser?.test();
  };

  const refresh = async () => {
    await opfsBrowser?.refresh();
  };

  const goToRoot = async () => {
    await opfsBrowser?.goToRoot();
  };

  const goToByPath = async (path: string, joinCurrent: boolean = false) => {
    await opfsBrowser?.goToByPath(path, joinCurrent);
  };

  const deleteByPaths = async (paths: string[]) => {
    await opfsBrowser?.deleteByPaths(paths);
  };

  const mkdir = async (path: string, options: { recursive: boolean }) => {
    await opfsBrowser?.mkdir(path, options);
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
        goToByPath,
        goBack,
        test,
        refresh,
        goToRoot,
        deleteByPaths,
        mkdir,
      }}
    >
      {children}
    </OpfsBrowserContext.Provider>
  );
};
