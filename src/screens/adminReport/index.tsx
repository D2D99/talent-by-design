import { Icon } from "@iconify/react";
import Streamline from "../../../public/static/img/home/streamline-plump_graph-bar-increase.svg";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import Hugeicons from "../../../public/static/img/home/hugeicons_target-02.svg";
// import StreamlinePlump from "../../../public/static/img/home/streamline-plump_ai-technology-spark.svg";
// import Healthicons from "../../../public/static/img/home/healthicons_i-certificate-paper-outline.svg";
// import LastGraph from "../../../public/static/img/home/last-graph.svg";
// import kri from "../../../public/static/img/home/kdi1111.svg";
// import Employee from "../../../public/static/img/home/employee.svg";
import OuiSecurity from "../../../public/static/img/home/oui_security-signal-detected.svg";
import DownArrow from "../../../public/static/img/home/down-arrow.svg";
import Iconamoon from "../../../public/static/img/home/iconamoon_attention-square.svg";
import UpArrow from "../../../public/static/img/home/up-arrow.svg";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { toast } from "react-toastify";
import SpinnerLoader from "../../components/spinnerLoader";
import ReportEmptyState from "../../components/reportEmptyState";
import { useAuth } from "../../context/useAuth";
import ReportPreviewModal from "../../components/reportPreviewModal";
import { Dropdown, Ripple, initTWE, Offcanvas } from "tw-elements";
import Select from "react-select";
import Triangle from "../../components/triangle";
import CircularProgress from "../../components/percentageCircle";
import SpeedMeter from "../../components/speedMeter";
import MultiLineChart from "../../charts/multiLineChart";
import MultiRadarChart from "../../charts/multiRadarChart";
import type { RadarData } from "../../charts/radarChart";
import RoleProgressChart from "../../components/alignmentStatus";
import FeedbackEditorModal from "../../components/feedbackEditorModal";
import { Tooltip } from "react-tooltip";

// Score mapping: SCALE_1_5: 1→20,2→40,3→60,4→80,5→100; FORCED_CHOICE: low→20,high→100
const getNumericScore = (res: any): number => {
  if (res.scale === "SCALE_1_5" || res.scale === "NEVER_ALWAYS") {
    return (Number(res.value) || 1) * 20;
  }
  if (res.scale === "FORCED_CHOICE") {
    return res.selectedOption === res.higherValueOption ? 100 : 20;
  }
  return 20;
};

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
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
    </>
  );
};

