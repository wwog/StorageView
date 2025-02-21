import { OPFSOperator } from "./operator";
import type {
  FileInfo,
  FileTreeNode,
  MakeDirOptions,
  SnapshotOptions,
  WriteFileOptions,
  OpfsNode,
} from "./types";
import { isDirectoryHandle, isFileHandle, normalizePath } from "./utils";

export class OPFS {
  private static instance: OPFS;
  private opfsOperator: OPFSOperator;

  static async create(single = false) {
    if (single) {
      if (OPFS.instance) {
        return OPFS.instance;
      }
      const opfsOperator = await OPFSOperator.create();
      OPFS.instance = new OPFS(opfsOperator);
      return OPFS.instance;
    }
    const opfsOperator = await OPFSOperator.create();
    const opfs = new OPFS(opfsOperator);
    return opfs;
  }

  private constructor(operator: OPFSOperator) {
    this.opfsOperator = operator;
  }

  async stat(path: string) {
    const handle = await this.opfsOperator.getPathHandle(path);
    const absolute = await this.opfsOperator.absolute(handle);

    if (handle instanceof FileSystemFileHandle) {
      const file = await handle.getFile();
      return {
        name: file.name,
        size: file.size,
        isDirectory: false,
        isFile: true,
        path: absolute,
      } as FileInfo;
    } else {
      return {
        name: handle.name,
        size: -1,
        isDirectory: true,
        isFile: false,
        path: absolute,
      } as FileInfo;
    }
  }

  async mkdir(path: string, options: MakeDirOptions = {}) {
    return this.opfsOperator.mkdir(path, options);
  }

  async remove(path: string, options: FileSystemRemoveOptions = {}) {
    const { recursive = false } = options;
    const { lastPath, parentHandle } = await this.opfsOperator.getParentHandle(
      path
    );

    return parentHandle.removeEntry(lastPath, {
      recursive,
    });
  }

  async writeFile(
    path: string,
    data: string | ArrayBuffer | ArrayBufferView | Blob,
    options: WriteFileOptions = {}
  ) {
    if (typeof data === "string") {
      const _data = new TextEncoder().encode(data);
      return this.opfsOperator.writeFile(path, _data, options);
    } else if (data instanceof Blob) {
      const _data = await data.arrayBuffer();
      return this.opfsOperator.writeFile(path, _data, options);
    } else {
      return this.opfsOperator.writeFile(path, data, options);
    }
  }

  async drop() {
    //@ts-expect-error 类型不匹配
    await this.opfsOperator.root.remove({
      recursive: true,
    });
  }

  /**
   * 快照当前路径下的所有成员
   */
  async snapshot(path = "/", options: SnapshotOptions = {}) {
    const { filter } = options;
    const rootHandle = await this.opfsOperator.getPathHandle(path);
    if (rootHandle.kind === "file") {
      throw new TypeError("Cannot snapshot a file");
    }
    const tree: FileTreeNode = {
      name: rootHandle.name,
      kind: "directory",
      path: normalizePath(path),
      children: [],
    };

    const innerSnapshot = async (
      nextHandle: FileSystemDirectoryHandle,
      tree: any
    ) => {
      for await (const [name, handle] of nextHandle.entries()) {
        const path = `${tree.path}/${name}`;
        if (isDirectoryHandle(handle)) {
          const info: FileTreeNode = {
            name,
            kind: "directory",
            path,
            children: [],
          };
          if (filter && !filter(info)) {
            continue;
          }
          tree.children.push(info);
          await innerSnapshot(handle, info);
        }
        if (isFileHandle(handle)) {
          const info: FileTreeNode = {
            name,
            kind: "file",
            path,
          };
          if (filter && !filter(info)) {
            continue;
          }
          tree.children.push(info);
        }
      }
    };

    await innerSnapshot(rootHandle, tree);
    console.log(tree);
    return tree;
  }

  /**
   * 获取指定目录下的成员快照（不递归）
   * @param path 目标路径
   * @returns 返回目录成员的数组
   */
  async getDirectorySnapshot(path: string = '/'): Promise<OpfsNode[]> {
    try {
      const handle = await this.opfsOperator.getPathHandle(path);
      
      if (handle.kind !== 'directory') {
        throw new Error('指定路径不是目录');
      }

      const entries: OpfsNode[] = [];
      for await (const entry of handle.values()) {
        entries.push({
          name: entry.name,
          kind: entry.kind,
          path: path === '/' ? `/${entry.name}` : `${path}/${entry.name}`,
        });
      }

      return entries;
    } catch (error) {
      console.error('获取目录快照失败:', error);
      throw error;
    }
  }
}
