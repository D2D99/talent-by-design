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
import { formatDistanceToNow } from "date-fns";
import PieChart from "../../charts/pieChart";

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
    const [teamAvgLoading, setTeamAvgLoading] = useState(false);
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
                const [reportRes] = await Promise.all([
                    api.get(`dashboard/admin?orgName=${encodeURIComponent(orgName || "")}`)
                ]);
                setReportData(reportRes.data.report);
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
            setTeamAvgLoading(true);
            try {
                let url = "dashboard/manager-team-avg";
                const params: string[] = ["includeSelf=true"];
                params.push(`orgName=${encodeURIComponent(orgName)}`);
                if (selectedRadarDept)
                    params.push(`department=${encodeURIComponent(selectedRadarDept)}`);

                if (params.length) url += `?${params.join("&")}`;
                const res = await api.get(url);
                setTeamAvgData(res.data);
            } finally {
                setTeamAvgLoading(false);
            }
        };
        fetchTeamAvg();
    }, [orgName, selectedRadarDept]);

    if (loading || intelLoading) return <SpinnerLoader />;

    const { stats, roleBreakdown, activityStream } = intelData || {};

    const overallScore = reportData?.scores?.overall || 0;
    const domains = reportData?.scores?.domains || {};
    const dNames = Object.keys(domains);

    const getMetricColor = (score: number) => {
        if (score < 50) return "#FF5656";
        if (score < 75) return "#FEE114";
        return "#30AD43";
    };

    const domainMetrics = dNames.map((name) => ({
        name,
        score: domains[name]?.score || 0,
        color: getMetricColor(domains[name]?.score || 0),
    }));

    const getDomainIcon = (idx: number) => {
        if (idx === 0) return "solar:users-group-rounded-bold";
        if (idx === 1) return "solar:settings-bold";
        if (idx === 2) return "solar:laptop-minimalistic-bold";
        return "solar:star-bold";
    };

    const radarData: RadarData = (() => {
        const domainsObj = reportData?.scores?.domains || {};
        const labels = Object.keys(domainsObj);
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

    const handleDomainChange = (domain: string) => {
        console.log("Selected domain from radar:", domain);
    };

    const completionRate = stats?.completionRate || 0;
    const completed = stats?.completedAssessments || 0;
    const total = stats?.totalMembers || 0;
    const pending = stats?.notStartedAssessments || 0;
    const inProgress = stats?.inProgressAssessments || 0;

    const displayStats = [
        {
            label: "Total Team Members",
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
            label: "Completed Cycles",
            value: completed.toString(),
            icon: "solar:checklist-minimalistic-broken",
            color: "#10B981",
        },
        {
            label: "In Progress",
            value: inProgress.toString(),
            icon: "solar:clock-circle-broken",
            color: "#8E54E9",
        },
    ];

    const roleLabels = ["Managers", "Leaders", "Employees"];
    const roleColors = ["#10B981", "#6366F1", "#F59E0B"];
    const roleData = [
        roleBreakdown?.manager || 0,
        roleBreakdown?.leader || 0,
        roleBreakdown?.employee || 0,
    ];

    const totalUsers = roleData.reduce((a, b) => a + b, 0);
    // const getRoleStats = (role: string) => {
    //     const idx = roleLabels.indexOf(role);
    //     const val = roleData[idx] || 0;
    //     const pct = totalUsers > 0 ? ((val / totalUsers) * 100).toFixed(1) : "0";
    //     return { val, pct, color: roleColors[idx] };
    // };

    return (
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] space-y-6">
            {/* ── Header ── */}
            <div className="">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold mb-2 cursor-pointer text-[#448CD2] hover:underline" onClick={() => navigate(-1)}>
                                <Icon icon="material-symbols:arrow-back-rounded" width="14" />
                                <span>Back to Organizations</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="md:text-2xl mb-1 text-xl font-bold text-gray-800 uppercase tracking-tight">
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
                                    <svg className="size-3 text-[#448CD2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="bg-[#edf5fd] text-[#448CD2] border border-[rgba(68,140,210,0.2)] rounded-full ps-3 pe-6 py-1.5 text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-[#448CD2] transition-all appearance-none"
                                >
                                    {[2024, 2025, 2026, 2027, 2028].map((y) => (
                                        <option key={y} value={y}>{y}</option>
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

            {/* ── Stats Grid — compact horizontal cards ── */}
            <div className="grid grid-cols-2 pt-5 xl:grid-cols-4 gap-3">
                {displayStats.map((stat, idx) => (
                    <div key={idx} className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full flex items-center gap-5 flex-nowrap bg-white shadow-sm">
                        <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            <Icon icon={stat.icon} width="24" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide truncate">{stat.label}</p>
                            <p className="text-2xl font-bold leading-tight mt-0.5" style={{ color: stat.color }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Pulse Row — 3 quick-read cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {[
                    { label: "Completion Rate", value: `${completionRate}%`, icon: "solar:user-check-broken", color: "#10b981", badge: completionRate >= 70 ? "On Track" : "Action Needed" },
                    { label: "Pending Invites", value: stats?.activeInvites || 0, icon: "la:stopwatch", color: "#448cd2", badge: "Awaiting Join" },
                    { label: "Latest Submission", value: activityStream?.[0]?.user || "N/A", icon: "solar:history-broken", color: "#8E54E9", badge: activityStream?.[0]?.time ? formatDistanceToNow(new Date(activityStream[0].time), { addSuffix: true }) : "N/A" },
                ].map((item, i) => (
                    <div key={i} className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full flex items-start justify-between bg-white shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                <Icon icon={item.icon} width="20" />
                            </div>
                            <div>
                                <p className="text-xs text-[#5d5d5d] font-medium">{item.label}</p>
                                <p className="text-base font-bold capitalize leading-tight max-w-[120px] truncate">{item.value}</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border" style={{ color: item.color, backgroundColor: `${item.color}12`, borderColor: `${item.color}30` }}>{item.badge}</span>
                    </div>
                ))}
            </div>

            {/* ── Main 3-col Grid ── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Member Distribution */}
                <div className="xl:col-span-4 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] p-5 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(68,140,210,0.1)]">
                        <div>
                            <h3 className="text-sm font-bold">Member Distribution</h3>
                            <p className="text-[10px] text-[#5d5d5d] mt-0.5">Role Breakdown</p>
                        </div>
                        {viewMode === "visual" && (
                            <div className="relative">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="appearance-none bg-[#edf5fd] border border-[rgba(68,140,210,0.25)] text-[#448CD2] text-[10px] font-semibold py-1 pl-2.5 pr-6 rounded-full outline-none cursor-pointer"
                                >
                                    {roleLabels.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <Icon icon="solar:alt-arrow-down-bold" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#448CD2] pointer-events-none" width="9" />
                            </div>
                        )}
                    </div>
                    <div className="flex bg-[#edf5fd] p-0.5 rounded-full mb-4 border border-[rgba(68,140,210,0.15)]">
                        <button onClick={() => setViewMode("list")} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "list" ? "bg-white text-[#448CD2] shadow-sm" : "text-[#5d5d5d]"}`}><Icon icon="solar:list-bold" width="11" /> Breakdown</button>
                        <button onClick={() => setViewMode("visual")} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${viewMode === "visual" ? "bg-white text-[#448CD2] shadow-sm" : "text-[#5d5d5d]"}`}><Icon icon="solar:pie-chart-bold" width="11" /> Visual</button>
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
                                                <span className="text-[11px] font-semibold text-[#5d5d5d] group-hover:text-[#448CD2] transition-colors">{role}</span>
                                                <span className="text-[11px] font-bold">{val} <span className="text-[9px] text-[#5d5d5d] font-normal">({pct.toFixed(0)}%)</span></span>
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
                                <PieChart labels={roleLabels} data={roleData} colors={roleColors} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Overall Health (Circular Progress Bar) */}
                <div className="xl:col-span-4 flex flex-col gap-4">
                    <div className="flex-1 bg-white rounded-xl border border-[rgba(68,140,210,0.2)] p-7 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-6">Overall Health</h3>
                        <div className="relative inline-flex items-center justify-center mb-8">
                            <CircularProgress value={completionRate} pathColor="#448cd2" trailColor="rgba(68, 140, 210, 0.1)" textColor="#1a3652" width={160} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full relative z-10">
                            {[
                                { label: "Completed", value: completed, color: "#10B981" },
                                { label: "In Progress", value: inProgress, color: "#6366F1" },
                                { label: "Pending", value: pending, color: "#F59E0B" },
                                { label: "Total Members", value: total, color: "#448CD2" },
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-xl transition-colors">
                                    <span className="text-xl font-black text-slate-800 block tracking-tight">{item.value}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider block mt-1" style={{ color: item.color }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Stream */}
                <div className="xl:col-span-4 bg-white rounded-[20px] border border-[rgba(68,140,210,0.2)] p-7 flex flex-col shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#448CD2]"></div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Stream</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Feed</p>
                        </div>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] rounded-full text-[9px] font-black uppercase tracking-wider border border-[#10b981]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" /> Live
                        </span>
                    </div>
                    <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar max-h-[350px] relative z-10">
                        {activityStream?.length > 0 ? (
                            activityStream.map((log: any, i: number) => (
                                <div key={i} className="flex gap-4 group/item cursor-default">
                                    <div className="mt-1">
                                        <div className={`size-5 rounded-full flex shrink-0 items-center justify-center ${log.type === "completion" ? "bg-[#10B981]" : "bg-[#448CD2]"} shadow-sm`}>
                                            <span className="text-[8px] font-bold text-white uppercase">{log.user?.[0] || "?"}</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[12px] font-black text-slate-800 truncate">{log.user}</p>
                                        <p className="text-[11px] text-slate-500 mt-1 font-medium italic">{log.action}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 italic text-center py-10 opacity-50">Monitoring stream...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ────────── EXTRAS ADDED AT THE END ────────── */}

            {/* Health Domain Breakdown (POD Details) */}
            <div className="border-[1px] border-[#448CD2] border-opacity-20 p-8 rounded-[24px] bg-white shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-[#1A3652] tracking-tight">
                            Organizational Health Architecture
                        </h2>
                        <EditableTooltip id="orgHealth" defaultContent="A snapshot of overall performance averaged across People, Operations, and Digital domains." />
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {[
                            { label: "High Perform", color: "#30AD43" },
                            { label: "Stable Flow", color: "#FEE114" },
                            { label: "Critical Zone", color: "#FF5656" }
                        ].map((pill, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pill.color }} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pill.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative flex justify-center items-center scale-105">
                        <svg width="280" height="280" viewBox="0 0 200 200" className="drop-shadow-2xl">
                            <Ring score={domainMetrics[0]?.score || 0} r={88} color={domainMetrics[0]?.color} />
                            <Ring score={domainMetrics[1]?.score || 0} r={68} color={domainMetrics[1]?.color} />
                            <Ring score={domainMetrics[2]?.score || 0} r={48} color={domainMetrics[2]?.color} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-6xl font-black text-[#1A3652] tracking-tighter leading-none">
                                {Math.round(overallScore)}%
                            </span>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Collective Avg</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-8">
                        {domainMetrics.map((dm, idx) => (
                            <div key={idx} className="group/item">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover/item:bg-blue-50 transition-all">
                                            <Icon icon={getDomainIcon(idx)} className="text-[#448CD2] w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-black text-[#1A3652] uppercase tracking-widest">{dm.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-black italic tracking-tighter" style={{ color: dm.color }}>{Math.round(dm.score)}%</span>
                                    </div>
                                </div>
                                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-100 p-0.5">
                                    <div className="h-full rounded-full transition-all duration-[2s] ease-out shadow-lg" style={{ width: `${dm.score}%`, backgroundColor: dm.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Departmental Comparison Radar Selection */}
            <div className="border-[1px] border-[#448CD2] border-opacity-20 p-8 rounded-[24px] bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
                    <div className="flex gap-3 items-center">
                        <h3 className="text-2xl font-black text-[#1A3652] capitalize">
                            Departmental POD Comparison
                        </h3>
                        <EditableTooltip id="podScore" defaultContent="Compares how Leaders, Managers, and Employees experience the organization across the three POD domains." />
                    </div>
                    <div className="relative" data-twe-dropdown-ref>
                        <button
                            className="flex items-center gap-3 bg-[#edf5fd] px-6 py-2.5 text-xs font-black text-[#448CD2] rounded-full border border-blue-100 hover:bg-blue-100 transition-all uppercase tracking-widest shadow-sm"
                            type="button"
                            id="deptDropdownDeep"
                            data-twe-dropdown-toggle-ref
                            aria-expanded="false"
                        >
                            {selectedRadarDept || "Select Department"}
                            <Icon icon="mdi:chevron-down" />
                        </button>
                        <ul
                            className="absolute z-[1000] float-left m-0 hidden min-w-[200px] list-none overflow-hidden rounded-xl border-none bg-white bg-clip-padding text-base shadow-2xl data-[twe-dropdown-show]:block max-h-68 overflow-y-auto mt-2 py-2"
                            aria-labelledby="deptDropdownDeep"
                            data-twe-dropdown-menu-ref
                        >
                            <li><button className="block w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-[#448CD2] transition-colors" onClick={() => setSelectedRadarDept("")}>Full Organization</button></li>
                            {(teamAvgData?.allDepartments || []).map((dept: string) => (
                                <li key={dept}>
                                    <button className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 transition-colors" onClick={() => setSelectedRadarDept(dept)}>{dept}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="flex flex-wrap justify-center gap-6 mb-10">
                            {[
                                { label: "Leader", color: "rgba(74, 144, 226, 0.7)", count: teamAvgData?.leaderCount || 0 },
                                { label: "Manager", color: "rgba(46, 204, 113, 0.7)", count: teamAvgData?.managerCount || 0 },
                                { label: "Employee", color: "rgba(231, 76, 60, 0.6)", count: teamAvgData?.employeeCount || 0 }
                            ].map((legend, idx) => (
                                <div key={idx} className={`flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-50 cursor-pointer transition-all hover:bg-slate-50 shadow-sm ${hiddenIndices.includes(idx) ? "opacity-30 grayscale" : "opacity-100"}`} onClick={() => toggleHiddenIndex(idx)}>
                                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: legend.color }} />
                                    <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{legend.label} <span className="opacity-40 italic">({legend.count})</span></span>
                                </div>
                            ))}
                        </div>
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            {teamAvgLoading && <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-sm"><Icon icon="line-md:loading-loop" className="text-[#448CD2] w-12 h-12" /></div>}
                            <MultiRadarChart data={radarData} onLabelSelect={handleDomainChange} datasetLabels={["Leader", "Manager", "Employee"]} hiddenIndices={hiddenIndices} />
                        </div>
                    </div>
                    <div className="lg:col-span-5 bg-slate-50/50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                        <div className="flex items-center gap-3 mb-6">
                            <Icon icon="solar:info-circle-bold-duotone" className="text-[#448CD2] w-6 h-6" />
                            <h4 className="text-sm font-black text-[#1A3652] uppercase tracking-[0.15em]">Analysis Summary</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-bold leading-loose italic">
                            Based on the comparative analysis of {orgName}, there is a {Math.abs((radarData.manager[0] || 0) * 10 - (radarData.peer[0] || 0) * 10) > 15 ? "significant disconnect" : "strong alignment"} between leadership perception and employee experience.
                            {overallScore >= 75 ? " The organization maintains a high level of operational integrity across all domains." : " Attention to operational steadiness is recommended to close internal visibility gaps."}
                        </p>
                        <div className="mt-10 space-y-4">
                            {[
                                { label: "Talent Mobility", trend: "up", text: "Optimal expansion detected." },
                                { label: "Digital Fluidity", trend: "up", text: "Systems performing high." },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                                        <span className="text-[11px] font-black text-slate-600">{item.text}</span>
                                    </div>
                                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                                        <Icon icon="solar:arrow-right-up-bold-duotone" width="16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDeepDive;
