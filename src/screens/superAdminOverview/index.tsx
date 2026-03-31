import { Icon } from "@iconify/react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/axios";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import PieChart from "../../charts/pieChart";
import ReportPreviewModal from "../../components/reportPreviewModal";
import CircularProgress from "../../components/percentageCircle";

const SuperAdminOverview = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor(new Date().getMonth() / 3) + 1,
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"list" | "visual">("list");
  const [selectedRole, setSelectedRole] = useState<string>("Administrators");

  const [intelData, setIntelData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [currentPreviewType, setCurrentPreviewType] = useState<
    "individual" | "master"
  >("individual");

  const handlePreview = async (type: "individual" | "master") => {
    setLoadingPreview(true);
    setCurrentPreviewType(type);
    try {
      const isMaster = type === "master";
      const respReal = await api.get(
        `/dashboard/preview-pdf-report?isMaster=${isMaster}`,
        {
          responseType: "blob",
        },
      );
      const url = URL.createObjectURL(respReal.data);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
      setShowPreview(true);
    } catch (error) {
      console.error("Failed to generate preview:", error);
      alert(
        "Error generating preview. Ensure at least one assessment exists in the system.",
      );
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const response = await api.get(
          `/assessment/super-admin/intelligence?quarter=${selectedQuarter}&year=${selectedYear}`,
        );
        setIntelData(response.data);
      } catch (error) {
        console.error("Failed to fetch intelligence data:", error);
      }
    };
    fetchIntel();
  }, [selectedQuarter, selectedYear]);

  const stats = [
    {
      label: "Onboarded Organizations",
      // detail: "Active corporate entities",
      longDesc: "Unique legal entities managed under your platform umbrella.",
      value: intelData?.stats?.[0]?.value || "0",
      icon: "solar:buildings-3-broken",
      color: "#448CD2",
    },
    {
      label: "Client Base Users",
      // detail: "Total registered individuals",
      longDesc: "Total active user accounts across all organization layers.",
      value: intelData?.stats?.[1]?.value || "0",
      icon: "solar:users-group-two-rounded-broken",
      color: "#8E54E9",
    },
    {
      label: "Verified Assessments",
      // detail: "Completed data sessions",
      longDesc: "Validated datasets that have passed all integrity protocols.",
      value: intelData?.stats?.[2]?.value || "0",
      icon: "solar:diploma-verified-broken",
      color: "#2d5d8c",
    },
    {
      label: "Client Success Rate",
      // detail: "Active participation score",
      longDesc:
        "Percentage of clients with active quarterly assessment cycles.",
      value: intelData?.stats?.[3]?.value || "0%",
      icon: "solar:ticker-star-linear",
      color: "#10b981",
    },
  ];

  const recentActivities =
    (intelData?.recentActivities || []).map((a: any) => ({
      ...a,
      time: a.time
        ? formatDistanceToNow(new Date(a.time), { addSuffix: true })
        : "recently",
    })) || [];

  const aiInsights = intelData?.aiInsights || [
    {
      title: "Market Growth",
      desc: "Enterprise organization onboarding is trending 14% higher than initial projections.",
      type: "positive",
    },
    {
      title: "Data Integrity",
      desc: "All current cycle assessments have passed automated verification protocols.",
      type: "info",
    },
  ];

  const roleLabels = [
    "Administrators",
    "Managers",
    "Strategic Leaders",
    "Employees",
  ];
  const roleColors = ["#448CD2", "#10B981", "#6366F1", "#F59E0B"];

  const roleData = [
    intelData?.userBreakdown?.admin || 0,
    intelData?.userBreakdown?.manager || 0,
    intelData?.userBreakdown?.leader || 0,
    intelData?.userBreakdown?.employee || 0,
  ];

  const totalUsers = roleData.reduce((a, b) => a + b, 0);
  const getRoleStats = (role: string) => {
    const idx = roleLabels.indexOf(role);
    const val = roleData[idx] || 0;
    const pct = totalUsers > 0 ? ((val / totalUsers) * 100).toFixed(1) : "0";
    return { val, pct, color: roleColors[idx] };
  };

  return (
    <>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] space-y-6">
        {/* ── Header ── */}
        <div className="">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 flex-wrap">
            <div className="flex items-center gap-3">
              {/* <div className="w-12 h-12 bg-[#edf5fd] rounded-lg flex items-center justify-center text-[var(--primary-color)] shrink-0">
                <Icon icon="solar:globus-bold-duotone" width="28" />
              </div> */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="md:text-2xl mb-1 text-xl font-bold text-gray-800">
                    Platform Overview
                  </h1>
                  {/* <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] text-[9px] font-semibold rounded-full border border-[#10b981]/20 uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
                    Live
                  </span> */}
                </div>
                <p className="text-gray-500 text-sm">
                  Your watching over{" "}
                  <strong className="text-[var(--primary-color)]">
                    {intelData?.stats?.[0]?.value || 0}
                  </strong>{" "}
                  active organizations right now.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 -right-1 top-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="size-3 text-[var(--primary-color)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-[#edf5fd] text-[var(--primary-color)] border border-[rgba(68,140,210,0.2)] rounded-full ps-3 pe-6 py-1.5 text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-[var(--primary-color)] transition-all appearance-none"
                  >
                    {[2025, 2026, 2027, 2028].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end bg-[#edf5fd] p-1 rounded-full border border-[rgba(68,140,210,0.2)]">
                  {[1, 2, 3, 4].map((q) => (
                    <button
                      key={q}
                      onClick={() => setSelectedQuarter(q)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${selectedQuarter === q ? "bg-[var(--primary-color)] text-white shadow-sm" : "text-[#5d5d5d] hover:text-[var(--primary-color)]"}`}
                    >
                      Q{q}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-1.5 py-0.5 bg-[#edf5fd] border border-[rgba(68,140,210,0.2)] rounded-full flex items-center gap-1">
                <Icon
                  icon="solar:clock-circle-bold-duotone"
                  className="text-[var(--primary-color)]"
                  width="10"
                />
                <span className="text-[10px] font-semibold text-[var(--primary-color)]">
                  {intelData?.currentCycle?.daysLeft || "0"} days left
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid — compact horizontal cards ── */}
        <div className="grid grid-cols-2 pt-5 xl:grid-cols-4 gap-3">
          {stats.map((stat: any, index: number) => (
            <div
              key={index}
              className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full flex items-center gap-5 flex-nowrap"
            >
              <div
                className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <Icon icon={stat.icon} width="24" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide truncate">
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-bold leading-tight mt-0.5"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                {/* <p className="text-[10px] text-[#5d5d5d] mt-0.5 truncate">
                  {stat.detail}
                </p> */}
              </div>
            </div>
          ))}
        </div>

        {/* ── Pulse Row — 3 quick-read cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {[
            {
              label: "Assessments completed",
              value: intelData?.participation?.completed || 0,
              badge: `${intelData?.participation?.rate || 0}% rate`,
              icon: "solar:user-check-broken",
              color: "#10b981",
            },
            {
              label: "Waiting for feedback",
              value: intelData?.participation?.pending || 0,
              badge: "In queue",
              icon: "la:stopwatch",
              color: "#448cd2",
            },
            {
              label: "Most active group",
              value:
                Object.entries(intelData?.completionByRole || {}).sort(
                  ([, a], [, b]) => (b as number) - (a as number),
                )[0]?.[0] || "N/A",
              badge: "Top segment",
              icon: "streamline-flex:star-badge",
              color: "#8E54E9",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full flex items-start justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  <Icon icon={item.icon} width="20" />
                </div>
                <div>
                  <p className="text-xs text-[#5d5d5d] font-medium">
                    {item.label}
                  </p>
                  <p className="text-base font-bold text-[#1a3652] capitalize leading-tight">
                    {item.value}
                  </p>
                </div>
              </div>
              <span
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}12`,
                  borderColor: `${item.color}30`,
                }}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* ── Main 3-col grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Member Distribution */}
          <div className="xl:col-span-4 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(68,140,210,0.1)]">
              <div>
                <h3 className="text-sm font-bold text-[#1a3652]">
                  Member Distribution
                </h3>
                <p className="text-[10px] text-[#5d5d5d] mt-0.5">
                  People across your platform
                </p>
              </div>
              {viewMode === "visual" && (
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setViewMode("visual");
                  }}
                  className="appearance-none bg-[#edf5fd] border border-[rgba(68,140,210,0.25)] text-[var(--primary-color)] text-[10px] font-semibold py-1 pl-2.5 pr-6 rounded-full outline-none cursor-pointer"
                >
                  {roleLabels.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <Icon
                  icon="solar:alt-arrow-down-bold"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--primary-color)] pointer-events-none"
                  width="9"
                />
              </div>
              )}
            </div>

            {/* Toggle */}
            <div className="flex bg-[#edf5fd] p-0.5 rounded-full mb-4 border border-[rgba(68,140,210,0.15)]">
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "list" ? "bg-white text-[var(--primary-color)] shadow-sm" : "text-[#5d5d5d]"}`}
              >
                <Icon icon="solar:list-bold" width="11" /> Breakdown
              </button>
              <button
                onClick={() => setViewMode("visual")}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "visual" ? "bg-white text-[var(--primary-color)] shadow-sm" : "text-[#5d5d5d]"}`}
              >
                <Icon icon="solar:pie-chart-bold" width="11" /> Visual
              </button>
            </div>

            <div className="flex-1">
              {viewMode === "list" ? (
                <div className="space-y-3">
                  {[
                    {
                      label: "Administrators",
                      val: intelData?.userBreakdown?.admin || 0,
                      color: roleColors[0],
                    },
                    {
                      label: "Managers",
                      val: intelData?.userBreakdown?.manager || 0,
                      color: roleColors[1],
                    },
                    {
                      label: "Leaders",
                      val: intelData?.userBreakdown?.leader || 0,
                      color: roleColors[2],
                    },
                    {
                      label: "Employees",
                      val: intelData?.userBreakdown?.employee || 0,
                      color: roleColors[3],
                    },
                  ].map((role) => {
                    const pct =
                      totalUsers > 0 ? (role.val / totalUsers) * 100 : 0;
                    return (
                      <div
                        key={role.label}
                        className="cursor-pointer group"
                        onClick={() => {
                          setSelectedRole(role.label);
                          setViewMode("visual");
                        }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-semibold text-[#5d5d5d] group-hover:text-[var(--primary-color)] transition-colors">
                            {role.label}
                          </span>
                          <span className="text-[11px] font-bold text-[#1a3652]">
                            {role.val}{" "}
                            <span className="text-[9px] text-[#5d5d5d] font-normal">
                              ({pct.toFixed(0)}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#edf5fd] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.max(pct, 3)}%`,
                              backgroundColor: role.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in slide-in-from-bottom-1 duration-300">
                  <div className="w-full bg-[#edf5fd] rounded-xl border border-[rgba(68,140,210,0.12)] px-4 py-3 flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[9px] font-semibold text-[#5d5d5d] uppercase tracking-wider">
                        {selectedRole}
                      </p>
                      <span
                        className="text-3xl font-bold"
                        style={{ color: getRoleStats(selectedRole).color }}
                      >
                        {getRoleStats(selectedRole).pct}%
                      </span>
                      <span className="text-[10px] text-[#5d5d5d] ml-1.5">
                        of total
                      </span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-[rgba(68,140,210,0.15)] text-center shadow-sm">
                      <span className="text-xl font-bold text-[#1a3652] block">
                        {getRoleStats(selectedRole).val}
                      </span>
                      <span className="text-[8px] text-[#5d5d5d] uppercase tracking-widest">
                        People
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <PieChart
                      labels={roleLabels}
                      data={roleData}
                      colors={roleColors}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Community Health */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="flex-1 bg-[var(--app-surface)] rounded-xl border border-[var(--app-border-color)] p-7 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
              <h3 className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-[0.2em] mb-6">
                Overall Health
              </h3>

              <div className="relative inline-flex items-center justify-center mb-8">
                <CircularProgress
                  value={intelData?.participation?.rate || 0}
                  pathColor="#448cd2"
                  trailColor="rgba(68, 140, 210, 0.1)"
                  textColor="#1a3652"
                  width={160}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 w-full relative z-10">
                <div className="p-4 bg-[var(--app-surface-soft)] rounded-xl transition-colors">
                  <span className="text-xl font-black text-[var(--app-heading-color)] block tracking-tight">
                    {intelData?.participation?.completed || 0}
                  </span>
                  <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block mt-1">
                    Completed
                  </span>
                </div>
                <div className="p-4 bg-[var(--app-surface-soft)] rounded-xl transition-colors">
                  <span className="text-xl font-black text-[var(--app-heading-color)] block tracking-tight">
                    {intelData?.participation?.assigned || 0}
                  </span>
                  <span className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wider block mt-1">
                    Assigned
                  </span>
                </div>
                <div className="p-4 bg-[var(--app-surface-soft)] rounded-xl transition-colors">
                  <span className="text-xl font-black text-[var(--app-heading-color)] block tracking-tight">
                    {intelData?.participation?.pending || 0}
                  </span>
                  <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider block mt-1">
                    Pending
                  </span>
                </div>
                <div className="p-4 bg-[var(--app-surface-soft)] rounded-xl transition-colors">
                  <span className="text-xl font-black text-[var(--app-heading-color)] block tracking-tight">
                    {intelData?.stats?.[0]?.value || 0}
                  </span>
                  <span className="text-[10px] font-bold text-[#448CD2] uppercase tracking-wider block mt-1">
                    Orgs
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard/org-assessments")}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[var(--app-heading-color)] to-[var(--primary-color)] p-5 rounded-[20px] shadow-lg flex items-center justify-between text-white group hover:shadow-2xl hover:scale-[1.01] transition-all active:scale-[0.99] border border-white/10"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="text-left relative z-10">
                <p className="text-[10px] font-black text-blue-200/80 uppercase tracking-[0.2em] mb-1">
                  Governance Module
                </p>
                <h4 className="text-base font-black tracking-wide">
                  Audit Client Portfolios
                </h4>
              </div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all relative z-10">
                <Icon icon="solar:arrow-right-up-bold" width="20" />
              </div>
            </button>
          </div>

          {/* Team Stream */}
          <div className="xl:col-span-4 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#448CD2]"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-lg font-black text-[var(--app-heading-color)] tracking-tight">
                  Global Stream
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Live platform feed
                </p>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] rounded-full text-[9px] font-black uppercase tracking-wider border border-[#10b981]/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                Live
              </span>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar max-h-[350px] relative z-10">
              {recentActivities?.length > 0 ? (
                recentActivities.map((log: any, i: number) => (
                  <div
                    key={log.id || i}
                    className="flex gap-4 group/item cursor-default"
                  >
                    <div className="mt-1">
                      <div
                        className={`size-5 rounded-full flex flex-shrink-0 items-center justify-center ${log.type === "submission" ? "bg-[#10B981]" : "bg-[#448CD2]"} shadow-sm`}
                      >
                        <span className="text-[8px] font-semibold text-white uppercase">
                          {log.org?.[0] || "?"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black text-[var(--app-heading-color)] group-hover/item:text-[var(--primary-color)] transition-colors truncate max-w-[180px]">
                        {log.org}
                      </h4>
                      <p className="text-[11px] text-[var(--app-text-muted)] mt-1 font-medium italic">
                        {log.action}
                      </p>
                      {/* <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          {log.time
                            ? new Date(log.time).toLocaleDateString()
                            : "Just now"}
                        </span>
                      </div> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-16">
                  <Icon
                    icon="solar:history-bold-duotone"
                    width="40"
                    className="text-slate-300 dark:text-slate-600 opacity-50"
                  />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
                    Monitoring grid...
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/dashboard/notifications")}
              className="w-full mt-6 py-4 bg-[var(--app-surface-soft)] border border-[var(--app-border-color)] rounded-[14px] text-[10px] font-black uppercase tracking-[0.25em] text-[var(--app-text-muted)] hover:bg-[#448CD2] hover:text-white hover:border-[#448CD2] transition-all duration-300 relative z-10"
            >
              Analyze Data Stream
            </button>
          </div>
        </div> 

        {/* ── AI-Powered Platform Observations ── */}
        <div className="bg-[var(--app-surface)] rounded-[24px] border border-[var(--app-border-color)] p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[var(--app-heading-color)] tracking-tight">
                AI-Powered Platform Observations
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                POD Insights™ Super Admin Intelligence
              </p>
            </div>
            <div className="w-9 h-9 bg-[#8E54E9]/10 rounded-[12px] flex items-center justify-center">
              <Icon
                className="text-[#8E54E9]"
                icon="solar:magic-stick-3-line-duotone"
                width="20"
                height="20"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-4">
            {[
              {
                icon: "solar:graph-broken",
                color: "#10B981",
                bg: "bg-[#10B981]/10",
                title: "Platform Momentum",
                body:
                  (intelData?.participation?.rate || 0) >= 70
                    ? `Platform completion is at ${intelData?.participation?.rate || 0}% — exceeding the 70% benchmark. ${intelData?.stats?.[0]?.value || 0} active organizations are contributing to a strong Q${selectedQuarter} cycle.`
                    : (intelData?.participation?.rate || 0) >= 40
                      ? `Completion rate stands at ${intelData?.participation?.rate || 0}%across ${intelData?.stats?.[0]?.value || 0} organizations. Targeted org-level outreach can push this past the 70% platform benchmark.`
                      : `Completion is below benchmark at ${intelData?.participation?.rate || 0}%. Consider escalating outreach across all ${intelData?.stats?.[0]?.value || 0} client organizations.`,
              },
              {
                icon: "solar:buildings-2-broken",
                color: "#448CD2",
                bg: "bg-[#448CD2]/10",
                title: "Organizational Coverage",
                body: `${intelData?.stats?.[1]?.value || 0} users are registered across ${intelData?.stats?.[0]?.value || 0} organizations. The most active group this quarter is ${Object.entries(intelData?.completionByRole || {}).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "N/A"}. ${intelData?.participation?.pending || 0} assessments are still pending platform-wide.`,
              },
              {
                icon: "oui:security-signal",
                color: "#F59E0B",
                bg: "bg-[#F59E0B]/10",
                title: "Client Health Signal",
                body:
                  (intelData?.participation?.pending || 0) > 10
                    ? `${intelData?.participation?.pending || 0} assessments remain pending. Priority intervention is recommended for organizations with zero completions this quarter to maintain platform integrity.`
                    : `Pending queue is healthy at ${intelData?.participation?.pending || 0}. Platform data integrity is strong. Continue monitoring role-level compliance across all organizations.`,
              },
            ].map((obs, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 bg-[rgba(68,140,210,0.1)] rounded-xl transition-colors"
              >
                <div
                  className={`w-10 h-10 shrink-0 ${obs.bg} rounded-[12px] flex items-center justify-center mt-0.5`}
                >
                  <Icon
                    icon={obs.icon}
                    width="20"
                    style={{ color: obs.color }}
                  />
                </div>
                <div>
                  <h4 className="text-[12px] font-black text-[var(--app-heading-color)] mb-1.5">
                    {obs.title}
                  </h4>
                  <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed">
                    {obs.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Report Laboratory: Live Preview ── */}
        <div className="bg-white border border-[#448CD2] border-opacity-20 p-5 rounded-xl flex flex-col xl:flex-row items-start justify-between gap-5 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#edf5fd] to-white rounded-xl flex items-center justify-center text-[var(--primary-color)]">
              <Icon icon="solar:document-broken" width="28" height="28" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1a3652]">
                Report Live Laboratory
              </h3>
              <p className="text-xs text-gray-500">
                Super Admin Mode: Real-time validation of POD-360™ dossier
                layout and PDF service logic.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <button
              disabled={loadingPreview}
              onClick={() => handlePreview("individual")}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-xs rounded-lg hover:bg-[#edf5fd] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loadingPreview && currentPreviewType === "individual" ? (
                <Icon icon="line-md:loading-loop" width="16" />
              ) : (
                <Icon icon="solar:user-broken" width="16" height="16" />
              )}
              Sample Participant
            </button>
            <button
              disabled={loadingPreview}
              onClick={() => handlePreview("master")}
              className="flex-1  sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[#1a3652] text-white font-bold text-xs rounded-lg hover:opacity-95 transition-all shadow-md flex hidden items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loadingPreview && currentPreviewType === "master" ? (
                <Icon icon="line-md:loading-loop" width="16" />
              ) : (
                <Icon icon="solar:globus-bold" width="16" />
              )}
              Master Org Report
            </button>
          </div>
        </div>

        {/* ── AI Insights Footer ── */}
        <div className="bg-white border border-[rgba(68,140,210,0.2)]  px-5 py-4 rounded-xl flex flex-col sm:flex-row items-start gap-4">
          <div className="flex items-start gap-3 shrink-0 px-4 py-3 bg-[#edf5fd] rounded-xl border border-[rgba(68,140,210,0.15)]">
            <Icon
              icon="solar:magic-stick-3-line-duotone"
              width="20"
              height="20"
              className="text-[var(--primary-color)] mt-1"
            />
            <div>
              <span className="text-[9px] font-bold text-[var(--primary-color)] uppercase tracking-widest block">
                POD Insights™ AI
              </span>
              <span className="text-xs font-bold text-[#1a3652]">
                Global Overview
              </span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiInsights.map((insight: any, idx: number) => (
              <div
                key={idx}
                className="flex gap-3 items-start p-3 rounded-lg border border-[rgba(68,140,210,0.1)] hover:border-[rgba(68,140,210,0.25)] hover:bg-[#fafcff] transition-all group"
              >
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${insight.type === "positive" ? "bg-[#10b981]/10 text-[#10b981]" : "bg-blue-50 text-[var(--primary-color)]"}`}
                >
                  <Icon
                    icon={
                      insight.type === "positive"
                        ? "solar:graph-broken"
                        : "solar:notification-unread-lines-broken"
                    }
                    width="16"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1a3652] group-hover:text-[var(--primary-color)] transition-colors">
                    {insight.title}
                  </h4>
                  <p className="text-[10px] text-[#5d5d5d] mt-0.5 leading-relaxed">
                    {insight.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReportPreviewModal
        show={showPreview}
        onClose={() => {
          setShowPreview(false);
          if (pdfUrl) URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
        onRefresh={() => handlePreview(currentPreviewType)}
        loading={loadingPreview}
        type="Live PDF System Preview"
      />
    </>
  );
};

export default SuperAdminOverview;
