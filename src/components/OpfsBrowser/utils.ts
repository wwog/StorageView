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
  return res;
}
