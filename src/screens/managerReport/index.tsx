import { Icon } from "@iconify/react";
import Streamline from "../../../public/static/img/home/streamline-plump_graph-bar-increase.svg";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import Hugeicons from "../../../public/static/img/home/hugeicons_target-02.svg";
import StreamlinePlump from "../../../public/static/img/home/streamline-plump_ai-technology-spark.svg";
import Healthicons from "../../../public/static/img/home/healthicons_i-certificate-paper-outline.svg";
// import LastGraph from "../../../public/static/img/home/last-graph.svg";
// import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
// import kri from "../../../public/static/img/home/kdi1111.svg";
import { Dropdown, Ripple, initTWE, Offcanvas } from "tw-elements";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { toast } from "react-toastify";
import SpinnerLoader from "../../components/spinnerLoader";
import ReportEmptyState from "../../components/reportEmptyState";
// import Sidebar from "../../components/sidebar";
import { useAuth } from "../../context/useAuth";
import ReportPreviewModal from "../../components/reportPreviewModal";
import ScoreBar from "../../components/scoreBar";
import SpeedMeter from "../../components/speedMeter";
import MultiLineChart from "../../charts/multiLineChart";
import CircularProgress from "../../components/percentageCircle";
import Triangle from "../../components/triangle";
// // import { useDynamicTriangleData } from "../../components/triangle/useDynamicTriangleData";
import FeedbackEditorModal from "../../components/feedbackEditorModal";
import RadarChart from "../../charts/radarChart";
import type { RadarData } from "../../charts/radarChart";
import GapBarChart from "../../charts/gapBarChart";
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

