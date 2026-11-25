import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";

export const BenefitsRealizationDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingCheckpoint, setUpdatingCheckpoint] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("Langara College");
  const [scaleMode, setScaleMode] = useState<"LIKERT" | "PERCENT">("LIKERT");

  // Modal State for Editing Recommendations / Next Actions
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingRecs, setSavingRecs] = useState(false);
  const [editedRecs, setEditedRecs] = useState<Record<string, string>>({});

  // Dynamic Excel Export State
  const [exportingExcel, setExportingExcel] = useState(false);

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
          className="px-5 py-2 bg-[#E65100] text-white text-xs font-bold rounded-full hover:bg-[#D84315] transition cursor-pointer"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-2.5 sm:p-4 md:p-6 font-['Quicksand',sans-serif] space-y-3.5 sm:space-y-4 text-slate-800 max-w-[1680px] mx-auto">
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
                  ? "bg-[#E65100] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1–5 Scale
            </button>
            <button
              onClick={() => setScaleMode("PERCENT")}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                scaleMode === "PERCENT"
                  ? "bg-[#E65100] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              % Index
            </button>
          </div>

          {/* Edit Next Actions / Steering Recommendations */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-[8px] transition cursor-pointer shadow-2xs"
            title="Edit Focus Areas & Next Actions"
          >
            <Icon icon="lucide:pencil" width={13} className="text-[#E65100]" />
            <span className="whitespace-nowrap">Edit Actions</span>
          </button>

          {/* Dynamic Excel Export */}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#2E7D32]/40 hover:bg-emerald-50 text-[#1B5E20] text-xs font-bold rounded-[8px] transition cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Download Live 5-Sheet Benefits Realization Excel Workbook"
          >
            <Icon icon={exportingExcel ? "eos-icons:loading" : "vscode-icons:file-type-excel"} width={15} />
            <span className="whitespace-nowrap">{exportingExcel ? "Generating..." : "Export Excel (.xlsx)"}</span>
          </button>

          {/* PowerPoint Deck Export */}
          <a
            href="/Langara_PRM_Executive_Scorecard.pptx"
            download="Langara_PRM_Executive_Scorecard.pptx"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#D84315] to-[#F57C00] text-white text-xs font-bold rounded-[8px] hover:opacity-95 transition shadow-2xs"
            title="Download Executive Scorecard Presentation"
          >
            <Icon icon="solar:presentation-graph-bold" width={15} />
            <span className="whitespace-nowrap">Executive Deck (.pptx)</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          MAIN CLIENT DASHBOARD CANVAS (MATCHING EXACT UPLOADED IMAGE)
          ========================================================================= */}
      <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-3.5 sm:p-5 md:p-6 space-y-4">
        {/* 1. TOP HEADER ROW */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 pb-3.5 border-b border-slate-200">
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
                className="w-4 sm:w-5 h-8 sm:h-9 bg-gradient-to-b from-[#F57C00] to-[#E65100] transform -skew-x-12 rounded-[2px] shrink-0"
                aria-hidden="true"
              ></div>
            </div>

            {/* Dashboard Titles */}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">
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
              <span className="font-extrabold text-[#E65100]">LCP</span>
            </div>
            <div className="sm:px-3">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 mr-1">Project:</span>
              <span className="font-extrabold text-[#E65100]">Admin Group 1</span>
            </div>
            <div className="sm:px-3">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 mr-1">Business Unit:</span>
              <span className="font-extrabold text-[#E65100]">PRM</span>
            </div>
            <div className="sm:px-3">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 mr-1">Go-Live:</span>
              <span className="font-extrabold text-[#E65100]">June 2, 2026</span>
            </div>
          </div>
        </div>

        {/* 2. STRATEGIC ALIGNMENT BANNER */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-[10px] p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#E65100] shrink-0">
              <Icon icon="solar:target-bold-duotone" width={18} />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] tracking-tight whitespace-nowrap">
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
          <div className="col-span-12 xl:col-span-4 bg-gradient-to-br from-[#E65100] via-[#F57C00] to-[#FB8C00] text-white rounded-[14px] p-3.5 sm:p-4 2xl:p-5 shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <h2 className="text-sm sm:text-base 2xl:text-lg font-black tracking-tight mb-2.5 sm:mb-3 2xl:mb-4">
                Overall Benefits Realization
              </h2>

              <div className="flex flex-row items-center justify-between gap-2.5 sm:gap-3 2xl:gap-4 min-w-0">
                {/* Circular Gauge */}
                <div className="relative flex flex-col items-center justify-center shrink-0 w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] 2xl:w-[114px] 2xl:h-[114px]">
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
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] 2xl:text-[10px] font-bold bg-[#FFF9C4] text-[#E65100] shadow-2xs shrink-0 whitespace-nowrap">
                      <Icon icon="solar:danger-circle-bold" width={9.5} className="text-[#F57C00]" />
                      Progressing
                    </span>
                  </div>

                  {/* Risk & Compliance */}
                  <div className="flex items-center justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-1 font-bold text-white text-[10px] sm:text-[10.5px] 2xl:text-xs truncate min-w-0">
                      <Icon icon="solar:shield-check-linear" width={13} className="text-white/90 shrink-0" />
                      <span className="truncate">Risk &amp; Compliance</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] 2xl:text-[10px] font-bold bg-[#FFF9C4] text-[#E65100] shadow-2xs shrink-0 whitespace-nowrap">
                      <Icon icon="solar:danger-circle-bold" width={9.5} className="text-[#F57C00]" />
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
              <h3 className="text-xs sm:text-sm 2xl:text-base font-extrabold text-[#0F172A] tracking-tight mb-2.5 sm:mb-3 2xl:mb-4">
                Key Outcomes <span className="font-normal text-slate-500">(Post-Go-Live)</span>
              </h3>

              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                {/* 1. Folder Count */}
                <div className="px-1 sm:px-1.5 2xl:px-2 space-y-1 min-w-0">
                  <div className="flex justify-center text-slate-700">
                    <Icon icon="solar:folder-with-files-linear" width={18} className="text-slate-600" />
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] font-bold text-slate-700 truncate" title="Folder Count">Folder Count</div>
                  <div className="text-xs sm:text-[13px] 2xl:text-base font-black text-[#D84315] leading-none whitespace-nowrap tracking-tight flex items-center justify-center gap-0.5">
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
                  <div className="text-xs sm:text-[13px] 2xl:text-base font-black text-[#D84315] leading-none whitespace-nowrap tracking-tight flex items-center justify-center gap-0.5">
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
                  <div className="text-xs sm:text-[13px] 2xl:text-base font-black text-[#D84315] leading-none whitespace-nowrap tracking-tight flex items-center justify-center gap-0.5">
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
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white rounded-[14px] border border-slate-200/90 p-3.5 sm:p-4 2xl:p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 2xl:mb-4">
                <Icon icon="solar:chart-square-bold" width={18} className="text-[#E65100] shrink-0" />
                <h3 className="text-xs sm:text-sm 2xl:text-base font-extrabold text-[#0F172A] tracking-tight">
                  Value Demonstrated to Date
                </h3>
              </div>

              <div className="space-y-2 sm:space-y-2.5 2xl:space-y-3 text-xs leading-snug">
                {/* 1 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:document-text-bold" width={16} className="text-[#E65100] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#E65100] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">91.9% fewer folders</strong>
                    <p className="text-slate-600 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">541 reduced to 44; flatter structure and easier navigation.</p>
                  </div>
                </div>

                {/* 2 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:layers-bold" width={16} className="text-[#E65100] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#E65100] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">58.1% fewer duplicate files</strong>
                    <p className="text-slate-600 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">117 reduced to 49; improved information hygiene.</p>
                  </div>
                </div>

                {/* 3 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:shield-check-bold" width={16} className="text-[#E65100] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#E65100] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">Stronger access controls</strong>
                    <p className="text-slate-600 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">0 "Everyone" grants; 0 folder-level exceptions.</p>
                  </div>
                </div>

                {/* 4 */}
                <div className="flex items-start gap-2">
                  <Icon icon="solar:hourglass-line" width={16} className="text-[#E65100] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#E65100] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">Benefits still to validate</strong>
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
            <div className="w-8 h-8 rounded-[8px] bg-orange-100 flex items-center justify-center text-[#E65100] shrink-0">
              <Icon icon="solar:calendar-bold-duotone" width={20} />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight leading-tight">
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
          <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-[#FFFBF5] rounded-[14px] border border-[#FFE0B2] p-3 sm:p-3.5 2xl:p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Icon icon="solar:target-bold-duotone" width={20} className="text-[#E65100] shrink-0" />
                  <h3 className="text-xs sm:text-sm 2xl:text-base font-black text-[#0F172A] tracking-tight truncate">
                    Focus Areas &amp; Next Actions
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#E65100] font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-1"
                >
                  <Icon icon="lucide:pencil" width={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2 sm:space-y-2.5 text-xs leading-relaxed">
                {/* 1. Version-control maturity */}
                <div className="flex items-start gap-2 min-w-0">
                  <Icon icon="solar:danger-triangle-bold" width={18} className="text-[#D32F2F] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#D32F2F] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">
                      Version-control maturity
                    </strong>
                    <p className="text-slate-700 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">
                      Increase use of version history and reduce "v2/final/draft" filename habits (468 ➔ 607).
                    </p>
                  </div>
                </div>

                {/* 2. Records & security labelling */}
                <div className="flex items-start gap-2 min-w-0">
                  <Icon icon="solar:danger-triangle-bold" width={18} className="text-[#F57C00] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-[#E65100] font-black text-[11px] sm:text-[11.5px] 2xl:text-xs block">
                      Records &amp; security labelling
                    </strong>
                    <p className="text-slate-700 mt-0.5 text-[10px] sm:text-[10.5px] 2xl:text-[11.5px] leading-tight">
                      Apply retention and sensitivity labels (0% labelled; 205 potentially sensitive files unlabelled).
                    </p>
                  </div>
                </div>

                {/* 3. Validate benefits */}
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
              </div>
            </div>
          </div>

          {/* Card 3: Benefits Scorecard (B1–B9) (Full 12 cols on md-lg, 5 cols on xl) */}
          <div className="col-span-12 xl:col-span-5 bg-white rounded-[14px] border border-slate-200/90 p-3 sm:p-3.5 2xl:p-4 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Icon icon="solar:chart-2-bold" width={17} className="text-[#E65100] shrink-0" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] tracking-tight truncate">
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
                <div className="col-span-7">Benefit (B1 – B9)</div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-3 text-right">Status</div>
              </div>

              {/* B1-B9 Rows */}
              <div className="divide-y divide-slate-100 text-xs">
                {(data?.scorecard || []).map((b: any) => (
                  <div key={b.driverId} className="grid grid-cols-12 items-center py-1.5 gap-1 min-w-0">
                    <div className="col-span-7 flex items-center gap-1 min-w-0">
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: EDIT ACTION RECOMMENDATIONS / NEXT ACTIONS
          ========================================================================= */}
      {isEditModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4"
        >
          <div className="bg-white rounded-[16px] max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-3.5 sm:space-y-4 animate-in fade-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100 flex items-center justify-center text-[#E65100] shrink-0">
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
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#E65100]"
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
                className="px-4 sm:px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#D84315] to-[#F57C00] rounded-full hover:opacity-95 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {savingRecs ? <Icon icon="eos-icons:loading" width={14} /> : <Icon icon="lucide:check" width={14} />}
                <span>{savingRecs ? "Saving..." : "Save Recommendations"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitsRealizationDashboard;
