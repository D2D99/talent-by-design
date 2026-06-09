import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import EditableTooltip from "../../components/editableTooltip";
import RoleProgressChart from "../../components/alignmentStatus";

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

const PersonDeepDive = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const orgName = searchParams.get("orgName");

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [teamAvgData, setTeamAvgData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const [reportRes, avgRes] = await Promise.all([
          api.get(`dashboard/admin?userId=${userId}`),
          api.get(
            `dashboard/manager-team-avg?userId=${userId}&includeSelf=true`,
          ),
        ]);
        setReportData(reportRes.data.report);
        setUserData(reportRes.data.user);
        setTeamAvgData(avgRes.data);
      } catch (error) {
        console.error("Failed to fetch person deep dive data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <SpinnerLoader />;

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

  const roleAverages = (() => {
    if (!teamAvgData) return [];

    const getRoles = (roleData: any, label: string, count: number) => {
      const scores = Object.values(roleData || {}).map(
        (d: any) => d.avgScore || 0,
      );
      const score =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;
      return {
        label: `${label} (${count})`,
        value: score,
        color: getMetricColor(score),
      };
    };

    return [
      getRoles(teamAvgData.leaderAvg, "SENIOR LEADER", teamAvgData.leaderCount),
      getRoles(teamAvgData.managerAvg, "MANAGER", teamAvgData.managerCount),
      getRoles(teamAvgData.employeeAvg, "EMPLOYEE", teamAvgData.employeeCount),
    ];
  })();

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-8 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)]">
      {/* Header */}
      <div className="mb-8">
        <div
          className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit"
          onClick={() => navigate(-1)}
        >
          <Icon icon="material-symbols:arrow-back-rounded" width="16" />
          <span className="uppercase tracking-wider">Back to List</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2">
              {userData?.firstName} {userData?.lastName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Icon
                  icon="solar:buildings-2-bold"
                  className="text-[#448CD2]"
                />
                {orgName}
              </span>
              <span className="flex items-center gap-1">
                <Icon icon="solar:user-bold" className="text-[#448CD2]" />
                {userData?.role &&
                  userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(
                  `/dashboard/reports/${userData?.role?.toLowerCase() === "admin" ? "org-head" : userData?.role?.toLowerCase()}?userId=${userId}&orgName=${encodeURIComponent(orgName || "")}`,
                )
              }
              className="px-4 py-2 bg-gray-100 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Original Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Metrics (Left) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex gap-2 items-center mb-6">
            <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize">
              Alignment Analysis
            </h2>
            <EditableTooltip
              id="alignmentInfo"
              defaultContent="Compares perception across different organizational levels (Leaders, Managers, Employees). High variance indicates hidden risk."
            />
          </div>
          <div className="mt-4">
            <RoleProgressChart data={roleAverages} />
          </div>
          <div className="mt-8 space-y-4">
            {roleAverages.map((r, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
              >
                <span className="text-sm font-bold text-gray-700">
                  {r.label.split(" (")[0]}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-black"
                    style={{ color: r.value > 0 ? r.color : "#94A3B8" }}
                  >
                    {r.value > 0 ? (
                      `${r.value}%`
                    ) : (
                      <span className="text-[11px] font-normal italic">
                        No Data Available
                      </span>
                    )}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: r.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Radial (Right - User's Snippet) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="sm:flex-row justify-between items-start mb-10 gap-4">
            <div>
              <div className="flex gap-2">
                <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize">
                  Personal Health Score
                </h2>
                <div className="flex items-center">
                  <EditableTooltip
                    id="orgHealth"
                    defaultContent="A high-level snapshot of performance averaged across People, Operations, and Digital for this individual."
                  />
                </div>
              </div>
            </div>
            {/* Legend Pill */}
            <div className="flex mt-4 justify-center items-center gap-4 px-4 py-2 rounded-xl ">
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
                  Attention
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col items-center gap-10 mt-2 mb-10">
            {/* Radial Chart Left */}
            <div className="relative flex justify-center items-center">
              <svg
                width="220"
                height="220"
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
                  Individual
                </span>
              </div>
            </div>

            {/* Linear Bars Right */}
            <div className="w-full space-y-6">
              {domainMetrics.map((dm, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={getDomainIcon(idx)}
                        className="text-[#475569] w-[18px] h-[18px]"
                      />
                      <span className="text-sm font-bold text-[#334155]">
                        {dm.name}
                      </span>
                    </div>
                    <span
                      className="text-sm font-black"
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
        </div>
      </div>
    </div>
  );
};

export default PersonDeepDive;
