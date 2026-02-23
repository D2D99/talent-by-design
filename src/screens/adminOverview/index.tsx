import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import PieChart from "../../charts/pieChart";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";

const AdminOverview = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("This Month");
  const [intelData, setIntelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntelligence = async () => {
      try {
        const res = await api.get("assessment/admin/intelligence");
        setIntelData(res.data);
      } catch (error) {
        console.error("Dashboard intel fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntelligence();
  }, []);

  if (loading) return <SpinnerLoader />;

  const { stats, roleBreakdown, activityStream } = intelData || {};

  // Map backend stats to UI metrics
  const displayStats = [
    { label: "Team Members", value: stats?.totalMembers?.toString() || "0", icon: "solar:users-group-rounded-bold-duotone", color: "#448CD2", trend: "Active directory" },
    { label: "Active Invites", value: stats?.activeInvites?.toString() || "0", icon: "solar:letter-bold-duotone", color: "#F59E0B", trend: "Awaiting response" },
    { label: "Completed Assessments", value: stats?.completedAssessments?.toString() || "0", icon: "solar:checklist-minimalistic-bold-duotone", color: "#10B981", trend: `${stats?.completionRate || 0}% completion` },
    { label: "Pending Assessments", value: ((stats?.totalMembers || 0) - (stats?.completedAssessments || 0)).toString(), icon: "solar:clipboard-list-bold-duotone", color: "#8E54E9", trend: "Requires attention" },
  ];

  const roleData = [roleBreakdown?.manager || 0, roleBreakdown?.leader || 0, roleBreakdown?.employee || 0];
  const roleLabels = ["Managers", "Leaders", "Employees"];
  const roleColors = ["#10B981", "#6366F1", "#F59E0B"];

  return (
    <div className="sm:p-6 p-3 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="bg-[var(--app-surface)] border border-[var(--app-border-color)] shadow-[0_8px_30px_rgba(68,140,210,0.08)] sm:p-8 p-5 rounded-[20px] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#448CD2] to-[#1a3652] rounded-[18px] flex items-center justify-center text-white shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Icon icon="solar:chart-square-bold-duotone" width="36" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[var(--app-heading-color)] tracking-tight">Team Intelligence</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <p className="text-sm font-bold text-[var(--app-text-muted)] uppercase tracking-wider">Internal Workspace Hub</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[var(--app-surface-soft)] p-1.5 rounded-[14px] border border-[var(--app-border-color)]">
            {["This Week", "This Month", "Quarterly"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2.5 rounded-[10px] text-[11px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-[var(--primary-color)] text-white shadow-md' : 'text-[var(--app-text-muted)] hover:text-[var(--primary-color)]'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat: any, idx: number) => (
          <div key={idx} className="bg-[var(--app-surface)] p-6 rounded-[20px] border border-[var(--app-border-color)] shadow-sm group hover:border-[var(--primary-color)] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="p-3.5 rounded-[12px] transition-transform duration-500 group-hover:scale-110 shadow-sm" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <Icon icon={stat.icon} width="24" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[var(--app-surface-soft)] px-2.5 py-1 rounded-full border border-[var(--app-border-color)]">{stat.trend}</span>
            </div>
            <div className="mt-8">
              <h3 className="text-4xl font-black text-[var(--app-heading-color)] tracking-tighter">{stat.value}</h3>
              <p className="text-[11px] font-black text-[var(--app-text-muted)] uppercase tracking-[0.2em] mt-2">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Team Composition (Pie Chart) */}
        <div className="xl:col-span-4 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-[var(--app-heading-color)] tracking-tight">Team Structure</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Role Distribution</p>
            </div>
            <div className="w-10 h-10 bg-[var(--app-surface-soft)] rounded-full flex items-center justify-center text-[var(--app-text-muted)] border border-[var(--app-border-color)]">
              <Icon icon="solar:pie-chart-bold-duotone" width="20" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-[220px] flex items-center justify-center">
              <PieChart labels={roleLabels} data={roleData} colors={roleColors} />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              {roleLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-[var(--app-surface-soft)] rounded-[12px] border border-[var(--app-border-color)]/30">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: roleColors[i] }}></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">{label}</p>
                    <p className="text-[10px] font-bold text-slate-400">{roleData[i]} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assessment Lifecycle */}
        <div className="xl:col-span-5 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary-color)]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-black text-[var(--app-heading-color)] tracking-tight">Assessment Lifecycle</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Participation Stream</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/org-invitation")}
              className="px-4 py-2 bg-[var(--primary-color)] text-white text-[10px] font-black uppercase rounded-[10px] shadow-lg shadow-[var(--primary-color)]/20 hover:scale-105 transition-transform"
            >
              Send Reminders
            </button>
          </div>

          <div className="flex-1 space-y-8 relative z-10">
            {/* Progress Bars for Lifecycle */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">Completed</span>
                <span className="text-sm font-black text-[#10B981]">{stats?.completedAssessments} <span className="text-[10px] text-slate-400 font-bold">({stats?.completionRate}%)</span></span>
              </div>
              <div className="w-full h-3 bg-[var(--app-surface-soft)] rounded-full border border-[var(--app-border-color)]/30 overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full transition-all duration-1000" style={{ width: `${stats?.completionRate}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">In Progress</span>
                <span className="text-sm font-black text-[#6366F1]">{stats?.inProgressAssessments || 0}</span>
              </div>
              <div className="w-full h-3 bg-[var(--app-surface-soft)] rounded-full border border-[var(--app-border-color)]/30 overflow-hidden">
                <div className="h-full bg-[#6366F1] rounded-full transition-all duration-1000" style={{ width: `${stats?.totalMembers > 0 ? ((stats?.inProgressAssessments || 0) / stats?.totalMembers) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-black text-[var(--app-heading-color)] uppercase tracking-wider">Not Started</span>
                <span className="text-sm font-black text-[#F59E0B]">{stats?.notStartedAssessments || 0}</span>
              </div>
              <div className="w-full h-3 bg-[var(--app-surface-soft)] rounded-full border border-[var(--app-border-color)]/30 overflow-hidden">
                <div className="h-full bg-[#F59E0B] rounded-full transition-all duration-1000" style={{ width: `${stats?.totalMembers > 0 ? ((stats?.notStartedAssessments || 0) / stats?.totalMembers) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-[var(--app-surface-soft)] p-4 rounded-[16px] border border-[var(--app-border-color)]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Average Response</p>
                <p className="text-lg font-black text-[var(--app-heading-color)] tracking-tight">2.4 Days</p>
              </div>
              <div className="bg-[var(--app-surface-soft)] p-4 rounded-[16px] border border-[var(--app-border-color)]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Weekly Growth</p>
                <p className="text-lg font-black text-[#10B981] tracking-tight">+14.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Log (List) - CHANGED TO WHITE THEME */}
        <div className="xl:col-span-3 bg-[var(--app-surface)] rounded-[20px] border border-[var(--app-border-color)] p-7 flex flex-col shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#448CD2]"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-lg font-bold tracking-tight text-[var(--app-heading-color)]">Team Stream</h3>
            <Icon icon="solar:history-bold-duotone" className="text-[#448CD2]" width="20" />
          </div>

          <div className="flex-1 space-y-6 relative z-10 overflow-y-auto max-h-[400px] no-scrollbar">
            {activityStream?.map((activity: any) => (
              <div key={activity.id} className="flex gap-4 group/item cursor-default">
                <div className="mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${activity.type === 'completion' ? 'bg-[#10B981]' : (activity.type === 'start' ? 'bg-[#6366F1]' : 'bg-[#F59E0B]')} shadow-sm`}></div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[var(--app-heading-color)] group-hover/item:text-[#448CD2] transition-colors">
                    {activity.user}
                  </h4>
                  <p className="text-[11px] text-[var(--app-text-muted)] mt-1 font-medium italic">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[8px] font-black text-[#448CD2] uppercase tracking-widest">{activity.role}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(activity.time).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!activityStream || activityStream.length === 0) && (
              <p className="text-xs text-slate-400 italic text-center py-10 opacity-50">Pulse sequence initiated...</p>
            )}
          </div>

          <button
            onClick={() => navigate("/dashboard/team")}
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
            <h3 className="text-xl font-black text-[var(--app-heading-color)] tracking-tight">Active Participants</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Direct Assessment Data Feed</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/team")}
            className="text-[10px] font-black uppercase text-[var(--primary-color)] tracking-widest hover:underline"
          >
            View Entire Directory
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--app-surface-soft)]">
                <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">Participant</th>
                <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">Role</th>
                <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">Lifecycle Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-widest">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--app-border-color)]">
              {(intelData?.people || []).slice(0, 5).map((person: any, idx: number) => (
                <tr key={idx} className="hover:bg-[var(--app-surface-soft)]/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)] font-bold text-xs border border-[var(--primary-color)]/20">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--app-heading-color)] leading-none">{person.name}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{person.email}</p>
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
                      <span className={`w-1.5 h-1.5 rounded-full ${person.assessmentStatus === 'Completed' ? 'bg-[#10B981]' : person.assessmentStatus === 'In Progress' ? 'bg-[#6366F1]' : 'bg-slate-300'}`}></span>
                      <span className={`text-[11px] font-bold ${person.assessmentStatus === 'Completed' ? 'text-[#10B981]' : (person.assessmentStatus === 'In Progress' ? 'text-[#6366F1]' : 'text-slate-400')}`}>
                        {person.assessmentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {person.status === 'Registered' ? 'Profile Verified' : 'External Access'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!intelData?.people || intelData.people.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-xs text-slate-400 italic">No participation records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Prompt Section */}
      <div className="bg-gradient-to-r from-[#448CD2] to-[#1a3652] rounded-[24px] p-8 text-white relative overflow-hidden shadow-2xl group">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[22px] flex items-center justify-center text-white border border-white/20 shadow-xl transform group-hover:scale-105 transition-transform">
              <Icon icon="solar:lightbulb-bolt-bold-duotone" width="40" className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none mb-2">Team Insight</h2>
              <p className="text-sm text-blue-100/80 font-medium max-w-md leading-relaxed">Assessments indicate a collective strength in <span className="text-white font-bold">Strategic Vision</span>. Consider focusing the next sprint on clarity protocols to maintain this momentum.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/org-assessments")}
            className="bg-white text-[#1a3652] px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Review Team Progress
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex flex-col items-center pt-10 pb-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-1 rounded-full bg-[var(--primary-color)]"></div>
          <p className="text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-[1em] ml-1">Workspace Hub</p>
        </div>
        <img src="/static/img/home/logo.svg" className="h-6" alt="logo" />
      </div>

    </div>
  );
};

export default AdminOverview;
