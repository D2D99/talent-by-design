import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import EditableTooltip from "../../components/editableTooltip";
import MultiRadarChart from "../../charts/multiRadarChart";
import type { RadarData } from "../../charts/radarChart";
import { initTWE, Dropdown, Ripple } from "tw-elements";

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
    const [selectedRadarDept, setSelectedRadarDept] = useState<string>("");
    const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);
    const [teamAvgLoading, setTeamAvgLoading] = useState(false);

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

    if (loading) return <SpinnerLoader />;

    const overallScore = reportData?.scores?.overall || 0;
    const domains = reportData?.scores?.domains || {};
    const dNames = Object.keys(domains);

    const getMetricColor = (score: number) => {
        if (score < 50) return "#FF5656"; // Needs Attention (Red)
        if (score < 75) return "#FEE114"; // At Risk (Yellow)
        return "#30AD43"; // On Track (Green)
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

    return (
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-8 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)]">
            {/* Header */}
            <div className="mb-8">
                <div
                    className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit"
                    onClick={() => navigate(-1)}
                >
                    <Icon icon="material-symbols:arrow-back-rounded" width="16" />
                    <span className="uppercase tracking-wider">Back</span>
                </div>
                <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2">
                    {orgName} Insights
                </h1>
                <p className="text-gray-500 text-sm">
                    Collective organizational health and team performance analysis
                </p>
            </div>

            {/* Organizational Health Section (User's Snippet) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Organizational Health (Radial) */}
                <div className="bg-white border border-[#448CD2] border-opacity-10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <div className="flex gap-2">
                            <h2 className="text-xl font-bold text-[#1A3652] capitalize">
                                Organizational Health
                            </h2>
                            <EditableTooltip
                                id="orgHealth"
                                defaultContent="A snapshot of overall performance averaged across People, Operations, and Digital domains."
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { label: "On Track", color: "#30AD43" },
                                { label: "At Risk", color: "#FEE114" },
                                { label: "Needs Attention", color: "#FF5656" }
                            ].map((pill, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                                    <span className="h-1.5 w-3 rounded-full" style={{ backgroundColor: pill.color }} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{pill.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row items-center justify-center gap-10">
                        <div className="relative flex justify-center items-center scale-90 xxl:scale-100 transition-transform">
                            <svg width="240" height="240" viewBox="0 0 200 200" className="drop-shadow-lg">
                                <Ring score={domainMetrics[0]?.score || 0} r={82} color={domainMetrics[0]?.color} />
                                <Ring score={domainMetrics[1]?.score || 0} r={62} color={domainMetrics[1]?.color} />
                                <Ring score={domainMetrics[2]?.score || 0} r={42} color={domainMetrics[2]?.color} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-[#1A3652] tracking-tighter">
                                    {Math.round(overallScore)}%
                                </span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Org Average</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-6">
                            {domainMetrics.map((dm, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                                <Icon icon={getDomainIcon(idx)} className="text-[#448CD2] w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-[#1A3652]">{dm.name}</span>
                                        </div>
                                        <span className="text-sm font-black" style={{ color: dm.color }}>{Math.round(dm.score)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                            style={{ width: `${dm.score}%`, backgroundColor: dm.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Radar Chart (Departmental) */}
                <div className="bg-white border border-[#448CD2] border-opacity-10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <div className="flex gap-2">
                            <h3 className="text-xl font-bold text-[#1A3652] capitalize">
                                Overall Departmental POD Score
                            </h3>
                            <EditableTooltip
                                id="podScore"
                                defaultContent="Compares how Leaders, Managers, and Employees experience the organization across the three POD domains. Highlights gaps signaling hidden risks."
                            />
                        </div>
                        <div className="relative" data-twe-dropdown-ref>
                            <button
                                className="flex items-center gap-2 bg-[#F1F5F9] px-4 py-1.5 text-xs font-bold text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-200 transition-all uppercase tracking-wider"
                                type="button"
                                id="deptDropdown"
                                data-twe-dropdown-toggle-ref
                                aria-expanded="false"
                            >
                                {selectedRadarDept || "Organization"}
                                <Icon icon="mdi:chevron-down" />
                            </button>
                            <ul
                                className="absolute z-[1000] float-left m-0 hidden min-w-[200px] list-none overflow-hidden rounded-xl border-none bg-white bg-clip-padding text-base shadow-2xl data-[twe-dropdown-show]:block max-h-68 overflow-y-auto mt-2 py-2"
                                aria-labelledby="deptDropdown"
                                data-twe-dropdown-menu-ref
                            >
                                <li>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-[#448CD2] transition-colors"
                                        onClick={() => setSelectedRadarDept("")}
                                    >
                                        Full Organization
                                    </button>
                                </li>
                                {(teamAvgData?.allDepartments || []).map((dept: string) => (
                                    <li key={dept}>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 transition-colors"
                                            onClick={() => setSelectedRadarDept(dept)}
                                        >
                                            {dept}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 mt-2 mb-6">
                        {[
                            { label: "Leader", color: "rgba(74, 144, 226, 0.7)", count: teamAvgData?.leaderCount || 0 },
                            { label: "Manager", color: "rgba(46, 204, 113, 0.7)", count: teamAvgData?.managerCount || 0 },
                            { label: "Employee", color: "rgba(231, 76, 60, 0.6)", count: teamAvgData?.employeeCount || 0 }
                        ].map((legend, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${hiddenIndices.includes(idx) ? "opacity-30 grayscale" : "opacity-100"}`}
                                onClick={() => toggleHiddenIndex(idx)}
                            >
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: legend.color }} />
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                                    {legend.label} ({legend.count})
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="relative w-full h-[320px]">
                        {teamAvgLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                                <Icon icon="line-md:loading-loop" className="text-[#448CD2] w-8 h-8" />
                            </div>
                        ) : null}
                        <MultiRadarChart
                            data={radarData}
                            onLabelSelect={handleDomainChange}
                            datasetLabels={["Leader", "Manager", "Employee"]}
                            hiddenIndices={hiddenIndices}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon icon="solar:lightbulb-bold-duotone" className="text-[#448CD2] w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1A3652]">Strategic Recommendation</h3>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed text-sm">
                        Based on the aggregate score of <span className="font-black text-[#448CD2]">{Math.round(overallScore)}%</span>, the organization is currently {overallScore >= 75 ? "exceling in most areas. Focus on maintaining momentum and scaling best practices to ensure long-term sustainability." : overallScore >= 50 ? "in a transition phase. Identify key bottlenecks in Operational Steadiness to improve overall efficiency and reduce friction." : "in need of immediate attention across multiple domains. Prioritize People Potential to build a stronger foundation and improve employee alignment."}
                    </p>
                </div>

                <div className="border border-[#448CD2] border-opacity-10 p-6 rounded-2xl bg-[#448bd208] shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon icon="solar:graph-up-bold-duotone" className="text-[#448CD2] w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#1A3652] capitalize">Trends Analysis</h2>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Talent Retention", trend: "up", text: "Strong positive momentum" },
                            { label: "Digital Adoption", trend: "up", text: "Improving fast enough" },
                            { label: "Operational Fluidity", trend: "down", text: "Attention required" },
                            { label: "Strategic Alignment", trend: "up", text: "Consistently high" }
                        ].map((item, i) => (
                            <li key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-colors group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-[#1A3652] transition-colors">{item.text}</span>
                                </div>
                                <div className={`p-2 rounded-full ${item.trend === 'up' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                    <Icon icon={item.trend === 'up' ? "solar:arrow-right-up-bold-duotone" : "solar:arrow-right-down-bold-duotone"} width="20" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default OrganizationDeepDive;