const ManagerReport = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const userEmail = searchParams.get("email"); // Guest employee support

  const [reportData, setReportData] = useState<any>(null);
  const [firstReportData, setFirstReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "gaps">("graph");
  const [showAllGaps, setShowAllGaps] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasNoReport, setHasNoReport] = useState(false);
  const [detailedPods, setDetailedPods] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [teamAvgData, setTeamAvgData] = useState<any>(null); // 🆕 Real dept team avg

  // setChartData
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([]); // 🆕 Radar Visibility Toggle
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const toggleHiddenIndex = (idx: number) => {
    setHiddenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = user?.role?.toLowerCase() || "";
  const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";
  const isAdmin = userRole === "admin";
  const isLeader = userRole === "leader";
  const isManager = userRole === "manager";

  const isReportPage = location.pathname.includes("reports");

  const [orgs, setOrgs] = useState<string[]>([]);
  const [depts, setDepts] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const [selectedOrg, setSelectedOrg] = useState<string>(
    searchParams.get("orgName") || user?.orgName || "",
  );
  const [selectedDept, setSelectedDept] = useState<string>(
    searchParams.get("department") || "",
  );
  const [selectedMember, setSelectedMember] = useState<any>(null);

  useEffect(() => {
    if (user?.department && !isAdmin && !isSuperAdmin) {
      setSelectedDept(user.department);
    }
  }, [user, isAdmin, isSuperAdmin, selectedDept]);

  useEffect(() => {
    if (isSuperAdmin) {
      api
        .get("/auth/organizations")
        .then((res) => setOrgs(res.data.organizations));
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (selectedOrg) {
      api.get(`/auth/organization-filters/${selectedOrg}`).then((res) => {
        const fetchedMembers = res.data.members;
        setDepts(res.data.departments);
        setMembers(fetchedMembers);

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
    const memberDept = m.department?.toString().trim().toLowerCase();
    const searchDept = selectedDept?.toString().trim().toLowerCase();

    const matchesDept = !searchDept || memberDept === searchDept;

    // Security: Non-Admins only see their own department
    if (!isAdmin && !isSuperAdmin) {
      const uDept = String(user?.department || "")
        .trim()
        .toLowerCase();
      if (memberDept !== uDept) return false;
    }

    // Strictly show only managers on this page
    return roleLower === "manager" && !!matchesDept;
  });

  // const customSelectStyles = {
  //   control: (provided: any) => ({
  //     ...provided,
  //     backgroundColor: '#EDF5FD',
  //     border: 'none',
  //     borderRadius: '4px',
  //     fontSize: '12px',
  //     minHeight: '32px',
  //     width: '180px',
  //     boxShadow: 'none',
  //     '&:hover': {
  //       backgroundColor: '#E4F0FC'
  //     }
  //   }),
  //   valueContainer: (provided: any) => ({
  //     ...provided,
  //     padding: '0 8px'
  //   }),
  //   singleValue: (provided: any) => ({
  //     ...provided,
  //     color: '#676767',
  //     fontWeight: '500'
  //   }),
  //   placeholder: (provided: any) => ({
  //     ...provided,
  //     color: '#676767',
  //     fontWeight: '500'
  //   }),
  //   dropdownIndicator: (provided: any) => ({
  //     ...provided,
  //     color: '#676767',
  //     padding: '4px',
  //     '&:hover': {
  //       color: '#448CD2'
  //     }
  //   }),
  //   indicatorSeparator: () => ({
  //     display: 'none'
  //   }),
  //   menu: (provided: any) => ({
  //     ...provided,
  //     zIndex: 9999
  //   })
  // };

  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });

    const fetchReport = async () => {
      if (!userId && !userEmail) {
        setLoading(false);
        setHasNoReport(false); // Ensure this is false if no user is selected
        return;
      }
      setLoading(true);
      setHasNoReport(false); // Reset hasNoReport before fetching
      try {
        let url = `dashboard/manager`; // Kept as manager for ManagerReport
        if (userEmail) {
          url = `dashboard/manager?userId=${userId}&email=${encodeURIComponent(userEmail)}`;
        } else if (userId) {
          url = `dashboard/manager?userId=${userId}`;
        }
        const res = await api.get(url);
        setReportData(res.data.report);
        setFirstReportData(res.data.firstReport || res.data.report);
        setUserData(res.data.user);
        setAiInsight(res.data.aiInsight);
        setHasNoReport(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setHasNoReport(true); // Set hasNoReport to true on 404
        }
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId, userEmail, refreshKey]);

  // 🆕 Fetch real team avg from backend whenever the viewed manager changes
  useEffect(() => {
    const fetchTeamAvg = async () => {
      if (!userId && !userEmail) return;
      try {
        let url = "dashboard/manager-team-avg";
        const params: string[] = [];
        if (userId) params.push(`userId=${userId}`);
        if (userEmail) params.push(`email=${encodeURIComponent(userEmail)}`);
        if (params.length) url += `?${params.join("&")}`;
        const res = await api.get(url);
        setTeamAvgData(res.data);
      } catch (err) {
        // Not critical — silently fall back to empty
        setTeamAvgData(null);
      }
    };
    fetchTeamAvg();
  }, [userId, userEmail, refreshKey]);

  // Handle label selection from Radar Chart
  const handleRadarChartSelection = (label: string) => {
    setSelectedLabel(label);
    setSelectedSubdomain(label); // Sync radar click with subdomain insight fetching
  };

  // Dynamic selection states
  const [selectedDomain, setSelectedDomain] =
    useState<string>("People Potential");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>("");

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

      // Sort questions to ensure consistent order
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

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    // 🆕 Auto-select first subdomain when domain changes to ensure SpeedMeter updates
    if (reportData?.scores?.domains?.[domain]?.subdomains) {
      const firstSub = Object.keys(
        reportData.scores.domains[domain].subdomains,
      )[0];
      setSelectedSubdomain(firstSub);
    } else {
      setSelectedSubdomain("");
    }
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

  const displayRecommendations = detailedPods?.recommendations?.items || [
    "No specific recommendations available for this domain yet.",
  ];

  // Calculate radar data dynamically from responses
  // Manager series = manager's OWN subdomain scores (self-assessment)
  // Team series    = REAL dept avg from backend
  // Peer series    = Org-wide benchmark avg (other departments)
  const radarData: RadarData = (() => {
    const subdomains = Object.keys(
      reportData?.scores?.domains?.[selectedDomain]?.subdomains || {},
    );
    const labels = subdomains;
    const mScores: number[] = [];
    const tScores: number[] = [];

    labels.forEach((sub) => {
      // Manager self-assessment score
      const managerSubData =
        reportData?.scores?.domains?.[selectedDomain]?.subdomains?.[sub];
      const mRaw =
        typeof managerSubData === "object"
          ? (managerSubData?.score ?? 0)
          : (managerSubData ?? 0);
      mScores.push(Number((mRaw / 10).toFixed(1)));

      // Employee avg (same department) - mapped to 'team' dataset for colors
      const employeeSubScore =
        teamAvgData?.employeeAvg?.[selectedDomain]?.subdomains?.[sub] ?? null;
      tScores.push(
        employeeSubScore !== null
          ? Number((employeeSubScore / 10).toFixed(1))
          : 0,
      );
    });

    return { labels, manager: mScores, team: tScores, peer: [] };
  })();

  const deltaScores = radarData.team.map((t, i) =>
    Number((t - radarData.manager[i]).toFixed(1)),
  );

  // 🆕 Perception Gap Highlights
  const gapInsights = radarData.labels.map((label, i) => {
    const mScore = radarData.manager[i];
    const tScore = radarData.team[i];
    const gapVal = Number((mScore - tScore).toFixed(1)); // Manager - Team
    const absGap = Math.abs(gapVal);
    const direction =
      gapVal > 0 ? "Manager higher" : gapVal < 0 ? "Team higher" : "Aligned";

    let severity: "Small" | "Medium" | "Large" = "Small";
    if (absGap >= 2.0) severity = "Large";
    else if (absGap >= 1.0) severity = "Medium";

    const indicator =
      severity === "Large"
        ? "Action Required"
        : severity === "Medium"
          ? "Watch"
          : "Informational";
    const color =
      severity === "Large"
        ? "#E74C3C"
        : severity === "Medium"
          ? "#F39C12"
          : "#3498DB";
    const bgColor =
      severity === "Large"
        ? "#FDECEA"
        : severity === "Medium"
          ? "#FFF5E6"
          : "#EBF5FB";

    let insight = "";
    if (gapVal > 0) {
      insight = `${direction.split(" ")[0]}s perceive higher ${label.toLowerCase()} than employees, indicating potential disconnect in how it is experienced on the ground.`;
      if (label.toLowerCase().includes("adaptability")) {
        insight =
          "Managers perceive higher adaptability than employees, indicating potential disconnect in how change is experienced on the ground.";
      }
    } else if (gapVal < 0) {
      insight = `Employees perceive higher ${label.toLowerCase()} than managers, suggesting managers may be underestimating team strengths in this area.`;
    } else {
      insight = `Managers and employees are perfectly aligned on ${label.toLowerCase()}.`;
    }

    return {
      label,
      gapVal,
      absGap,
      direction,
      indicator,
      color,
      bgColor,
      insight,
      severity,
      teamScore: tScore,
      managerScore: mScore,
    };
  });

  const gapInsightsList = gapInsights.filter((g) => g.absGap > 0);
  const topGapsShown = gapInsightsList
    .sort((a, b) => b.absGap - a.absGap)
    .slice(0, 3);
  const otherGaps = gapInsightsList
    .sort((a, b) => b.absGap - a.absGap)
    .slice(3);

  return (
    <div>
      <div className="bg-white border border-[#448CD2] border-opacity-20  sm:p-6 p-3 rounded-[12px] min-h-[calc(100vh-162px)] shadow-[4px_4px_4px_0px_#448CD21A]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-2xl font-black tracking-tight">
            {userData?.firstName ||
              reportData?.user?.firstName ||
              reportData?.userDetails?.firstName ||
              "Manager"}{" "}
            {userData?.lastName ||
              reportData?.user?.lastName ||
              reportData?.userDetails?.lastName ||
              ""}
          </h3>

          <div className="flex items-center gap-3">
            {(isSuperAdmin || isAdmin) && reportData && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="group text-[var(--primary-color)] w-10 h-10 rounded-full border-2 border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                title="Edit AI Insights, Objectives, and Recommendations"
              >
                <Icon icon="lucide:pencil" width="16" />
                {/* Edit Feedback */}
              </button>
            )}

            <button
              onClick={handlePreview}
              disabled={loadingPreview}
              className="flex items-center gap-2 h-10 px-4 bg-white border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-xs rounded-full hover:bg-[#edf5fd] transition-all disabled:opacity-50 hidden"
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
              style={{ backgroundColor: "#1a3652" }}
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
          {isAdmin && <div className="xl:block hidden"></div>}

          {isLeader && <div className="xl:block hidden"></div>}
          {isLeader && <div className="xl:block hidden"></div>}

          {isManager && <div className="xl:block hidden"></div>}

          {isManager && <div className="xl:block hidden"></div>}

          {isSuperAdmin && (
            <Select
              className="select-search"
              // styles={customSelectStyles}
              placeholder="Organization"
              options={orgs.map((o) => ({ value: o, label: o }))}
              value={
                selectedOrg ? { value: selectedOrg, label: selectedOrg } : null
              }
              onChange={(option: any) => {
                setSelectedOrg(option?.value || "");
                setSelectedDept("");
                setSelectedMember(null);
              }}
            />
          )}

          {(isSuperAdmin || isAdmin) && (
            <Select
              className="select-search"
              placeholder="Select Department"
              options={[
                { value: "", label: "All Departments" },
                ...[...depts].sort().map((d) => ({ value: d, label: d })),
              ]}
              value={
                [
                  { value: "", label: "All Departments" },
                  ...depts.map((d) => ({ value: d, label: d })),
                ].find((o) => o.value === selectedDept) || null
              }
              onChange={(option: any) => {
                setSelectedDept(option?.value || "");
                setSelectedMember(null);
              }}
            />
          )}

          {(isSuperAdmin || isAdmin || isReportPage) && (
            <Select
              // styles={customSelectStyles}
              className="select-search"
              placeholder="Select Manager"
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
          )}
        </div>

        {hasNoReport ? (
          <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-xl sm:p-20 p-10 rounded-[24px] mt-10 text-center flex flex-col items-center gap-6">
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
              This manager has been invited to take the assessment, but they
              haven't completed it yet. Once they finish, you'll see their full
              performance report here.
            </p>
            <div className="flex gap-4 mt-4">
              <div className="px-6 py-3 bg-blue-50 rounded-xl text-blue-600 font-bold text-sm">
                Status: Pending Completion
              </div>
            </div>
          </div>
        ) : reportData ? (
          <>
            <div className="mt-6 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 justify-between xl:gap-6 gap-5">
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full ">
                <div className="flex gap-2">
                  <h2 className="sm:text-xl text-lg font-bold capitalize">
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
                    id="dropdownMenuButton1"
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
                    className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block"
                    aria-labelledby="dropdownMenuButton1"
                    data-twe-dropdown-menu-ref
                  >
                    {Object.keys(reportData?.scores?.domains || {}).map((d) => (
                      <li key={d}>
                        <button
                          onClick={() => handleDomainChange(d)}
                          className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                          data-twe-dropdown-item-ref
                        >
                          {d}
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
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full ">
                <div className="flex gap-2">
                  <h2 className="sm:text-xl text-lg font-bold capitalize">
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
                    className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base text-sm font-medium  leading-normal text-[#676767] rounded-[4px]  "
                    type="button"
                    id="dropdownMenuButton1"
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
                    aria-labelledby="dropdownMenuButton1"
                    data-twe-dropdown-menu-ref
                  >
                    {Object.keys(
                      reportData?.scores?.domains?.[selectedDomain]
                        ?.subdomains || {},
                    ).map((s) => (
                      <li key={s}>
                        <button
                          onClick={() => setSelectedSubdomain(s)}
                          className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                          data-twe-dropdown-item-ref
                        >
                          {s}
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

              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-5 rounded-[12px] h-full bg-white flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-2">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold capitalize">
                        POD-360™ Model
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
                            Visualizes the balance across People Potential,
                            Operational Steadiness, and Digital Fluency.
                          </p>

                          <p>
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
                <div className="w-full mt-2 pt-4 border-t border-[#F1F5F9] hidden grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                      People
                    </p>
                    <p className="text-sm font-black text-[var(--secondary-color)]">
                      {Math.round(findDomainScore("people"))}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                      Operational
                    </p>
                    <p className="text-sm font-black text-[var(--secondary-color)]">
                      {Math.round(findDomainScore("operational"))}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                      Digital
                    </p>
                    <p className="text-sm font-black text-[var(--secondary-color)]">
                      {Math.round(findDomainScore("digital"))}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-[1px] border-[#448CD2] xl:col-span-1 lg:col-span-2 border-opacity-20 p-4 rounded-[12px] w-full hidden">
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
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                        {detailedPods?.insights?.title ||
                          `Insight for ${selectedSubdomain || selectedDomain}`}
                      </h3>

                      <div className="flex items-center">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="podInsightDomain"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#podInsightDomain"
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
                    <img src={Streamline} alt="images" className="w-8 h-8" />
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
                <div className="flex items-center justify-between ">
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
                    </div>
                    <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                      Lead team improvements in this domain area
                    </p>
                  </div>
                  <div>
                    <img src={Hugeicons} alt="images" className="w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-6">
                  {displayKRs.map((kr: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 mt-4">
                      <div className="text-lg-progress">
                        <CircularProgress
                          value={kr.value}
                          width={60}
                          textColor="#36454F"
                          pathColor="#1A3652"
                          trailColor="#D9D9D9"
                        />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize ">
                          {kr.label}
                        </h2>
                        <p className="text-sm font-normal text-[var(--secondary-color)]">
                          {kr.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {displayKRs.length === 0 && (
                    <p className="text-sm text-gray-500 italic mt-6 font-medium">
                      No strategic objectives have been defined for this area yet.
                    </p>
                  )}
                </div>
                <div></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
              {/* <div className="border-[1px] border-[#448CD2] border-opacity-20 p-5 rounded-[12px] h-full bg-white flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-2">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold capitalize">
                        POD-360™ Model
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
                            Visualizes the balance across People Potential,
                            Operational Steadiness, and Digital Fluency.
                          </p>

                          <p>
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
                <div className="w-full mt-2 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                      People
                    </p>
                    <p className="text-sm font-black text-[var(--secondary-color)]">
                      {Math.round(findDomainScore("people"))}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                      Operational
                    </p>
                    <p className="text-sm font-black text-[var(--secondary-color)]">
                      {Math.round(findDomainScore("operational"))}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                      Digital
                    </p>
                    <p className="text-sm font-black text-[var(--secondary-color)]">
                      {Math.round(findDomainScore("digital"))}%
                    </p>
                  </div>
                </div>
              </div> */}
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
                <div className="flex items-center justify-between ">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold capitalize">
                        Coaching Tips
                      </h3>
                      <div className="flex items-center">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="managerTips"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#managerTips"
                        >
                          <p className="mb-2">
                            Provides targeted, actionable guidance to support
                            leaders and teams in improving performance and
                            adoption.
                          </p>
                          <p>
                            Aligned to key capability areas these tips help
                            address friction, build consistency, and sustain
                            progress across the organization.
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      src={StreamlinePlump}
                      alt="images"
                      className="w-8 h-8"
                    />
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {displayKRs.map((kr: any, idx: number) => (
                    <li key={idx} className="feature-list flex gap-2">
                      <img
                        src={IconStar}
                        alt="icon"
                        className="mt-1 w-4 h-4 shrink-0"
                      />
                      <span className="text-sm text-[var(--secondary-color)] font-normal">
                        {kr.text}
                      </span>
                    </li>
                  ))}
                  {displayKRs.length === 0 && (
                    <li className="text-xs text-gray-400 italic">
                      No coaching tips available for this domain.
                    </li>
                  )}
                </ul>
                <div></div>
              </div>

              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
                <div className="flex items-center justify-between ">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold capitalize">
                        Recommended Development Programs
                      </h3>
                      <div className="flex items-center">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="tbdOffering"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#tbdOffering"
                        >
                          <p>
                            Highlights curated programs and resources aligned to
                            your results. These offerings are designed to
                            address key gaps and strengthen capabilities.
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img src={Healthicons} alt="images" className="w-8 h-8" />
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {displayRecommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="feature-list flex gap-2">
                      <img
                        src={IconStar}
                        alt="icon"
                        className="mt-1 w-4 h-4 shrink-0"
                      />
                      <span className="text-sm text-[var(--secondary-color)] font-normal">
                        {rec}
                      </span>
                    </li>
                  ))}
                </ul>
                <div></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px]">
                <div className="flex items-center justify-between flex-wrap gap-y-5">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold capitalize">
                        Manager VS Team Gap
                      </h3>
                      <div className="flex items-center">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="teamGap"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#teamGap"
                        >
                          <p>
                            Reveals differences between manager and employee
                            experiences across key capabilities and identifies
                            where perception gaps may be impacting alignment,
                            trust, and effective execution at the team level.
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  {/* 🆕 Premium Tab Switcher */}
                  {/* <div className="flex justify-center mb-8 p-4"> */}
                  <div className="inline-flex bg-[var(--light-primary-color)] py-1 px-1.5 rounded-full border border-slate-200 shadow-inner">
                    <button
                      onClick={() => setActiveTab("graph")}
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "graph" ? "bg-white text-[#448CD2] shadow-sm scale-105" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Radar View
                    </button>
                    <button
                      onClick={() => setActiveTab("gaps")}
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "gaps" ? "bg-white text-[#448CD2] shadow-sm scale-105" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Gap Insights
                    </button>
                  </div>
                  {/* </div> */}
                </div>
                <div className="flex flex-wrap justify-center mt-8 gap-x-4 gap-y-1 mt-2 mb-2">
                  <div
                    className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${hiddenIndices.includes(0) ? "opacity-30" : "opacity-100"}`}
                    onClick={() => toggleHiddenIndex(0)}
                  >
                    <span
                      className="w-5 h-2 rounded-sm inline-block"
                      style={{ background: "rgba(74, 144, 226, 0.7)" }}
                    />
                    <span className="text-xs text-[#474747]">Manager</span>
                  </div>
                  {(teamAvgData?.employeeCount > 0 || true) && (
                    <div
                      className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${hiddenIndices.includes(1) ? "opacity-30" : "opacity-100"}`}
                      onClick={() => toggleHiddenIndex(1)}
                    >
                      <span
                        className="w-5 h-2 rounded-sm inline-block"
                        style={{ background: "rgba(46, 204, 113, 0.7)" }}
                      />
                      <span className="text-xs text-[#474747]">
                        Employee ({teamAvgData?.employeeCount || 0})
                      </span>
                    </div>
                  )}
                </div>

                <div className="transition-all duration-500 overflow-visible">
                  {activeTab === "graph" ? (
                    <div className="flex-1 w-full relative py-2 overflow-visible min-h-[550px]">
                      <RadarChart
                        data={radarData}
                        selectedLabel={selectedLabel}
                        onLabelSelect={handleRadarChartSelection}
                        datasetLabels={["Manager", "Employee"]}
                        hiddenIndices={hiddenIndices}
                      />
                    </div>
                  ) : (
                    <div className="py-4 space-y-10">
                      <div className="flex flex-col items-center mb-6 text-center"></div>

                      <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto pb-12">
                        {(showAllGaps ? gapInsightsList : topGapsShown).map(
                          (gap, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                            >
                              <div className="p-6 flex flex-col w-full">
                                {/* Header: Title & Severity & Gap */}
                                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                                  <div className="flex items-center gap-3">
                                    <h5 className="text-[13px] font-black text-[#1A3652] uppercase tracking-[0.05em]">
                                      {gap.label}
                                    </h5>
                                    <span
                                      className="text-[9px] font-black px-2 py-0.5 rounded text-white uppercase tracking-widest"
                                      style={{ backgroundColor: gap.color }}
                                    >
                                      {gap.indicator} Priority
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      GAP:
                                    </span>
                                    <span
                                      className="text-base font-black"
                                      style={{ color: gap.color }}
                                    >
                                      {gap.absGap}pt
                                    </span>
                                  </div>
                                </div>

                                {/* Data Section: Compact Bars */}
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                  {/* Team */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      <span>Team Alignment</span>
                                      <span className="text-[#2ECC71]">
                                        {(gap.teamScore * 10).toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-[#2ECC71] rounded-full transition-all duration-1000"
                                        style={{
                                          width: `${gap.teamScore * 10}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Manager */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      <span>Manager View</span>
                                      <span className="text-[#4A90E2]">
                                        {(gap.managerScore * 10).toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-[#4A90E2] rounded-full transition-all duration-1000"
                                        style={{
                                          width: `${gap.managerScore * 10}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>

                                {/* Insight: Simple Text */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                  <p className="text-[11px] text-[#1A3652]/80 font-semibold leading-relaxed">
                                    {gap.insight}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}

                        {otherGaps.length > 0 && !showAllGaps && (
                          <button
                            onClick={() => setShowAllGaps(true)}
                            className="flex items-center justify-center gap-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#448CD2] transition-colors bg-white rounded-2xl border border-dashed border-slate-200"
                          >
                            <Icon icon="solar:double-alt-arrow-down-bold" />
                            Expand {otherGaps.length} more Alignment Insights
                          </button>
                        )}

                        {gapInsightsList.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-[#448CD210] rounded-2xl gap-4">
                            <Icon
                              icon="solar:star-fall-bold-duotone"
                              width="40"
                              className="text-[#30AD43]/30"
                            />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">
                              Perfect Synchronization Complete
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
                <div className="flex items-center justify-between ">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="sm:text-xl text-lg font-bold capitalize">
                        Delta Breakdown
                      </h3>
                      <div className="flex items-center">
                        <button
                          type="button"
                          // className="text-[var(--primary-color)]"
                          id="deltaBreakdown"
                        >
                          <Icon icon="ci:info" width="20" height="20" />
                        </button>
                        <Tooltip
                          className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                          anchorSelect="#deltaBreakdown"
                        >
                          <p className="mb-2">
                            Measures the difference between manager and employee
                            experiences across key capability areas.
                          </p>
                          <p>
                            Highlights where misalignment exists, how
                            significant it is, and where it may be impacting
                            execution, adoption, and overall performance.
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-sm text-[#64748B] mt-1 mb-6 ">
                      {userData?.firstName ||
                        reportData?.user?.firstName ||
                        "Manager"}
                      :{" "}
                      <span className="font-bold text-[#448CD2]">
                        {(
                          (radarData.manager.reduce((a, b) => a + b, 0) /
                            (radarData.manager.length || 1)) *
                          10
                        ).toFixed(0)}
                        %
                      </span>{" "}
                      Domain Avg vs Employee Avg:{" "}
                      <span className="font-bold text-[#E74C3C]">
                        {(
                          (radarData.team.reduce((a, b) => a + b, 0) /
                            (radarData.team.length || 1)) *
                          10
                        ).toFixed(0)}
                        %
                      </span>
                    </p>
                  </div>
                </div>
                <div className="relative w-full min-h-[450px]">
                  <GapBarChart
                    labels={radarData.labels}
                    deltaScores={deltaScores}
                    selectedLabel={selectedLabel}
                    managerScores={radarData.manager}
                    employeeScores={radarData.team}
                  />
                </div>
              </div>
            </div>

            <div className="last-graph mt-8 bg-white p-6 border border-[#448CD2] border-opacity-20 rounded-[12px] hidden">
              <div className="flex gap-2">
                <h3 className="text-lg font-bold text-[var(--secondary-color)]  capitalize text-left">
                  Overall {selectedDomain} Domain Score —{" "}
                  {userData?.firstName ||
                    reportData?.user?.firstName ||
                    "Manager"}
                </h3>
                <div className="flex items-center">
                  <button
                    type="button"
                    // className="text-[var(--primary-color)]"
                    id="overallScore"
                  >
                    <Icon icon="ci:info" width="20" height="20" />
                  </button>
                  <Tooltip
                    className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs"
                    anchorSelect="#overallScore"
                  >
                    <p>No Data Found.</p>
                  </Tooltip>
                </div>
              </div>

              <div className="p-4 pt-0 ">
                <ScoreBar
                  score={Math.round(domainScore)}
                  label={`${userData?.firstName || reportData?.user?.firstName || "Manager"} ${userData?.lastName || reportData?.user?.lastName || ""}`}
                />
              </div>
            </div>
          </>
        ) : (
          <ReportEmptyState role="Manager" />
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
        type="Manager Report Preview"
      />
    </div>
  );
};
export default ManagerReport;
