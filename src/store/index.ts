import { atom, useAtom } from "jotai";
import { DEFAULT_BROWSER_TYPE, type BrowserType } from "../constant";
import type { OpfsBrowser } from "../contexts/OpfsBrowserContext";

const browserTypeAtom = atom<BrowserType>(DEFAULT_BROWSER_TYPE);

export const useBrowserType = () => {
  return useAtom(browserTypeAtom);
};

export const opfsBrowserAtom = atom<OpfsBrowser>({} as OpfsBrowser);
