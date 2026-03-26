// import { Icon } from "@iconify/react";
import Streamline from "../../../public/static/img/home/streamline-plump_graph-bar-increase.svg";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import Hugeicons from "../../../public/static/img/home/hugeicons_target-02.svg";
// import StreamlinePlump from "../../../public/static/img/home/streamline-plump_ai-technology-spark.svg";
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
import { useAuth } from "../../context/useAuth";
import { Icon } from "@iconify/react";
import SpeedMeter from "../../components/speedMeter";
import CircularProgress from "../../components/percentageCircle";
import Triangle from "../../components/triangle";
import ReportEmptyState from "../../components/reportEmptyState";
import FeedbackEditorModal from "../../components/feedbackEditorModal";
import ReportPreviewModal from "../../components/reportPreviewModal";
import { Tooltip } from "react-tooltip";

// ------ CONSTANTS ------
const ROLE_DOMAIN_SUBDOMAINS: Record<string, Record<string, string[]>> = {
  admin: {
    "People Potential": [
      "Psychological Health & Safety",
      "Mindset & Adaptability",
      "Relational & Emotional Intelligence",
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management",
    ],
    "Digital Fluency": [
      "Data, AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset, Confidence and Change Readiness",
      "Tool & System Proficiency",
    ],
  },
  leader: {
    "People Potential": [
      "Psychological Health & Safety",
      "Mindset & Adaptability",
      "Relational & Emotional Intelligence",
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management",
    ],
    "Digital Fluency": [
      "Data, AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset, Confidence and Change Readiness",
      "Tool & System Proficiency",
    ],
  },
  manager: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence",
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management",
    ],
    "Digital Fluency": [
      "Data, AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset, Confidence and Change Readiness",
      "Tool & System Proficiency",
    ],
  },
  employee: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence",
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management",
    ],
    "Digital Fluency": [
      "Data, AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset, Confidence and Change Readiness",
      "Tool & System Proficiency",
    ],
  },
};

