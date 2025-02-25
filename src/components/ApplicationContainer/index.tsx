import { FC } from "react";
import React from "react";
import {
  useApplicationInstances,
  useActiveApplicationInstance,
  useApplications,
} from "../../store/applications";
import { clsx } from "../../utils";

export const ApplicationContainer: FC = () => {
  const [applicationInstances, setApplicationInstances] =
    useApplicationInstances();
  const [activeInstanceId, setActiveInstanceId] =
    useActiveApplicationInstance();
  const [applications] = useApplications();

  const closeInstance = (instanceId: string) => {
    setApplicationInstances((prev) =>
      prev.filter((instance) => instance.id !== instanceId)
    );
    if (activeInstanceId === instanceId) {
      // 如果关闭的是当前活跃的实例，则激活最后一个实例
      const remainingInstances = applicationInstances.filter(
        (instance) => instance.id !== instanceId
      );
      if (remainingInstances.length > 0) {
        setActiveInstanceId(
          remainingInstances[remainingInstances.length - 1].id
        );
      } else {
        setActiveInstanceId(null);
      }
    }
  };

  if (applicationInstances.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400">
        没有打开的文件
      </div>
    );
  }

  const activeInstance = applicationInstances.find(
    (instance) => instance.id === activeInstanceId
  );

  const application = activeInstance
    ? applications.find((app) => app.id === activeInstance.applicationId)
    : null;

  console.log(activeInstance, application, applicationInstances);

  return (
    <div className="h-full w-full flex flex-col">
      {/* 标签栏 */}
      <div className="flex-none h-10 bg-[#f5f5f5] border-b border-gray-200 flex items-center">
        <div className="flex-1 flex items-center overflow-x-auto">
          {applicationInstances.map((instance) => {
            const app = applications.find(
              (a) => a.id === instance.applicationId
            );
            const isActive = instance.id === activeInstanceId;

            return (
              <div
                key={instance.id}
                className={clsx(
                  "flex items-center h-9 px-3 border-r border-gray-200 cursor-pointer group",
                  isActive ? "bg-white" : "hover:bg-gray-100"
                )}
                onClick={() => setActiveInstanceId(instance.id)}
              >
                <span className="mr-2">{app?.icon || "📄"}</span>
                <span className="font-medium">{instance.fileName}</span>
                <button
                  className={clsx(
                    "ml-2 p-1 rounded-full hover:bg-gray-200",
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeInstance(instance.id);
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 内容区域 */}
      {activeInstance && application ? (
        <div className="flex-1 overflow-hidden">
          {React.createElement(application.component, {
            fileId: activeInstance.fileId,
            filePath: activeInstance.filePath,
            fileName: activeInstance.fileName,
            fileType: activeInstance.fileType,
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          请选择要查看的文件
        </div>
      )}
    </div>
  );
};
