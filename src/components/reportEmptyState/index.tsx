import React from "react";
import { Icon } from "@iconify/react";

interface ReportEmptyStateProps {
  role: string;
}

const ReportEmptyState: React.FC<ReportEmptyStateProps> = ({ role }) => {
  return (
    <div className="text-center flex flex-col items-center mt-[10%]">
      <div className="bg-[#448CD208] p-4 rounded-full shadow-sm mb-4">
        <Icon
          icon="hugeicons:audit-02"
          className="text-[var(--primary-color)] size-10"
        />
      </div>
      <h2 className="text-xl font-bold text-gray-800">No {role} Selected</h2>
      <p className="text-gray-500 max-w-sm text-sm leading-relaxed px-4">
        To view the detailed performance report and analytics, please select a{" "}
        <strong>{role}</strong> from the filters above.
      </p>
    </div>
  );
};

export default ReportEmptyState;
