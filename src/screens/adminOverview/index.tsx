import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import PieChart from "../../charts/pieChart";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";

const AdminOverview = () => {
  const navigate = useNavigate();
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
          `assessment/admin/intelligence?quarter=${selectedQuarter}&year=${selectedYear}`,
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

  const { stats, roleBreakdown, activityStream } = intelData || {};

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
    roleBreakdown?.manager || 0,
    roleBreakdown?.leader || 0,
    roleBreakdown?.employee || 0,
  ];
  const roleLabels = ["Managers", "Leaders", "Employees"];
  const roleColors = ["#10B981", "#6366F1", "#F59E0B"];

  return (
    <>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="md:text-2xl mb-1 text-xl font-bold text-gray-800">
              Team Intelligence
            </h1>

            <p className="text-gray-500 text-sm">Internal Workspace Hub</p>
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
              <div className="w-full h-[240px] flex items-center justify-center p-4 relative overflow-hidden">
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

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-[var(--app-surface-soft)] p-4 rounded-[16px] border border-[var(--app-border-color)]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    Average Response
                  </p>
                  <p className="text-lg font-black text-[var(--app-heading-color)] tracking-tight">
                    2.4 Days
                  </p>
                </div>
                <div className="bg-[var(--app-surface-soft)] p-4 rounded-[16px] border border-[var(--app-border-color)]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    Weekly Growth
                  </p>
                  <p className="text-lg font-black text-[#10B981] tracking-tight">
                    +14.2%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Log (List) - CHANGED TO WHITE THEME */}
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
                      <span className="text-[8px] font-black text-[#448CD2] uppercase tracking-widest">
                        {activity.role}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
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

            <button
              onClick={() => navigate("/dashboard/users")}
              className="w-full mt-10 py-4 bg-[var(--app-surface-soft)] border border-[var(--app-border-color)] rounded-[14px] text-[10px] font-black uppercase tracking-[0.25em] text-[var(--app-text-muted)] hover:bg-[#448CD2] hover:text-white transition-all duration-300"
            >
              View Team Directory
            </button>
          </div>
        </div>

        {/* Recent Participants Detailed View */}
        <div className="bg-[var(--app-surface)] rounded-[24px] border border-[var(--app-border-color)] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-[var(--app-border-color)] flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-[var(--app-heading-color)] tracking-tight">
                Active Participants
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Direct Assessment Data Feed
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/users")}
              className="text-[10px] font-black uppercase text-[var(--primary-color)] tracking-widest hover:underline"
            >
              View Entire Directory
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--app-surface-soft)]">
                  <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">
                    Participant
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">
                    Lifecycle Status
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">
                    Score
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border-color)]">
                {(intelData?.people || [])
                  .slice(0, 5)
                  .map((person: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-[var(--app-surface-soft)]/30 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)] font-bold text-xs border border-[var(--primary-color)]/20">
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--app-heading-color)] leading-none">
                              {person.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              {person.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black uppercase text-[var(--app-text-muted)] tracking-wider px-2 py-1 bg-[var(--app-surface-soft)] rounded-md border border-[var(--app-border-color)]">
                          {person.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${person.assessmentStatus === "Completed" ? "bg-[#10B981]" : person.assessmentStatus === "In Progress" ? "bg-[#6366F1]" : "bg-slate-300"}`}
                          ></span>
                          <span
                            className={`text-[11px] font-bold ${person.assessmentStatus === "Completed" ? "text-[#10B981]" : person.assessmentStatus === "In Progress" ? "text-[#6366F1]" : "text-slate-400"}`}
                          >
                            {person.assessmentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {person.assessmentStatus === "Completed" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--app-heading-color)]">
                              {person.lastScore}%
                            </span>
                            {person.classification === "High" && (
                              <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 uppercase">
                                High
                              </span>
                            )}
                            {person.classification === "Medium" && (
                              <span className="text-[9px] font-black bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200 uppercase">
                                Med
                              </span>
                            )}
                            {person.classification === "Low" && (
                              <span className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 uppercase">
                                Low
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {person.lastActivity
                            ? new Date(person.lastActivity).toLocaleDateString()
                            : person.status === "Registered"
                              ? "Profile Verified"
                              : "Invited"}
                        </span>
                      </td>
                    </tr>
                  ))}
                {(!intelData?.people || intelData.people.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-8 py-10 text-center text-xs text-slate-400 italic"
                    >
                      No participation records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Health Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Completion Rate", value: `${stats?.completionRate || 0}%`, icon: "solar:chart-square-bold-duotone", color: "#10B981", bg: "bg-[#10B981]/8", sub: stats?.completionRate >= 70 ? "On track" : stats?.completionRate >= 40 ? "Progressing" : "Needs focus" },
            { label: "Not Started", value: stats?.notStartedAssessments || 0, icon: "solar:hourglass-bold-duotone", color: "#F59E0B", bg: "bg-[#F59E0B]/8", sub: "Awaiting action" },
            { label: "In Progress", value: stats?.inProgressAssessments || 0, icon: "solar:refresh-circle-bold-duotone", color: "#6366F1", bg: "bg-[#6366F1]/8", sub: "Active sessions" },
            { label: "Active Invites", value: stats?.activeInvites || 0, icon: "solar:letter-bold-duotone", color: "#448CD2", bg: "bg-[#448CD2]/8", sub: "Awaiting join" },
          ].map((item, i) => (
            <div key={i} className="bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-6 flex flex-col gap-3 hover:shadow-md transition-all cursor-default">
              <div className={`w-10 h-10 ${item.bg} rounded-[12px] flex items-center justify-center`}>
                <Icon icon={item.icon} width="20" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-2xl font-black text-[var(--app-heading-color)] tracking-tight">{item.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</p>
              </div>
              <p className="text-[10px] font-bold mt-auto" style={{ color: item.color }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Pipeline + Quick Actions ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[var(--app-surface)] rounded-[24px] border border-[var(--app-border-color)] p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[var(--app-heading-color)] tracking-tight">Assessment Pipeline</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Org-wide lifecycle view</p>
              </div>
              <Icon icon="solar:graph-bold-duotone" className="text-[#448CD2]" width="22" />
            </div>
            <div className="space-y-4">
              {[
                { label: "Completed", value: stats?.completedAssessments || 0, total: stats?.totalMembers || 1, color: "#10B981" },
                { label: "In Progress", value: stats?.inProgressAssessments || 0, total: stats?.totalMembers || 1, color: "#6366F1" },
                { label: "Not Started", value: stats?.notStartedAssessments || 0, total: stats?.totalMembers || 1, color: "#F59E0B" },
                { label: "Pending Invites", value: stats?.activeInvites || 0, total: stats?.totalMembers || 1, color: "#448CD2" },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">{row.label}</span>
                    <span className="text-[11px] font-black" style={{ color: row.color }}>{row.value}</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--app-surface-soft)] rounded-full overflow-hidden border border-[var(--app-border-color)]/30">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${row.total > 0 ? Math.min(100, Math.round((row.value / row.total) * 100)) : 0}%`, backgroundColor: row.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--app-surface)] rounded-[24px] border border-[var(--app-border-color)] p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[var(--app-heading-color)] tracking-tight">Quick Actions</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Admin controls</p>
              </div>
              <Icon icon="solar:settings-bold-duotone" className="text-[#8E54E9]" width="22" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Manage Users", icon: "solar:users-group-rounded-bold-duotone", color: "#448CD2", path: "/dashboard/users" },
                { label: "Assessments", icon: "solar:document-bold-duotone", color: "#10B981", path: "/dashboard/org-assessments" },
                { label: "Send Invites", icon: "solar:letter-bold-duotone", color: "#F59E0B", path: "/dashboard/invite" },
                { label: "Reports", icon: "solar:chart-2-bold-duotone", color: "#8E54E9", path: "/dashboard/reports" },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center justify-center gap-3 p-5 bg-[var(--app-surface-soft)] rounded-[18px] border border-[var(--app-border-color)] hover:shadow-md transition-all group"
                  style={{ color: action.color } as any}
                >
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${action.color}15` }}>
                    <Icon icon={action.icon} width="24" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--app-text-muted)] group-hover:text-[var(--app-heading-color)] transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI Insights + Quarter Scorecard ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[var(--app-surface)] rounded-[24px] border border-[var(--app-border-color)] p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[var(--app-heading-color)] tracking-tight">AI-Powered Observations</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">POD Insights™ Engine</p>
              </div>
              <div className="w-9 h-9 bg-[#8E54E9]/10 rounded-[12px] flex items-center justify-center">
                <Icon icon="solar:magic-stick-3-bold-duotone" className="text-[#8E54E9]" width="18" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: "solar:graph-up-bold", color: "#10B981", bg: "bg-[#10B981]/10",
                  title: "Completion Momentum",
                  body: stats?.completionRate >= 70
                    ? `Organization is performing strongly at ${stats?.completionRate}% completion. This exceeds the recommended platform threshold. Continue driving structured engagement.`
                    : stats?.completionRate >= 40
                      ? `Completion rate is at ${stats?.completionRate}%. Targeted outreach to the ${stats?.notStartedAssessments || 0} not-yet-started members will help close the gap this quarter.`
                      : `At ${stats?.completionRate || 0}% completion, an org-wide mobilization campaign is recommended before the end of Q${selectedQuarter}.`,
                },
                {
                  icon: "solar:buildings-2-bold-duotone", color: "#448CD2", bg: "bg-[#448CD2]/10",
                  title: "Organization Engagement",
                  body: stats?.totalMembers > 0
                    ? `${stats.totalMembers} team members are tracked under your organization. ${stats?.completedAssessments || 0} have submitted — a ${stats?.completionRate || 0}% engagement rate for Q${selectedQuarter} ${selectedYear}.`
                    : "No team members found under your organization for this period. Send invitations to onboard your team.",
                },
                {
                  icon: "solar:shield-warning-bold-duotone", color: "#F59E0B", bg: "bg-[#F59E0B]/10",
                  title: "Risk & Action Zone",
                  body: (stats?.notStartedAssessments || 0) > 0
                    ? `${stats.notStartedAssessments} member(s) have not initiated assessments. Based on current velocity, ${stats?.activeInvites || 0} pending invites remain outstanding. Early re-engagement is advised.`
                    : "No risk indicators. All registered members have initiated their Q${selectedQuarter} assessments. Focus on completion quality.",
                },
              ].map((obs, i) => (
                <div key={i} className="flex gap-4 p-4 bg-[var(--app-surface-soft)] rounded-[16px] border border-[var(--app-border-color)]/50 hover:border-[var(--app-border-color)] transition-colors">
                  <div className={`w-9 h-9 shrink-0 ${obs.bg} rounded-[10px] flex items-center justify-center mt-0.5`}>
                    <Icon icon={obs.icon} width="18" style={{ color: obs.color }} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-[var(--app-heading-color)] mb-1">{obs.title}</h4>
                    <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed">{obs.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--app-surface)] rounded-[24px] border border-[var(--app-border-color)] p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[var(--app-heading-color)] tracking-tight">Q{selectedQuarter} Scorecard</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{selectedYear} cycle</p>
              </div>
              <div className="px-2.5 py-1 bg-[#448CD2]/10 rounded-full border border-[#448CD2]/20">
                <span className="text-[9px] font-black text-[#448CD2] uppercase tracking-widest">Q{selectedQuarter} · {selectedYear}</span>
              </div>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--app-surface-soft)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="#10B981" strokeWidth="10"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * (stats?.completionRate || 0)) / 100}
                    strokeLinecap="round" className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[var(--app-heading-color)] tracking-tighter">{stats?.completionRate || 0}%</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Complete</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Completed", value: stats?.completedAssessments || 0, color: "#10B981" },
                { label: "Not Started", value: stats?.notStartedAssessments || 0, color: "#F59E0B" },
                { label: "In Progress", value: stats?.inProgressAssessments || 0, color: "#6366F1" },
                { label: "Pending Joins", value: stats?.activeInvites || 0, color: "#448CD2" },
              ].map((kv, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--app-border-color)]/40 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kv.color }}></span>
                    <span className="text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider">{kv.label}</span>
                  </div>
                  <span className="text-sm font-black text-[var(--app-heading-color)]">{kv.value}</span>
                </div>
              ))}
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
                    "Assessments indicate a collective strength in Strategic Vision. Consider focusing the next sprint on clarity protocols to maintain this momentum."}
                </p>
              </div>
            </div>
            <button
              className="bg-white text-[#1a3652] px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-default"
            >
              Review Team Progress
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
