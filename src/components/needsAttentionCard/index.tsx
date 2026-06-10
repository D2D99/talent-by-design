import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { getPrioritySummary } from "../../utils/priorityUtils";

export type TopPriority = {
  rank?: number;
  domain: string;
  subdomain?: string;
  area: string;
  score?: number;
  classification?: string;
  issue: string;
  impact: string;
  recommendedStep: string;
};

interface NeedsAttentionCardProps {
  priorities: TopPriority[];
  loading?: boolean;
  showHealthyState?: boolean;
  subtitle?: string;
  onPriorityClick?: (priority: TopPriority) => void;
}

const getScoreColor = (score?: number, classification?: string) => {
  if (score != null) {
    if (score < 50)
      return {
        hex: "#EF4444",
        text: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-100",
      };
    if (score < 75)
      return {
        hex: "#FEE114",
        text: "text-amber-400",
        bg: "bg-amber-50",
        border: "border-amber-100",
      };
    return {
      hex: "#10B981",
      text: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    };
  }
  if (classification === "Low")
    return {
      hex: "#EF4444",
      text: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
    };
  if (classification === "Medium")
    return {
      hex: "#F59E0B",
      text: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    };
  return {
    hex: "#3B82F6",
    text: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  };
};

const getClassificationLabel = (score?: number, classification?: string) => {
  if (classification) return classification;
  if (score == null) return "Action";
  if (score < 50) return "Low";
  if (score < 75) return "Medium";
  return "High";
};

const getDomainIcon = (domain: string) => {
  const d = domain.toLowerCase();
  // if (d.includes("people")) return "solar:users-group-rounded-bold";
  // if (d.includes("operational")) return "solar:settings-minimalistic-bold";
  // if (d.includes("digital")) return "solar:cpu-bolt-bold";
  if (d.includes("people")) return "solar:users-group-rounded-linear";
  if (d.includes("operational")) return "solar:settings-minimalistic-linear";
  if (d.includes("digital")) return "solar:cpu-bolt-linear";
  if (d.includes("assessment") || d.includes("invitation"))
    return "solar:clipboard-check-bold";
  return "solar:chart-square-bold";
};

