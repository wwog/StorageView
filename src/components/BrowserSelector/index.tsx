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
    default:
      return null;
  }
};
