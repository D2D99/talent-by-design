import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import EditableTooltip from "../../components/editableTooltip";
import MultiRadarChart from "../../charts/multiRadarChart";
import type { RadarData } from "../../charts/radarChart";
import { initTWE, Dropdown, Ripple } from "tw-elements";
import CircularProgress from "../../components/percentageCircle";
// import { formatDistanceToNow } from "date-fns";
import PieChart from "../../charts/pieChart";
import RoleProgressChart from "../../components/alignmentStatus";

// --- Assets (using same names as in user request for consistency) ---
import OuiSecurity from "../../../public/static/img/home/oui_security-signal-detected.svg";
import Iconamoon from "../../../public/static/img/home/iconamoon_attention-square.svg";

const Ring = ({
  score,
  r,
  color,
}: {
  score: number;
  r: number;
  color: string;
}) => {
  const circ = 2 * Math.PI * r;
  const strokeDashoffset = circ - (circ * score) / 100;
  return (
    <>
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="#F1F5F9"
        strokeWidth="8"
      />
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="butt"
        transform="rotate(-90 100 100)"
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
    </>
  );
};

const OrganizationDeepDive = () => {
  const { orgName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [teamAvgData, setTeamAvgData] = useState<any>(null);
  const [intelData, setIntelData] = useState<any>(null);
  const [selectedRadarDept, setSelectedRadarDept] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor(new Date().getMonth() / 3) + 1,
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"list" | "visual">("list");
  const [selectedRole, setSelectedRole] = useState<string>("Managers");
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);
  const [intelLoading, setIntelLoading] = useState(false);

  const toggleHiddenIndex = (idx: number) => {
    setHiddenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  useEffect(() => {
    initTWE({ Dropdown, Ripple });
    const fetchOrgData = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `dashboard/admin?orgName=${encodeURIComponent(orgName || "")}`,
        );
        setReportData(res.data.report);
      } catch (error) {
        console.error("Failed to fetch org health data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgData();
  }, [orgName]);

  useEffect(() => {
    const fetchIntelligence = async () => {
      if (!orgName) return;
      setIntelLoading(true);
      try {
        const res = await api.get(
          `assessment/admin/intelligence?orgName=${encodeURIComponent(orgName)}&quarter=${selectedQuarter}&year=${selectedYear}`,
        );
        setIntelData(res.data);
      } catch (error) {
        console.error("Org intel fetch error:", error);
      } finally {
        setIntelLoading(false);
      }
    };
    fetchIntelligence();
  }, [orgName, selectedQuarter, selectedYear]);

  useEffect(() => {
    const fetchTeamAvg = async () => {
      if (!orgName) return;
      try {
        let url = "dashboard/manager-team-avg";
        const params: string[] = ["includeSelf=true"];
        params.push(`orgName=${encodeURIComponent(orgName)}`);
        if (selectedRadarDept)
          params.push(`department=${encodeURIComponent(selectedRadarDept)}`);

        if (params.length) url += `?${params.join("&")}`;
        const res = await api.get(url);
        setTeamAvgData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTeamAvg();
  }, [orgName, selectedRadarDept]);

  if (loading || intelLoading) return <SpinnerLoader />;

  const { stats, roleBreakdown } = intelData || {};

  const overallScore = reportData?.scores?.overall || 0;

  const completionRate = stats?.completionRate || 0;
  const completed = stats?.completedAssessments || 0;
  const total = stats?.totalMembers || 0;
  const pending = stats?.notStartedAssessments || 0;
  const inProgress = stats?.inProgressAssessments || 0;

  const displayStats = [
    {
      label: "Total Members",
      value: total.toString(),
      icon: "solar:users-group-two-rounded-broken",
      color: "#448CD2",
    },
    {
      label: "Active Invitations",
      value: stats?.activeInvites?.toString() || "0",
      icon: "solar:letter-broken",
      color: "#F59E0B",
    },
    {
      label: "Not Started",
      value: pending.toString(),
      icon: "material-symbols:not-started-outline",
      color: "#8892B0",
    },
    {
      label: "In Progress",
      value: inProgress.toString(),
      icon: "solar:clock-circle-broken",
      color: "#8E54E9",
    },
    {
      label: "Completed Cycles",
      value: completed.toString(),
      icon: "solar:checklist-minimalistic-broken",
      color: "#10B981",
    },
  ];

  const roleLabels = ["Managers", "Leaders", "Employees"];
  const roleColors = ["#10B981", "#6366F1", "#F59E0B"];
  const roleReportDataCounts = [
    roleBreakdown?.manager || 0,
    roleBreakdown?.leader || 0,
    roleBreakdown?.employee || 0,
  ];

  const totalUsers = roleReportDataCounts.reduce((a, b) => a + b, 0);

  const radarData: RadarData = (() => {
    const labels = Object.keys(reportData?.scores?.domains || {});
    const lScores: number[] = [];
    const mScores: number[] = [];
    const eScores: number[] = [];

    labels.forEach((domain) => {
      const lAvg = teamAvgData?.leaderAvg?.[domain]?.avgScore ?? 0;
      const mAvg = teamAvgData?.managerAvg?.[domain]?.avgScore ?? 0;
      const eAvg = teamAvgData?.employeeAvg?.[domain]?.avgScore ?? 0;

      lScores.push(Number((lAvg / 10).toFixed(1)));
      mScores.push(Number((mAvg / 10).toFixed(1)));
      eScores.push(Number((eAvg / 10).toFixed(1)));
    });

    return { labels, manager: lScores, team: mScores, peer: eScores };
  })();

  const topPriorities = Object.entries(reportData?.scores?.domains || {})
    .sort(([, a]: any, [, b]: any) => a.score - b.score)
    .slice(0, 3)
    .map(([name, data]: any) => ({
      name,
      score: Math.round(data.score),
      color: data.score < 50 ? "#D71818" : "#FF8D28",
    }));

  const roleAverages = (() => {
    const lScores = Object.values(teamAvgData?.leaderAvg || {}).map(
      (d: any) => d.avgScore || 0,
    );
    const leaderScore =
      lScores.length > 0
        ? Math.round(lScores.reduce((a, b) => a + b, 0) / lScores.length)
        : 0;
    const mScores = Object.values(teamAvgData?.managerAvg || {}).map(
      (d: any) => d.avgScore || 0,
    );
    const managerScore =
      mScores.length > 0
        ? Math.round(mScores.reduce((a, b) => a + b, 0) / mScores.length)
        : 0;
    const eScores = Object.values(teamAvgData?.employeeAvg || {}).map(
      (d: any) => d.avgScore || 0,
    );
    const employeeScore =
      eScores.length > 0
        ? Math.round(eScores.reduce((a, b) => a + b, 0) / eScores.length)
        : 0;
    const getColor = (val: number) => {
      if (val < 50) return "#FF5656";
      if (val < 75) return "#FEE114";
      return "#30AD43";
    };
    return [
      {
        label: `SENIOR LEADER (${teamAvgData?.leaderCount || 0})`,
        value: leaderScore,
        color: getColor(leaderScore),
      },
      {
        label: `MANAGER (${teamAvgData?.managerCount || 0})`,
        value: managerScore,
        color: getColor(managerScore),
      },
      {
        label: `EMPLOYEE (${teamAvgData?.employeeCount || 0})`,
        value: employeeScore,
        color: getColor(employeeScore),
      },
    ];
  })();

  const alignmentInfo = (() => {
    const values = roleAverages.map((r) => r.value).filter((v) => v !== 0);
    if (values.length === 0)
      return {
        label: "No Data",
        status: "Gray",
        color: "#ccc",
        bg: "#eee",
        gap: 0,
        icon: "solar:info-circle-bold-duotone",
        coachText: "Insufficient data.",
        largestRole: "N/A",
        lowestRole: "N/A",
      };
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const gap = maxVal - minVal;
    const largestRole =
      roleAverages.find((r) => r.value === maxVal)?.label?.split(" (")[0] ||
      "N/A";
    const lowestRole =
      roleAverages.find((r) => r.value === minVal)?.label?.split(" (")[0] ||
      "N/A";
    if (gap > 15)
      return {
        label: "High Variance",
        status: "Red",
        color: "#D71818",
        bg: "#FFEBEB",
        icon: "solar:shield-warning-bold-duotone",
        gap,
        largestRole,
        lowestRole,
        coachText:
          "High variance detected (> 15%). This indicates Hidden Risk; leadership perception may be disconnected.",
      };
    if (gap < 10)
      return {
        label: "High Alignment",
        status: "Green",
        color: "#30AD43",
        bg: "#F0FDF4",
        icon: "solar:check-circle-bold-duotone",
        gap,
        largestRole,
        lowestRole,
        coachText:
          "Low variance detected. The organization is moving with Aligned Execution.",
      };
    return {
      label: "Moderate Variance",
      status: "Amber",
      color: "#D97706",
      bg: "#FFFBEB",
      icon: "fluent:eye-lines-20-regular",
      gap,
      largestRole,
      lowestRole,
      coachText: "Moderate variance detected. Blind spots may exist.",
    };
  })();

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] space-y-6">
      {/* ── Header ── */}
      <div className="">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-3">
            <div>
              <div
                className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit uppercase"
                onClick={() => navigate(-1)}
              >
                <Icon icon="material-symbols:arrow-back-rounded" width="14" />
                <span>Back to Organizations</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-1">
                  {orgName} <span className="text-[#448CD2]">Insights</span>
                </h1>
              </div>
              <p className="text-gray-500 text-sm">
                Organization Workspace · Q{selectedQuarter} {selectedYear}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 -right-1 top-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="size-3 text-[#448CD2]"
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
                  className="bg-[#edf5fd] text-[#448CD2] border border-[rgba(68,140,210,0.2)] rounded-full ps-3 pe-6 py-1.5 text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-[#448CD2] transition-all appearance-none"
                >
                  {[2024, 2025, 2026, 2027, 2028].map((y) => (
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
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${selectedQuarter === q ? "bg-[#448CD2] text-white shadow-sm" : "text-[#5d5d5d] hover:text-[#448CD2]"}`}
                  >
                    Q{q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 pt-5 xl:grid-cols-5 gap-3">
        {displayStats.map((stat, idx) => (
          <div
            key={idx}
            className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full flex items-center gap-5 flex-nowrap bg-white"
          >
            <div
              className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
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
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-6 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] p-5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(68,140,210,0.1)]">
            <div>
              <h3 className="text-sm font-bold">Member Distribution</h3>
            </div>
            {viewMode === "visual" && (
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="appearance-none bg-[#edf5fd] border border-[rgba(68,140,210,0.25)] text-[#448CD2] text-[10px] font-semibold py-1 pl-2.5 pr-6 rounded-full outline-none cursor-pointer"
                >
                  {roleLabels.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <Icon
                  icon="solar:alt-arrow-down-bold"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#448CD2] pointer-events-none"
                  width="9"
                />
              </div>
            )}
          </div>
          <div className="flex bg-[#edf5fd] p-0.5 rounded-full mb-4 border border-[rgba(68,140,210,0.15)]">
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "list" ? "bg-white text-[#448CD2] shadow-sm" : "text-[#5d5d5d]"}`}
            >
              <Icon icon="solar:list-bold" width="11" /> Breakdown
            </button>
            <button
              onClick={() => setViewMode("visual")}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "visual" ? "bg-white text-[#448CD2] shadow-sm" : "text-[#5d5d5d]"}`}
            >
              <Icon icon="solar:pie-chart-bold" width="11" /> Visual
            </button>
          </div>
          <div className="flex-1">
            {viewMode === "list" ? (
              <div className="space-y-3">
                {roleLabels.map((role, idx) => {
                  const val = roleReportDataCounts[idx] || 0;
                  const pct = totalUsers > 0 ? (val / totalUsers) * 100 : 0;
                  return (
                    <div
                      key={role}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedRole(role);
                        setViewMode("visual");
                      }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-semibold text-[#5d5d5d] group-hover:text-[#448CD2] transition-colors">
                          {role}
                        </span>
                        <span className="text-[11px] font-bold">
                          {val === 0 ? (
                            <span className="text-[9px] text-gray-400 font-normal italic">No Data Available</span>
                          ) : (
                            <>{val}{" "}<span className="text-[9px] text-[#5d5d5d] font-normal">({pct.toFixed(0)}%)</span></>
                          )}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#edf5fd] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(pct, 3)}%`,
                            backgroundColor: roleColors[idx],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom-1 duration-300">
                <PieChart
                  labels={roleLabels}
                  data={roleReportDataCounts}
                  colors={roleColors}
                />
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-6 flex flex-col gap-4">
          <div className="flex-1 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] p-7 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-6">
              Audit Engagement
            </h3>
            <div className="relative inline-flex items-center justify-center mb-8">
              <CircularProgress
                value={completionRate}
                pathColor="#448cd2"
                trailColor="rgba(68, 140, 210, 0.1)"
                textColor="#1a3652"
                width={160}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 w-full relative z-10">
              {[
                { label: "Completed", value: completed, color: "#10B981" },
                { label: "In Progress", value: inProgress, color: "#6366F1" },
                { label: "Pending Member", value: pending, color: "#F59E0B" },
                {
                  label: "Total Members Joined",
                  value: total,
                  color: "#448CD2",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 rounded-xl transition-colors"
                >
                  <span className="text-xl font-black text-slate-800 block tracking-tight">
                    {item.value}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider block mt-1"
                    style={{ color: item.color }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ────────── BELOW 3 SECTIONS: COPIED FROM USER REQUEST ────────── */}

      <div className="mt-8 grid lg:grid-cols-2 grid-cols-1  justify-between xl:gap-6 gap-5">
        <div className="border-[1px] border-[#448CD2] border-opacity-20 p-5 rounded-[12px] h-full bg-white w-full">
          {(() => {
            const getMetricColor = (score: number) => {
              if (score < 50) return "#FF5656"; // Needs Attention (Red)
              if (score < 75) return "#FEE114"; // At Risk (Yellow)
              return "#30AD43"; // On Track (Green)
            };

            const domains = reportData?.scores?.domains || {};
            const dNames = Object.keys(domains);
            const domainMetrics = [
              {
                name: dNames[0] || "People Potential",
                score: domains[dNames[0]]?.score || 0,
                color: getMetricColor(domains[dNames[0]]?.score || 0),
              },
              {
                name: dNames[1] || "Operational Steadiness",
                score: domains[dNames[1]]?.score || 0,
                color: getMetricColor(domains[dNames[1]]?.score || 0),
              },
              {
                name: dNames[2] || "Digital Fluency",
                score: domains[dNames[2]]?.score || 0,
                color: getMetricColor(domains[dNames[2]]?.score || 0),
              },
            ];

            const getDomainIconLocal = (idx: number) => {
              if (idx === 0) return "solar:users-group-rounded-bold";
              if (idx === 1) return "solar:settings-bold";
              if (idx === 2) return "solar:laptop-minimalistic-bold";
              return "solar:star-bold";
            };

            return (
              <>
                {/* Header Section */}
                <div className="sm:flex-row flex flex-col justify-between items-start mb-10 gap-4">
                  <div>
                    <div className="flex gap-2">
                      <h2 className="sm:text-xl text-lg font-bold text-[#1A3652] capitalize">
                        Organizational Health
                      </h2>
                      <div className="flex items-center">
                        <EditableTooltip
                          id="orgHealth"
                          defaultContent="A high-level snapshot of overall performance averaged across People, Operations, and Digital.

Indicates whether the organization is on track, at risk, or needs attention, helping you quickly prioritize focus areas."
                        />
                      </div>
                    </div>
                  </div>
                  {/* Legend Pill */}
                  <div className="flex mt-4 justify-center items-center gap-4  px-4 py-2 rounded-xl ">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-6 bg-[#30AD43]" />
                      <span className="text-xs font-semibold text-[#64748B]">
                        On Track
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-6 bg-[#FEE114]" />
                      <span className="text-xs font-semibold text-[#64748B]">
                        Monitor
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-6 bg-[#ff5656]" />
                      <span className="text-xs font-semibold text-[#64748B]">
                        Needs Attention
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex flex-wrap justify-center items-center gap-10 mt-2 mb-10">
                  {/* Radial Chart Left */}
                  <div className="relative flex justify-center items-center">
                    <svg
                      width="250"
                      height="250"
                      viewBox="0 0 200 200"
                      className="drop-shadow-sm"
                    >
                      <Ring
                        score={domainMetrics[0]?.score || 0}
                        r={82}
                        color={domainMetrics[0]?.color}
                      />
                      <Ring
                        score={domainMetrics[1]?.score || 0}
                        r={62}
                        color={domainMetrics[1]?.color}
                      />
                      <Ring
                        score={domainMetrics[2]?.score || 0}
                        r={42}
                        color={domainMetrics[2]?.color}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-[#0F172A] tracking-tighter">
                        {Math.round(overallScore)}
                        <span className="text-3xl">%</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mt-1.5">
                        Aggregate
                      </span>
                    </div>
                  </div>

                  {/* Linear Bars Right */}
                  <div className="flex flex-col justify-center space-y-8">
                    {domainMetrics.map((dm, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2.5 gap-10">
                          <div className="flex items-center gap-2">
                            <Icon
                              icon={getDomainIconLocal(idx)}
                              className="text-[#475569] w-[20px] h-[20px]"
                            />
                            <span className="text-[15px] font-bold text-[#334155]">
                              {dm.name}
                            </span>
                          </div>
                          <span
                            className="text-[15px] font-black"
                            style={{ color: dm.color }}
                          >
                            {Math.round(dm.score)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${dm.score}%`,
                              backgroundColor: dm.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-white">
          <div className="flex gap-2 mb-1">
            <h3 className="sm:text-xl text-lg font-bold text-[#1A3652] capitalize ">
              Overall Departmental POD Score
            </h3>

            <div className="flex items-center">
              <EditableTooltip
                id="podScore"
                defaultContent={
                  <>
                    <p className="mb-2">
                      Compares how Leaders, Managers, and Employees experience
                      the organization across the three POD domains.
                    </p>

                    <p>
                      Highlights gaps and imbalances that may signal hidden
                      risks to alignment, adoption, and overall performance.
                    </p>
                  </>
                }
              />
            </div>
          </div>
          <div className="relative" data-twe-dropdown-ref>
            <button
              className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base 2xl:text-sm text-[14px] font-medium  leading-normal text-[#676767] rounded-[4px]  "
              type="button"
              id="dropdownMenuButton1"
              data-twe-dropdown-toggle-ref
              aria-expanded="false"
            >
              {selectedRadarDept || "Select Org"}
              <span className="ms-2 w-2 [&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
            <ul
              className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block max-h-60 overflow-y-auto"
              aria-labelledby="dropdownMenuButton1"
              data-twe-dropdown-menu-ref
            >
              <li>
                <button
                  className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                  onClick={() => setSelectedRadarDept("")}
                >
                  Organization
                </button>
              </li>
              {(teamAvgData?.allDepartments || []).map((dept: string) => (
                <li key={dept}>
                  <button
                    className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                    onClick={() => setSelectedRadarDept(dept)}
                  >
                    {dept}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {((teamAvgData?.leaderCount || 0) + (teamAvgData?.managerCount || 0) + (teamAvgData?.employeeCount || 0)) > 0 && (
            <>
              <div className="flex justify-center mt-6 mb-4">
                {((teamAvgData?.leaderCount || 0) < 3 || (teamAvgData?.managerCount || 0) < 3 || (teamAvgData?.employeeCount || 0) < 3) ? (
                  <div className="bg-[#FFF9EE] border border-[#FDE68A] rounded-xl p-4 flex items-start gap-3 w-full text-left shadow-sm">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[13px] text-[#B45309] font-medium leading-relaxed">
                        Moderate variance detected. Blind spots may exist — leadership perception requires validation against front-line experience.
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#FDE68A]">
                          Limited Data
                        </span>
                        <span className="text-[10px] text-[#D97706] font-medium">
                          (Responses: {(teamAvgData?.leaderCount || 0) + (teamAvgData?.managerCount || 0) + (teamAvgData?.employeeCount || 0)})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#3498DB]"></span>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Confidence: High
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">
                      Total Responses: {(teamAvgData?.leaderCount || 0) + (teamAvgData?.managerCount || 0) + (teamAvgData?.employeeCount || 0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2">
                <div
                  className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${hiddenIndices.includes(0) ? "opacity-30" : "opacity-100"}`}
                  onClick={() => toggleHiddenIndex(0)}
                >
                  <span
                    className="w-5 h-2 rounded-sm inline-block"
                    style={{ background: "rgba(74, 144, 226, 0.7)" }}
                  />
                  <span className="text-xs text-[#474747]">
                    {(teamAvgData?.leaderCount || 0) === 0 ? "Leader - No Data Available" : `Leader (${teamAvgData?.leaderCount || 0})`}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${hiddenIndices.includes(1) ? "opacity-30" : "opacity-100"}`}
                  onClick={() => toggleHiddenIndex(1)}
                >
                  <span
                    className="w-5 h-2 rounded-sm inline-block"
                    style={{ background: "rgba(46, 204, 113, 0.7)" }}
                  />
                  <span className="text-xs text-[#474747]">
                    {(teamAvgData?.managerCount || 0) === 0 ? "Manager - No Data Available" : `Manager (${teamAvgData?.managerCount || 0})`}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${hiddenIndices.includes(2) ? "opacity-30" : "opacity-100"}`}
                  onClick={() => toggleHiddenIndex(2)}
                >
                  <span
                    className="w-5 h-2 rounded-sm inline-block"
                    style={{ background: "rgba(231, 76, 60, 0.6)" }}
                  />
                  <span className="text-xs text-[#474747]">
                    {(teamAvgData?.employeeCount || 0) === 0 ? "Employee - No Data Available" : `Employee (${teamAvgData?.employeeCount || 0})`}
                  </span>
                </div>
              </div>
            </>
          )}
          <div className="relative w-full min-h-[450px]">
            <MultiRadarChart
              data={radarData}
              onLabelSelect={() => { }}
              datasetLabels={["Leader", "Manager", "Employee"]}
              hiddenIndices={hiddenIndices}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
        <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-white">
          <div>
            <div className="flex items-center justify-between mb-4 ">
              <div>
                <div className="flex gap-2">
                  <h3 className="sm:text-xl text-lg font-bold text-[#1A3652] capitalize ">
                    Alignment Status
                  </h3>
                  <div className="flex items-center">
                    <EditableTooltip
                      id="alignStatus"
                      defaultContent={<p>No Data Found.</p>}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="relative" data-twe-dropdown-ref>
                    <button
                      className="flex items-center whitespace-nowrap bg-[#EDF5FD] px-3 py-1 text-sm font-medium leading-normal text-[#676767] rounded-[4px]"
                      type="button"
                      id="alignmentDeptDropdown"
                      data-twe-dropdown-toggle-ref
                      aria-expanded="false"
                    >
                      {selectedRadarDept || "Select Org"}
                      <span className="ms-1 w-2 [&>svg]:h-3 [&>svg]:w-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>
                    <ul
                      className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block"
                      aria-labelledby="alignmentDeptDropdown"
                      data-twe-dropdown-menu-ref
                    >
                      <li>
                        <button
                          className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                          onClick={() => setSelectedRadarDept("")}
                        >
                          Select Org
                        </button>
                      </li>
                      {(teamAvgData?.allDepartments || []).map(
                        (dept: string) => (
                          <li key={dept}>
                            <button
                              className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                              onClick={() => setSelectedRadarDept(dept)}
                            >
                              {dept}
                            </button>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <p
                    className="text-sm font-semibold flex items-center gap-1 hidden"
                    style={{ color: alignmentInfo.color }}
                  >
                    <Icon icon={alignmentInfo.icon} width="16" />
                    {alignmentInfo.status} Status
                  </p>
                </div>
              </div>

              <div>
                <img src={OuiSecurity} alt="images" className="w-8 h-8" />
              </div>
            </div>
            <div className="sm:w-[400px] w-full my-10">
              {roleAverages.every((r) => r.value === 0) ? (
                <p className="text-sm text-gray-400 italic text-center py-10">No Data Available</p>
              ) : (
                <RoleProgressChart data={roleAverages} />
              )}
            </div>
            <p className="text-base font-medium text-[#1A3652]  mt-6">
              <b className="">Largest Gap:</b> {alignmentInfo.largestRole} VS{" "}
              {alignmentInfo.lowestRole} (+{alignmentInfo.gap})
            </p>
            <div className="sm:mt-8 mt-6">
              <button
                type="button"
                className=" group rounded-full px-6 py-2 flex items-center gap-2 font-bold text-sm uppercase tracking-wider mb-4"
                style={{
                  backgroundColor: alignmentInfo.bg,
                  color: alignmentInfo.color,
                }}
              >
                {alignmentInfo.label}
              </button>
              {/* Coach Voice */}
              <div
                className="p-3 rounded-xl border text-sm font-medium leading-relaxed"
                style={{
                  backgroundColor: alignmentInfo.bg,
                  borderColor: `${alignmentInfo.color}30`,
                  color: alignmentInfo.color,
                }}
              >
                <Icon
                  icon={alignmentInfo.icon}
                  className="inline mr-1.5"
                  width="15"
                />
                {alignmentInfo.coachText}
              </div>
            </div>
            <div></div>
          </div>
        </div>

        <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex gap-2">
                <h3 className="sm:text-xl text-lg font-bold text-[#1A3652] capitalize ">
                  Priorities Attention
                </h3>

                <div className="flex items-center">
                  <EditableTooltip
                    id="priAtt"
                    defaultContent="Identifies the most critical areas requiring attention based on current results.

Provides clear direction on where to stabilize, optimize, or accelerate efforts."
                  />
                </div>
              </div>

              <p className="text-sm font-normal text-[#000000] mt-1">
                Top 3 priorities based on current data
              </p>
            </div>

            <div>
              <img src={Iconamoon} alt="images" className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {topPriorities.map((item, _idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <p
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color: item.color }}
                >
                  <span
                    className="w-2.5 h-2.5 flex rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.name}
                </p>
                <p className="text-sm font-bold" style={{ color: item.color }}>
                  {item.score}%
                </p>
              </div>
            ))}
            {topPriorities.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No priorities identified yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDeepDive;
