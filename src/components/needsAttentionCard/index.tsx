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

const getScoreColor = (score?: number, classification?: string) => {
  if (score != null) {
    if (score < 50) return "#FF5656";
    if (score < 75) return "#F59E0B";
    return "#30AD43";
  }
  if (classification === "Low") return "#FF5656";
  if (classification === "Medium") return "#F59E0B";
  return "#448CD2";
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
  if (d.includes("people")) return "solar:users-group-rounded-bold";
  if (d.includes("operational")) return "solar:settings-minimalistic-bold";
  if (d.includes("digital")) return "solar:cpu-bolt-bold";
  if (d.includes("assessment") || d.includes("invitation")) {
    return "solar:clipboard-check-bold";
  }
  return "solar:chart-square-bold";
};

interface NeedsAttentionCardProps {
  priorities: TopPriority[];
  loading?: boolean;
  showHealthyState?: boolean;
  subtitle?: string;
  onPriorityClick?: (priority: TopPriority) => void;
}

const PriorityScoreBar = ({
  score,
  color,
}: {
  score?: number;
  color: string;
}) => {
  if (score == null) return null;
  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const NeedsAttentionCard = ({
  priorities,
  loading = false,
  showHealthyState = true,
  subtitle,
  onPriorityClick,
}: NeedsAttentionCardProps) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopyStep = async (step: string, idx: number) => {
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
      <div className="mt-6 border border-[#448CD2] border-opacity-20 bg-white p-5 rounded-[12px] animate-pulse">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 bg-gray-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-2/5" />
            <div className="h-3 bg-gray-100 rounded w-3/5" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-44 bg-gray-50 rounded-[10px] border border-gray-100" />
          <div className="h-44 bg-gray-50 rounded-[10px] border border-gray-100" />
        </div>
      </div>
    );
  }

  if (!priorities.length) {
    if (!showHealthyState) return null;
    return (
      <div className="mt-6 border border-[#30AD43] border-opacity-30 bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] p-5 rounded-[12px]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#30AD43] bg-opacity-10 flex items-center justify-center shrink-0">
            <Icon
              icon="solar:check-circle-bold"
              className="text-[#30AD43]"
              width={24}
            />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1A3652]">
              No Critical Issues Right Now
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              Performance signals are within acceptable ranges. Continue monitoring
              charts below for emerging trends.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summary = getPrioritySummary(priorities);

  return (
    <div className="mt-6 rounded-[12px] overflow-hidden border-2 border-[#FF5656] border-opacity-35 shadow-[0_4px_24px_rgba(255,86,86,0.1)]">
      {/* Header band */}
      <div className="bg-gradient-to-r from-[#1A3652] to-[#2d4a6f] px-5 py-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-white bg-opacity-10 flex items-center justify-center shrink-0 border border-white border-opacity-20">
              <Icon icon="solar:danger-triangle-bold" width={24} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Needs Attention Now
              </h3>
              <p className="text-sm text-white text-opacity-80 mt-0.5">
                {subtitle ||
                  `Top ${priorities.length} ${priorities.length === 1 ? "area" : "areas"} ranked by urgency — act within the first 60 seconds`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {summary.critical > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5656] bg-opacity-20 border border-[#FF5656] border-opacity-40 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#FF5656]" />
                {summary.critical} Critical
              </span>
            )}
            {summary.atRisk > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B] bg-opacity-20 border border-[#F59E0B] border-opacity-40 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                {summary.atRisk} At Risk
              </span>
            )}
            {summary.operational > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white bg-opacity-10 border border-white border-opacity-20 text-xs font-bold">
                <Icon icon="solar:clipboard-list-bold" width={14} />
                {summary.operational} Operational
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Priority cards */}
      <div className="bg-gradient-to-br from-[#fff8f8] to-[#fffbf5] p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {priorities.map((item, idx) => {
            const color = getScoreColor(item.score, item.classification);
            const badge = getClassificationLabel(item.score, item.classification);
            const isExpanded = expandedIdx === idx;
            const isClickable = !!onPriorityClick;

            return (
              <div
                key={`${item.area}-${idx}`}
                className={`bg-white rounded-[12px] border border-[#448CD2] border-opacity-15 overflow-hidden transition-shadow hover:shadow-md ${
                  isClickable ? "cursor-pointer" : ""
                }`}
                onClick={() => isClickable && onPriorityClick?.(item)}
              >
                {/* Card header */}
                <div
                  className="px-4 pt-4 pb-3 border-b border-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIdx(isExpanded ? null : idx);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      <Icon icon={getDomainIcon(item.domain)} width={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${color}15`,
                            color,
                          }}
                        >
                          Priority {item.rank ?? idx + 1}
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: `${color}40`,
                            color,
                          }}
                        >
                          {badge}
                        </span>
                      </div>
                      <p className="font-bold text-[#1A3652] text-sm mt-1.5 leading-tight">
                        {item.area}
                      </p>
                      {item.domain && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.domain}
                        </p>
                      )}
                      <PriorityScoreBar score={item.score} color={color} />
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {item.score != null && (
                        <span
                          className="text-2xl font-black leading-none"
                          style={{ color }}
                        >
                          {item.score}%
                        </span>
                      )}
                      <button
                        type="button"
                        className="text-gray-400 hover:text-[#448CD2] transition-colors p-0.5"
                        aria-label={isExpanded ? "Collapse details" : "Expand details"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedIdx(isExpanded ? null : idx);
                        }}
                      >
                        <Icon
                          icon={
                            isExpanded
                              ? "solar:alt-arrow-up-linear"
                              : "solar:alt-arrow-down-linear"
                          }
                          width={18}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div
                  className={`px-4 transition-all duration-300 ${
                    isExpanded ? "py-4 opacity-100" : "py-0 max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#FF5656] bg-opacity-10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon
                          icon="solar:danger-circle-bold"
                          className="text-[#FF5656]"
                          width={12}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Issue
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mt-0.5">
                          {item.issue}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#F59E0B] bg-opacity-10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon
                          icon="solar:graph-down-bold"
                          className="text-[#F59E0B]"
                          width={12}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Impact
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                          {item.impact}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[10px] bg-[#EDF5FD] border border-[#448CD2] border-opacity-20 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-2.5 flex-1">
                          <div className="w-5 h-5 rounded-full bg-[#448CD2] bg-opacity-15 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon
                              icon="solar:flag-bold"
                              className="text-[#448CD2]"
                              width={12}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-[#448CD2]">
                              First Recommended Step
                            </p>
                            <p className="text-sm font-semibold text-[#1A3652] leading-relaxed mt-0.5">
                              {item.recommendedStep}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyStep(item.recommendedStep, idx);
                          }}
                          className="shrink-0 p-1.5 rounded-lg hover:bg-white transition-colors text-[#448CD2]"
                          title="Copy recommended step"
                        >
                          <Icon
                            icon={
                              copiedIdx === idx
                                ? "solar:check-circle-bold"
                                : "solar:copy-bold"
                            }
                            width={16}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsed preview */}
                {!isExpanded && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      <span className="font-semibold text-gray-600">Impact: </span>
                      {item.impact}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1.5">
          <Icon icon="solar:info-circle-linear" width={14} />
          Tap a priority card to expand details · Copy the first step to share with your team
        </p>
      </div>
    </div>
  );
};

export default NeedsAttentionCard;
