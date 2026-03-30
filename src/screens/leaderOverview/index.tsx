import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import PieChart from "../../charts/pieChart";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import { formatDistanceToNow } from "date-fns";
import CircularProgress from "../../components/percentageCircle";

const LeaderOverview = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor(new Date().getMonth() / 3) + 1,
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"list" | "visual">("visual");
  const [selectedRole, setSelectedRole] = useState<string>("Managers");
  const [intelData, setIntelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntelligence = async () => {
      try {
        const res = await api.get(
          `assessment/leader/intelligence?quarter=${selectedQuarter}&year=${selectedYear}`,
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

  // For Admin/Leader/Manager, the data keys are different from SuperAdmin
  const completionRate = stats?.completionRate || 0;
  const completed = stats?.completedAssessments || 0;
  const total = stats?.totalMembers || 0;
  const inProgress = stats?.inProgressAssessments || 0;
  const pending = stats?.notStartedAssessments || 0;

  const displayStats = [
    {
      label: "Department Members",
      value: total.toString(),
      icon: "solar:users-group-rounded-bold-duotone",
      color: "#448CD2",
    },
    {
      label: "Active Invites",
      value: stats?.activeInvites?.toString() || "0",
      icon: "solar:letter-bold-duotone",
      color: "#F59E0B",
    },
    {
      label: "Completed",
      value: completed.toString(),
      icon: "solar:checklist-minimalistic-bold-duotone",
      color: "#10B981",
    },
    {
      label: "Awaiting Action",
      value: (total - completed).toString(),
      icon: "solar:clock-circle-bold-duotone",
      color: "#8E54E9",
    },
  ];

  const roleLabels = ["Managers", "Employees"];
  const roleColors = ["#10B981", "#F59E0B"];
  const roleData = [
    roleBreakdown?.manager || 0,
    roleBreakdown?.employee || 0,
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="md:text-2xl mb-1 text-xl font-bold text-gray-800">
              Department Intelligence
            </h1>
            <p className="text-gray-500 text-sm">{department || "Department"} Hub · Q{selectedQuarter} {selectedYear}</p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-[#edf5fd] text-[var(--primary-color)] border border-[rgba(68,140,210,0.2)] rounded-full px-4 py-1.5 text-sm font-bold outline-none cursor-pointer"
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

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {displayStats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-neutral-100 rounded-xl p-4 flex items-center gap-5">
              <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <Icon icon={stat.icon} width="24" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide truncate">{stat.label}</p>
                <p className="text-2xl font-bold leading-tight mt-0.5" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pulse Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Completion Rate", value: `${completionRate}%`, icon: "solar:user-check-broken", color: "#10b981", badge: completionRate >= 70 ? "Healthy" : "In Progress" },
            { label: "Pending Invites", value: stats?.activeInvites || 0, icon: "la:stopwatch", color: "#448cd2", badge: "In Queue" },
            { label: "Department Status", value: completionRate >= 50 ? "Stable" : "Developing", icon: "solar:history-broken", color: "#8E54E9", badge: "Live Updates" },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-xl p-4 flex items-center gap-5 justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <Icon icon={item.icon} width="20" />
                </div>
                <div>
                  <p className="text-[10px] text-[#5d5d5d] font-medium uppercase tracking-wider">{item.label}</p>
                  <p className="text-base font-bold text-[#1a3652] truncate max-w-[120px]">{item.value}</p>
                </div>
              </div>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border" style={{ color: item.color, backgroundColor: `${item.color}12`, borderColor: `${item.color}30` }}>
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* ── Main 3-col Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

          {/* Member Distribution */}
          <div className="xl:col-span-4 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.07)] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(68,140,210,0.1)]">
              <div>
                <h3 className="text-sm font-bold text-[#1a3652]">Member Distribution</h3>
                <p className="text-[10px] text-[#5d5d5d] mt-0.5">{department} Role Breakdown</p>
              </div>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => { setSelectedRole(e.target.value); setViewMode("visual"); }}
                  className="appearance-none bg-[#edf5fd] border border-[rgba(68,140,210,0.25)] text-[var(--primary-color)] text-[10px] font-semibold py-1 pl-2.5 pr-6 rounded-full outline-none cursor-pointer"
                >
                  {roleLabels.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <Icon icon="solar:alt-arrow-down-bold" className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--primary-color)] pointer-events-none" width="9" />
              </div>
            </div>

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
                  {roleLabels.map((role, idx) => {
                    const val = roleData[idx] || 0;
                    const pct = totalUsers > 0 ? (val / totalUsers) * 100 : 0;
                    return (
                      <div key={role} className="cursor-pointer group" onClick={() => { setSelectedRole(role); setViewMode("visual"); }}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-semibold text-[#5d5d5d] group-hover:text-[var(--primary-color)] transition-colors">{role}</span>
                          <span className="text-[11px] font-bold text-[#1a3652]">{val} <span className="text-[9px] text-[#5d5d5d] font-normal">({pct.toFixed(0)}%)</span></span>
                        </div>
                        <div className="h-1.5 bg-[#edf5fd] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: roleColors[idx] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in slide-in-from-bottom-1 duration-300">
                  <div className="w-full bg-[#edf5fd] rounded-xl border border-[rgba(68,140,210,0.12)] px-4 py-3 flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[9px] font-semibold text-[#5d5d5d] uppercase tracking-wider">{selectedRole}</p>
                      <span className="text-3xl font-bold" style={{ color: getRoleStats(selectedRole).color }}>{getRoleStats(selectedRole).pct}%</span>
                      <span className="text-[10px] text-[#5d5d5d] ml-1.5">of total</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-[rgba(68,140,210,0.15)] text-center shadow-sm">
                      <span className="text-xl font-bold text-[#1a3652] block">{getRoleStats(selectedRole).val}</span>
                      <span className="text-[8px] text-[#5d5d5d] uppercase tracking-widest">People</span>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <PieChart labels={roleLabels} data={roleData} colors={roleColors} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Department Health (Circular Progress Bar) */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="flex-1 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-1000 group-hover:scale-150 group-hover:bg-[#10b981]/10"></div>
              <h3 className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-[0.2em] mb-6">Department Health</h3>

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
                  { label: "Pending", value: pending, color: "#F59E0B" },
                  { label: "Total Members", value: total, color: "#448CD2" },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-[var(--app-surface-soft)] rounded-[16px] border border-[var(--app-border-color)] hover:border-current transition-colors" style={{ color: item.color } as any}>
                    <span className="text-xl font-black text-[var(--app-heading-color)] block tracking-tight">{item.value}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider block mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard/org-assessments")}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[var(--app-heading-color)] to-[var(--primary-color)] p-5 rounded-[20px] shadow-lg flex items-center justify-between text-white group hover:shadow-2xl transition-all"
            >
              <div className="text-left relative z-10">
                <p className="text-[9px] font-black text-blue-200/80 uppercase tracking-[0.2em] mb-1">Action Center</p>
                <h4 className="text-base font-black tracking-wide">Review Department</h4>
              </div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <Icon icon="solar:arrow-right-up-bold" width="20" />
              </div>
            </button>
          </div>

          {/* Team Stream */}
          <div className="xl:col-span-4 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#448CD2]"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-lg font-black text-[var(--app-heading-color)] tracking-tight">Stream</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Activity Log</p>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] rounded-full text-[9px] font-black uppercase tracking-wider border border-[#10b981]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" /> Live
              </span>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar max-h-[350px] relative z-10">
              {activityStream?.length > 0 ? activityStream.map((log: any, i: number) => (
                <div key={i} className="flex gap-4 group/item cursor-default">
                  <div className="mt-1">
                    <div className={`w-3 h-3 rounded-full flex shrink-0 items-center justify-center ${log.type === "completion" ? "bg-[#10B981]" : "bg-[#448CD2]"} shadow-sm`}>
                      <span className="text-[6px] font-bold text-white uppercase">{log.user?.[0] || "?"}</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black text-[var(--app-heading-color)] truncate">{log.user}</p>
                    <p className="text-[11px] text-[var(--app-text-muted)] mt-1 font-medium italic">{log.action}</p>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 block">
                      {log.time ? formatDistanceToNow(new Date(log.time), { addSuffix: true }) : 'N/A'}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-400 italic text-center py-10 opacity-50">Monitoring stream...</p>
              )}
            </div>

            <button
              onClick={() => navigate("/dashboard/notifications")}
              className="w-full mt-6 py-4 bg-[var(--app-surface-soft)] border border-[var(--app-border-color)] rounded-[14px] text-[10px] font-black uppercase tracking-widest text-[var(--app-text-muted)] hover:bg-[#448CD2] hover:text-white transition-all shadow-sm"
            >
              Analyze Data Stream
            </button>
          </div>
        </div>

        {/* ── AI Insights Board ── */}
        <div className="bg-[var(--app-surface-soft)] rounded-[20px] border border-[var(--app-border-color)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8E54E9]/10 rounded-xl flex items-center justify-center">
              <Icon icon="solar:magic-stick-3-bold-duotone" className="text-[#8E54E9]" width="22" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--app-heading-color)] tracking-tight">AI-Powered Observations</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">POD Insights™ Leader Intelligence</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "solar:graph-up-bold", color: "#10B981", bg: "bg-[#10B981]/10",
                title: "Engagement Pulse",
                desc: completionRate >= 70
                  ? `Your department is performing strongly at ${completionRate}% completion.`
                  : `Current engagement is at ${completionRate}%. Encouraging the ${pending} pending members to start will improve readiness metrics.`,
              },
              {
                icon: "solar:buildings-2-bold-duotone", color: "#448CD2", bg: "bg-[#448CD2]/10",
                title: "Role Composition",
                desc: `Your team consists of ${roleBreakdown?.manager || 0} Managers and ${roleBreakdown?.employee || 0} Employees. High alignment with organizational goals is observed.`,
              },
              {
                icon: "solar:shield-warning-bold-duotone", color: "#F59E0B", bg: "bg-[#F59E0B]/10",
                title: "Risk & Action",
                desc: (stats?.activeInvites || 0) > 0
                  ? `${stats.activeInvites} invitations are outstanding. Onboarding these members will provide a complete department profile.`
                  : "Departmental deployment is at full capacity with no immediate risks identified in the current lifecycle cycle.",
              },
            ].map((obs, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-[rgba(68,140,210,0.1)] hover:border-[rgba(68,140,210,0.3)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${obs.bg} flex items-center justify-center`} style={{ color: obs.color }}>
                    <Icon icon={obs.icon} width="18" />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1a3652]">{obs.title}</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{obs.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Strategic Insight Banner ── */}
        <div className="bg-gradient-to-r from-[#448CD2] to-[#1a3652] rounded-[24px] p-8 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[22px] flex items-center justify-center text-white border border-white/20 shadow-xl transform group-hover:scale-105 transition-transform">
                <Icon icon="solar:lightbulb-bolt-bold-duotone" width="40" className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight leading-none mb-2">Team Insight</h2>
                <p className="text-sm text-blue-100/80 font-medium max-w-md leading-relaxed">
                  Excellent engagement! Your team shows strong <strong className="text-white">'Strategic Alignment'</strong>. {intelData?.strategicInsight || "Results indicate high readiness for growth."}
                </p>
              </div>
            </div>
            <button className="bg-white text-[#1a3652] px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-default">
              Review Results
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default LeaderOverview;