export const NeedsAttentionCard = ({
  priorities,
  loading = false,
  showHealthyState = true,
  subtitle,
  onPriorityClick,
}: NeedsAttentionCardProps) => {
  const [expandedIdxs, setExpandedIdxs] = useState<number[]>([0]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setExpandedIdxs((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const handleCopyStep = async (
    e: React.MouseEvent,
    step: string,
    idx: number,
  ) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(step);
      setCopiedIdx(idx);
      toast.success("Recommended step copied");
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="mt-6 border border-slate-200 bg-white p-6 rounded-xl space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-48 bg-slate-50 rounded-xl border border-slate-100" />
          <div className="h-48 bg-slate-50 rounded-xl border border-slate-100" />
        </div>
      </div>
    );
  }

  if (!priorities.length) {
    if (!showHealthyState) return null;
    return (
      <div className="mt-6 border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/20 p-6 rounded-xl shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <Icon icon="solar:check-circle-bold" width={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No Critical Issues Right Now
            </h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Performance signals are within acceptable ranges. Continue
              monitoring charts below for emerging trends.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summary = getPrioritySummary(priorities);

  return (
    <div className="mt-6 bg-white border border-red-500 border-opacity-20 rounded-xl  overflow-hidden">
      <div className="bg-[#FFEBEB] px-6 py-5 text-[#D71818]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-[#D71818]/5 flex items-center justify-center shrink-0 border border-[#D71818]/10 text-[#D71818]">
              <Icon icon="circum:warning" width={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Needs Attention Now</h3>
              <p className="text-xs text-slate-500">
                {subtitle ||
                  `Top ${priorities.length} ${priorities.length === 1 ? "area" : "areas"} ranked by urgency — act within the first 60 seconds`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {summary.critical > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D71818]/15 border border-[#D71818]/20 text-[10px] font-semibold text-[#D71818]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D71818] animate-pulse" />
                {summary.critical} Critical
              </span>
            )}
            {summary.atRisk > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {summary.atRisk} At Risk
              </span>
            )}
            {summary.operational > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-white text-[10px] font-semibold text-slate-500">
                <Icon icon="system-uicons:clipboard" width={12} />
                {summary.operational} Operational
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-red-50/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {priorities.map((item, idx) => {
            const colors = getScoreColor(item.score, item.classification);
            const badge = getClassificationLabel(
              item.score,
              item.classification,
            );
            const isExpanded = expandedIdxs.includes(idx);
            const isClickable = !!onPriorityClick;

            return (
              <div
                key={`${item.area}-${idx}`}
                onClick={() => isClickable && onPriorityClick?.(item)}
                className={`bg-white rounded-xl border border-gray-100 flex-col overflow-hidden transition-all duration-300 ${
                  isClickable ? "cursor-pointer hover:border-gray-200" : ""
                }`}
              >
                {/* Header Action Layer */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAccordion(idx);
                  }}
                  className="w-full text-left p-5 flex items-start gap-4 focus:outline-none focus:bg-slate-50/50"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 border ${colors.border}`}
                  >
                    <Icon icon={getDomainIcon(item.domain)} width={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold tracking-wider uppercase ${colors.text}`}
                      >
                        Priority {item.rank ?? idx + 1}
                      </span>
                      <span className="text-[8px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                        {badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                      {item.area}
                    </h4>

                    {item.domain && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.domain}
                      </p>
                    )}

                    {item.score != null && (
                      <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(item.score, 100)}%`,
                            backgroundColor: colors.hex,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-between h-full min-h-[40px] shrink-0">
                    {item.score != null && (
                      <span
                        className="text-xl font-extrabold tracking-tight"
                        style={{ color: colors.hex }}
                      >
                        {item.score}%
                      </span>
                    )}
                    <div className="text-slate-400 group-hover:text-slate-600 transition-colors mt-auto">
                      <Icon
                        icon="solar:alt-arrow-down-linear"
                        width={18}
                        className={`transform transition-transform duration-300 ease-out ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </button>

                {/* Animated Drawer Section for BOTH Expand State & Preview State */}
                <div className="border-t border-slate-100 bg-slate-50/30 relative">
                  {/* Expanded Content View */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded
                        ? "max-h-[500px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="p-5 space-y-4 divide-y divide-slate-100/80">
                      <div className="flex gap-3 pt-0">
                        <Icon
                          icon="solar:danger-circle-linear"
                          className="text-red-500 mt-0.5 shrink-0"
                          width={16}
                        />
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
                            Issue
                          </span>
                          <p className="text-sm text-slate-700 leading-relaxed mt-0.5">
                            {item.issue}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <Icon
                          icon="solar:graph-down-linear"
                          className="text-amber-500 mt-0.5 shrink-0"
                          width={16}
                        />
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
                            Impact
                          </span>
                          <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                            {item.impact}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3">
                        <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3.5 flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <Icon
                              icon="solar:flag-linear"
                              className="text-blue-500 mt-0.5 shrink-0"
                              width={16}
                            />
                            <div>
                              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-500 block">
                                First Recommended Step
                              </span>
                              <p className="text-sm font-semibold text-slate-900 leading-relaxed mt-0.5">
                                {item.recommendedStep}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) =>
                              handleCopyStep(e, item.recommendedStep, idx)
                            }
                            className="shrink-0 p-2 rounded-lg bg-white border border-blue-100 hover:bg-blue-50 text-blue-600 shadow-sm transition-colors"
                            title="Copy action step"
                          >
                            <Icon
                              icon={
                                copiedIdx === idx
                                  ? "solar:check-circle-linear"
                                  : "solar:copy-linear"
                              }
                              width={14}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsed Preview View (Transitions smoothly inside the frame container) */}
                  <div
                    className={`absolute inset-x-0 top-0 transition-all duration-300 ease-in-out overflow-hidden ${
                      !isExpanded
                        ? "max-h-20 opacity-100 py-3 px-5"
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <p className="text-xs text-slate-500 line-clamp-1">
                      <span className="font-semibold text-slate-600">
                        Impact:{" "}
                      </span>
                      {item.impact}
                    </p>
                  </div>

                  {/* Spacer helper to prevent container layout jumping during absolute transition shifts */}
                  <div
                    className={`transition-all duration-300 ${!isExpanded ? "h-[38px]" : "h-0"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 text-center mt-5 flex items-center justify-center gap-2">
          <Icon
            icon="solar:info-circle-linear"
            width={14}
            className="text-slate-500"
          />
          Click any card to inspect internal metrics · Transfer direct steps
          instantly using the action buttons.
        </p>
      </div>
    </div>
  );
};

export default NeedsAttentionCard;
