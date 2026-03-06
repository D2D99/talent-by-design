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
import SpinnerLoader from "../../components/spinnerLoader";
import Sidebar from "../../components/sidebar";
import { useAuth } from "../../context/useAuth";
import { Icon } from "@iconify/react";
import SpeedMeter from "../../components/speedMeter";
import CircularProgress from "../../components/percentageCircle";
import Triangle from "../../components/triangle";

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
  const isSuperAdmin = userRole === "superadmin";
  const isAdmin = userRole === "admin";
  const isReportPage = location.pathname.includes("reports");

  const [orgs, setOrgs] = useState<string[]>([]);
  const [depts, setDepts] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const [selectedOrg, setSelectedOrg] = useState<string>(user?.orgName || "");
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detailedPods, setDetailedPods] = useState<any>(null);


  // Dynamic selection states
  const [selectedDomain, setSelectedDomain] =
    useState<string>("People Potential");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(
    "Mindset & Adaptability",
  );

  useEffect(() => {
    if (isSuperAdmin) {
      api.get("/auth/organizations").then((res) => setOrgs(res.data.organizations));
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (selectedOrg) {
      api.get(`/auth/organization-filters/${selectedOrg}`).then((res) => {
        setDepts(res.data.departments);
        setMembers(res.data.members);
      });
    }
  }, [selectedOrg]);

  const filteredMembers = members.filter((m) => {
    const roleLower = m.role.toLowerCase();
    const matchesDept = !selectedDept || m.department === selectedDept;

    // For Employee report, we only show members with role 'employee'
    const isAllowedRole = roleLower === "employee";

    return matchesDept && isAllowedRole;
  });

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#EDF5FD',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      minHeight: '32px',
      width: '180px',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: '#E4F0FC'
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 8px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#676767',
      fontWeight: '500'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#676767',
      fontWeight: '500'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#676767',
      padding: '4px',
      '&:hover': {
        color: '#448CD2'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    })
  };

  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });

    const fetchReport = async () => {
      try {
        // Build URL: if we have an email (guest employee), use it; else use userId
        let url = `dashboard/employee`;
        if (userEmail) {
          url = `dashboard/employee?userId=${userId}&email=${encodeURIComponent(userEmail)}`;
        } else if (userId) {
          url = `dashboard/employee?userId=${userId}`;
        }
        const res = await api.get(url);
        const data = res.data.report;
        setReportData(data);

        const domainKeys = Object.keys(ROLE_DOMAIN_SUBDOMAINS.employee);
        const defaultDomain =
          domainKeys.find((k) => k.toLowerCase().includes("people")) ||
          domainKeys[0];
        setSelectedDomain(defaultDomain);

        const possibleSubs =
          ROLE_DOMAIN_SUBDOMAINS.employee[defaultDomain] || [];
        if (possibleSubs.length > 0) setSelectedSubdomain(possibleSubs[0]);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId, userEmail]);

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
  }, [selectedDomain, selectedSubdomain, userId, userEmail, reportData]);

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

  const domainScore = reportData?.scores?.domains[selectedDomain]?.score || 0;
  const subdomainScore =
    reportData?.scores?.domains[selectedDomain]?.subdomains?.[
    selectedSubdomain
    ] || 0;

  // Use dynamic pods if available, fallback to legacy
  const displayInsights = detailedPods?.insights?.mainText
    ? [detailedPods.insights.mainText]
    : ["Processing insights..."];

  const displayKRs = detailedPods?.objectives?.items?.map(
    (text: string, i: number) => ({
      label: `KR${i + 1}`,
      text: text,
      value: detailedPods.objectives.progress || 0,
    }),
  ) || [];

  const displayRecommendations =
    detailedPods?.recommendations?.items ||
    ["No specific recommendations available for this domain yet."];

  return (
    <div>
      <div>
        <div
          className="invisible fixed bottom-0 left-0 top-0 z-[1045] flex w-96 max-w-full -translate-x-full flex-col border-none bg-white bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out data-[twe-offcanvas-show]:transform-none"
          tabIndex={-1}
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
          data-twe-offcanvas-init
        >
          <div className="flex items-center justify-end p-4">
            <button
              type="button"
              className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none"
              data-twe-offcanvas-dismiss
              aria-label="Close"
            >
              <span className="[&>svg]:h-6 [&>svg]:w-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </button>
          </div>
          <Sidebar />
        </div>
      </div>

      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_4px_20px_-5px_rgba(75,155,233,0.15)] sm:p-6 p-3 rounded-[12px]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="sm:text-2xl text-lg font-bold text-[var(--secondary-color)] ">
              {reportData?.userDetails?.firstName || "Employee"}'s Report Highlights
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="group text-white rounded-full py-2.5 sm:scale-100 scale-75 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
            >
              Export report
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="24"
                height="24"
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-2 justify-end mt-4 mb-2">
          {isSuperAdmin && (
            <Select
              styles={customSelectStyles}
              placeholder="Organization"
              options={orgs.map(o => ({ value: o, label: o }))}
              value={selectedOrg ? { value: selectedOrg, label: selectedOrg } : null}
              onChange={(option: any) => {
                setSelectedOrg(option?.value || "");
                setSelectedDept("");
                setSelectedMember(null);
              }}
            />
          )}

          {(isSuperAdmin || isAdmin || isReportPage) && (
            <>
              {(isSuperAdmin || isAdmin) && (
                <Select
                  styles={customSelectStyles}
                  placeholder="Business Unit | Department"
                  options={[
                    { value: "", label: "All Departments" },
                    ...depts.map(d => ({ value: d, label: d }))
                  ]}
                  value={selectedDept ? { value: selectedDept, label: selectedDept } : null}
                  onChange={(option: any) => {
                    setSelectedDept(option?.value || "");
                    setSelectedMember(null);
                  }}
                />
              )}
            </>
          )}

          {(isSuperAdmin || isAdmin || isReportPage) && (
            <Select
              styles={customSelectStyles}
              placeholder="Select Member"
              options={filteredMembers.map(m => ({
                value: m._id,
                label: `${m.name} (${m.role})`,
                data: m
              }))}
              value={selectedMember ? { value: selectedMember._id, label: `${selectedMember.name} (${selectedMember.role})` } : null}
              onChange={(option: any) => {
                const m = option?.data;
                if (m) {
                  setSelectedMember(m);
                  const roleMapping: Record<string, string> = {
                    superadmin: "org-head",
                    super_admin: "org-head",
                    admin: "org-head",
                    leader: "senior-leader",
                    manager: "manager",
                    employee: "employee",
                  };
                  const reportType = roleMapping[m.role.toLowerCase()] || "employee";
                  navigate(`/dashboard/reports/${reportType}?userId=${m._id}&email=${encodeURIComponent(m.email)}`);
                }
              }}
            />
          )}
        </div>
        <div className="mt-6 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1  justify-between xl:gap-6 gap-5">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4  rounded-[12px] w-full ">
            <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
              Score by domain
            </h2>
            <div className="relative mt-2" data-twe-dropdown-ref>
              <button
                className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base text-sm font-medium  leading-normal text-[#676767] rounded-[4px]  "
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
                      className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-black text-neutral-700 hover:bg-[#EDF5FD]"
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
                  <p className="text-sm font-normal text-[#474747]">Medium</p>
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
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4  rounded-[12px] w-full ">
            <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
              Score by sub-domain
            </h2>
            <div className="relative mt-2" data-twe-dropdown-ref>
              <button
                className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base text-sm font-medium  leading-normal text-[#676767] rounded-[4px]  "
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
                {(ROLE_DOMAIN_SUBDOMAINS.employee[selectedDomain] || []).map(
                  (s) => (
                    <li key={s}>
                      <button
                        onClick={() => setSelectedSubdomain(s)}
                        className="block w-full text-left whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        data-twe-dropdown-item-ref
                      >
                        {s}
                      </button>
                    </li>
                  ),
                )}
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
                  <p className="text-sm font-normal text-[#474747]">Medium</p>
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
          <div className="xl:col-span-1 lg:col-span-2">
            <div className="border-[1px] border-[#448CD2] border-opacity-20 p-5 rounded-[12px] h-full bg-white flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                <div>
                  <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                    POD-360™ Model
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium">
                    Interconnectivity of focus areas
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-row items-center justify-center py-4 w-full gap-4">
                <div className="flex-1 max-w-[250px] flex items-center justify-center">
                  <Triangle data={triangleData} />
                </div>
                <div className="flex flex-col justify-center gap-3 shrink-0 max-w-[50%] max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {detailedPods?.insights?.modelDescription ? (
                    detailedPods.insights.modelDescription
                      .split(/[•\n\r]/)
                      .map((item: string) => item.trim())
                      .filter((item: string) => item.length > 0)
                      .map((bullet: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <img src={IconStar} alt="icon" className="w-4 h-4 shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-[#64748B] leading-snug">
                            {bullet}
                          </span>
                        </div>
                      ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <img src={IconStar} alt="icon" className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium text-[#64748B]">Capability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={IconStar} alt="icon" className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium text-[#64748B]">Engagement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={IconStar} alt="icon" className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium text-[#64748B]">Confidence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={IconStar} alt="icon" className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium text-[#64748B]">Change resilience</span>
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
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-8">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Insight for {selectedDomain}
                </h3>
                <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                  Overall analysis based on your responses
                </p>
              </div>
              <div>
                <img src={Streamline} alt="images" />
              </div>
            </div>
            <div>
              <ul className="mt-4 space-y-2">
                {displayInsights.map((insight: string, idx: number) => (
                  <li key={idx} className="feature-list">
                    <img src={IconStar} alt="icon" className="mt-1" />
                    <span className="text-sm text-[var(--secondary-color)] font-normal">
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
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Objectives and Key Results
                </h3>
                <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                  {detailedPods?.objectives?.subtitle || "Develop essential leadership and EI skills"}
                </p>
              </div>
              <div>
                <img src={Hugeicons} alt="images" />
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
              {displayKRs.length === 0 && <p className="text-sm text-gray-400 italic">No specific key results available for this score level.</p>}
            </div>
            <div></div>
          </div>
        </div>
        {/*  */}

        {/*  */}
        <div className="mt-8 border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                Talent By Design <br />
                Recommended Offering
              </h3>
            </div>
            <div>
              <img src={Healthicons} alt="images" />
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
    </div>
  );
};

export default EmployeeReport;
