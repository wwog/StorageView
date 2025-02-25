import { LRUCache } from "../../utils/LRUCache";

export function formatPath(path: string[]) {
  //如果第一个是空或者'/'，则去掉
  const _arr = path.slice();
  if (path[0] === "" || path[0] === "/") {
    _arr.shift();
  }
  return "/" + _arr.join("/");
}

export function pathToArr(path: string) {
  const res = path.split("/");
  if (res[0] === "") {
    res.unshift("/");
  }
  return res.filter((item) => item !== "");
}

/**
 * 获取文本宽度，带有缓存
 */
export const getTextWidth = (() => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("context is null");
  }

  const lruCache = new LRUCache<number>(100);

  const getKey = (text: string, font: string) => {
    const t = `${text}-${font}`;
    return t;
  };

  return (text: string, font: string) => {
    const key = getKey(text, font);
    const cache = lruCache.get(key);
    if (cache) {
      return cache;
    }
    context.font = font;
    const metrics = context.measureText(text);
    const width = Math.round(metrics.width);
    lruCache.set(key, width);
    return width;
  };
})();