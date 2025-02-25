import React from "react";
import { clsx } from "../../utils";

interface ListProps {
  children: React.ReactNode;
  className?: string;
}

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const ListItem: React.FC<ListItemProps> = (props) => {
  const { children, className, ...rest } = props;
  return (
    <div
      className={clsx(
        "px-3 py-[6px] text-sm text-gray-800 rounded-md hover:bg-[#0866FF] hover:text-white transition-colors",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const List: React.FC<ListProps> & { Item: typeof ListItem } = ({
  children,
  className,
}) => {
  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={() => {
        const customEvent = new Event("mousedown", {
          bubbles: true,
        });
        document.dispatchEvent(customEvent);
      }}
      className={clsx(
        "bg-white/30 backdrop-blur-xl rounded-lg shadow-lg shadow-black/[0.12] border border-white/30 p-1 min-w-[220px] select-none",
        className
      )}
    >
      {children}
    </div>
  );
};

List.Item = ListItem;

export { ListItem };
export type { ListProps, ListItemProps };
