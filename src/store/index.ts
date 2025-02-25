import { atom } from "jotai";
import type { OpfsBrowser } from "../contexts/OpfsBrowserContext";

export const opfsBrowserAtom = atom<OpfsBrowser>({} as OpfsBrowser);
