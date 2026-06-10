import { Icon } from "@iconify/react";
import type { OverviewScope } from "../../utils/overviewScope";
import { getHierarchyIcon, getRoleColor } from "../../utils/overviewScope";

interface OverviewScopeBannerProps {
  scope: OverviewScope;
  overallScore?: number;
  loading?: boolean;
}

const OverviewScopeBanner = ({
  scope,
  overallScore,
  loading = false,
}: OverviewScopeBannerProps) => {
  if (loading) {
    return (
      <div className="rounded-[12px] border border-[#448CD2] border-opacity-20 bg-[#EDF5FD] p-5 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
        <div className="flex gap-2">
          <div className="h-8 bg-gray-100 rounded-full w-24" />
          <div className="h-8 bg-gray-100 rounded-full w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#448CD2] border-opacity-25 bg-gradient-to-r from-[#EDF5FD] via-white to-[#f8fbff] overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#448CD2] mb-1">
              {scope.level === "organization"
                ? "Organization Level"
                : scope.level === "department"
                  ? "Department Level"
                  : "Team Level"}
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A3652] tracking-tight">
              {scope.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{scope.subtitle}</p>
          </div>

          {overallScore != null && overallScore > 0 && (
            <div className="shrink-0 flex items-center gap-3 bg-white border border-[#448CD2] border-opacity-20 rounded-[10px] px-4 py-2.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Scope Score
                </p>
                <p className="text-2xl font-black text-[#1A3652] leading-none">
                  {Math.round(overallScore)}%
                </p>
              </div>
              <div
                className={`w-2 h-10 rounded-full ${
                  overallScore < 50
                    ? "bg-[#FF5656]"
                    : overallScore < 75
                      ? "bg-[#F59E0B]"
                      : "bg-[#30AD43]"
                }`}
              />
            </div>
          )}
        </div>

        {/* Hierarchy breadcrumb */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-sm">
          {scope.hierarchy.map((step, idx) => (
            <div key={step.key} className="flex items-center gap-1.5">
              {idx > 0 && (
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  className="text-gray-300 shrink-0"
                  width={14}
                />
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  step.active
                    ? "bg-[#1A3652] text-white border-[#1A3652] shadow-sm"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                <Icon icon={getHierarchyIcon(step.key)} width={14} />
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Who is included in this view */}
      <div className="px-5 py-3.5 bg-white bg-opacity-60 border-t border-[#448CD2] border-opacity-15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:eye-bold"
              className="text-[#448CD2] shrink-0"
              width={16}
            />
            <p className="text-xs font-semibold text-gray-600">
              Data includes{" "}
              <span className="text-[#1A3652]">
                {scope.includesRoles.map((r) => r.label).join(" · ")}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {scope.includesRoles.map((chip) => (
              <span
                key={chip.role}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                style={{
                  color: getRoleColor(chip.role),
                  backgroundColor: `${getRoleColor(chip.role)}12`,
                  borderColor: `${getRoleColor(chip.role)}30`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: getRoleColor(chip.role) }}
                />
                {chip.count} {chip.label}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1A3652] bg-opacity-5 text-[#1A3652] border border-[#1A3652] border-opacity-10">
              {scope.totalMembers} total in scope
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewScopeBanner;
