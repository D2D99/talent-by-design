import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import PieChart from "../../charts/pieChart";
// import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import ManagerReport from "../managerReport";

const ManagerOverview = () => {
  // const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor(new Date().getMonth() / 3) + 1,
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [intelData, setIntelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntelligence = async () => {
      try {
        const res = await api.get(
          `assessment/manager/intelligence?quarter=${selectedQuarter}&year=${selectedYear}`,
        );
        setIntelData(res.data);
      } catch (error) {
        console.error("Dashboard intel fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntelligence();
  }, [selectedQuarter, selectedYear]);

  if (loading) return <SpinnerLoader />;

  const { stats, roleBreakdown, activityStream, department } = intelData || {};

  // Map backend stats to UI metrics
  const displayStats = [
    {
      label: "Team Members",
      value: stats?.totalMembers?.toString() || "0",
      icon: "solar:users-group-rounded-bold-duotone",
      color: "#448CD2",
      trend: "Active directory",
    },
    {
      label: "Active Invites",
      value: stats?.activeInvites?.toString() || "0",
      icon: "solar:letter-bold-duotone",
      color: "#F59E0B",
      trend: "Awaiting response",
    },
    {
      label: "Completed Assessments",
      value: stats?.completedAssessments?.toString() || "0",
      icon: "solar:checklist-minimalistic-bold-duotone",
      color: "#10B981",
      trend: `${stats?.completionRate || 0}% completion`,
    },
    {
      label: "Pending Assessments",
      value: (
        (stats?.totalMembers || 0) - (stats?.completedAssessments || 0)
      ).toString(),
      icon: "solar:clipboard-list-bold-duotone",
      color: "#8E54E9",
      trend: "Requires attention",
    },
  ];

  const roleData = [
    roleBreakdown?.employee || 0,
  ];
  const roleLabels = ["Employees"];
  const roleColors = ["#F59E0B"];

  return (
    <>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 mb-8 min-h-[calc(100vh-162px)] space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="md:text-2xl mb-1 text-xl font-bold text-gray-800">
              Team Intelligence
            </h1>
            <p className="text-gray-500 text-sm">{department || "Team"} Hub</p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-[#edf5fd] text-[var(--primary-color)] border border-[rgba(68,140,210,0.2)] rounded-full px-4 py-1.5 text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
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
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map((stat: any, idx: number) => (
            <div
              key={idx}
              className="bg-[var(--app-surface)] p-6 rounded-[20px] border border-[var(--app-border-color)] shadow-sm group transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div
                  className="p-3.5 rounded-[12px] transition-transform duration-500 group-hover:scale-110 shadow-sm"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  <Icon icon={stat.icon} width="24" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[var(--app-surface-soft)] px-2.5 py-1 rounded-full border border-[var(--app-border-color)]">
                  {stat.trend}
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-4xl font-black text-[var(--app-heading-color)] tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-[11px] font-black text-[var(--app-text-muted)] uppercase tracking-[0.2em] mt-2">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Team Composition (Pie Chart) */}
          <div className="xl:col-span-4 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-[var(--app-heading-color)] tracking-tight">
                  Team Structure
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Role Distribution
                </p>
              </div>
              <div className="w-10 h-10 bg-[var(--app-surface-soft)] rounded-full flex items-center justify-center text-[var(--app-text-muted)] border border-[var(--app-border-color)] transition-transform duration-500 hover:rotate-180">
                <Icon icon="solar:pie-chart-bold-duotone" width="20" />
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center pt-2">
              <div className="w-full h-[240px] flex items-center justify-center relative overflow-hidden">
                <PieChart
                  labels={roleLabels}
                  data={roleData}
                  colors={roleColors}
                />
              </div>
            </div>
          </div>

          {/* Assessment Lifecycle */}
          <div className="xl:col-span-5 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary-color)]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h3 className="text-xl font-black text-[var(--app-heading-color)] tracking-tight">
                  Assessment Lifecycle
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Real-time Participation Stream
                </p>
              </div>
              <div className="w-10 h-10 bg-[var(--app-surface-soft)] rounded-full flex items-center justify-center text-[var(--app-text-muted)] border border-[var(--app-border-color)]">
                <Icon
                  icon="solar:notification-status-bold-duotone"
                  width="20"
                />
              </div>
            </div>

            <div className="flex-1 space-y-8 relative z-10">
              {/* Progress Bars for Lifecycle */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">
                    Completed
                  </span>
                  <span className="text-sm font-black text-[#10B981]">
                    {stats?.completedAssessments}{" "}
                    <span className="text-[10px] text-slate-400 font-bold">
                      ({stats?.completionRate}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-3 bg-[var(--app-surface-soft)] rounded-full border border-[var(--app-border-color)]/30 overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full transition-all duration-1000"
                    style={{ width: `${stats?.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">
                    In Progress
                  </span>
                  <span className="text-sm font-black text-[#6366F1]">
                    {stats?.inProgressAssessments || 0}
                  </span>
                </div>
                <div className="w-full h-3 bg-[var(--app-surface-soft)] rounded-full border border-[var(--app-border-color)]/30 overflow-hidden">
                  <div
                    className="h-full bg-[#6366F1] rounded-full transition-all duration-1000"
                    style={{
                      width: `${stats?.totalMembers > 0 ? ((stats?.inProgressAssessments || 0) / stats?.totalMembers) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">
                    Not Started
                  </span>
                  <span className="text-sm font-black text-[#F59E0B]">
                    {stats?.notStartedAssessments || 0}
                  </span>
                </div>
                <div className="w-full h-3 bg-[var(--app-surface-soft)] rounded-full border border-[var(--app-border-color)]/30 overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full transition-all duration-1000"
                    style={{
                      width: `${stats?.totalMembers > 0 ? ((stats?.notStartedAssessments || 0) / stats?.totalMembers) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Log (List) */}
          <div className="xl:col-span-3 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#448CD2]"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-lg font-bold tracking-tight text-[var(--app-heading-color)]">
                Team Stream
              </h3>
              <Icon
                icon="solar:history-bold-duotone"
                className="text-[#448CD2]"
                width="20"
              />
            </div>

            <div className="flex-1 space-y-6 relative z-10 overflow-y-auto max-h-[400px] no-scrollbar">
              {activityStream?.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex gap-4 group/item cursor-default"
                >
                  <div className="mt-1">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${activity.type === "completion" ? "bg-[#10B981]" : activity.type === "start" ? "bg-[#6366F1]" : "bg-[#F59E0B]"} shadow-sm`}
                    ></div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[var(--app-heading-color)] group-hover/item:text-[#448CD2] transition-colors">
                      {activity.user}
                    </h4>
                    <p className="text-[11px] text-[var(--app-text-muted)] mt-1 font-medium italic">
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(activity.time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!activityStream || activityStream.length === 0) && (
                <p className="text-xs text-slate-400 italic text-center py-10 opacity-50">
                  Pulse sequence initiated...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Strategic Prompt Section */}
        <div className="bg-gradient-to-r from-[#448CD2] to-[#1a3652] rounded-[24px] p-8 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[22px] flex items-center justify-center text-white border border-white/20 shadow-xl transform group-hover:scale-105 transition-transform">
                <Icon
                  icon="solar:lightbulb-bolt-bold-duotone"
                  width="40"
                  className="text-yellow-400"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight leading-none mb-2">
                  Team Insight
                </h2>
                <p className="text-sm text-blue-100/80 font-medium max-w-md leading-relaxed">
                  {intelData?.strategicInsight ||
                    "Assessments indicate a collective strength in Operational Flow. Consider focusing on maintaining this momentum."}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const reportEl = document.getElementById("manager-report-section");
                if (reportEl) reportEl.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white text-[#1a3652] px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Review Full Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerOverview;
