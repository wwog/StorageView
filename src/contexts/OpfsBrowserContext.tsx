import { createContext } from "react";
import type { OpfsNode } from "../utils/opfs/types";
import { Emitter } from "../utils/event";
import { createOpfsBridge, type OpfsBridge } from "../utils/opfs/bridge";
import { formatPath, pathToArr } from "../components/OpfsBrowser/utils";

export class OpfsBrowser {
  private static instance: OpfsBrowser;

  static async getInstance() {
    if (!OpfsBrowser.instance) {
      const opfs = await createOpfsBridge();
      OpfsBrowser.instance = new OpfsBrowser(opfs);
      OpfsBrowser.instance.currentDirItems = await opfs.getDirectorySnapshot(
        "/"
      );
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
      formatPath(this.currentPath)
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
      formatPath(this.currentPath)
    );
    this._onCurrentDirItemsChange.fire(this.currentDirItems);
    this._onCurrentPathChange.fire(this.currentPath);
  };

  public goToByPath = async (path: string, joinCurrent = false) => {
    await this.goTo(pathToArr(path), joinCurrent);
  };

  public goToRoot = async () => {
    await this.goTo(["/"]);
  };

  public deleteByPaths = async (paths: string[]) => {
    for (const path of paths) {
      await this.opfsBridge.remove(path, {
        recursive: true,
      });
    }
    await this.refresh();
  };

  public goBack = async () => {
    if (this.canGoBack) {
      this.currentPath.pop();
      await this.goTo(this.currentPath);
    }
  };

  public mkdir = async (path: string, options: { recursive: boolean }) => {
    await this.opfsBridge.mkdir(path, options);
    await this.refresh();
  };
}

interface OpfsBrowserContextType {
  opfsBrowser: OpfsBrowser | null;
  loading: boolean;
  currentPath: string[];
  currentDirItems: OpfsNode[];
  canGoBack: boolean;
  goTo: (path: string[], joinCurrent?: boolean) => Promise<void>;
  goToByPath: (path: string, joinCurrent?: boolean) => Promise<void>;
  goBack: () => Promise<void>;
  test: () => Promise<void>;
  refresh: () => Promise<void>;
  goToRoot: () => Promise<void>;
  deleteByPaths: (paths: string[]) => Promise<void>;
  mkdir: (path: string, options: { recursive: boolean }) => Promise<void>;
}

export const OpfsBrowserContext = createContext<OpfsBrowserContextType | null>(
  null
);
