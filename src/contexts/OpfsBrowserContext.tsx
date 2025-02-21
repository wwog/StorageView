import { createContext } from "react";
import type { OpfsNode } from "../utils/opfs/types";
import { Emitter } from "../utils/event";
import { createOpfsBridge, type OpfsBridge } from "../utils/opfs/bridge";
import { formatPath } from "../components/OpfsBrowser/utils";

export class OpfsBrowser {
  private static instance: OpfsBrowser;

  static async getInstance() {
    if (!OpfsBrowser.instance) {
      const opfs = await createOpfsBridge();
      const items = await opfs.getDirectorySnapshot("/");
      OpfsBrowser.instance = new OpfsBrowser(opfs);
      OpfsBrowser.instance.currentDirItems = items;
    }
    return OpfsBrowser.instance;
  }

  public opfsBridge: OpfsBridge;
  public currentPath: string[] = ["/"];
  public currentDirItems: OpfsNode[] = [];
  private _onCurrentPathChange = new Emitter<string[]>();
  public onCurrentPathChange = this._onCurrentPathChange.event;
  private _onCurrentDirItemsChange = new Emitter<OpfsNode[]>();
  public onCurrentDirItemsChange = this._onCurrentDirItemsChange.event;

  /**可否返回上一级 */
  get canGoBack() {
    return this.currentPath.length > 1;
  }

  private constructor(opfsBridge: OpfsBridge) {
    this.opfsBridge = opfsBridge;
    //@ts-expect-error 方便调试
    window.opfsBrowser = this;
    this.onCurrentDirItemsChange((items) => {
      console.log("onCurrentDirItemsChange", items);
    });
    this.onCurrentPathChange((path) => {
      console.log("onCurrentPathChange", path);
    });
  }

  public test = async () => {
    const uuid = crypto.randomUUID();
    const fileName = `${uuid.slice(0, 16)}.txt`;
    const path = formatPath([...this.currentPath, fileName]);
    await this.opfsBridge.writeFile(path, "test1", { create: true });
    await this.refresh();
  };

  public refresh = async () => {
    this.currentDirItems = await this.opfsBridge.getDirectorySnapshot(
      this.currentPath.join("/")
    );
    this._onCurrentDirItemsChange.fire(this.currentDirItems);
  };

  public goTo = async (path: string[], joinCurrent = false) => {
    if (joinCurrent) {
      this.currentPath = [...this.currentPath, ...path];
    } else {
      this.currentPath = path;
    }
    this.currentDirItems = await this.opfsBridge.getDirectorySnapshot(
      formatPath(path)
    );
    this._onCurrentDirItemsChange.fire(this.currentDirItems);
    this._onCurrentPathChange.fire(this.currentPath);
  };

  public goToRoot = async () => {
    await this.goTo(["/"]);
  };

  public goBack = async () => {
    if (this.canGoBack) {
      this.currentPath.pop();
      await this.goTo(this.currentPath);
    }
  };
}

interface OpfsBrowserContextType {
  opfsBrowser: OpfsBrowser | null;
  loading: boolean;
  currentPath: string[];
  currentDirItems: OpfsNode[];
  canGoBack: boolean;
  goTo: (path: string[], joinCurrent?: boolean) => void;
  goBack: () => void;
  test: () => void;
  refresh: () => void;
  goToRoot: () => void;
}

export const OpfsBrowserContext = createContext<OpfsBrowserContextType | null>(
  null
);
