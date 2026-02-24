import { Icon } from "@iconify/react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/axios";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import PieChart from "../../charts/pieChart";

const SuperAdminOverview = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const [selectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"list" | "visual">("visual");
  const [selectedRole, setSelectedRole] = useState<string>("Administrators");

  const [intelData, setIntelData] = useState<any>(null);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const response = await api.get(`/assessment/super-admin/intelligence?quarter=${selectedQuarter}&year=${selectedYear}`);
        setIntelData(response.data);
      } catch (error) {
        console.error("Failed to fetch intelligence data:", error);
      }
    };
    fetchIntel();
  }, [selectedQuarter, selectedYear]);

  const stats = [
    { label: "Onboarded Organizations", detail: "Active corporate entities", longDesc: "Unique legal entities managed under your platform umbrella.", value: intelData?.stats?.[0]?.value || "0", icon: "solar:buildings-2-bold-duotone", color: "var(--primary-color)" },
    { label: "Client Base Users", detail: "Total registered individuals", longDesc: "Total active user accounts across all organization layers.", value: intelData?.stats?.[1]?.value || "0", icon: "solar:users-group-rounded-bold-duotone", color: "#8E54E9" },
    { label: "Verified Assessments", detail: "Completed data sessions", longDesc: "Validated datasets that have passed all integrity protocols.", value: intelData?.stats?.[2]?.value || "0", icon: "solar:checklist-minimalistic-bold-duotone", color: "var(--dark-primary-color)" },
    { label: "Client Success Rate", detail: "Active participation score", longDesc: "Percentage of clients with active quarterly assessment cycles.", value: intelData?.stats?.[3]?.value || "0%", icon: "solar:shield-check-bold-duotone", color: "#10b981" },
  ];

  const recentActivities = (intelData?.recentActivities || []).map((a: any) => ({
    ...a,
    time: a.time ? formatDistanceToNow(new Date(a.time), { addSuffix: true }) : "recently"
  })) || [];

  const aiInsights = [
    { title: "Market Growth", desc: "Enterprise organization onboarding is trending 14% higher than initial projections.", type: "positive" },
    { title: "Data Integrity", desc: "All current cycle assessments have passed automated verification protocols.", type: "info" },
  ];

  const roleLabels = ["Administrators", "Managers", "Strategic Leaders", "Employees"];
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
    <div className="sm:p-5 p-3 space-y-4 max-w-[1600px] mx-auto">

      {/* ── Header ── */}
      <div className="bg-white border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.07)] sm:px-6 px-4 py-4 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#edf5fd] rounded-xl flex items-center justify-center text-[var(--primary-color)] border border-[rgba(68,140,210,0.15)] shrink-0">
              <Icon icon="solar:globus-bold-duotone" width="22" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-[#1a3652] leading-tight">Platform Overview</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] text-[9px] font-semibold rounded-full border border-[#10b981]/20 uppercase tracking-widest">
                  <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />Live
                </span>
              </div>
              <p className="text-xs text-[#5d5d5d] mt-0.5">Watching over <strong className="text-[var(--primary-color)]">{intelData?.stats?.[0]?.value || 0}</strong> active organizations right now.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#edf5fd] p-0.5 rounded-full border border-[rgba(68,140,210,0.2)]">
              {[1, 2, 3, 4].map(q => (
                <button key={q} onClick={() => setSelectedQuarter(q)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${selectedQuarter === q ? 'bg-[var(--primary-color)] text-white shadow-sm' : 'text-[#5d5d5d] hover:text-[var(--primary-color)]'}`}>
                  Q{q}
                </button>
              ))}
            </div>
            <div className="px-3 py-1.5 bg-[#edf5fd] border border-[rgba(68,140,210,0.2)] rounded-full flex items-center gap-1.5">
              <Icon icon="solar:clock-circle-bold-duotone" className="text-[var(--primary-color)]" width="13" />
              <span className="text-[11px] font-semibold text-[var(--primary-color)]">{intelData?.currentCycle?.daysLeft || "0"} days left</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid — compact horizontal cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((stat: any, index: number) => (
          <div key={index}
            className="bg-white rounded-xl border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.07)] px-4 py-3.5 flex items-center gap-3 hover:shadow-[4px_6px_14px_rgba(68,140,210,0.11)] transition-all duration-300">
            <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <Icon icon={stat.icon} width="20" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-[#5d5d5d] uppercase tracking-wider leading-none truncate">{stat.label}</p>
              <p className="text-2xl font-bold leading-tight mt-0.5" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-[#5d5d5d] mt-0.5 truncate">{stat.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pulse Row — 3 quick-read cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Assessments completed", value: intelData?.participation?.completed || 0, badge: `${intelData?.participation?.rate || 0}% rate`, icon: "solar:user-check-bold-duotone", color: "#10b981" },
          { label: "Waiting for feedback", value: intelData?.participation?.pending || 0, badge: "In queue", icon: "solar:hourglass-bold-duotone", color: "var(--primary-color)" },
          { label: "Most active group", value: Object.entries(intelData?.completionByRole || {}).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "N/A", badge: "Top segment", icon: "solar:medal-ribbon-bold-duotone", color: "#8E54E9" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-[rgba(68,140,210,0.2)] rounded-xl px-4 py-3 flex items-center justify-between shadow-[4px_4px_4px_0_rgba(68,140,210,0.05)] hover:shadow-[4px_6px_12px_rgba(68,140,210,0.09)] transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                <Icon icon={item.icon} width="17" />
              </div>
              <div>
                <p className="text-[10px] text-[#5d5d5d] font-medium">{item.label}</p>
                <p className="text-base font-bold text-[#1a3652] capitalize leading-tight">{item.value}</p>
              </div>
            </div>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: item.color, backgroundColor: `${item.color}12`, borderColor: `${item.color}30` }}>
              {item.badge}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Member Distribution */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.07)] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(68,140,210,0.1)]">
            <div>
              <h3 className="text-sm font-bold text-[#1a3652]">Member Distribution</h3>
              <p className="text-[10px] text-[#5d5d5d] mt-0.5">People across your platform</p>
            </div>
            <div className="relative">
              <select value={selectedRole} onChange={(e) => { setSelectedRole(e.target.value); setViewMode("visual"); }}
                className="appearance-none bg-[#edf5fd] border border-[rgba(68,140,210,0.25)] text-[var(--primary-color)] text-[10px] font-semibold py-1 pl-2.5 pr-6 rounded-full outline-none cursor-pointer">
                {roleLabels.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <Icon icon="solar:alt-arrow-down-bold" className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--primary-color)] pointer-events-none" width="9" />
            </div>
          </div>

          {/* Toggle */}
          <div className="flex bg-[#edf5fd] p-0.5 rounded-full mb-4 border border-[rgba(68,140,210,0.15)]">
            <button onClick={() => setViewMode("list")} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "list" ? "bg-white text-[var(--primary-color)] shadow-sm" : "text-[#5d5d5d]"}`}>
              <Icon icon="solar:list-bold" width="11" /> Breakdown
            </button>
            <button onClick={() => setViewMode("visual")} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "visual" ? "bg-white text-[var(--primary-color)] shadow-sm" : "text-[#5d5d5d]"}`}>
              <Icon icon="solar:pie-chart-bold" width="11" /> Visual
            </button>
          </div>

          <div className="flex-1">
            {viewMode === "list" ? (
              <div className="space-y-3">
                {[
                  { label: "Administrators", val: intelData?.userBreakdown?.admin || 0, color: roleColors[0] },
                  { label: "Managers", val: intelData?.userBreakdown?.manager || 0, color: roleColors[1] },
                  { label: "Leaders", val: intelData?.userBreakdown?.leader || 0, color: roleColors[2] },
                  { label: "Employees", val: intelData?.userBreakdown?.employee || 0, color: roleColors[3] },
                ].map((role) => {
                  const pct = totalUsers > 0 ? (role.val / totalUsers) * 100 : 0;
                  return (
                    <div key={role.label} className="cursor-pointer group" onClick={() => { setSelectedRole(role.label); setViewMode("visual"); }}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-semibold text-[#5d5d5d] group-hover:text-[var(--primary-color)] transition-colors">{role.label}</span>
                        <span className="text-[11px] font-bold text-[#1a3652]">{role.val} <span className="text-[9px] text-[#5d5d5d] font-normal">({pct.toFixed(0)}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-[#edf5fd] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: role.color }} />
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
                <div className="w-full max-h-[170px] flex items-center justify-center">
                  <PieChart labels={roleLabels} data={roleData} colors={roleColors} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Health */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          <div className="flex-1 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.07)] p-5 flex flex-col items-center justify-center text-center">
            <p className="text-[9px] font-bold text-[var(--primary-color)] uppercase tracking-widest mb-4">Overall Health</p>
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-36 h-36 rounded-full border-[10px] border-[#edf5fd] flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#1a3652] leading-none">{intelData?.participation?.rate || 100}%</span>
                <span className="text-[9px] font-medium text-[#5d5d5d] mt-1">Platform healthy</span>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none scale-105" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="url(#hGrad)" strokeWidth="9"
                  strokeDasharray="276" strokeDashoffset={276 - (276 * (intelData?.participation?.rate || 100)) / 100}
                  strokeLinecap="round" className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="hGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2d5d8c" /><stop offset="100%" stopColor="#448cd2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <div className="p-3 bg-[#edf5fd] rounded-lg border border-[rgba(68,140,210,0.12)]">
                <span className="text-lg font-bold text-[#10b981] block">{intelData?.participation?.completed || 0}</span>
                <span className="text-[9px] font-semibold text-[#5d5d5d] uppercase tracking-wider">Completed</span>
              </div>
              <div className="p-3 bg-[#edf5fd] rounded-lg border border-[rgba(68,140,210,0.12)]">
                <span className="text-lg font-bold text-[var(--primary-color)] block">{intelData?.participation?.assigned || 0}</span>
                <span className="text-[9px] font-semibold text-[#5d5d5d] uppercase tracking-wider">Assigned</span>
              </div>
            </div>
          </div>

          <button onClick={() => navigate("/dashboard/org-assessments")}
            className="bg-gradient-to-r from-[#1a3652] to-[var(--primary-color)] px-5 py-4 rounded-xl shadow-[4px_4px_14px_rgba(68,140,210,0.2)] flex items-center justify-between text-white group hover:shadow-[4px_6px_20px_rgba(68,140,210,0.3)] hover:scale-[1.01] transition-all active:scale-[0.99]">
            <div className="text-left">
              <p className="text-[9px] font-medium text-[#c7e0f8] uppercase tracking-widest mb-0.5">Governance</p>
              <h4 className="text-sm font-bold">Audit Client Portfolios</h4>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center border border-white/25 group-hover:bg-white/30 transition-all">
              <Icon icon="solar:arrow-right-up-bold" width="17" />
            </div>
          </button>
        </div>

        {/* Team Stream */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.07)] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(68,140,210,0.1)]">
            <div>
              <h3 className="text-sm font-bold text-[#1a3652]">Team Stream</h3>
              <p className="text-[10px] text-[#5d5d5d] mt-0.5">Live activity feed</p>
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-[9px] font-semibold uppercase border border-[#10b981]/20">
              <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />Live
            </span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar max-h-[300px] pr-1">
            {recentActivities.length > 0 ? recentActivities.map((log: any, i: number) => (
              <div key={log.id || i} className="flex gap-2.5 p-2.5 rounded-lg hover:bg-[#f5faff] transition-colors group cursor-default">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                  style={{ background: log.type === 'submission' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#448cd2,#2d5d8c)' }}>
                  {(log.org || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1a3652] leading-tight truncate group-hover:text-[var(--primary-color)] transition-colors">{log.org}</p>
                  <p className="text-[10px] text-[#5d5d5d] mt-0.5 leading-snug">{log.action}</p>
                  <span className="text-[9px] text-[#5d5d5d] opacity-40 mt-0.5 block">{log.time}</span>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center py-16">
                <Icon icon="solar:history-bold-duotone" width="36" className="text-[#5d5d5d] opacity-20" />
                <p className="text-[10px] text-[#5d5d5d] opacity-40 uppercase tracking-widest mt-3">No activity yet</p>
              </div>
            )}
          </div>
          <button onClick={() => navigate("/dashboard/notifications")}
            className="w-full mt-4 py-2 bg-[#edf5fd] text-[var(--primary-color)] text-[10px] font-semibold uppercase tracking-widest rounded-lg hover:bg-[#e4f0fc] transition-all border border-[rgba(68,140,210,0.2)]">
            See full activity log
          </button>
        </div>
      </div>

      {/* ── AI Insights Footer ── */}
      <div className="bg-white border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.06)] px-5 py-4 rounded-xl flex flex-col sm:flex-row items-start gap-4">
        <div className="flex items-center gap-3 shrink-0 px-4 py-3 bg-[#edf5fd] rounded-xl border border-[rgba(68,140,210,0.15)]">
          <Icon icon="solar:magic-stick-3-bold-duotone" className="text-[var(--primary-color)]" width="22" />
          <div>
            <span className="text-[9px] font-bold text-[var(--primary-color)] uppercase tracking-widest block">POD Insights™ AI</span>
            <span className="text-xs font-bold text-[#1a3652]">Global Overview</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 rounded-lg border border-[rgba(68,140,210,0.1)] hover:border-[rgba(68,140,210,0.25)] hover:bg-[#fafcff] transition-all group">
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${insight.type === 'positive' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'}`}>
                <Icon icon={insight.type === 'positive' ? 'solar:graph-up-bold' : 'solar:notification-lines-bold'} width="16" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1a3652] group-hover:text-[var(--primary-color)] transition-colors">{insight.title}</h4>
                <p className="text-[10px] text-[#5d5d5d] mt-0.5 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SuperAdminOverview;
