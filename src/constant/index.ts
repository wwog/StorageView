export enum BrowserType {
  opfs,
  localStorage,
  sessionStorage,
}

export const BrowserTypeLabelMap = {
  [BrowserType.opfs]: "Opfs",
  [BrowserType.localStorage]: "Local Storage",
  [BrowserType.sessionStorage]: "Session Storage",
};

export const DEFAULT_BROWSER_TYPE = BrowserType.opfs;
