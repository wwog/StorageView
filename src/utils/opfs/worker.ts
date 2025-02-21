import { OPFS } from "./index";

export type OpfsResult<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
};
let opfs: OPFS;

self.onmessage = async (e: MessageEvent) => {
  const { method, args, id } = e.data;

  const result: OpfsResult<any> = {
    success: true,
    data: null,
    message: null,
  };
  // console.log("Worker", method, args, id);
  try {
    if (method === "init") {
      opfs = await OPFS.create(true);
      // console.log("Worker: initialized");
      result.data = true;
      self.postMessage({ id, result });
      return;
    }

    if (!opfs) {
      throw new Error("OPFS not initialized");
    }
    if (method in opfs) {
      // @ts-expect-error 123
      result.data = await opfs[method](...args);
    } else {
      throw new Error(`Method ${method} not found`);
    }

    self.postMessage({ id, result });
  } catch (error) {
    result.success = false;
    if (error instanceof Error) {
      result.message = error.message;
      self.postMessage({ id, result });
    } else {
      console.error(error);
      result.message = String(error);
      self.postMessage({ id, result });
    }
  }
};
