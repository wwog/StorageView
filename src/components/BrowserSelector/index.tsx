import { FC } from "react";
import { useBrowserType } from "../../store";
import { BrowserType, BrowserTypeLabelMap } from "../../constant";
import { clsx } from "../../utils";

export const BrowserSelector: FC = () => {
  const [browserType, setBrowserType] = useBrowserType();
  return (
    <div className="flex flex-col px-2 py-2">
      <BrowserItem
        browserType={BrowserType.opfs}
        selected={browserType === BrowserType.opfs}
        onClick={setBrowserType}
      />
      <BrowserItem
        browserType={BrowserType.localStorage}
        selected={browserType === BrowserType.localStorage}
        onClick={setBrowserType}
      />
      <BrowserItem
        browserType={BrowserType.sessionStorage}
        selected={browserType === BrowserType.sessionStorage}
        onClick={setBrowserType}
      />
    </div>
  );
};

const BrowserItem: FC<{
  browserType: BrowserType;
  selected: boolean;
  onClick: (browserType: BrowserType) => void;
}> = ({ browserType, selected, onClick }) => {
  return (
    <div
      className={clsx(
        "cursor-pointer px-2 py-2 flex items-center gap-2 rounded-md",
        selected ? "bg-[#c5c9cae6]" : ""
      )}
      onClick={() => onClick(browserType)}
    >
      {getStorageIcon(browserType, selected)}
      {BrowserTypeLabelMap[browserType]}
    </div>
  );
};

const getStorageIcon = (browserType: BrowserType, selected: boolean) => {
  const color = selected ? "#3B82F6" : "#6B7280";

  switch (browserType) {
    case BrowserType.opfs:
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 4H20V20H4V4Z" stroke={color} strokeWidth="2" />
          <path d="M4 8H20" stroke={color} strokeWidth="2" />
          <path
            d="M8 12H16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 16H16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case BrowserType.localStorage:
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
            stroke={color}
            strokeWidth="2"
          />
          <path d="M8 8H16V16H8V8Z" stroke={color} strokeWidth="2" />
          <path d="M12 8V16" stroke={color} strokeWidth="2" />
        </svg>
      );
    case BrowserType.sessionStorage:
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
            stroke={color}
            strokeWidth="2"
          />
          <path d="M8 8H16V16H8V8Z" stroke={color} strokeWidth="2" />
          <path d="M8 12H16" stroke={color} strokeWidth="2" />
          <path
            d="M12 16L12 8"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="2 2"
          />
        </svg>
      );
  }
};
