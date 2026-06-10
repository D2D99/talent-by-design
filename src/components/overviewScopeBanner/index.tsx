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
      <div className="rounded-[12px] border border-[var(--light-primary-color)] border-opacity-20 bg-[#EDF5FD] p-5 animate-pulse">
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
    <div className="rounded-[12px] border border-[var(--light-primary-color)] border-opacity-25">
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-color)] mb-1">
              {scope.level === "organization"
                ? "Organization Level"
                : scope.level === "department"
                  ? "Department Level"
                  : "Team Level"}
            </p>
            <h2 className="text-xl sm:text-2xl font-black  tracking-tight">
              {scope.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{scope.subtitle}</p>
          </div>

          {overallScore != null && overallScore > 0 && (
            <div className="shrink-0 flex items-center gap-3 bg-[#448CD2] bg-opacity-5 border border-[var(--light-primary-color)] border-opacity-20 rounded-[10px] px-4 py-2.5 w-fit">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                  Scope Score
                </p>
                <p className="text-2xl font-black  leading-none">
                  {Math.round(overallScore)}%
                </p>
              </div>
              <div
                className={`w-2 h-10 rounded-full ${
                  overallScore < 50
                    ? "bg-[#FF5656]"
                    : overallScore < 75
                      ? "bg-[#FEE114]"
                      : "bg-[#30AD43]"
                }`}
              />
            </div>
          )}
        </div>

        {/* Hierarchy breadcrumb */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5 text-sm">
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
                    ? "bg-[var(--dark-primary-color)] text-white border-[var(--dark-primary-color)] shadow-sm"
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

      <div className="px-5 py-3.5 bg-[#448CD2] bg-opacity-10 rounded-b-xl border-t border-[var(--light-primary-color)] border-opacity-15">
        <div className="flex flex-wrap sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:eye-outline"
              className="text-[var(--primary-color)] shrink-0"
              width={16}
            />
            <p className="text-xs font-semibold text-gray-600">
              Data includes{" "}
              <span className="">
                {scope.includesRoles.map((r) => r.label).join(" · ")}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1A3652] bg-opacity-5  border border-[#1A3652] border-opacity-10 hidden">
              {scope.totalMembers} total in scope
            </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewScopeBanner;