const AdminReport = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const userEmail = searchParams.get("email"); // Guest employee support
  const [reportData, setReportData] = useState<any>(null);
  const [firstReportData, setFirstReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [detailedPods, setDetailedPods] = useState<any>(null);
  const [hasNoReport, setHasNoReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [teamAvgData, setTeamAvgData] = useState<any>(null); // 🆕 Org wide data
  const [selectedRadarDept, setSelectedRadarDept] = useState<string>(""); // 🆕 Radar Dept Filter
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([]); // 🆕 Radar Visibility Toggle
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const toggleHiddenIndex = (idx: number) => {
    setHiddenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const userRole = user?.role?.toLowerCase();
  const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";

  const isAdmin = userRole === "admin";
  const [orgs, setOrgs] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>(
    searchParams.get("orgName") || user?.orgName || "",
  );
  const [depts, setDepts] = useState<string[]>([]);

  useEffect(() => {
    if (isSuperAdmin) {
      api
        .get("/auth/organizations")
        .then((res) => setOrgs(res.data.organizations));
    }
  }, [isSuperAdmin]);

  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  useEffect(() => {
    if (selectedOrg) {
      api.get(`/auth/organization-filters/${selectedOrg}`).then((res) => {
        const fetchedMembers = res.data.members;
        setMembers(fetchedMembers);
        setDepts(res.data.departments);

        // Pre-select member if userId or email is in query params
        if (userId || userEmail) {
          const member = fetchedMembers.find(
            (m: any) =>
              (userId && m._id === userId) ||
              (userEmail && m.email === userEmail),
          );
          if (member) {
            setSelectedMember(member);
          }
        }
      });
    }
  }, [selectedOrg, userId, userEmail]);

  const filteredMembers = members.filter((m) => {
    const roleLower = m.role?.toLowerCase();
    const isTargetRole =
      roleLower === "admin" ||
      roleLower === "superadmin" ||
      roleLower === "super_admin";

    // Only show target role (Admins/SuperAdmins) on this page
    if (!isTargetRole) return false;

    // Hierarchy filter for visibility
    if (isSuperAdmin) return true;

    // Admin should see Admins (Org Heads) in their own organization
    if (isAdmin && isTargetRole) return true;

    return false;
  });

  // const customSelectStyles = {
  //     control: (provided: any) => ({
  //         ...provided,
  //         backgroundColor: '#EDF5FD',
  //         border: 'none',
  //         borderRadius: '4px',
  //         fontSize: '12px',
  //         minHeight: '32px',
  //         width: '180px',
  //         boxShadow: 'none',
  //         '&:hover': {
  //             backgroundColor: '#E4F0FC'
  //         }
  //     }),
  //     valueContainer: (provided: any) => ({
  //         ...provided,
  //         padding: '0 8px'
  //     }),
  //     singleValue: (provided: any) => ({
  //         ...provided,
  //         color: '#676767',
  //         fontWeight: '500'
  //     }),
  //     placeholder: (provided: any) => ({
  //         ...provided,
  //         color: '#676767',
  //         fontWeight: '500'
  //     }),
  //     dropdownIndicator: (provided: any) => ({
  //         ...provided,
  //         color: '#676767',
  //         padding: '4px',
  //         '&:hover': {
  //             color: '#448CD2'
  //         }
  //     }),
  //     indicatorSeparator: () => ({
  //         display: 'none'
  //     }),
  //     menu: (provided: any) => ({
  //         ...provided,
  //         zIndex: 9999
  //     })
  // };

  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });

    const fetchReport = async () => {
      if (!userId && !userEmail) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let url = `dashboard/admin`;
        if (userEmail) {
          url = `dashboard/admin?userId=${userId}&email=${encodeURIComponent(userEmail)}`;
        } else if (userId) {
          url = `dashboard/admin?userId=${userId}`;
        }
        const res = await api.get(url);
        setReportData(res.data.report);
        setFirstReportData(res.data.firstReport || res.data.report);
        setUserData(res.data.user);
        setAiInsight(res.data.aiInsight);
        setHasNoReport(false);
      } catch (error: any) {
        console.error("Failed to fetch report:", error);
        if (error.response?.status === 404) {
          setHasNoReport(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId, userEmail, refreshKey]);

  // 🆕 NEW: Fetch Org averages
  useEffect(() => {
    const fetchTeamAvg = async () => {
      if (!userId && !userEmail) return;
      try {
        let url = "dashboard/manager-team-avg";
        const params: string[] = ["includeSelf=true"];
        if (userId) params.push(`userId=${userId}`);
        if (userEmail) params.push(`email=${encodeURIComponent(userEmail)}`);
        if (selectedRadarDept)
          params.push(`department=${encodeURIComponent(selectedRadarDept)}`);
        if (params.length) url += `?${params.join("&")}`;
        const res = await api.get(url);
        setTeamAvgData(res.data);
      } catch (err) {
        setTeamAvgData(null);
      }
    };
    fetchTeamAvg();
  }, [userId, userEmail, refreshKey, selectedRadarDept]);

  const handlePreview = async () => {
    try {
      setLoadingPreview(true);
      const qParams = new URLSearchParams();
      if (userId) qParams.append("userId", userId);
      if (userEmail) qParams.append("email", userEmail);

      const response = await api.get(
        `/dashboard/preview-pdf-report?${qParams.toString()}`,
        {
          responseType: "blob",
        },
      );
      const url = URL.createObjectURL(response.data);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
      setShowPreview(true);
    } catch (err) {
      toast.error("Failed to generate preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportLoading(true);
      const params: any = {};
      if (userId) params.userId = userId;
      if (userEmail) params.email = userEmail;

      const response = await api.get("/dashboard/export-pdf", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName = `POD360_Report_${userData?.firstName || "Participant"}.pdf`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Export failed:", err);
      toast.error("Failed to generate PDF report");
    } finally {
      setExportLoading(false);
    }
  };

  const [selectedDomain, setSelectedDomain] =
    useState<string>("People Potential");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>("");

  useEffect(() => {
    if (reportData?.scores?.domains?.[selectedDomain]?.subdomains) {
      const firstSub = Object.keys(
        reportData.scores.domains[selectedDomain].subdomains,
      )[0];
      setSelectedSubdomain(firstSub);
    }
  }, [reportData, selectedDomain]);

  // 🆕 NEW: Fetch detailed insights (Pods) when domain changes
  useEffect(() => {
    const fetchDetailedPods = async () => {
      try {
        let url = `dashboard/detailed-insight?domain=${encodeURIComponent(selectedDomain)}&subdomain=${encodeURIComponent(selectedSubdomain)}`;
        if (userEmail) {
          url += `&userId=${userId}&email=${encodeURIComponent(userEmail)}`;
        } else if (userId) {
          url += `&userId=${userId}`;
        }
        const res = await api.get(url);
        setDetailedPods(res.data.pods);
      } catch (error) {
        console.error("Failed to fetch detailed pods:", error);
      }
    };

    if (reportData) {
      fetchDetailedPods();
    }
  }, [
    selectedDomain,
    selectedSubdomain,
    userId,
    userEmail,
    reportData,
    refreshKey,
  ]);

  if (loading) return <SpinnerLoader />;

  // Robust triangle data mapping
  const findDomainScore = (pattern: string) => {
    const key = Object.keys(reportData?.scores?.domains || {}).find((k) =>
      k.toLowerCase().includes(pattern.toLowerCase()),
    );
    return key ? reportData.scores.domains[key].score : 0;
  };

  const triangleData = {
    peoplePotential: findDomainScore("people"),
    operationalSteadiness: findDomainScore("operational"),
    digitalFluency: findDomainScore("digital"),
  };

  const domainScore = reportData?.scores?.domains?.[selectedDomain]?.score || 0;
  const subdomainScore = (() => {
    const subData =
      reportData?.scores?.domains?.[selectedDomain]?.subdomains?.[
        selectedSubdomain
      ];
    if (typeof subData === "object" && subData !== null) {
      return subData.score || 0;
    }
    return Number(subData) || 0;
  })();
  const overallScore = reportData?.scores?.overall || 0;

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    if (reportData?.scores?.domains?.[domain]?.subdomains) {
      const firstSub = Object.keys(
        reportData.scores.domains[domain].subdomains,
      )[0];
      setSelectedSubdomain(firstSub);
    } else {
      setSelectedSubdomain("");
    }
  };

  const handleSubdomainChange = (sub: string) => {
    setSelectedSubdomain(sub);
  };

  // Use dynamic pods if available, fallback to legacy
  const displayInsights = detailedPods?.insights?.mainText
    ? (() => {
        const lines = detailedPods.insights.mainText
          .split(/\r?\n/)
          .filter((l: string) => l.trim().length > 0);
        const hasBullets = lines.some((l: string) => l.includes("•"));
        if (!hasBullets) return lines;
        return lines
          .filter((line: string) => line.includes("•"))
          .map((line: string) => line.replace(/•/g, "").trim())
          .filter((line: string) => line.length > 0);
      })()
    : ["Processing insights..."];

  const finalInsights =
    displayInsights.length > 0
      ? displayInsights
      : ["No specific insights available yet."];

  const displayKRs =
    detailedPods?.objectives?.items?.map((text: string, i: number) => ({
      label: `KR${i + 1}`,
      text: text,
      value: detailedPods.objectives.progress || 0,
    })) || [];

  // const displayRecommendations = detailedPods?.recommendations?.items || [
  //   "No specific recommendations available for this domain yet.",
  // ];

  const topPriorities = Object.entries(reportData?.scores?.domains || {})
    .sort(([, a]: any, [, b]: any) => a.score - b.score)
    .slice(0, 3)
    .map(([name, data]: any) => ({
      name,
      score: Math.round(data.score),
      color: data.score < 50 ? "#D71818" : "#FF8D28",
    }));

  // Derive Radar Data from responses (Aggregated by Domain instead of Subdomain)
  const radarData: RadarData = (() => {
    const domains = Object.keys(reportData?.scores?.domains || {});
    const labels = domains;
    const lScores: number[] = []; // Leader (Blue)
    const mScores: number[] = []; // Manager (Green)
    const eScores: number[] = []; // Employee (Red)

    labels.forEach((domain) => {
      // Pull directly from the fetched org-wide team averages
      const lAvg = teamAvgData?.leaderAvg?.[domain]?.avgScore ?? 0;
      const mAvg = teamAvgData?.managerAvg?.[domain]?.avgScore ?? 0;
      const eAvg = teamAvgData?.employeeAvg?.[domain]?.avgScore ?? 0;

      lScores.push(Number((lAvg / 10).toFixed(1)));
      mScores.push(Number((mAvg / 10).toFixed(1)));
      eScores.push(Number((eAvg / 10).toFixed(1)));
    });

    return { labels, manager: lScores, team: mScores, peer: eScores };
  })();

  // Derive Role Data and Gaps from stakeholders (Alignment Status)
  const roleAverages = (() => {
    // Aggregated averages across ALL domains
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
      if (val < 50) return "#FF5656"; // Needs Attention
      if (val < 75) return "#FEE114"; // At Risk
      return "#30AD43"; // On Track
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
        coachText: "Insufficient data to calculate alignment.",
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

    if (gap > 15) {
      return {
        label: "High Variance",
        status: "Red",
        color: "#D71818",
        bg: "#FFEBEB",
        icon: "solar:shield-warning-bold-duotone",
        gap: gap,
        largestRole,
        lowestRole,
        coachText:
          "High variance detected (> 15%). This indicates Hidden Risk; leadership perception may be disconnected from employee experience.",
      };
    }

    if (gap < 10) {
      return {
        label: "High Alignment",
        status: "Green",
        color: "#30AD43",
        bg: "#F0FDF4",
        icon: "solar:check-circle-bold-duotone",
        gap: gap,
        largestRole,
        lowestRole,
        coachText:
          "Low variance detected. The organization is moving with Aligned Execution.",
      };
    }

    return {
      label: "Moderate Variance",
      status: "Amber",
      color: "#D97706",
      bg: "#FFFBEB",
      icon: "solar:eye-broken-bold-duotone",
      gap: gap,
      largestRole,
      lowestRole,
      coachText:
        "Moderate variance detected. Blind spots may exist — leadership perception requires validation against front-line experience.",
    };
  })();

  const trendData = (() => {
    if (!reportData)
      return { labels: [], manager: [], team: [], descriptions: [] };

    // Convert 0-100 score to /10 scale
    const getScoreForChart = (val: any) =>
      Number((getNumericScore(val) / 10).toFixed(1));

    // If a subdomain is selected, show question-level trend
    if (selectedSubdomain) {
      const qCurrent =
        reportData?.responses?.filter(
          (r: any) =>
            r.domain === selectedDomain && r.subdomain === selectedSubdomain,
        ) || [];

      const qFirst =
        firstReportData?.responses?.filter(
          (r: any) =>
            r.domain === selectedDomain && r.subdomain === selectedSubdomain,
        ) || [];

      const labels = qCurrent.map((_: any, i: number) => `Q${i + 1}`);
      const descriptions = qCurrent.map((q: any) => q.text);

      const latestScores = qCurrent.map((q: any) => getScoreForChart(q));
      const firstScores = qCurrent.map((q: any) => {
        const matched = qFirst.find((fq: any) => fq.text === q.text);
        return matched ? getScoreForChart(matched) : 0;
      });

      return { labels, manager: firstScores, team: latestScores, descriptions };
    }

    // Default: subdomain averages
    const subdomains = Object.keys(
      reportData?.scores?.domains?.[selectedDomain]?.subdomains || {},
    );
    const labels = subdomains.map((_: any, i: number) => `S${i + 1}`);
    const descriptions = subdomains.map((sub) => sub);

    const currentScores = subdomains.map((sub) => {
      const scoreData =
        reportData?.scores?.domains?.[selectedDomain]?.subdomains?.[sub];
      const score = typeof scoreData === "object" ? scoreData.score : scoreData;
      return Number(((score || 0) / 10).toFixed(1));
    });

    const firstScores = subdomains.map((sub) => {
      const scoreData =
        firstReportData?.scores?.domains?.[selectedDomain]?.subdomains?.[sub];
      const score = typeof scoreData === "object" ? scoreData.score : scoreData;
      return Number(((score || 0) / 10).toFixed(1));
    });

    return { labels, manager: firstScores, team: currentScores, descriptions };
  })();

  return (
    <div>
      <div className="bg-white border border-[#448CD2] border-opacity-20  sm:p-6 p-3 rounded-[12px] min-h-[calc(100vh-162px)] shadow-[4px_4px_4px_0px_#448CD21A]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-2xl font-black tracking-tight">
            {userData?.firstName ||
              reportData?.user?.firstName ||
              reportData?.userDetails?.firstName ||
              "Org Head"}{" "}
            {userData?.lastName ||
              reportData?.user?.lastName ||
              reportData?.userDetails?.lastName ||
              ""}
          </h3>

          <div className="flex items-center gap-3">
            {isSuperAdmin && reportData && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="group text-[var(--primary-color)] w-10 h-10 rounded-full border-2 border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                title="Edit AI Insights, Objectives, and Recommendations"
              >
                <Icon icon="lucide:pencil" width="16" />
              </button>
            )}

            <button
              onClick={handlePreview}
              disabled={loadingPreview}
              className=" hidden flex items-center gap-2 h-10 px-4 bg-white border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-xs rounded-full hover:bg-[#edf5fd] transition-all disabled:opacity-50"
            >
              {loadingPreview ? (
                <Icon icon="line-md:loading-loop" width="16" />
              ) : (
                <Icon icon="solar:document-bold-duotone" width="18" />
              )}
              {loadingPreview ? "Loading..." : "Live Lab Preview"}
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={exportLoading}
              className="relative overflow-hidden z-0 text-[var(--white-color)] px-3.5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              // style={{ backgroundColor: "#1a3652" }}
            >
              {exportLoading ? (
                <Icon icon="eos-icons:loading" width="16" />
              ) : (
                <Icon icon="pajamas:export" width="16" height="16" />
              )}
              {exportLoading ? "Exporting..." : "Export PDF Report"}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 mb-10 gap-4 items-center">
          <div className="xl:block hidden"></div>
          <div className="xl:block hidden"></div>
          {isAdmin && <div className="xl:block hidden"></div>}
          {isSuperAdmin && (
            <Select
              className="select-search"
              placeholder="Organization"
              options={orgs.map((o) => ({ value: o, label: o }))}
              value={
                selectedOrg ? { value: selectedOrg, label: selectedOrg } : null
              }
              onChange={(option: any) => {
                setSelectedOrg(option?.value || "");
                setSelectedMember(null);
              }}
            />
          )}

          <Select
            className="select-search"
            placeholder="Select Org Head / Coach"
            options={filteredMembers.map((m) => ({
              value: m._id,
              label: m.name,
              data: m,
            }))}
            value={
              selectedMember
                ? {
                    value: selectedMember._id,
                    label: selectedMember.name,
                  }
                : null
            }
            onChange={(option: any) => {
              const m = option?.data;
              if (m) {
                setSelectedMember(m);
                const roleMapping: Record<string, string> = {
                  superadmin: "org-head",
                  super_admin: "org-head",
                  admin: "org-head",
                  "senior-leader": "senior-leader",
                  leader: "senior-leader",
                  manager: "manager",
                  employee: "employee",
                };
                const reportType =
                  roleMapping[m.role.toLowerCase()] || "employee";

                // Use orgName from searchParams if available
                const currentOrg = searchParams.get("orgName") || "";
                const orgQuery = currentOrg
                  ? `&orgName=${encodeURIComponent(currentOrg)}`
                  : "";

                navigate(
                  `/dashboard/reports/${reportType}?userId=${m._id}&email=${encodeURIComponent(m.email)}${orgQuery}`,
                );
              }
            }}
          />
        </div>

        {hasNoReport ? (
          <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-xl sm:p-20 p-10 rounded-[24px] mt-6 text-center flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
              <Icon
                icon="solar:clipboard-list-broken-bold-duotone"
                width="48"
                className="text-[#448CD2]"
              />
            </div>
            <h2 className="text-3xl font-black text-[#1A3652]">
              No Assessment Results Yet
            </h2>
            <p className="text-neutral-500 max-w-md text-lg">
              This administrator has been invited to take the assessment, but
              they haven't completed it yet. Once they finish, you'll see their
              full performance report here.
            </p>
            <div className="flex gap-4 mt-4">
              <div className="px-6 py-3 bg-blue-50 rounded-xl text-blue-600 font-bold text-sm">
                Status: Pending Completion
              </div>
            </div>
          </div>
        ) : reportData ? (
          <>
            <div className="mt-6 grid lg:grid-cols-2 grid-cols-1  justify-between xl:gap-6 gap-5">
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

                  const getDomainIcon = (idx: number) => {
                    if (idx === 0) return "solar:users-group-rounded-bold";
                    if (idx === 1) return "solar:settings-bold";
                    if (idx === 2) return "solar:laptop-minimalistic-bold";
                    return "solar:star-bold";
                  };

                  return (
                    <>
                      {/* Header Section */}
                      <div className="sm:flex-row justify-between items-start mb-10 gap-4">
                        <div>
                          <div className="flex gap-2">
                            <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize">
                              Organizational Health
                            </h2>
                            <div className="flex items-center">
                              <button
                                type="button"
                                // className="text-[var(--primary-color)]"
                                id="orgHealth"
                              >
                                <Icon icon="ci:info" width="20" height="20" />
                              </button>
                              <Tooltip
                                className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                                anchorSelect="#orgHealth"
                              >
                                <p className="mb-2">
                                  A high-level snapshot of overall performance
                                  averaged across People, Operations, and
                                  Digital.
                                </p>
                                <p>
                                  Indicates whether the organization is on
                                  track, at risk, or needs attention, helping
                                  you quickly prioritize focus areas.
                                </p>
                              </Tooltip>
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
                              At Risk
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
                                    icon={getDomainIcon(idx)}
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
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px]">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex gap-2">
                    <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                      Overall Departmental POD Score
                    </h3>

                    <div className="flex items-center">
                      <button
                        type="button"
                        // className="text-[var(--primary-color)]"
                        id="podScore"
                      >
                        <Icon icon="ci:info" width="20" height="20" />
                      </button>
                      <Tooltip
                        className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                        anchorSelect="#podScore"
                      >
                        <p className="mb-2">
                          Compares how Leaders, Managers, and Employees
                          experience the organization across the three POD
                          domains.
                        </p>

                        <p>
                          Highlights gaps and imbalances that may signal hidden
                          risks to alignment, adoption, and overall performance.
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="relative" data-twe-dropdown-ref>
                    <button
                      className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base 2xl:text-sm text-[14px] font-medium  leading-normal text-[#676767] rounded-[4px]  "
                      type="button"
                      id="dropdownMenuButton1"
                      data-twe-dropdown-toggle-ref
                      aria-expanded="false"
                      data-twe-ripple-init
                      data-twe-ripple-color="light"
                    >
                      {selectedRadarDept || "Organization"}
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
                      {(depts.length > 0
                        ? depts
                        : teamAvgData?.allDepartments || []
                      ).map((dept: string) => (
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
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-6 mb-2">
                  <div
                    className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${hiddenIndices.includes(0) ? "opacity-30" : "opacity-100"}`}
                    onClick={() => toggleHiddenIndex(0)}
                  >
                    <span
                      className="w-5 h-2 rounded-sm inline-block"
                      style={{ background: "rgba(74, 144, 226, 0.7)" }}
                    />
                    <span className="text-xs text-[#474747]">
                      Leader ({teamAvgData?.leaderCount || 0})
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
                      Manager ({teamAvgData?.managerCount || 0})
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
                      Employee ({teamAvgData?.employeeCount || 0})
                    </span>
                  </div>
                </div>
                <div className="relative w-full min-h-[450px]">
                  <MultiRadarChart
                    data={radarData}
                    onLabelSelect={handleDomainChange}
                    datasetLabels={["Leader", "Manager", "Employee"]}
                    hiddenIndices={hiddenIndices}
                  />
                </div>
              </div>
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 hidden rounded-[12px] bg-[#448bd21c]">
                <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Trends Analysis
                </h2>
                <ul className=" mt-4 grid xl:grid-cols-2 grid-cols-1 justify-between gap-4">
                  <li className="flex gap-2 items-center ">
                    <span className="text-base font-medium text-[var(--secondary-color)]">
                      Wellbeing
                    </span>
                    <img src={DownArrow} alt="arrow" />
                  </li>
                  <li className="flex gap-2 items-center ">
                    <span className="text-base font-medium text-[var(--secondary-color)]">
                      Improving fast enough
                    </span>
                    <img src={UpArrow} alt="arrow" />
                  </li>
                  <li className="flex gap-2 items-center ">
                    <span className="text-base font-medium text-[var(--secondary-color)]">
                      Improving fast enough
                    </span>
                    <img src={UpArrow} alt="arrow" />
                  </li>
                  <li className="flex gap-2 items-center ">
                    <span className="text-base font-medium text-[var(--secondary-color)]">
                      Lorem Ipsum
                    </span>
                    <img src={UpArrow} alt="arrow" />
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] ">
                <div>
                  <div className="flex items-center justify-between mb-4 ">
                    <div>
                      <div className="flex gap-2">
                        <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                          Alignment Status
                        </h3>
                        <div className="flex items-center">
                          <button
                            type="button"
                            // className="text-[var(--primary-color)]"
                            id="alignStatus"
                          >
                            <Icon icon="ci:info" width="20" height="20" />
                          </button>
                          <Tooltip
                            className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                            anchorSelect="#alignStatus"
                          >
                            <p>No Data Found.</p>
                          </Tooltip>
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
                            {selectedRadarDept || "Organization Wide"}
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
                                Organization Wide
                              </button>
                            </li>
                            {(depts.length > 0
                              ? depts
                              : teamAvgData?.allDepartments || []
                            ).map((dept: string) => (
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
                      <img src={OuiSecurity} alt="images" />
                    </div>
                  </div>
                  <div className="sm:w-[400px] w-full my-10">
                    <RoleProgressChart data={roleAverages} />
                  </div>
                  <p className="text-base font-medium text-[var(--secondary-color)]  mt-6">
                    <b className="">Largest Gap:</b> Senior Leader VS Employee
                    (+{alignmentInfo.gap})
                  </p>
                  <div className="sm:mt-8 mt-6">
                    <button
                      type="button"
                      className="ml-auto group rounded-full px-6 py-2 flex items-center gap-2 font-bold text-sm uppercase tracking-wider mb-4"
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
            </div>

            <div className="mt-8 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 justify-between xl:gap-6 gap-5">
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full">
                <div className="flex gap-2">
                  <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                    Score by domain
                  </h2>

                  <div className="flex items-center">
                    <button
                      type="button"
                      // className="text-[var(--primary-color)]"
                      id="scoreDomain"
                    >
                      <Icon icon="ci:info" width="20" height="20" />
                    </button>
                    <Tooltip
                      className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                      anchorSelect="#scoreDomain"
                    >
                      <p className="mb-2">
                        Provides a snapshot of performance within the selected
                        POD domain.
                      </p>

                      <p>
                        Indicates whether this area is a strength to leverage or
                        a risk requiring attention, helping you focus where
                        friction may be impacting outcomes.
                      </p>
                    </Tooltip>
                  </div>
                </div>
                <div className="relative mt-2" data-twe-dropdown-ref>
                  <button
                    className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base text-sm font-medium  leading-normal text-[#676767] rounded-[4px]  "
                    type="button"
                    id="dropdownDomain"
                    data-twe-dropdown-toggle-ref
                    aria-expanded="false"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                  >
                    {selectedDomain}
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
                    className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block "
                    aria-labelledby="dropdownDomain"
                    data-twe-dropdown-menu-ref
                  >
                    {reportData?.scores?.domains &&
                      Object.keys(reportData.scores.domains).map((domain) => (
                        <li key={domain}>
                          <button
                            onClick={() => handleDomainChange(domain)}
                            className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                          >
                            {domain}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="w-6 h-2 bg-[#FF5656]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">Low</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="w-6 h-2 bg-[#FEE114]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">
                        Medium
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="w-6 h-2 bg-[#30AD43]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">High</p>
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <SpeedMeter value={domainScore} />
                </div>
              </div>
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full">
                <div className="flex gap-2">
                  <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                    Score by sub-domain
                  </h2>

                  <div className="flex items-center">
                    <button
                      type="button"
                      // className="text-[var(--primary-color)]"
                      id="scoreSubDomain"
                    >
                      <Icon icon="ci:info" width="20" height="20" />
                    </button>
                    <Tooltip
                      className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                      anchorSelect="#scoreSubDomain"
                    >
                      <p className="mb-2">
                        Breaks the domain down into its core components for
                        deeper insight.
                      </p>

                      <p>
                        Helps pinpoint specific drivers of friction or
                        performance gaps, enabling more targeted action and
                        coaching.
                      </p>
                    </Tooltip>
                  </div>
                </div>
                <div className="relative mt-2" data-twe-dropdown-ref>
                  <button
                    className="ml-auto flex items-center bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base text-sm font-medium  leading-normal text-[#676767] rounded-[4px]  "
                    type="button"
                    id="dropdownSubdomain"
                    data-twe-dropdown-toggle-ref
                    aria-expanded="false"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                  >
                    {selectedSubdomain || "Select Sub-domain"}
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
                    className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block"
                    aria-labelledby="dropdownSubdomain"
                    data-twe-dropdown-menu-ref
                  >
                    {reportData?.scores?.domains?.[selectedDomain]
                      ?.subdomains &&
                      Object.keys(
                        reportData.scores.domains[selectedDomain].subdomains,
                      ).map((sub) => (
                        <li key={sub}>
                          <button
                            onClick={() => handleSubdomainChange(sub)}
                            className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="xl-w-6 w-5 h-2 bg-[#FF5656]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">Low</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="xl-w-6 w-5 h-2 bg-[#FEE114]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">
                        Medium
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="xl-w-6 w-5 h-2 bg-[#30AD43]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">High</p>
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <SpeedMeter value={subdomainScore} />
                </div>
              </div>

              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-5 rounded-[12px] h-full bg-white flex flex-col items-center w-full">
                <div className="grid justify-start w-full mb-2">
                  <div className="flex gap-2">
                    <div>
                      <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                        POD-360™ Model
                      </h3>
                    </div>

                    <div className="flex items-center">
                      <button
                        type="button"
                        // className="text-[var(--primary-color)]"
                        id="pod360"
                      >
                        <Icon icon="ci:info" width="20" height="20" />
                      </button>
                      <Tooltip
                        className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                        anchorSelect="#pod360"
                      >
                        <p>
                          Visualizes the balance across People Potential,
                          Operational Steadiness, and Digital Fluency.
                          Highlights strengths, gaps, and misalignment—guiding
                          where to stabilize, optimize, or accelerate efforts.
                        </p>
                      </Tooltip>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] font-medium">
                    Interconnectivity of focus areas
                  </p>
                </div>
                <div className="flex-1 flex flex-col px-2 items-start justify-start py-4 w-full gap-4">
                  <div className="flex-1 max-w-[300px] flex items-center justify-center self-center">
                    <Triangle data={triangleData} />
                  </div>
                  <div className="flex flex-col justify-center gap-3 shrink-0 overflow-y-auto pr-2 custom-scrollbar">
                    {detailedPods?.insights?.modelDescription ? (
                      (() => {
                        const mLines = detailedPods.insights.modelDescription
                          .split(/\r?\n/)
                          .filter((l: string) => l.trim().length > 0);
                        const hasMBullets = mLines.some((l: string) =>
                          l.includes("•"),
                        );
                        const finalMLines = hasMBullets
                          ? mLines
                              .filter((l: string) => l.includes("•"))
                              .map((l: string) => l.replace(/•/g, "").trim())
                              .filter((l: string) => l.length > 0)
                          : mLines;

                        return finalMLines.map(
                          (bullet: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <img
                                src={IconStar}
                                alt="icon"
                                className="w-4 h-4 shrink-0 mt-0.5"
                              />
                              <span className="text-sm font-medium text-[#64748B] leading-snug">
                                {bullet}
                              </span>
                            </div>
                          ),
                        );
                      })()
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <img
                            src={IconStar}
                            alt="icon"
                            className="w-4 h-4 shrink-0"
                          />
                          <span className="text-sm font-medium text-[#64748B]">
                            Capability
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={IconStar}
                            alt="icon"
                            className="w-4 h-4 shrink-0"
                          />
                          <span className="text-sm font-medium text-[#64748B]">
                            Engagement
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={IconStar}
                            alt="icon"
                            className="w-4 h-4 shrink-0"
                          />
                          <span className="text-sm font-medium text-[#64748B]">
                            Confidence
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={IconStar}
                            alt="icon"
                            className="w-4 h-4 shrink-0"
                          />
                          <span className="text-sm font-medium text-[#64748B]">
                            Change resilience
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-[1px] border-[#448CD2] xl:col-span-1 lg:col-span-2 border-opacity-20 p-4  rounded-[12px] w-full hidden">
                <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Performance Analysis
                </h2>
                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="xl-w-6 w-5 h-2 bg-[#448CD2]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">
                        Previous Test
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="xl-w-6 w-5 h-2 bg-[#1A3652]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">
                        Current Test
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <MultiLineChart data={trendData} />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-8">
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
                <div className="flex items-center justify-between ">
                  <div>
                    <div className="flex gap-2 items-start">
                      <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                        {detailedPods?.insights?.title ||
                          `Insight for ${selectedSubdomain || selectedDomain}`}
                      </h3>

                      <div className="flex items-center mt-1">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="insightDomain"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#insightDomain"
                        >
                          <p className="mb-2">
                            Provides a synthesized interpretation of the data
                            within this domain.
                          </p>

                          <p>
                            Highlights what is happening, why it matters, and
                            where to focus next to improve performance and
                            reduce friction.
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                      {detailedPods?.insights?.subtitle ||
                        (selectedSubdomain
                          ? `Detailed analysis for ${selectedSubdomain}`
                          : `Overall analysis for ${selectedDomain}`)}
                    </p>
                  </div>

                  <div>
                    <img src={Streamline} alt="images" />
                  </div>
                </div>
                <div>
                  <ul className="mt-4 space-y-2">
                    {finalInsights.map((insight: string, idx: number) => (
                      <li key={idx} className="feature-list flex gap-2">
                        <img
                          src={IconStar}
                          alt="icon"
                          className="mt-1 w-4 h-4 shrink-0"
                        />
                        <span className="text-sm text-[var(--secondary-color)] font-normal italic">
                          {insight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                        Objectives and Key Results
                      </h3>

                      <div className="flex items-center">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="okrs"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#okrs"
                        >
                          <p className="mb-2">
                            Translates insights into measurable actions and
                            outcomes aligned to strategic priorities.
                          </p>

                          <p>
                            Use this a guide for what to execute, track, and
                            reinforce to drive sustained improvement over time.
                          </p>
                        </Tooltip>
                      </div>
                    </div>{" "}
                    <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                      {detailedPods?.objectives?.subtitle ||
                        "Cultivate high-trust, psychologically safe leadership"}
                    </p>
                  </div>

                  <div>
                    <img src={Hugeicons} alt="images" />
                  </div>
                </div>
                <div className="space-y-6">
                  {/* {displayKRs.map((kr: any, idx: number) => ( */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="text-lg-progress">
                        <CircularProgress
                          value={20}
                          width={60}
                          textColor="#36454F"
                          pathColor="#1A3652"
                          trailColor="#D9D9D9"
                        />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize ">
                          kr1
                        </h2>
                        <p className="text-sm font-normal text-[var(--secondary-color)]">
                          Lorem ipsum dolor sit amet.
                        </p>
                      </div>
                    </div>
                  {/* ))} */}
                  {displayKRs.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      Strategic key results are being generated.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                        Priorities Attention
                      </h3>

                      <div className="flex items-center">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="priAtt"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#priAtt"
                        >
                          <p className="mb-2">
                            Identifies the most critical areas requiring
                            attention based on current results.
                          </p>

                          <p>
                            Provides clear direction on where to stabilize,
                            optimize, or accelerate efforts.
                          </p>
                        </Tooltip>
                      </div>
                    </div>

                    <p className="text-sm font-normal text-[#000000] mt-1">
                      Top 3 priorities based on current data
                    </p>
                  </div>

                  <div>
                    <img src={Iconamoon} alt="images" />
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
                      <p
                        className="text-sm font-bold"
                        style={{ color: item.color }}
                      >
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
          </>
        ) : (
          <ReportEmptyState role="Org Head" />
        )}
      </div>

      <FeedbackEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        domain={selectedDomain}
        subdomain={selectedSubdomain}
        userId={userId}
        userEmail={userEmail}
        rawFeedback={{
          ...detailedPods?.rawFeedback,
          pod360Title: aiInsight?.title,
          pod360Description: aiInsight?.description,
        }}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      <ReportPreviewModal
        show={showPreview}
        onClose={() => {
          setShowPreview(false);
          if (pdfUrl) URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
        onRefresh={handlePreview}
        loading={loadingPreview}
        type="Admin Report Preview"
      />
    </div>
  );
};

export default AdminReport;
