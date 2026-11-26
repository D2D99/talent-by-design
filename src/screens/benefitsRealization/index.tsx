import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import { useAuth } from "../../context/useAuth";

export const BenefitsRealizationDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingCheckpoint, setUpdatingCheckpoint] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(
    user?.orgName && (user.orgName === "WTEC" || user.orgName === "Langara College")
      ? user.orgName
      : "Langara College"
  );
  const [scaleMode, setScaleMode] = useState<"LIKERT" | "PERCENT">("LIKERT");
  const [activeView, setActiveView] = useState<"DASHBOARD" | "SURVEY" | "TECHNICAL">("DASHBOARD");
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [showGovernance, setShowGovernance] = useState(false);

  // Modal State for Editing Recommendations / Next Actions
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingRecs, setSavingRecs] = useState(false);
  const [editedRecs, setEditedRecs] = useState<Record<string, string>>({});

  // Dynamic Excel Export State
  const [exportingExcel, setExportingExcel] = useState(false);

  // Expandable Methodology & SuperAdmin Governance Configuration
  const [showMethodology, setShowMethodology] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [governanceConfigState, setGovernanceConfigState] = useState<any>(null);

  const isSuperAdmin = user?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    if (user?.orgName && (user.orgName === "WTEC" || user.orgName === "Langara College")) {
      setSelectedOrg(user.orgName);
    }
  }, [user?.orgName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditModalOpen) {
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditModalOpen]);

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      const res = await api.get(
        `/benefits/export-excel?orgName=${encodeURIComponent(selectedOrg)}`,
        { responseType: "blob" },
      );
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${selectedOrg.replace(/\s+/g, "_")}_Benefits_Realization_Scorecard.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Excel scorecard downloaded successfully!");
    } catch (err) {
      toast.error("Failed to export Excel scorecard");
    } finally {
      setExportingExcel(false);
    }
  };

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/benefits?orgName=${encodeURIComponent(selectedOrg)}`);
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        if (res.data.data.governanceConfig) {
          setGovernanceConfigState(res.data.data.governanceConfig);
        }
        const initialRecs: Record<string, string> = {};
        (res.data.data.needsAttention || []).forEach((na: any) => {
          initialRecs[na.id] = na.recommendation || "";
        });
        setEditedRecs(initialRecs);
      }
    } catch (err) {
      console.error("Failed to load benefits data from backend API:", err);
      toast.error("Failed to load Benefits Realization data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, [selectedOrg]);

  const handleCheckpointSelect = async (cpNum: number) => {
    try {
      setUpdatingCheckpoint(true);
      const res = await api.put("/benefits/checkpoint", {
        orgName: selectedOrg,
        checkpointNumber: cpNum,
      });
      if (res.data?.success) {
        toast.success(`Active review gate switched to Checkpoint ${cpNum}`);
        setData(res.data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update review gate");
    } finally {
      setUpdatingCheckpoint(false);
    }
  };

  const handleSaveRecommendations = async () => {
    try {
      setSavingRecs(true);
      for (const [id, recommendation] of Object.entries(editedRecs)) {
        await api.put("/benefits/needs-attention", {
          orgName: selectedOrg,
          id,
          recommendation,
        });
      }
      toast.success("Action recommendations updated successfully!");
      setIsEditModalOpen(false);
      await fetchBenefits();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save recommendations");
    } finally {
      setSavingRecs(false);
    }
  };

  const handleSaveGovernanceConfig = async () => {
    try {
      setSavingConfig(true);
      const res = await api.put("/benefits/governance-config", {
        orgName: selectedOrg,
        governanceConfig: governanceConfigState,
      });
      if (res.data?.success) {
        toast.success("Governance configuration & thresholds updated successfully!");
        setIsConfigModalOpen(false);
        await fetchBenefits();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update governance configuration");
    } finally {
      setSavingConfig(false);
    }
  };

  const formatScore = (val: number) => {
    if (scaleMode === "PERCENT") {
      return `${Math.round((val / 5.0) * 100)}%`;
    }
    return val?.toFixed(1) || "0.0";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Track":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[9.5px] 2xl:text-[10px] font-bold bg-[#E8F8EE] text-[#1E824C] border border-[#A3E4D7]/50 whitespace-nowrap shrink-0">
            <Icon icon="solar:check-circle-bold" width={11} className="text-[#27AE60]" />
            On Track
          </span>
        );
      case "Verified":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[9.5px] 2xl:text-[10px] font-bold bg-[#E8F8EE] text-[#1E824C] border border-[#A3E4D7]/50 whitespace-nowrap shrink-0">
            <Icon icon="solar:check-circle-bold" width={11} className="text-[#27AE60]" />
            Verified
          </span>
        );
      case "Monitor":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[9.5px] 2xl:text-[10px] font-bold bg-[#FFF9E6] text-[#D35400] border border-[#FAD7A0]/60 whitespace-nowrap shrink-0">
            <Icon icon="solar:danger-circle-bold" width={11} className="text-[#F39C12]" />
            Monitor
          </span>
        );
      case "Progressing":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[9.5px] 2xl:text-[10px] font-bold bg-[#EBF5FB] text-[#2980B9] border border-[#AED6F1]/60 whitespace-nowrap shrink-0">
            <Icon icon="solar:info-circle-bold" width={11} className="text-[#3498DB]" />
            Progressing
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[9.5px] 2xl:text-[10px] bg-slate-100 text-slate-700 whitespace-nowrap shrink-0">
            {status}
          </span>
        );
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <SpinnerLoader />
      </div>
    );
  }

  if (!loading && !data) {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-[16px] text-center space-y-4 my-6 shadow-sm">
        <Icon icon="solar:danger-triangle-linear" width={48} className="mx-auto text-amber-500" />
        <h3 className="text-xl font-bold text-slate-800">Benefits Dashboard Data Unavailable</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Could not retrieve scorecard records for {selectedOrg}. Please ensure the backend is running and try again.
        </p>
        <button
          onClick={fetchBenefits}
          className="px-5 py-2 bg-[#F15A22] text-white text-xs font-bold rounded-full hover:bg-[#F15A22] transition cursor-pointer"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="langara-branding-scope bg-white border border-[#D1D2D4] shadow-[0_4px_12px_rgba(241,90,34,0.06)] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] space-y-3.5 sm:space-y-4">
      {/* =========================================================================
          TOP CONTROLS TOOLBAR (Export, Switchers, Edit)
          ========================================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-[12px] border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="whitespace-nowrap">Live M365 Realization Data Active</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="Langara College">Langara College (Vancouver, BC)</option>
            <option value="WTEC">WTEC (Langara College)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
          {/* Scale Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-[11px] font-bold border border-slate-200">
            <button
              onClick={() => setScaleMode("LIKERT")}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                scaleMode === "LIKERT"
                  ? "bg-[#F15A22] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1–5 Scale
            </button>
            <button
              onClick={() => setScaleMode("PERCENT")}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                scaleMode === "PERCENT"
                  ? "bg-[#F15A22] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              % Index
            </button>
          </div>

          {/* Methodology & Scoring Legend Toggle */}
          <button
            type="button"
            onClick={() => setShowMethodology(!showMethodology)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold rounded-[8px] transition cursor-pointer shadow-2xs ${
              showMethodology
                ? "bg-orange-50 border-[#F15A22] text-[#F15A22]"
                : "bg-white border-slate-300 hover:border-slate-400 text-slate-700"
            }`}
            title="Toggle Scoring Methodology, Performance Thresholds & Legend"
          >
            <Icon icon="solar:info-circle-bold" width={14} className="text-[#F15A22]" />
            <span className="whitespace-nowrap">Methodology &amp; Legend</span>
          </button>

          {/* SuperAdmin Governance Configuration Button */}
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-[8px] transition cursor-pointer shadow-2xs"
              title="Centralized Governance Worksheet & Threshold Configuration"
            >
              <Icon icon="solar:settings-bold" width={14} className="text-amber-400" />
              <span className="whitespace-nowrap">Config Worksheet</span>
            </button>
          )}

          {/* Edit Next Actions / Steering Recommendations */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-[8px] transition cursor-pointer shadow-2xs"
            title="Edit Focus Areas & Next Actions"
          >
            <Icon icon="lucide:pencil" width={13} className="text-[#F15A22]" />
            <span className="whitespace-nowrap">Edit Actions</span>
          </button>

          {/* Dynamic Excel Export */}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#2E7D32]/40 hover:bg-emerald-50 text-[#1B5E20] text-xs font-bold rounded-[8px] transition cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Download Live 7-Sheet Benefits Realization Excel Workbook"
          >
            <Icon icon={exportingExcel ? "eos-icons:loading" : "vscode-icons:file-type-excel"} width={15} />
            <span className="whitespace-nowrap">{exportingExcel ? "Generating..." : "Export Excel (.xlsx)"}</span>
          </button>

          {/* PowerPoint Deck Export */}
          <a
            href="/Langara_PRM_Executive_Scorecard.pptx"
            download="Langara_PRM_Executive_Scorecard.pptx"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#F15A22] to-[#F29705] text-white text-xs font-bold rounded-[8px] hover:opacity-95 transition shadow-2xs"
            title="Download Executive Scorecard Presentation"
          >
            <Icon icon="solar:presentation-graph-bold" width={15} />
            <span className="whitespace-nowrap">Executive Deck (.pptx)</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          VIEW SWITCHER TABS (EXECUTIVE DASHBOARD, SURVEY RESULTS, TECHNICAL AUDIT)
          ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveView("DASHBOARD")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-[8px] transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeView === "DASHBOARD"
              ? "border-[#F15A22] text-[#F15A22] bg-orange-50/60"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Icon icon="solar:widget-bold-duotone" width={16} />
          <span>Executive Dashboard</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView("SURVEY")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-[8px] transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeView === "SURVEY"
              ? "border-[#F15A22] text-[#F15A22] bg-orange-50/60"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Icon icon="solar:chat-round-line-bold-duotone" width={16} />
          <span>Survey Results (n=2, Nov 4, 2026)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView("TECHNICAL")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-[8px] transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeView === "TECHNICAL"
              ? "border-[#F15A22] text-[#F15A22] bg-orange-50/60"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Icon icon="solar:server-square-bold-duotone" width={16} />
          <span>M365 Technical Audit (Nov 5, 2026)</span>
        </button>
      </div>

      {/* =========================================================================
          EXPANDABLE METHODOLOGY, THRESHOLDS & COLOUR CODING LEGEND
          ========================================================================= */}
      {showMethodology && (
        <div className="bg-gradient-to-r from-orange-50/80 via-white to-slate-50 border border-orange-200/90 rounded-[14px] p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-orange-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#F15A22] text-white flex items-center justify-center font-bold text-xs">
                <Icon icon="solar:document-text-bold" width={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Governance Methodology, Performance Thresholds &amp; Color Legend
                </h3>
                <p className="text-[11px] text-slate-500">
                  Standardized framework applied across all Langara Digital Roadmap (LDR) programs and benefit checkpoints
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMethodology(false)}
              className="p-1 hover:bg-orange-100/70 rounded-md text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <Icon icon="lucide:x" width={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Column 1: 1-5 Scoring Methodology */}
            <div className="bg-white p-3.5 rounded-[10px] border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900 border-b border-slate-100 pb-1.5">
                <Icon icon="solar:chart-bold" className="text-[#F15A22]" width={15} />
                <span>1–5 Scoring Scale Definition</span>
              </div>
              <div className="space-y-1.5">
                {(governanceConfigState?.scoringMethodology || [
                  { level: 1, label: "Critical Gap", description: "Not started / compliance failure (<2.0)", color: "#D9534F" },
                  { level: 2, label: "Emerging", description: "Early adoption; coaching needed (2.0–2.9)", color: "#F29705" },
                  { level: 3, label: "Established", description: "Operating floor met; active monitoring (3.0–3.4)", color: "#FCB511" },
                  { level: 4, label: "Advanced", description: "Target realized; modern habits (3.5–4.4)", color: "#1E824C" },
                  { level: 5, label: "Optimized", description: "Institutional maturity; automated (4.5–5.0)", color: "#155724" }
                ]).map((sm: any) => (
                  <div key={sm.level} className="flex items-start gap-2 p-1.5 rounded hover:bg-slate-50">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-black text-white shrink-0 mt-0.5"
                      style={{ backgroundColor: sm.color || "#6D6E70" }}
                    >
                      {sm.level}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">{sm.label}</div>
                      <div className="text-[10.5px] text-slate-500 leading-snug">{sm.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Performance Thresholds & Rules */}
            <div className="bg-white p-3.5 rounded-[10px] border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900 border-b border-slate-100 pb-1.5">
                <Icon icon="solar:tuning-square-2-bold" className="text-[#F15A22]" width={15} />
                <span>Performance Thresholds</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Driver Scores (/5.0)</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Mean Target: 4.0</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-[10px] font-semibold text-center">
                    <span className="bg-emerald-50 text-emerald-800 p-0.5 rounded border border-emerald-200">≥ 4.0 Green</span>
                    <span className="bg-amber-50 text-amber-800 p-0.5 rounded border border-amber-200">3.5–3.9 Amb</span>
                    <span className="bg-rose-50 text-rose-800 p-0.5 rounded border border-rose-200">&lt; 3.5 Red</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Folder &amp; File Hygiene</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Audited: -91.9%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-[10px] font-semibold text-center">
                    <span className="bg-emerald-50 text-emerald-800 p-0.5 rounded border border-emerald-200">≥ 80% Green</span>
                    <span className="bg-amber-50 text-amber-800 p-0.5 rounded border border-amber-200">50–79% Amb</span>
                    <span className="bg-rose-50 text-rose-800 p-0.5 rounded border border-rose-200">&lt; 50% Red</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Purview Security Labelling</span>
                    <span className="text-[10px] text-rose-600 font-bold">Current: 0%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-[10px] font-semibold text-center">
                    <span className="bg-emerald-50 text-emerald-800 p-0.5 rounded border border-emerald-200">≥ 90% Green</span>
                    <span className="bg-amber-50 text-amber-800 p-0.5 rounded border border-amber-200">50–89% Amb</span>
                    <span className="bg-rose-50 text-rose-800 p-0.5 rounded border border-rose-200">&lt; 50% Red</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Health Status, Colors & Realization Index */}
            <div className="bg-white p-3.5 rounded-[10px] border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900 border-b border-slate-100 pb-1.5">
                <Icon icon="solar:palette-round-bold" className="text-[#F15A22]" width={15} />
                <span>Health Colors &amp; Realization Index</span>
              </div>
              <div className="space-y-1.5">
                {(governanceConfigState?.ragColors || [
                  { status: "On Track", label: "Green", code: "#1E824C", meaning: "Target met / low risk; on schedule." },
                  { status: "Monitor / Progressing", label: "Amber", code: "#F29705", meaning: "Approaching target; attention required." },
                  { status: "Needs Attention", label: "Red", code: "#D9534F", meaning: "Below floor; steering escalation needed." },
                  { status: "Verified", label: "Blue", code: "#468CD2", meaning: "Mathematically audited & verified." }
                ]).map((rc: any) => (
                  <div key={rc.label} className="flex items-center gap-2 p-1 rounded hover:bg-slate-50">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: rc.code }}
                    ></span>
                    <span className="font-bold text-slate-800 w-14 shrink-0">{rc.label}:</span>
                    <span className="text-[10.5px] text-slate-600 leading-tight">{rc.meaning}</span>
                  </div>
                ))}
              </div>

              {/* Realization Index Formula Box */}
              <div className="p-2.5 bg-orange-50/70 border border-orange-200 rounded-[8px] text-[10.5px] text-slate-700 space-y-1 mt-2">
                <div className="font-extrabold text-[#F15A22] flex items-center gap-1">
                  <Icon icon="solar:calculator-minimalistic-bold" width={13} />
                  <span>Realization Index Calculation</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Program Score:</span> Arithmetic mean of drivers B1–B9 (35.3 / 9 = 3.9 / 5.0).
                </div>
                <div>
                  <span className="font-bold text-slate-900">Index %:</span> (Score / 5.0) × 100% = (3.922 / 5.0) × 100% = 78%.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: MAIN CLIENT DASHBOARD CANVAS (MATCHING EXACT UPLOADED IMAGE)
          ========================================================================= */}
      {activeView === "DASHBOARD" && (
      <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-3.5 sm:p-5 md:p-6 space-y-4">
        {/* 1. TOP HEADER ROW */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 pb-3.5 border-b border-slate-200 flex-wrap">
          {/* Logo & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3.5">
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Langara College Official Logo */}
              <img
                src="/langara_logo.png"
                alt="Langara. ʔə ƛ̓ xʷməθkʷəy̓əm | at Musqueam"
                className="h-8 sm:h-10 md:h-11 w-auto object-contain shrink-0"
              />

              {/* Orange Slanted Parallelogram Accent */}
              <div
                className="w-4 sm:w-5 h-8 sm:h-9 bg-gradient-to-b from-[#F15A22] to-[#F29705] transform -skew-x-12 rounded-[2px] shrink-0"
                aria-hidden="true"
              ></div>
            </div>

            {/* Dashboard Titles */}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#000000] tracking-tight leading-snug">
                Privacy and Records Management Benefits Dashboard
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                Langara Collaboration Platform (LCP)
              </p>
            </div>
          </div>

          {/* Metadata Badges (Responsive: 2x2 grid on mobile, inline divider on desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:divide-x divide-slate-300 bg-slate-50/90 p-2 sm:px-3 sm:py-1.5 rounded-[10px] border border-slate-200/80 text-xs gap-y-1.5 sm:gap-y-0">
            <div className="sm:px-3">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 mr-1">Program:</span>
              <span className="font-extrabold text-[#F15A22]">LCP</span>
            </div>
            <div className="sm:px-3">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 mr-1">Project:</span>
              <span className="font-extrabold text-[#F15A22]">Admin Group 1</span>
            </div>
            <div className="sm:px-3">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 mr-1">Business Unit:</span>
              <span className="font-extrabold text-[#F15A22]">PRM</span>
            </div>
            <div className="sm:px-3">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 mr-1">Go-Live:</span>
              <span className="font-extrabold text-[#F15A22]">June 2, 2026</span>
            </div>
          </div>
        </div>

        {/* 2. STRATEGIC ALIGNMENT BANNER */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-[10px] p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#F15A22] shrink-0">
              <Icon icon="solar:target-bold-duotone" width={18} />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#000000] tracking-tight whitespace-nowrap">
              Strategic Alignment
            </span>
          </div>

          <div className="hidden md:block w-px h-6 bg-slate-300 shrink-0"></div>

          <p className="text-[11.5px] sm:text-xs font-medium text-slate-700 leading-relaxed">
            {data?.strategicAlignmentStatement ||
              "Advances Langara's Digital Roadmap by modernizing information management, strengthening collaboration, and enabling a more secure, compliant and efficient service environment."}
          </p>
        </div>

        {/* 3. ROW 1: THREE CORE CARDS
            Card 1: Overall Benefits Realization (Adaptive: Full on < xl, 4 cols on xl)
            Card 2: Key Outcomes (Adaptive: 6 cols on md-lg, 4 cols on xl)
            Card 3: Value Demonstrated to Date (Adaptive: 6 cols on md-lg, 4 cols on xl)
        */}
        <div className="grid grid-cols-12 gap-3.5 2xl:gap-4">
          {/* Card 1: Overall Benefits Realization */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-gradient-to-br from-[#F15A22] via-[#F29705] to-[#FCB511] text-white rounded-[14px] p-3.5 sm:p-4 2xl:p-5 shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <h2 className="text-sm sm:text-base 2xl:text-lg font-black tracking-tight mb-2.5 sm:mb-3 2xl:mb-4">
                Overall Benefits Realization
              </h2>

              <div className="flex 2xl:flex-row flex-col 2xl:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
                {/* Circular Gauge */}
                <div className="relative flex flex-col items-center justify-center shrink-0 w-[120px] h-[120px] 2xl:w-[150px] 2xl:h-[150px] self-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth="8.5"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#FFFFFF"
                      strokeWidth="8.5"
                      strokeDasharray="238.76"
                      strokeDashoffset={238.76 - (238.76 * (data?.realizationPercentage || 78)) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
                    <span className="text-base sm:text-lg 2xl:text-2xl font-black leading-none text-white tracking-tight">
                      {scaleMode === "PERCENT"
                        ? `${data?.realizationPercentage || 78}%`
                        : `${data?.overallScore || 3.9}`}
                      {scaleMode === "LIKERT" && <span className="text-[10px] sm:text-xs font-semibold text-white/80">/5.0</span>}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] 2xl:text-[9px] font-extrabold text-white/95 mt-1 uppercase tracking-normal whitespace-nowrap">
                      Program Score
                    </span>
                  </div>
                </div>

                {/* 4 Pillars List */}
                <div className="flex flex-col gap-1.5 sm:gap-2 2xl:gap-2.5 flex-1 min-w-0 text-xs">
                  {/* Delivery */}
                  <div className="flex items-center justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-1 font-bold text-white text-[10px] sm:text-[10.5px] 2xl:text-xs truncate min-w-0">
                      <Icon icon="solar:laptop-outline" width={13} className="text-white/90 shrink-0" />
                      <span className="truncate">Delivery</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] 2xl:text-[10px] font-bold bg-white text-[#1B5E20] shadow-2xs shrink-0 whitespace-nowrap">
                      <Icon icon="solar:check-circle-bold" width={9.5} className="text-[#2E7D32]" />
                      On Track
                    </span>
                  </div>

                  {/* Adoption */}
                  <div className="flex items-center justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-1 font-bold text-white text-[10px] sm:text-[10.5px] 2xl:text-xs truncate min-w-0">
                      <Icon icon="solar:users-group-rounded-linear" width={13} className="text-white/90 shrink-0" />
                      <span className="truncate">Adoption</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] 2xl:text-[10px] font-bold bg-white text-[#1B5E20] shadow-2xs shrink-0 whitespace-nowrap">
                      <Icon icon="solar:check-circle-bold" width={9.5} className="text-[#2E7D32]" />
                      On Track
                    </span>
                  </div>

                  {/* Benefits */}
                  <div className="flex items-center justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-1 font-bold text-white text-[10px] sm:text-[10.5px] 2xl:text-xs truncate min-w-0">
                      <Icon icon="solar:chart-2-linear" width={13} className="text-white/90 shrink-0" />
                      <span className="truncate">Benefits</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] 2xl:text-[10px] font-bold bg-[#FFF9C4] text-[#F15A22] shadow-2xs shrink-0 whitespace-nowrap">
                      <Icon icon="solar:danger-circle-bold" width={9.5} className="text-[#F29705]" />
                      Progressing
                    </span>
                  </div>

                  {/* Risk & Compliance */}
                  <div className="flex items-center justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-1 font-bold text-white text-[10px] sm:text-[10.5px] 2xl:text-xs truncate min-w-0">
                      <Icon icon="solar:shield-check-linear" width={13} className="text-white/90 shrink-0" />
                      <span className="truncate">Risk &amp; Compliance</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] 2xl:text-[10px] font-bold bg-[#FFF9C4] text-[#F15A22] shadow-2xs shrink-0 whitespace-nowrap">
                      <Icon icon="solar:danger-circle-bold" width={9.5} className="text-[#F29705]" />
                      Monitor
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Key Outcomes (Post-Go-Live) */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white rounded-[14px] border border-slate-200/90 p-3.5 sm:p-4 2xl:p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div>
              <h3 className="text-xs sm:text-sm 2xl:text-base font-extrabold text-[#000000] tracking-tight mb-2.5 sm:mb-3 2xl:mb-4">
                Key Outcomes <span className="font-normal text-slate-500">(Post-Go-Live)</span>
              </h3>

              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                {/* 1. Folder Count */}
                <div className="px-1 sm:px-1.5 2xl:px-2 space-y-1 min-w-0">
                  <div className="flex justify-center text-slate-700">
                    <Icon icon="solar:folder-with-files-linear" width={18} className="text-slate-600" />
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] font-bold text-slate-700 truncate" title="Folder Count">Folder Count</div>
                  <div className="text-xs sm:text-[13px] 2xl:text-base font-black text-[#F15A22] leading-none whitespace-nowrap tracking-tight flex items-center justify-center gap-0.5">
                    <span>{data?.outcomes?.folderCount?.baseline || 541}</span>
                    <span className="text-slate-400 font-normal text-[9px] 2xl:text-[10px]">➔</span>
                    <span>{data?.outcomes?.folderCount?.current || 44}</span>
                  </div>
                  <div className="text-[9px] sm:text-[9.5px] 2xl:text-[11px] font-bold text-slate-500 whitespace-nowrap">
                    ({data?.outcomes?.folderCount?.percentChange || -91.9}%)
                  </div>
                  <div className="text-[8.5px] sm:text-[9px] 2xl:text-[10px] text-slate-400 whitespace-nowrap truncate">Max depth: 8 ➔ 2</div>
                  <div className="pt-2 sm:pt-3 flex justify-center">
                    <span className="inline-flex items-center justify-center px-1 py-0.5 rounded text-[8px] sm:text-[8.5px] 2xl:text-[9.5px] font-extrabold bg-[#E8F8EE] text-[#1E824C] whitespace-nowrap truncate max-w-full">
                      ↑ Simpler structure
                    </span>
                  </div>
                </div>

                {/* 2. Duplicate Files */}
                <div className="px-1 sm:px-1.5 2xl:px-2 space-y-1 min-w-0">
                  <div className="flex justify-center text-slate-700">
                    <Icon icon="solar:layers-minimalistic-linear" width={18} className="text-slate-600" />
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] font-bold text-slate-700 truncate" title="Duplicate Files">Duplicate Files</div>
                  <div className="text-xs sm:text-[13px] 2xl:text-base font-black text-[#F15A22] leading-none whitespace-nowrap tracking-tight flex items-center justify-center gap-0.5">
                    <span>{data?.outcomes?.duplicateFiles?.baseline || 117}</span>
                    <span className="text-slate-400 font-normal text-[9px] 2xl:text-[10px]">➔</span>
                    <span>{data?.outcomes?.duplicateFiles?.current || 49}</span>
                  </div>
                  <div className="text-[9px] sm:text-[9.5px] 2xl:text-[11px] font-bold text-slate-500 whitespace-nowrap">
                    ({data?.outcomes?.duplicateFiles?.percentChange || -58.1}%)
                  </div>
                  <div className="pt-5 sm:pt-6 flex justify-center">
                    <span className="inline-flex items-center justify-center px-1 py-0.5 rounded text-[8px] sm:text-[8.5px] 2xl:text-[9.5px] font-extrabold bg-[#E8F8EE] text-[#1E824C] whitespace-nowrap truncate max-w-full">
                      ↑ Less redundancy
                    </span>
                  </div>
                </div>

                {/* 3. Generic File Names */}
                <div className="px-1 sm:px-1.5 2xl:px-2 space-y-1 min-w-0">
                  <div className="flex justify-center text-slate-700">
                    <Icon icon="solar:magnifer-linear" width={18} className="text-slate-600" />
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] font-bold text-slate-700 truncate" title="Generic Names">Generic Names</div>
                  <div className="text-xs sm:text-[13px] 2xl:text-base font-black text-[#F15A22] leading-none whitespace-nowrap tracking-tight flex items-center justify-center gap-0.5">
                    <span>{data?.outcomes?.genericNames?.baseline || 347}</span>
                    <span className="text-slate-400 font-normal text-[9px] 2xl:text-[10px]">➔</span>
                    <span>{data?.outcomes?.genericNames?.current || 41}</span>
                  </div>
                  <div className="text-[9px] sm:text-[9.5px] 2xl:text-[11px] font-bold text-slate-500 whitespace-nowrap">
                    ({data?.outcomes?.genericNames?.percentChange || -88.2}%)
                  </div>
                  <div className="pt-5 sm:pt-6 flex justify-center">
                    <span className="inline-flex items-center justify-center px-1 py-0.5 rounded text-[8px] sm:text-[8.5px] 2xl:text-[9.5px] font-extrabold bg-[#E8F8EE] text-[#1E824C] whitespace-nowrap truncate max-w-full">
                      ↑ Better findability
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Value Demonstrated to Date */}
          <div className="col-span-12 xl:col-span-4 bg-white rounded-[14px] border border-slate-200/90 p-3.5 sm:p-4 2xl:p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 2xl:mb-4">
                <Icon icon="solar:chart-square-bold" width={18} className="text-[#F15A22] shrink-0" />
                <h3 className="text-xs sm:text-sm 2xl:text-base font-extrabold text-[#000000] tracking-tight">
                  Value Demonstrated to Date
                </h3>
              </div>

              <div className="space-y-2 sm:space-y-2.5 2xl:space-y-3 text-xs leading-snug">
                {/* 1 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:document-text-bold" width={16} className="text-[#F15A22] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#F15A22] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">91.9% fewer folders</strong>
                    <p className="text-slate-600 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">541 reduced to 44; flatter structure and easier navigation.</p>
                  </div>
                </div>

                {/* 2 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:layers-bold" width={16} className="text-[#F15A22] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#F15A22] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">58.1% fewer duplicate files</strong>
                    <p className="text-slate-600 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">117 reduced to 49; improved information hygiene.</p>
                  </div>
                </div>

                {/* 3 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:shield-check-bold" width={16} className="text-[#F15A22] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#F15A22] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">Stronger access controls</strong>
                    <p className="text-slate-600 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">0 "Everyone" grants; 0 folder-level exceptions.</p>
                  </div>
                </div>

                {/* 4 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:hourglass-line" width={16} className="text-[#F15A22] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#F15A22] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">Benefits still to validate</strong>
                    <p className="text-slate-600 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">Measurable time savings, sustained adoption and records compliance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. ROW 2: BENEFIT CHECKPOINTS (CONNECTED STAGE-GATE STEPPER)
            ========================================================================= */}
        <div className="bg-slate-50/70 border border-slate-200/90 rounded-[14px] p-3 sm:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-[8px] bg-orange-100 flex items-center justify-center text-[#F15A22] shrink-0">
              <Icon icon="solar:calendar-bold-duotone" width={20} />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-[#000000] tracking-tight leading-tight">
              Benefit<br className="hidden sm:inline" /> Checkpoints
            </span>
          </div>

          {/* Stepper Grid (Responsive: 1 col on mobile, 2 cols on small tablet, 5 cols on lg/xl) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-stretch gap-2">
            {/* Checkpoint 1 */}
            <button
              type="button"
              disabled={updatingCheckpoint}
              onClick={() => handleCheckpointSelect(1)}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-[10px] p-2.5 text-center transition cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon icon="solar:check-circle-bold" width={15} className="text-[#27AE60]" />
                <span className="text-xs font-black text-slate-800">Checkpoint 1</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">Baseline</div>
              <div className="text-sm font-black text-[#27AE60] mt-0.5">
                {scaleMode === "PERCENT" ? "70%" : "3.5 / 5.0"}
              </div>
            </button>

            {/* Checkpoint 2 */}
            <button
              type="button"
              disabled={updatingCheckpoint}
              onClick={() => handleCheckpointSelect(2)}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-[10px] p-2.5 text-center transition cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon icon="solar:check-circle-bold" width={15} className="text-[#27AE60]" />
                <span className="text-xs font-black text-slate-800">Checkpoint 2</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">3-Month Review</div>
              <div className="text-sm font-black text-[#27AE60] mt-0.5">
                {scaleMode === "PERCENT" ? "72%" : "3.6 / 5.0"}
              </div>
            </button>

            {/* Checkpoint 3 (ACTIVE HERO GATE) */}
            <button
              type="button"
              disabled={updatingCheckpoint}
              onClick={() => handleCheckpointSelect(3)}
              className="bg-[#056839] text-white rounded-[10px] p-2.5 text-center shadow-md transform sm:scale-[1.02] border border-[#047857] cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Icon icon="solar:check-circle-bold" width={16} className="text-white" />
                <span className="text-xs font-black text-white">Checkpoint 3</span>
              </div>
              <div className="text-[10.5px] font-bold text-white/90">90-Day Review (Nov 2026)</div>
              <div className="text-base font-black text-white mt-0.5">
                {scaleMode === "PERCENT" ? "78%" : "3.9 / 5.0"}
              </div>
            </button>

            {/* Checkpoint 4 */}
            <button
              type="button"
              disabled={updatingCheckpoint}
              onClick={() => handleCheckpointSelect(4)}
              className="bg-white/80 border border-slate-200/90 rounded-[10px] p-2.5 text-center hover:bg-slate-50 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-400">
                <Icon icon="solar:calendar-linear" width={15} />
                <span className="text-xs font-bold text-slate-700">Checkpoint 4</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">Quarterly Review</div>
              <div className="text-xs font-bold text-slate-600 mt-1">~ Dec 2026</div>
            </button>

            {/* Checkpoint 5 */}
            <button
              type="button"
              disabled={updatingCheckpoint}
              onClick={() => handleCheckpointSelect(5)}
              className="bg-white/80 border border-slate-200/90 rounded-[10px] p-2.5 text-center hover:bg-slate-50 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-400">
                <Icon icon="solar:calendar-linear" width={15} />
                <span className="text-xs font-bold text-slate-700">Checkpoint 5</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">Program Closure</div>
              <div className="text-xs font-bold text-slate-600 mt-1">~ Feb 2027</div>
            </button>
          </div>
        </div>

        {/* =========================================================================
            5. ROW 3: THREE BOTTOM CARDS
            Card 1: What's Working
            Card 2: Focus Areas & Next Actions
            Card 3: Benefits Scorecard (B1 – B9)
            ========================================================================= */}
        <div className="grid grid-cols-12 gap-3.5 2xl:gap-4">
          {/* Card 1: What's Working (6 cols on md-lg, 3 cols on xl) */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-[#F2FBF5] rounded-[14px] border border-[#C8E6C9] p-3 sm:p-3.5 2xl:p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                <Icon icon="solar:check-circle-bold" width={20} className="text-[#2E7D32] shrink-0" />
                <h3 className="text-xs sm:text-sm 2xl:text-base font-black text-[#1B5E20] tracking-tight">
                  What's Working
                </h3>
              </div>

              <div className="space-y-2 sm:space-y-2.5 text-xs leading-relaxed text-slate-800">
                <div className="flex items-start gap-1.5 min-w-0">
                  <Icon icon="solar:check-circle-bold" width={15} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="min-w-0 text-[10.5px] sm:text-[11px] 2xl:text-xs">
                    <strong className="font-bold text-slate-900">Strong M365 &amp; SharePoint adoption</strong>{" "}
                    (100% training, 227 active files)
                  </div>
                </div>

                <div className="flex items-start gap-1.5 min-w-0">
                  <Icon icon="solar:check-circle-bold" width={15} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="min-w-0 text-[10.5px] sm:text-[11px] 2xl:text-xs">
                    <strong className="font-bold text-slate-900">Significant information hygiene</strong>{" "}
                    (-91.9% folders, -94.6% trial files)
                  </div>
                </div>

                <div className="flex items-start gap-1.5 min-w-0">
                  <Icon icon="solar:check-circle-bold" width={15} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="min-w-0 text-[10.5px] sm:text-[11px] 2xl:text-xs">
                    <strong className="font-bold text-slate-900">Governance &amp; access controls in place</strong>{" "}
                    (0 "Everyone" grants; 0 folder exceptions)
                  </div>
                </div>

                <div className="flex items-start gap-1.5 min-w-0">
                  <Icon icon="solar:check-circle-bold" width={15} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="min-w-0 text-[10.5px] sm:text-[11px] 2xl:text-xs">
                    <strong className="font-bold text-slate-900">Site owners and members trained 100%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Focus Areas & Next Actions (6 cols on md-lg, 4 cols on xl) */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-[#FFFBF5] rounded-[14px] border border-[#FBE0B5] p-3 sm:p-3.5 2xl:p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Icon icon="solar:target-bold-duotone" width={20} className="text-[#F15A22] shrink-0" />
                  <h3 className="text-xs sm:text-sm 2xl:text-base font-black text-[#000000] tracking-tight truncate">
                    Focus Areas &amp; Next Actions
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#F15A22] font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-1"
                >
                  <Icon icon="lucide:pencil" width={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2 sm:space-y-2.5 text-xs leading-relaxed">
                {(data?.needsAttention && data.needsAttention.length > 0) ? (
                  <>
                    {data.needsAttention.map((na: any) => {
                      const isCritical = na.severity?.toLowerCase() === "critical";
                      const iconColor = isCritical ? "text-[#D32F2F]" : "text-[#F29705]";
                      const titleColor = isCritical ? "text-[#D32F2F]" : "text-[#F15A22]";
                      return (
                        <div key={na.id} className="flex items-start gap-2 min-w-0">
                          <Icon icon="solar:danger-triangle-bold" width={18} className={`${iconColor} shrink-0 mt-0.5`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <strong className={`${titleColor} font-black text-[11px] sm:text-[11.5px] 2xl:text-xs truncate`}>
                                {na.title}
                              </strong>
                              <span className={`text-[8px] sm:text-[8.5px] font-extrabold uppercase px-1 rounded ${isCritical ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"} shrink-0`}>
                                {na.severity}
                              </span>
                            </div>
                            <p className="text-slate-700 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">
                              {na.issue}
                            </p>
                            {na.recommendation && (
                              <div className="mt-1 text-[9px] sm:text-[9.5px] 2xl:text-[10px] text-slate-800 bg-orange-50 border border-orange-200/70 rounded px-1.5 py-0.5 leading-snug">
                                <span className="font-bold text-[#F15A22]">Action:</span> {na.recommendation}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {/* 3. Validate benefits Forward-looking Milestone */}
                    <div className="flex items-start gap-2 min-w-0 pt-0.5">
                      <Icon icon="solar:info-circle-bold" width={18} className="text-[#1976D2] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <strong className="text-[#0D47A1] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">
                          Validate benefits
                        </strong>
                        <p className="text-slate-700 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">
                          Test and confirm time savings, search efficiency and sustained use through quarterly reviews.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2 min-w-0">
                      <Icon icon="solar:danger-triangle-bold" width={18} className="text-[#D32F2F] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <strong className="text-[#D32F2F] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">
                          Version-control maturity &amp; OneDrive sync
                        </strong>
                        <p className="text-slate-700 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">
                          Increase use of version history, reduce "v2/final/draft" habits (468 ➔ 607), and coach on OneDrive sync vs. manual uploads.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Icon icon="solar:danger-triangle-bold" width={18} className="text-[#F29705] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <strong className="text-[#F15A22] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">
                          Records &amp; security labelling
                        </strong>
                        <p className="text-slate-700 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">
                          Apply retention and sensitivity labels (0% labelled; 205 potentially sensitive files unlabelled).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Icon icon="solar:info-circle-bold" width={18} className="text-[#1976D2] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <strong className="text-[#0D47A1] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">
                          Validate benefits
                        </strong>
                        <p className="text-slate-700 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">
                          Test and confirm time savings, search efficiency and sustained use through quarterly reviews.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Benefits Scorecard (B1–B9) (Full 12 cols on md-lg, 5 cols on xl) */}
          <div className="col-span-12 xl:col-span-5 bg-white rounded-[14px] border border-slate-200/90 p-3 sm:p-3.5 2xl:p-4 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Icon icon="solar:chart-2-bold" width={17} className="text-[#F15A22] shrink-0" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#000000] tracking-tight truncate">
                    Benefits Scorecard{" "}
                    <span className="font-normal text-[9.5px] sm:text-[10px] text-slate-500 hidden sm:inline">
                      (Provisional)
                    </span>
                  </h3>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Mean: {scaleMode === "PERCENT" ? `${data?.realizationPercentage || 78}%` : `${data?.overallScore || 3.9}`}
                </span>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-12 text-[9px] sm:text-[9.5px] 2xl:text-[10px] font-black uppercase text-slate-500 pb-1 border-b border-slate-200">
                <div className="col-span-7 flex items-center gap-1">
                  <span>Benefit (B1 – B9)</span>
                  <span className="text-[8px] font-normal text-slate-400 lowercase italic hidden sm:inline">(click row to view evidence)</span>
                </div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-3 text-right">Status</div>
              </div>

              {/* B1-B9 Rows with Click-to-Inspect Evidence */}
              <div className="divide-y divide-slate-100 text-xs">
                {(data?.scorecard || []).map((b: any) => {
                  const isExpanded = expandedDriver === b.driverId;
                  return (
                    <div key={b.driverId} className="py-1.5 min-w-0 transition-colors">
                      <div
                        onClick={() => setExpandedDriver(isExpanded ? null : b.driverId)}
                        className="grid grid-cols-12 items-center gap-1 cursor-pointer hover:bg-slate-50/80 rounded px-1 py-0.5"
                        title="Click to view verified evidence and verification metrics"
                      >
                        <div className="col-span-7 flex items-center gap-1 min-w-0">
                          <Icon
                            icon={isExpanded ? "solar:alt-arrow-down-linear" : "solar:alt-arrow-right-linear"}
                            width={11}
                            className="text-slate-400 shrink-0"
                          />
                          <span className="font-extrabold text-slate-900 shrink-0 text-[10.5px] sm:text-[11px]">{b.driverId}</span>
                          <span className="text-slate-700 truncate font-medium text-[10px] sm:text-[10.5px] 2xl:text-[11px]" title={b.name}>{b.name}</span>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <span className="font-bold text-slate-900 text-[10.5px] sm:text-[11px] 2xl:text-xs shrink-0">{formatScore(b.score)}</span>
                        </div>

                        <div className="col-span-3 flex justify-end">
                          {getStatusBadge(b.status)}
                        </div>
                      </div>

                      {/* Expandable Evidence Card */}
                      {isExpanded && (
                        <div className="mt-1 ml-4 mr-1 p-2 bg-slate-50 border border-slate-200 rounded-[8px] text-[10.5px] space-y-1 animate-in fade-in duration-150">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[10px]">
                            <Icon icon="solar:document-text-bold" width={13} className="text-[#F15A22]" />
                            <span>Verified Evidence &amp; Verification Metrics</span>
                          </div>
                          <p className="text-slate-600 leading-snug">
                            {b.evidence || "No specific verification metrics logged for this driver."}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            6. PROGRAM GOVERNANCE & OCM GUIDANCE (COLLAPSIBLE DRAWER)
            ========================================================================= */}
        <div className="border-t border-slate-200/90 pt-3">
          <button
            type="button"
            onClick={() => setShowGovernance(!showGovernance)}
            className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-700 hover:text-slate-900 p-2 rounded-[8px] hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Icon icon="solar:users-group-rounded-bold-duotone" width={18} className="text-[#F15A22]" />
              <span className="text-xs sm:text-[13px] font-extrabold text-[#000000]">
                Program Governance, Stakeholders &amp; OCM Change Guidance
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
              <span>{showGovernance ? "Hide Details" : "Show Details"}</span>
              <Icon icon={showGovernance ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} width={14} />
            </div>
          </button>

          {showGovernance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2.5 p-3.5 bg-slate-50/70 rounded-[12px] border border-slate-200/80 animate-in fade-in duration-200">
              {/* Stakeholders List */}
              <div className="space-y-2">
                <h4 className="text-[11.5px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon icon="solar:shield-user-bold" width={14} className="text-[#F15A22]" />
                  Executive Steering &amp; Leadership Roles
                </h4>
                <div className="space-y-1.5 text-xs">
                  {(data?.stakeholders || []).map((s: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between bg-white p-2 rounded-[8px] border border-slate-200 shadow-2xs">
                      <div>
                        <div className="font-bold text-slate-900 text-[11px] sm:text-xs">{s.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{s.role}</div>
                      </div>
                      {s.email && (
                        <span className="text-[9.5px] text-[#F15A22] font-semibold bg-orange-50 px-1.5 py-0.5 rounded">
                          {s.email}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* OCM Coaching Tips */}
              <div className="space-y-2">
                <h4 className="text-[11.5px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon icon="solar:lightbulb-bolt-bold" width={14} className="text-[#F15A22]" />
                  OCM Change &amp; Adoption Guidance
                </h4>
                <div className="space-y-1.5 text-xs">
                  {(data?.coachingTips || []).map((tip: any, idx: number) => (
                    <div key={idx} className="bg-white p-2.5 rounded-[8px] border border-slate-200 shadow-2xs">
                      <div className="font-bold text-slate-900 text-[11px] sm:text-xs text-[#F15A22]">
                        • {tip.title}
                      </div>
                      <p className="text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                        {tip.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* =========================================================================
          VIEW 2: PRM SURVEY EMPIRICAL RESULTS (n=2, Nov 4, 2026)
          ========================================================================= */}
      {activeView === "SURVEY" && (
        <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#000000] tracking-tight flex items-center gap-2">
                <Icon icon="solar:chat-round-line-bold-duotone" width={22} className="text-[#F15A22]" />
                PRM Post-Implementation Survey Results
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Two responses: 4 November 2026 • 1 Site Owner &amp; 1 Site Member • 1–5 Agreement Scale (Floor: 3.0, Target: 4.0)
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8EE] text-[#1E824C] border border-[#A3E4D7]/50 w-fit">
              <Icon icon="solar:check-circle-bold" width={14} className="text-[#27AE60]" />
              Mean Score: 4.1 / 5.0 (All 16 Dimensions Met Floor)
            </span>
          </div>

          {/* Qualitative Feedback Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#F2FBF5] p-3.5 rounded-[12px] border border-[#C8E6C9] space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#2E7D32] flex items-center gap-1">
                <Icon icon="solar:like-bold" width={13} />
                What Improved Most
              </div>
              <p className="text-xs text-slate-800 font-semibold leading-snug">
                "Metadata has made it much easier to find documents related to a specific access to information request."
              </p>
              <div className="text-[10px] text-slate-500 italic pt-1">— PRM Site Owner (Consent: Named)</div>
            </div>

            <div className="bg-[#FFFBF5] p-3.5 rounded-[12px] border border-[#FBE0B5] space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#F15A22] flex items-center gap-1">
                <Icon icon="solar:danger-triangle-bold" width={13} />
                What Remains Difficult (Root Cause)
              </div>
              <p className="text-xs text-slate-800 font-semibold leading-snug">
                "I still need to learn how to sync my OneDrive with our SP site so I don't need to manually upload documents."
              </p>
              <div className="text-[10px] text-slate-500 italic pt-1">— Explains 'v2/draft' filename rise (468 ➔ 607)</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-[12px] border border-slate-200 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-600 flex items-center gap-1">
                <Icon icon="solar:info-circle-bold" width={13} />
                General Observation
              </div>
              <p className="text-xs text-slate-800 font-semibold leading-snug">
                "Because our N drive was well organized already, the main benefit of moving to SharePoint is improved search."
              </p>
              <div className="text-[10px] text-slate-500 italic pt-1">— Strategic Findability Confirmed</div>
            </div>
          </div>

          {/* Survey Questions Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-[10px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-extrabold text-[10.5px]">
                  <th className="p-2.5">Domain</th>
                  <th className="p-2.5">Survey Question (Exact Wording)</th>
                  <th className="p-2.5 text-center">Benefit</th>
                  <th className="p-2.5 text-center">Site Owner</th>
                  <th className="p-2.5 text-center">Site Member</th>
                  <th className="p-2.5 text-center">Mean (1–5)</th>
                  <th className="p-2.5 text-right">Floor Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {[
                  { domain: "Site ownership", q: "I feel confident managing access and permissions for the SharePoint site.", ben: "B2; B8", owner: 4, mem: "-", mean: 4.0, stat: "On Target" },
                  { domain: "Site ownership", q: "I feel confident maintaining the site’s document organization and metadata.", ben: "B7; B8", owner: 5, mem: "-", mean: 5.0, stat: "Above Target" },
                  { domain: "Support confidence", q: "I know where to go for help when I cannot resolve a SharePoint issue myself.", ben: "B3; B8", owner: 4, mem: "-", mean: 4.0, stat: "On Target" },
                  { domain: "Findability", q: "It is easier to find the documents and information I need.", ben: "B5", owner: 3, mem: 4, mean: 3.5, stat: "Above Floor" },
                  { domain: "Storage clarity", q: "It is clear to me where documents should be stored.", ben: "B7; B8", owner: 5, mem: 4, mean: 4.5, stat: "Above Target" },
                  { domain: "Organization", q: "Documents are better organized than they were before.", ben: "B7", owner: 3, mem: 4, mean: 3.5, stat: "Above Floor" },
                  { domain: "Metadata effectiveness", q: "Using metadata makes it easier to organize and find documents.", ben: "B5; B7", owner: 4, mem: 4, mean: 4.0, stat: "On Target" },
                  { domain: "Version control", q: "It is easier to identify and work with the correct version of a document.", ben: "B1; B5", owner: 5, mem: 4, mean: 4.5, stat: "Above Target" },
                  { domain: "Collaboration", q: "It is easier to share and collaborate on documents with others.", ben: "B1; B6", owner: 4, mem: 4, mean: 4.0, stat: "On Target" },
                  { domain: "Secure access", q: "I am confident that sensitive information is only accessible to the right people.", ben: "B2", owner: 5, mem: 4, mean: 4.5, stat: "Above Target" },
                  { domain: "Remote work", q: "The new SharePoint site has made my day-to-day work easier both in-office and while working off-site.", ben: "B4; B6", owner: 3, mem: 4, mean: 3.5, stat: "Above Floor" },
                  { domain: "Communications", q: "I received the information I needed at the right time during the transition.", ben: "B8", owner: 4, mem: 4, mean: 4.0, stat: "On Target" },
                  { domain: "Training", q: "The training prepared me to use the new SharePoint site effectively.", ben: "B8", owner: 5, mem: 4, mean: 4.5, stat: "Above Target" },
                  { domain: "Support", q: "I knew where to go for help or support when I needed it.", ben: "B3; B8", owner: 5, mem: 4, mean: 4.5, stat: "Above Target" },
                  { domain: "Engagement", q: "I had opportunities to provide input during the design through to transition.", ben: "B8", owner: 5, mem: 4, mean: 4.5, stat: "Above Target" },
                  { domain: "Client needs", q: "The project team understood our department’s needs and concerns.", ben: "B8", owner: 5, mem: 4, mean: 4.5, stat: "Above Target" },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"}>
                    <td className="p-2.5 font-bold text-slate-700">{row.domain}</td>
                    <td className="p-2.5 text-slate-800">{row.q}</td>
                    <td className="p-2.5 text-center text-slate-500 font-bold">{row.ben}</td>
                    <td className="p-2.5 text-center font-bold text-slate-900">{row.owner}</td>
                    <td className="p-2.5 text-center font-bold text-slate-600">{row.mem}</td>
                    <td className="p-2.5 text-center font-black text-[#F15A22] text-[13px]">{row.mean.toFixed(1)}</td>
                    <td className="p-2.5 text-right">{getStatusBadge(row.stat === "Above Floor" ? "Monitor" : "On Track")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: M365 TECHNICAL AUDIT (Nov 5, 2026)
          ========================================================================= */}
      {activeView === "TECHNICAL" && (
        <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#000000] tracking-tight flex items-center gap-2">
                <Icon icon="solar:server-square-bold-duotone" width={22} className="text-[#F15A22]" />
                SharePoint &amp; Microsoft 365 Technical Audit
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated site inventory &amp; post-migration comparison • Nov 5, 2026 Technical Audit
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8EE] text-[#1E824C] border border-[#A3E4D7]/50 w-fit">
              <Icon icon="solar:check-circle-bold" width={14} className="text-[#27AE60]" />
              Zero Security Exceptions Enforced
            </span>
          </div>

          {/* Technical Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 space-y-1">
              <div className="text-[10.5px] font-bold text-slate-500">Folder Count</div>
              <div className="text-base sm:text-lg font-black text-[#F15A22]">541 ➔ 44</div>
              <div className="text-[10px] font-bold text-emerald-600">-91.9% reduction</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 space-y-1">
              <div className="text-[10.5px] font-bold text-slate-500">ROT Elimination</div>
              <div className="text-base sm:text-lg font-black text-[#F15A22]">2,175 ➔ 1,300</div>
              <div className="text-[10px] font-bold text-emerald-600">-40.2% (Tgt: 50%)</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 space-y-1">
              <div className="text-[10.5px] font-bold text-slate-500">Storage Footprint</div>
              <div className="text-base sm:text-lg font-black text-[#F15A22]">3.90 ➔ 3.31 GB</div>
              <div className="text-[10px] font-bold text-emerald-600">-15.1% reduction</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 space-y-1">
              <div className="text-[10.5px] font-bold text-slate-500">Version Tokens</div>
              <div className="text-base sm:text-lg font-black text-[#D32F2F]">468 ➔ 607</div>
              <div className="text-[10px] font-bold text-red-600">+29.7% watch habit</div>
            </div>
          </div>

          {/* Technical Inventory Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-[10px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-extrabold text-[10.5px]">
                  <th className="p-2.5">Technical Metric Dimension</th>
                  <th className="p-2.5 text-center">Baseline</th>
                  <th className="p-2.5 text-center">Post-Go-Live</th>
                  <th className="p-2.5 text-center">Variance %</th>
                  <th className="p-2.5 text-center">Target Goal</th>
                  <th className="p-2.5">Technical Finding &amp; Governance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {[
                  { dim: "Folder Architecture (Total Folders)", base: "541", curr: "44", var: "-91.9%", tgt: "Major drop", finding: "Maximum depth collapsed from 8 levels to 2; zero path length errors." },
                  { dim: "Maximum Folder Depth", base: "8 levels", curr: "2 levels", var: "-75.0%", tgt: "<= 3 levels", finding: "Flattest hierarchy achieved across PRM document libraries." },
                  { dim: "ROT Files (Redundant, Obsolete, Trivial)", base: "2,175", curr: "1,300", var: "-40.2%", tgt: "50% reduction", finding: "1,300 files remain; secondary archiving underway." },
                  { dim: "Cloud Storage Footprint", base: "3.90 GB", curr: "3.31 GB", var: "-15.1%", tgt: "20% reduction", finding: "Decreased by 0.59 GB; ongoing cleanup to hit 20% mark." },
                  { dim: "Version-Token Filenames ('v2/final/draft')", base: "468", curr: "607", var: "+29.7%", tgt: "0% growth", finding: "Habitual naming under watch; OneDrive sync clinics scheduled." },
                  { dim: "Duplicate Files", base: "117", curr: "49", var: "-58.1%", tgt: "Substantial drop", finding: "Duplicate file sprawl reduced by more than half." },
                  { dim: "Generic / Ambiguous Filenames", base: "347", curr: "41", var: "-88.2%", tgt: "< 50 files", finding: "Standardized titles; enterprise findability drastically improved." },
                  { dim: "Unlabelled Sensitive Files", base: "205", curr: "205", var: "0% labelled", tgt: "100% labelled", finding: "Purview retention and sensitivity labels require automated deployment." },
                  { dim: "'Everyone' Sharing Grants", base: "0", curr: "0", var: "0 grants", tgt: "0 grants", finding: "Confidentiality boundary maintained; BC FIPPA baseline enforced." },
                  { dim: "Folder-Level Permission Exceptions", base: "0", curr: "0", var: "0 exceptions", tgt: "0 exceptions", finding: "Clean site-level permission inheritance preventing privilege drift." },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"}>
                    <td className="p-2.5 font-bold text-slate-900">{row.dim}</td>
                    <td className="p-2.5 text-center text-slate-600 font-semibold">{row.base}</td>
                    <td className="p-2.5 text-center font-black text-slate-900">{row.curr}</td>
                    <td className="p-2.5 text-center font-black text-[#F15A22] text-[13px]">{row.var}</td>
                    <td className="p-2.5 text-center text-slate-500 font-semibold">{row.tgt}</td>
                    <td className="p-2.5 text-slate-700">{row.finding}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT ACTION RECOMMENDATIONS / NEXT ACTIONS
          ========================================================================= */}
      {isEditModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditModalOpen(false);
          }}
          className="langara-branding-scope fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4"
        >
          <div className="bg-white rounded-[16px] max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-3.5 sm:space-y-4 animate-in fade-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100 flex items-center justify-center text-[#F15A22] shrink-0">
                  <Icon icon="lucide:pencil" width={16} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">Edit Focus Areas &amp; Next Actions</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Update steering committee actions for Review Gate 2</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer shrink-0"
              >
                <Icon icon="lucide:x" width={20} />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1 flex-1">
              {(data?.needsAttention || []).map((na: any) => (
                <div key={na.id} className="p-3 sm:p-3.5 bg-slate-50 rounded-[10px] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{na.title}</span>
                    <span className="text-[9.5px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 shrink-0">
                      {na.severity}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-[11.5px] text-slate-600 italic">"{na.issue}"</p>
                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] font-bold text-slate-700 mb-1">
                      Action Recommendation:
                    </label>
                    <textarea
                      rows={2}
                      value={editedRecs[na.id] || ""}
                      onChange={(e) =>
                        setEditedRecs((prev) => ({ ...prev, [na.id]: e.target.value }))
                      }
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#F15A22]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingRecs}
                onClick={handleSaveRecommendations}
                className="px-4 sm:px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#F15A22] to-[#F29705] rounded-full hover:opacity-95 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {savingRecs ? <Icon icon="eos-icons:loading" width={14} /> : <Icon icon="lucide:check" width={14} />}
                <span>{savingRecs ? "Saving..." : "Save Recommendations"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUPERADMIN CENTRALIZED GOVERNANCE CONFIGURATION WORKSHEET MODAL
          ========================================================================= */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-[16px] shadow-2xl max-w-4xl w-full p-4 sm:p-6 border border-slate-200 max-h-[92vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                  <Icon icon="solar:settings-bold" width={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Centralized Governance &amp; Thresholds Configuration Worksheet
                  </h3>
                  <p className="text-xs text-slate-500">
                    SuperAdmin settings: Changes automatically re-evaluate scorecards, RAG labels, and conditional formatting
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer shrink-0"
              >
                <Icon icon="lucide:x" width={20} />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Scale Max and Formula */}
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 space-y-2">
                <div className="font-extrabold text-slate-900 text-xs">Core Scale &amp; Index Formula</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Scale Maximum (Ceiling):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={governanceConfigState?.scaleMax || 5.0}
                      onChange={(e) =>
                        setGovernanceConfigState((prev: any) => ({
                          ...prev,
                          scaleMax: Number(e.target.value) || 5.0,
                        }))
                      }
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15A22]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Realization Formula Description:</label>
                    <input
                      type="text"
                      value={governanceConfigState?.realizationIndexFormula || "(Arithmetic Mean Score / Scale Max) * 100%"}
                      onChange={(e) =>
                        setGovernanceConfigState((prev: any) => ({
                          ...prev,
                          realizationIndexFormula: e.target.value,
                        }))
                      }
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15A22]"
                    />
                  </div>
                </div>
              </div>

              {/* Threshold Rules Table */}
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 space-y-2">
                <div className="font-extrabold text-slate-900 text-xs">Performance Thresholds &amp; Technical Targets</div>
                <div className="space-y-2">
                  {(governanceConfigState?.thresholds || []).map((th: any, idx: number) => (
                    <div key={th.key || idx} className="p-2.5 bg-white rounded border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{th.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">Key: {th.key}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="block text-[10px] font-semibold text-emerald-700 mb-0.5">Green Condition:</label>
                          <input
                            type="text"
                            value={th.greenCondition || ""}
                            onChange={(e) => {
                              const updated = [...(governanceConfigState.thresholds || [])];
                              updated[idx].greenCondition = e.target.value;
                              setGovernanceConfigState((prev: any) => ({ ...prev, thresholds: updated }));
                            }}
                            className="w-full text-xs p-1.5 bg-emerald-50/50 border border-emerald-300 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-amber-700 mb-0.5">Amber Condition:</label>
                          <input
                            type="text"
                            value={th.amberCondition || ""}
                            onChange={(e) => {
                              const updated = [...(governanceConfigState.thresholds || [])];
                              updated[idx].amberCondition = e.target.value;
                              setGovernanceConfigState((prev: any) => ({ ...prev, thresholds: updated }));
                            }}
                            className="w-full text-xs p-1.5 bg-amber-50/50 border border-amber-300 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-rose-700 mb-0.5">Red Condition:</label>
                          <input
                            type="text"
                            value={th.redCondition || ""}
                            onChange={(e) => {
                              const updated = [...(governanceConfigState.thresholds || [])];
                              updated[idx].redCondition = e.target.value;
                              setGovernanceConfigState((prev: any) => ({ ...prev, thresholds: updated }));
                            }}
                            className="w-full text-xs p-1.5 bg-rose-50/50 border border-rose-300 rounded focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-5 Scoring Methodology Definitions */}
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 space-y-2">
                <div className="font-extrabold text-slate-900 text-xs">1–5 Scale Maturity Definitions</div>
                <div className="space-y-1.5">
                  {(governanceConfigState?.scoringMethodology || []).map((sm: any, idx: number) => (
                    <div key={sm.level || idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-slate-200">
                      <div className="col-span-1 text-center font-bold text-slate-800">L{sm.level}</div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={sm.label || ""}
                          onChange={(e) => {
                            const updated = [...(governanceConfigState.scoringMethodology || [])];
                            updated[idx].label = e.target.value;
                            setGovernanceConfigState((prev: any) => ({ ...prev, scoringMethodology: updated }));
                          }}
                          className="w-full text-xs p-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="col-span-6">
                        <input
                          type="text"
                          value={sm.description || ""}
                          onChange={(e) => {
                            const updated = [...(governanceConfigState.scoringMethodology || [])];
                            updated[idx].description = e.target.value;
                            setGovernanceConfigState((prev: any) => ({ ...prev, scoringMethodology: updated }));
                          }}
                          className="w-full text-xs p-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={sm.color || ""}
                          onChange={(e) => {
                            const updated = [...(governanceConfigState.scoringMethodology || [])];
                            updated[idx].color = e.target.value;
                            setGovernanceConfigState((prev: any) => ({ ...prev, scoringMethodology: updated }));
                          }}
                          className="w-full text-xs p-1 border border-slate-300 rounded text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingConfig}
                onClick={handleSaveGovernanceConfig}
                className="px-4 sm:px-5 py-2 text-xs font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {savingConfig ? <Icon icon="eos-icons:loading" width={14} /> : <Icon icon="lucide:check" width={14} />}
                <span>{savingConfig ? "Saving Config..." : "Save Governance Worksheet"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitsRealizationDashboard;