const EmployeeReport = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const userEmail = searchParams.get("email");
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

  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasNoReport, setHasNoReport] = useState(false);
  const [detailedPods, setDetailedPods] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null); // Kept state but will hide UI
  const [exportLoading, setExportLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Dynamic selection states
  const [selectedDomain, setSelectedDomain] =
    useState<string>("People Potential");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(
    "Mindset & Adaptability",
  );

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

    return roleLower === "employee" && !!matchesDept;
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
  //   }),F
  //   menu: (provided: any) => ({
  //     ...provided,
  //     zIndex: 9999
  //   })
  // };

  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });

    const fetchReport = async () => {
      // Early exit if no target user specified in URL and no logged in user fallback needed
      // (Admin viewing report needs a target)
      if (!userId && !userEmail) {
        setLoading(false);
        setHasNoReport(false);
        return;
      }

      setLoading(true);
      setHasNoReport(false);
      try {
        let url = `dashboard/employee`;
        if (userEmail) {
          url = `dashboard/employee?userId=${userId}&email=${encodeURIComponent(userEmail)}`;
        } else if (userId) {
          url = `dashboard/employee?userId=${userId}`;
        }
        const res = await api.get(url);
        setReportData(res.data.report);
        setUserData(res.data.user);
        setAiInsight(res.data.aiInsight);
        setHasNoReport(false);

        const domainKeys = Object.keys(ROLE_DOMAIN_SUBDOMAINS.employee);
        const defaultDomain =
          domainKeys.find((k) => k.toLowerCase().includes("people")) ||
          domainKeys[0];
        setSelectedDomain(defaultDomain);

        const possibleSubs =
          ROLE_DOMAIN_SUBDOMAINS.employee[defaultDomain] || [];
        if (possibleSubs.length > 0) setSelectedSubdomain(possibleSubs[0]);
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

  // 🆕 NEW: Fetch detailed insights (Pods) when domain changes
  useEffect(() => {
    const fetchDetailedPods = async () => {
      try {
        // Build URL: pass email for guest employees, and include subdomain
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
      } finally {
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

  // Re-initialize TW-Elements after data is loaded and components are rendered
  // This useEffect is now redundant as initTWE is called in the main fetchReport useEffect
  // useEffect(() => {
  //   if (!loading) {
  //     setTimeout(() => {
  //       initTWE({ Ripple, Offcanvas, Dropdown });
  //     }, 0);
  //   }
  // }, [loading]);

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    const possibleSubs = ROLE_DOMAIN_SUBDOMAINS.employee[domain] || [];
    if (possibleSubs.length > 0) {
      setSelectedSubdomain(possibleSubs[0]);
    } else {
      setSelectedSubdomain("");
    }
  };

  if (loading) return <SpinnerLoader />; // Assuming SpinnerLoader is defined elsewhere

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
  const subdomainScore =
    reportData?.scores?.domains?.[selectedDomain]?.subdomains?.[
    selectedSubdomain
    ] || 0;

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

  return (
    <div className="flex flex-col gap-6">
      {/* Main Header & Filters Card */}
      <div className="bg-white border border-[#448CD2] border-opacity-20  sm:p-6 p-3 rounded-[12px] min-h-[calc(100vh-162px)] shadow-[4px_4px_4px_0px_#448CD21A]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <h3 className="text-2xl font-black tracking-tight">
            {userData?.firstName ||
              reportData?.user?.firstName ||
              reportData?.userDetails?.firstName ||
              "Employee"}{" "}
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
                {/* Edit Feedback */}
              </button>
            )}

            <button
              onClick={handlePreview}
              disabled={loadingPreview}
              className="flex items-center gap-2 h-10 px-4 bg-white border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-xs rounded-full hover:bg-[#edf5fd] transition-all disabled:opacity-50"
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
                ...depts.map((d) => ({ value: d, label: d })),
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
              className="select-search"
              placeholder="Select Employee"
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
          <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-xl sm:p-20 p-10 rounded-[24px] mt-4 text-center flex flex-col items-center gap-6">
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
              This person has been invited to take the assessment, but they
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
              {/* Domain Score Section */}
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full bg-white">
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
                    className="ml-auto flex items-center bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base text-sm font-medium leading-normal text-[#676767] rounded-[4px]"
                    type="button"
                    id="dropdownMenuButtonDomain"
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
                    aria-labelledby="dropdownMenuButtonDomain"
                    data-twe-dropdown-menu-ref
                  >
                    {Object.keys(ROLE_DOMAIN_SUBDOMAINS.employee).map((d) => (
                      <li key={d}>
                        <button
                          onClick={() => handleDomainChange(d)}
                          className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-[#EDF5FD]"
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
                    <p className="w-6 h-2 bg-[#FF5656]"></p>
                    <p className="text-sm font-normal text-[#474747]">Low</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="w-6 h-2 bg-[#FEE114]"></p>
                    <p className="text-sm font-normal text-[#474747]">Medium</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="w-6 h-2 bg-[#30AD43]"></p>
                    <p className="text-sm font-normal text-[#474747]">High</p>
                  </div>
                </div>
                <div className="p-10 flex justify-center">
                  <SpeedMeter value={domainScore} />
                </div>
              </div>

              {/* Subdomain Score Section */}
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] w-full bg-white">
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
                    className="ml-auto flex items-center bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base text-sm font-medium leading-normal text-[#676767] rounded-[4px]"
                    type="button"
                    id="dropdownMenuButtonSub"
                    data-twe-dropdown-toggle-ref
                    aria-expanded="false"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                  >
                    {selectedSubdomain}
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
                    aria-labelledby="dropdownMenuButtonSub"
                    data-twe-dropdown-menu-ref
                  >
                    {(
                      ROLE_DOMAIN_SUBDOMAINS.employee[selectedDomain] || []
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
                    <p className="w-6 h-2 bg-[#FF5656]"></p>
                    <p className="text-sm font-normal text-[#474747]">Low</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="w-6 h-2 bg-[#FEE114]"></p>
                    <p className="text-sm font-normal text-[#474747]">Medium</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="w-6 h-2 bg-[#30AD43]"></p>
                    <p className="text-sm font-normal text-[#474747]">High</p>
                  </div>
                </div>
                <div className="p-10 flex justify-center">
                  <SpeedMeter value={subdomainScore} />
                </div>
              </div>

              {/* Triangle Model Section */}
              <div className="xl:col-span-1 lg:col-span-2">
                <div className="border-[1px] border-[#448CD2] border-opacity-20 p-5 rounded-[12px] h-full bg-white flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-2 text-left">
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
                              Highlights strengths, gaps, and
                              misalignment—guiding where to stabilize, optimize,
                              or accelerate efforts.
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                      <p className="text-xs text-[#64748B] font-medium">
                        Interconnectivity of focus areas
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center py-4 w-full gap-6">
                    <div className="max-w-[240px]">
                      <Triangle data={triangleData} />
                    </div>
                    <div className="grid grid-cols-1 gap-3 w-full px-4">
                      {(() => {
                        const mText = detailedPods?.insights?.modelDescription;
                        if (!mText)
                          return [
                            "Capability",
                            "Engagement",
                            "Confidence",
                            "Resilience",
                          ];
                        const mLines = mText
                          .split(/\r?\n/)
                          .filter((l: string) => l.trim().length > 0);
                        const hasBullets = mLines.some((l: string) =>
                          l.includes("•"),
                        );
                        if (hasBullets) {
                          return mLines
                            .filter((l: string) => l.includes("•"))
                            .map((l: string) => l.replace(/•/g, "").trim())
                            .filter((l: string) => l.length > 0);
                        }
                        return mLines;
                      })().map((bullet: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <img
                            src={IconStar}
                            alt="icon"
                            className="w-4 h-4 shrink-0 mt-0.5"
                          />
                          <span className="text-sm font-medium text-[#64748B] text-left">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full mt-4 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                        People
                      </p>
                      <p className="text-sm font-black text-[#1A3652]">
                        {Math.round(triangleData.peoplePotential)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                        Operational
                      </p>
                      <p className="text-sm font-black text-[#1A3652]">
                        {Math.round(triangleData.operationalSteadiness)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                        Digital
                      </p>
                      <p className="text-sm font-black text-[#1A3652]">
                        {Math.round(triangleData.digitalFluency)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-6">
              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-6 rounded-[12px] bg-[#EDF5FD]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="text-xl font-bold capitalize">
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
                    <p className="text-xs text-[#64748B] font-medium">
                      {detailedPods?.insights?.subtitle ||
                        (selectedSubdomain
                          ? `Detailed analysis for ${selectedSubdomain}`
                          : `Overall analysis for ${selectedDomain}`)}
                    </p>
                  </div>
                  <img src={Streamline} alt="images" className="w-8 h-8" />
                </div>
                <ul className="space-y-3">
                  {finalInsights.map((insight: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <img
                        src={IconStar}
                        alt="icon"
                        className="w-4 h-4 mt-1 shrink-0"
                      />
                      <span className="text-sm text-[#1A3652] font-medium leading-relaxed">
                        {insight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-[1px] border-[#448CD2] border-opacity-20 p-6 rounded-[12px] bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex gap-2">
                      <h3 className="text-xl font-bold capitalize">
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
                    <p className="text-xs text-[#64748B] font-medium">
                      {detailedPods?.objectives?.subtitle ||
                        "Develop essential leadership and EI skills"}
                    </p>
                  </div>
                  <img src={Hugeicons} alt="images" className="w-8 h-8" />
                </div>
                <div className="space-y-5">
                  {displayKRs.map((kr: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="shrink-0">
                        <CircularProgress
                          value={kr.value}
                          width={50}
                          textColor="#1A3652"
                          pathColor="#1A3652"
                          trailColor="#E2E8F0"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1A3652]">
                          {kr.label}
                        </h4>
                        <p className="text-xs text-[#64748B] font-medium">
                          {kr.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {displayKRs.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      No specific key results available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 border-[1px] border-[#448CD2] border-opacity-20 p-6 rounded-[12px] bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex gap-2">
                    <h3 className="text-xl font-bold capitalize">
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
                        {/* <p className="mb-2">
                          Compares how Leaders, Managers, and Employees
                          experience the organization across the three POD
                          domains.
                        </p> */}

                        <p>
                          Highlights curated programs and resources aligned to
                          your results. These offerings are designed to address
                          key gaps and strengthen capabilities.
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] font-medium">
                    Selected growth opportunities
                  </p>
                </div>
                <img src={Healthicons} alt="images" className="w-8 h-8" />
              </div>
              <ul className="space-y-2">
                {displayRecommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-left">
                    <img
                      src={IconStar}
                      alt="icon"
                      className="w-4 h-4 mt-1 shrink-0"
                    />
                    <span className="text-sm text-[#64748B] font-medium">
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <ReportEmptyState role="Employee" />
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
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
          // Also refetch main report to update the header
          // The main fetchReport will run due to refreshKey if we add it to its deps or call manually
        }}
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
        type="Employee Report Preview"
      />
    </div>
  );
};

export default EmployeeReport;
