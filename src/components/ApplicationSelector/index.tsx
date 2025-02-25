import { FC } from "react";
import { useApplicationInstances, useActiveApplicationInstance, useApplications } from "../../store/applications";
import { clsx } from "../../utils";
import type { ApplicationInstance } from "../../types/application";

export const ApplicationSelector: FC = () => {
  const [applicationInstances] = useApplicationInstances();
  const [activeInstanceId, setActiveInstanceId] = useActiveApplicationInstance();

  return (
    <div className="flex flex-col px-2 py-2">
      {applicationInstances.map((instance) => (
        <ApplicationItem
          key={instance.id}
          instance={instance}
          selected={instance.id === activeInstanceId}
          onClick={() => setActiveInstanceId(instance.id)}
        />
      ))}
    </div>
  );
};

const ApplicationItem: FC<{
  instance: ApplicationInstance;
  selected: boolean;
  onClick: () => void;
}> = ({ instance, selected, onClick }) => {
  const [applications] = useApplications();
  const application = applications.find(app => app.id === instance.applicationId);

  return (
    <div
      className={clsx(
        "cursor-pointer px-2 py-2 flex items-center gap-2 rounded-md",
        selected ? "bg-[#c5c9cae6]" : ""
      )}
      onClick={onClick}
    >
      {application?.icon || "📄"}
      <span className="truncate">{instance.fileName}</span>
    </div>
  );
}; 