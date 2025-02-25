import { FC } from "react";
import { useOpfsBrowser } from "../../hooks/useOpfsBrowser";
import { ArrayRender } from "../RenderUtils/ArrayRender";
import { clsx } from "../../utils";
import { MarqueeSelection } from "../MarqueeSelection";
import type { OpfsNode } from "../../utils/opfs/types";
import { List } from "../List";
import { Truncate } from "../TextTruncate";
import { ApplicationManager } from "../../store/applications";
import { useApplicationInstances, useActiveApplicationInstance } from "../../store/applications";

export const Content: FC = () => {
  const { currentDirItems, goToByPath, deleteByPaths } = useOpfsBrowser();
  const [, setApplicationInstances] = useApplicationInstances();
  const [, setActiveInstanceId] = useActiveApplicationInstance();

  const openItem = (item: OpfsNode) => {
    if (item.kind === "directory") {
      goToByPath(item.path);
    } else {
      const fileType = item.name.split(".").pop() || "";
      const applications =
        ApplicationManager.getInstance().getApplicationsByFileType(fileType);

      if (applications.length > 0) {
        // 使用第一个支持的应用打开文件
        const application = applications[0];
        const newInstanceId = crypto.randomUUID();
        
        // 更新应用实例列表
        setApplicationInstances((prev) => [
          ...prev,
          {
            id: newInstanceId,
            applicationId: application.id,
            fileId: item.path,
            filePath: item.path,
            fileName: item.name,
            fileType,
            active: true,
          },
        ]);

        // 设置新实例为活跃实例
        setActiveInstanceId(newInstanceId);
      } else {
        alert("No application supports this file type");
      }
    }
  };

  const deleteItem = (items: OpfsNode[]) => {
    deleteByPaths(items.map((item) => item.path));
  };

  return (
    <MarqueeSelection
      className="h-full w-full p-4 flex flex-wrap gap-3 content-start"
      selectedItemClassName="bg-blue-300/30 transition-colors duration-300"
      onSelectedItemDoubleClick={(clicked) => {
        openItem(JSON.parse(clicked.getAttribute("data-node")!));
      }}
      contextMenuContent={(_e, clicked, selected) => {
        if (clicked) {
          return (
            <List>
              <List.Item
                onClick={() => {
                  openItem(JSON.parse(clicked.getAttribute("data-node")!));
                }}
              >
                Open
              </List.Item>
              <List.Item
                onClick={() => {
                  deleteItem(
                    selected.map((item) =>
                      JSON.parse(item.getAttribute("data-node")!)
                    )
                  );
                }}
              >
                Delete
              </List.Item>
            </List>
          );
        }
        return null;
      }}
    >
      <ArrayRender
        items={currentDirItems}
        renderItem={(item) => {
          const isDirectory = item.kind === "directory";

          return (
            <div
              key={item.name}
              data-node={JSON.stringify(item)}
              className={clsx("w-34 p-2 rounded")}
            >
              <div
                className={clsx("flex flex-col items-center justify-center")}
              >
                <div className="text-[48px]">{isDirectory ? "📁" : "📄"}</div>
              </div>
              <Truncate
                suffixMinLength={7}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                {item.name}
              </Truncate>
            </div>
          );
        }}
      />
    </MarqueeSelection>
  );
};
