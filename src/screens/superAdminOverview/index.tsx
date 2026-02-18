import { Icon } from "@iconify/react";
import { useState } from "react";
// import { useEffect } from "react";
// import api from "../../services/axios";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import PieChart from "../../charts/pieChart";

const SuperAdminOverview = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  // const [selectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"list" | "visual">("visual");
  const [selectedRole, setSelectedRole] = useState<string>("Administrators");

  // STATIC MOCK DATA FOR DEMONSTRATION
  const [intelData] = useState<any>({
    stats: [
      { value: "42" }, // Onboarded Organizations
      { value: "1,280" }, // Client Base Users
      { value: "850" }, // Verified Assessments
      { value: "94%" }, // Client Success Rate
    ],
    participation: {
      completed: 850,
      rate: 94,
      pending: 54,
      assigned: 904
    },
    userBreakdown: {
      admin: 42,
      manager: 156,
      leader: 88,
      employee: 994
    },
    completionByRole: {
      "Administrators": 98,
      "Managers": 92,
      "Strategic Leaders": 95,
      "Employees": 89
    },
    currentCycle: {
      daysLeft: 12
    },
    recentActivities: [
      { id: 1, org: "Global Tech Corp", action: "Completed Quarterly Assessment", type: "submission", time: new Date().toISOString() },
      { id: 2, org: "Visionary Systems", action: "New Manager Onboarded", type: "onboarding", time: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, org: "Nexus Solutions", action: "Data Integrity Verified", type: "submission", time: new Date(Date.now() - 7200000).toISOString() },
      { id: 4, org: "Stellar Dynamics", action: "Initialized New Assessment Cycle", type: "onboarding", time: new Date(Date.now() - 10800000).toISOString() },
    ]
  });

  /* 
  // DYNAMIC FETCHING (Commented out as per request)
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
  */

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
  // NEW VIBRANT & PROFESSIONAL COLOR PALETTE
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
    <div className="sm:p-6 p-3 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* Brand-Aligned Executive Header */}
      <div className="bg-[var(--app-surface)] border border-[var(--app-border-color)] shadow-[0_0_5px_0_rgba(68,140,210,0.2)] dark:shadow-[0_0_10px_rgba(0,0,0,0.3)] sm:p-6 p-4 rounded-[12px] transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[var(--app-surface-soft)] rounded-[12px] flex items-center justify-center text-[var(--primary-color)] shadow-inner">
              <Icon icon="solar:globus-bold-duotone" width="32" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="sm:text-3xl text-2xl font-bold text-[var(--app-heading-color)] tracking-tight">Global Intelligence</h1>
                <span className="px-3 py-1 bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-[10px] font-black uppercase rounded-full tracking-widest border border-[var(--primary-color)]/20 animate-pulse">Live Dashboard</span>
              </div>
              <p className="sm:text-sm text-xs font-medium text-[var(--app-text-muted)] mt-1">Strategic oversight across {intelData?.stats?.[0]?.value || 0} active organizations.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-[var(--app-surface-muted)] p-1.5 rounded-[12px] border border-[var(--app-border-color)]">
              {[1, 2, 3, 4].map(q => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-5 py-2 rounded-[8px] text-[11px] font-black uppercase transition-all duration-300 ${selectedQuarter === q ? 'bg-[var(--primary-color)] text-white shadow-lg' : 'text-[var(--app-text-muted)] hover:text-[var(--primary-color)]'}`}
                >
                  Q{q}
                </button>
              ))}
            </div>
            <div className="px-5 py-2.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-[12px] flex items-center gap-3">
              <Icon icon="solar:clock-circle-bold-duotone" className="text-[#10b981]" width="18" />
              <span className="text-[11px] font-black text-[#10b981] uppercase tracking-widest">{intelData?.currentCycle?.daysLeft || "0"} Days Remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Participation Pulse - Short summary of who has given assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--app-surface)] border border-[var(--app-border-color)] rounded-[12px] p-4 flex items-center justify-between shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10b981]/10 rounded-[10px] flex items-center justify-center text-[#10b981]">
              <Icon icon="solar:user-check-bold-duotone" width="20" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">Assessments Taken</p>
              <p className="text-lg font-black text-[var(--app-heading-color)]">{intelData?.participation?.completed || 0} <span className="text-[10px] text-[#10b981]">Done</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-[#10b981] uppercase">{intelData?.participation?.rate || 0}% Engagement</p>
          </div>
        </div>

        <div className="bg-[var(--app-surface)] border border-[var(--app-border-color)] rounded-[12px] p-4 flex items-center justify-between shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary-color)]/10 rounded-[10px] flex items-center justify-center text-[var(--primary-color)]">
              <Icon icon="solar:clock-circle-bold-duotone" width="20" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">Awaiting Feedback</p>
              <p className="text-lg font-black text-[var(--app-heading-color)]">{intelData?.participation?.pending || 0} <span className="text-[10px] text-[var(--primary-color)]">In Queue</span></p>
            </div>
          </div>
          <p className="text-[9px] font-bold text-[var(--app-text-muted)] italic">Global backlog</p>
        </div>

        <div className="bg-[var(--app-surface)] border border-[var(--app-border-color)] rounded-[12px] p-4 flex items-center justify-between shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8E54E9]/10 rounded-[10px] flex items-center justify-center text-[#8E54E9]">
              <Icon icon="solar:medal-ribbon-bold-duotone" width="20" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">Most Active Segment</p>
              <p className="text-lg font-black text-[var(--app-heading-color)] capitalize">
                {Object.entries(intelData?.completionByRole || {}).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
              </p>
            </div>
          </div>
          <Icon icon="solar:fire-bold-duotone" className="text-orange-500 animate-bounce" width="18" />
        </div>
      </div>

      {/* Brand-Aligned Stats Grid (Non-clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat: any, index: number) => (
          <div
            key={index}
            className="bg-[var(--app-surface)] p-7 rounded-[16px] border border-[var(--app-border-color)] shadow-[0_4px_15px_rgba(68,140,210,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden group hover:border-[var(--primary-color)]/40 transition-all duration-500"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="p-4 rounded-[14px] shadow-sm transform group-hover:rotate-12 transition-all duration-500" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                <Icon icon={stat.icon} width="28" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-black text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-full border border-[#10b981]/20 uppercase tracking-widest">Validated</span>
              </div>
            </div>

            <div className="mt-10 relative z-10 flex items-end justify-between gap-4">
              <div className="flex-1">
                <span className="text-4xl font-black text-[var(--app-heading-color)] tracking-tighter leading-none">{stat.value}</span>
                <span className="text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-[0.2em] mt-4 block">{stat.label}</span>
                <p className="text-[10px] font-medium text-[var(--app-text-muted)] opacity-60 mt-1">{stat.detail}</p>
              </div>
              <div className="w-[40%] pb-1">
                <p className="text-[9px] font-bold text-[var(--app-text-muted)] opacity-30 leading-relaxed text-right border-l border-[var(--app-border-color)] pl-4 italic">
                  {stat.longDesc}
                </p>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.05] -mr-10 -mt-10 rounded-full" style={{ backgroundColor: stat.color }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Segment Analysis (4 units) - IMPROVED FOR USER REQUEST */}
        <div className="xl:col-span-4 bg-[var(--app-surface)] rounded-[16px] border border-[var(--app-border-color)] shadow-[0_10px_30px_rgba(68,140,210,0.05)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.2)] p-6 flex flex-col overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--app-border-color)]/30">
            <div>
              <h3 className="text-xl font-extrabold text-[var(--app-heading-color)] tracking-tight">Market Segments</h3>
              <p className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-widest mt-1">Intelligence Distribution</p>
            </div>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setViewMode("visual");
                }}
                className="appearance-none bg-[var(--app-surface-muted)] border border-[var(--primary-color)]/20 text-[var(--primary-color)] text-[10px] font-black py-2 pl-4 pr-10 rounded-[10px] outline-none cursor-pointer hover:border-[var(--primary-color)] transition-all uppercase tracking-widest shadow-sm"
              >
                {roleLabels.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary-color)] pointer-events-none" width="12" />
            </div>
          </div>

          <div className="flex-1">
            {/* PREMIUN TOGGLE */}
            <div className="flex bg-[var(--app-surface-muted)] p-1.5 rounded-[12px] mb-8 border border-[var(--app-border-color)]">
              <button onClick={() => setViewMode("list")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === "list" ? "bg-[var(--app-surface)] text-[var(--primary-color)] shadow-md" : "text-[var(--app-text-muted)] hover:text-[var(--primary-color)]"}`}>
                <Icon icon="solar:list-bold" width="16" />
                Analysis
              </button>
              <button onClick={() => setViewMode("visual")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === "visual" ? "bg-[var(--app-surface)] text-[var(--primary-color)] shadow-md" : "text-[var(--app-text-muted)] hover:text-[var(--primary-color)]"}`}>
                <Icon icon="solar:pie-chart-bold" width="16" />
                Perspective
              </button>
            </div>

            {viewMode === "list" ? (
              <div className="space-y-6 px-1">
                {[
                  { label: "Administrators", id: 'admin', val: intelData?.userBreakdown?.admin || 0, color: roleColors[0] },
                  { label: "Managers", id: 'manager', val: intelData?.userBreakdown?.manager || 0, color: roleColors[1] },
                  { label: "Strategic Leaders", id: 'leader', val: intelData?.userBreakdown?.leader || 0, color: roleColors[2] },
                  { label: "Employees", id: 'employee', val: intelData?.userBreakdown?.employee || 0, color: roleColors[3] },
                ].map((role) => {
                  const distributionPct = totalUsers > 0 ? (role.val / totalUsers) * 100 : 0;
                  return (
                    <div key={role.label} className="group cursor-pointer" onClick={() => { setSelectedRole(role.label); setViewMode("visual"); }}>
                      <div className="flex justify-between mb-2.5">
                        <span className="text-xs font-black text-[var(--app-text-muted)] group-hover:text-[var(--primary-color)] transition-colors uppercase tracking-widest">{role.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">({distributionPct.toFixed(0)}%)</span>
                          <span className="text-sm font-black text-[var(--app-heading-color)]">{role.val}</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--app-surface-muted)] rounded-full overflow-hidden border border-[var(--app-border-color)]/20">
                        <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${Math.max(distributionPct, 4)}%`, backgroundColor: role.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-2 duration-500">
                {/* NEW DENSITY SPOTLIGHT CARD */}
                <div className="mb-10 w-full overflow-hidden rounded-[20px] bg-[var(--app-surface)] border border-[var(--app-border-color)]/30 shadow-[0_8px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1.5 h-full transition-colors duration-500" style={{ backgroundColor: getRoleStats(selectedRole).color }} />
                  <div className="p-6 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-[0.2em] block mb-2">{selectedRole} IMPACT</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter transition-colors duration-500" style={{ color: getRoleStats(selectedRole).color }}>{getRoleStats(selectedRole).pct}%</span>
                        <span className="text-xs font-bold text-slate-400">of Global Base</span>
                      </div>
                    </div>
                    <div className="px-5 py-2.5 bg-[var(--app-surface-muted)] rounded-[12px] border border-[var(--app-border-color)]/20 text-center">
                      <span className="text-xl font-black text-[var(--app-heading-color)] block leading-none">{getRoleStats(selectedRole).val}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mt-1">Users</span>
                    </div>
                  </div>
                </div>

                <div className="w-full max-h-[190px] flex items-center justify-center pb-6">
                  <PieChart labels={roleLabels} data={roleData} colors={roleColors} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Efficiency (4 units) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-[var(--app-surface)] rounded-[16px] border border-[var(--app-border-color)] shadow-[0_10px_30px_rgba(68,140,210,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 flex flex-col items-center justify-center text-center transition-all duration-300">
            <h3 className="text-[11px] font-black text-[var(--primary-color)] uppercase tracking-[0.4em] mb-12">Global Integrity Score</h3>
            <div className="relative inline-flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-[14px] border-[var(--app-surface-muted)] flex flex-col items-center justify-center shadow-inner">
                <span className="text-6xl font-black text-[var(--app-heading-color)] tracking-tighter leading-none">{intelData?.participation?.rate || 100}%</span>
                <span className="text-[11px] font-black text-[var(--app-text-muted)] uppercase mt-3 tracking-[0.2em]">Platform Health</span>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none scale-105" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="44"
                  fill="transparent"
                  stroke="var(--primary-color)"
                  strokeWidth="10"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * (intelData?.participation?.rate || 100)) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-5 w-full">
              <div className="p-5 bg-[var(--app-surface-muted)] rounded-[14px] border border-[var(--app-border-color)] group hover:border-[#10b981] transition-colors">
                <span className="block text-2xl font-black text-[#10b981]">{intelData?.participation?.completed || 0}</span>
                <span className="text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-wider">Validated</span>
              </div>
              <div className="p-5 bg-[var(--app-surface-muted)] rounded-[14px] border border-[var(--app-border-color)] group hover:border-[var(--primary-color)] transition-colors">
                <span className="block text-2xl font-black text-[var(--primary-color)]">{intelData?.participation?.assigned || 0}</span>
                <span className="text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-wider">Initialized</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/org-assessments")}
            className="bg-[#1a3652] dark:bg-[var(--app-surface-muted)] p-7 rounded-[16px] shadow-xl flex items-center justify-between text-white group hover:scale-[1.01] transition-all active:scale-[0.98] border border-transparent dark:border-[var(--app-border-color)]/30"
          >
            <div className="text-left">
              <p className="text-[10px] font-black text-[var(--primary-color)] uppercase tracking-[0.3em] mb-1.5">Governance Access</p>
              <h4 className="text-xl font-bold tracking-tight">Audit Client Portfolios</h4>
            </div>
            <div className="w-12 h-12 bg-[var(--primary-color)] rounded-[10px] flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
              <Icon icon="solar:arrow-right-up-bold" width="28" />
            </div>
          </button>
        </div>

        {/* Log Analysis (4 units) */}
        <div className="xl:col-span-4 bg-[var(--app-surface)] rounded-[16px] border border-[var(--app-border-color)] shadow-[0_10px_30px_rgba(68,140,210,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 flex flex-col transition-all duration-300">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--app-border-color)]/30">
            <div>
              <h3 className="text-xl font-black text-[var(--app-heading-color)] tracking-tight">Log Analysis</h3>
              <p className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-widest mt-1">Real-time Stream</p>
            </div>
            <span className="flex items-center gap-2 px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#10b981]/20">
              Live Audit
            </span>
          </div>
          <div className="flex-1 space-y-7 overflow-y-auto no-scrollbar max-h-[400px] px-1">
            {recentActivities.length > 0 ? recentActivities.map((log: any, i: number) => (
              <div key={log.id || i} className="flex gap-5 group">
                <div className="mt-1.5">
                  <div className={`w-3 h-3 rounded-full ${log.type === 'submission' ? 'bg-[#10b981]' : 'bg-[var(--primary-color)]'} shadow-sm border-2 border-[var(--app-surface)] ring-2 ring-[var(--app-surface-muted)] transition-colors group-hover:ring-[var(--primary-color)]/20`}></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-black text-[var(--app-heading-color)] tracking-tight leading-none group-hover:text-[var(--primary-color)] transition-colors">{log.org}</h4>
                  <p className="text-[12px] text-[var(--app-text-muted)] mt-2 font-medium leading-relaxed">{log.action}</p>
                  <span className="text-[9px] font-black text-slate-300 uppercase block mt-2">{log.time}</span>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-24">
                <Icon icon="solar:history-bold-duotone" width="56" />
                <p className="text-[11px] font-black uppercase mt-5 tracking-[0.2em] opacity-40">Empty Activity Log</p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/dashboard/notifications")}
            className="w-full mt-8 py-4 bg-[var(--app-surface-muted)] text-[var(--app-text-muted)] text-[11px] font-black uppercase tracking-[0.2em] rounded-[12px] hover:bg-[var(--app-surface-soft)] hover:text-[var(--primary-color)] transition-all border border-[var(--app-border-color)]"
          >
            Intelligence Vault
          </button>
        </div>
      </div>

      {/* Strategic Intelligence Footer */}
      <div className="bg-[var(--app-surface)] border border-[var(--app-border-color)] shadow-[0_10px_30px_rgba(68,140,210,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 rounded-[12px] flex flex-col lg:flex-row items-center gap-10 transition-all duration-300">
        <div className="flex items-center gap-5 shrink-0 px-8 py-5 bg-[var(--app-surface-soft)] rounded-[14px] border border-[var(--app-border-color)] shadow-inner">
          <Icon icon="solar:magic-stick-3-bold-duotone" className="text-[var(--primary-color)]" width="36" />
          <div>
            <span className="text-[11px] font-black text-[var(--primary-color)] uppercase tracking-[0.3em] block mb-1">Strategic AI</span>
            <span className="text-sm font-black text-[var(--app-heading-color)] uppercase tracking-widest">Global Overview v4.28</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="flex gap-5 items-start group">
              <div className={`w-12 h-12 rounded-[12px] shrink-0 flex items-center justify-center transition-all group-hover:scale-110 ${insight.type === 'positive' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'}`}>
                <Icon icon={insight.type === 'positive' ? 'solar:graph-up-bold' : 'solar:notification-lines-bold'} width="24" />
              </div>
              <div>
                <h4 className="text-base font-black text-[var(--app-heading-color)] tracking-tight group-hover:text-[var(--primary-color)] transition-colors">{insight.title}</h4>
                <p className="text-[12px] text-[var(--app-text-muted)] font-medium mt-1 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center pt-12 pb-6 opacity-20 filter grayscale hover:opacity-50 transition-opacity">
        <img src="/static/img/home/logo.svg" className="h-7 mb-3" alt="logo" />
        <p className="text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-[0.8em]">Talent By Design • Intelligence Suite</p>
      </div>
    </div>
  );
};

export default SuperAdminOverview;
