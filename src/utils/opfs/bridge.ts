import type {
  FileInfo,
  FileTreeNode,
  MakeDirOptions,
  OpfsNode,
  SnapshotOptions,
  WriteFileOptions,
} from "./types";

const opfsWorker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
  name: "StorageViewOpfsWorker",
});
let initialized = false;

async function sendMessage(method: string, args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    const handler = (e: MessageEvent) => {
      const { id: resId, result } = e.data;
      if (resId === id) {
        opfsWorker.removeEventListener("message", handler);

        if (result.success) {
          resolve(result.data);
        } else {
          reject(new Error(result.message));
        }
      }
    };

    opfsWorker.addEventListener("message", handler);
    opfsWorker.postMessage({ method, args, id });
  });
}

export async function createOpfsBridge() {
  if (!initialized) {
    initialized = true;
//todo trycatch 
    await sendMessage("init", []);
  }
  return {
    getDirectorySnapshot: async (path: string): Promise<OpfsNode[]> => {
      return await sendMessage("getDirectorySnapshot", [path]);
    },
    snapshot: async (
      path?: string,
      options?: SnapshotOptions
    ): Promise<FileTreeNode> => {
      return await sendMessage("snapshot", [path, options]);
    },
    writeFile: async (
      path: string,
      data: string | ArrayBuffer | ArrayBufferView | Blob,
      options?: WriteFileOptions
    ): Promise<number> => {
      return await sendMessage("writeFile", [path, data, options]);
    },
    stat: async (path: string): Promise<FileInfo> => {
      return await sendMessage("stat", [path]);
    },
    mkdir: async (
      path: string,
      options: MakeDirOptions = {}
    ): Promise<void> => {
      return await sendMessage("mkdir", [path, options]);
    },
    remove: async (
      path: string,
      options?: FileSystemRemoveOptions
    ): Promise<void> => {
      return await sendMessage("remove", [path, options]);
    },
    drop: async (): Promise<void> => {
      return await sendMessage("drop", []);
    },
  };
}

export type OpfsBridge = Awaited<ReturnType<typeof createOpfsBridge>>;
