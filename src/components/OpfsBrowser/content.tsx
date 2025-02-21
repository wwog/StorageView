import { FC, ReactNode, useEffect, useState } from "react";
import { useOpfsBrowser } from "../../hooks/useOpfsBrowser";
import { ArrayRender } from "../RenderUtils/ArrayRender";
import { clsx } from "../../utils";

interface ContentProps {
  children?: ReactNode;
}

export const Content: FC<ContentProps> = (props) => {
  const { currentDirItems, goTo } = useOpfsBrowser();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {}, [currentDirItems]);

  const handleItemClick = (item: any) => {
    setSelectedItem(item.name);
  };

  const handleItemDoubleClick = (item: any) => {
    if (item.kind === "directory") {
      goTo([...item.path.split("/").filter(Boolean)], true);
    }
  };

  return (
    <div
      className="h-full w-full p-4 flex flex-wrap gap-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedItem(null);
        }
      }}
    >
      <ArrayRender
        items={currentDirItems}
        renderItem={(item) => {
          const isDirectory = item.kind === "directory";
          const isSelected = selectedItem === item.name;
          return (
            <div key={item.name}>
              <div
                key={item.name}
                className={clsx(
                  "px-6 flex flex-col items-center justify-center border rounded",
                  isDirectory ? "hover:bg-blue-50" : "",
                  isSelected ? "bg-blue-100" : ""
                )}
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <div className="text-[52px]">{isDirectory ? "📁" : "📄"}</div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
