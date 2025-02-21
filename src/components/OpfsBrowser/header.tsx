import { FC } from "react";
import { Button } from "../Input/button";
import { useOpfsBrowser } from "../../hooks/useOpfsBrowser";

export const Header: FC = () => {
  const { currentPath, opfsBrowser, canGoBack } = useOpfsBrowser();
  const handleRefresh = () => {
    opfsBrowser?.refresh();
  };

  const handleNewFolder = async () => {
    const newFolderName = prompt("请输入文件夹名称");
    if (!newFolderName) return;
    await opfsBrowser?.opfsBridge.mkdir(newFolderName, {
      recursive: true,
    });
  };
  return (
    <div
      className="px-[10px] py-[10px] justify-between bg-[#f1f2f3]"
      style={{
        boxShadow: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="text-xl px-5 flex justify-between">
        <div className="flex gap-3">
          {canGoBack && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => opfsBrowser?.goBack()}
              icon="🔙"
            />
          )}

          <div>{currentPath}</div>
        </div>
        <div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={opfsBrowser?.test}
              icon="🔄"
            >
              测试文件
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              icon="🔄"
            >
              刷新
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNewFolder}
              icon="📂"
            >
              新建文件夹
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
