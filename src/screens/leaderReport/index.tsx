import { Icon } from "@iconify/react";
import Streamline from "../../../public/static/img/home/streamline-plump_graph-bar-increase.svg";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import Hugeicons from "../../../public/static/img/home/hugeicons_target-02.svg";
import StreamlinePlump from "../../../public/static/img/home/streamline-plump_ai-technology-spark.svg";
import Healthicons from "../../../public/static/img/home/healthicons_i-certificate-paper-outline.svg";
// import LastGraph from "../../../public/static/img/home/last-graph.svg";
// import kri from "../../../public/static/img/home/kdi1111.svg";
// import Employee from "../../../public/static/img/home/employee.svg";
import OuiSecurity from "../../../public/static/img/home/oui_security-signal-detected.svg";
import DownArrow from "../../../public/static/img/home/down-arrow.svg";
import Iconamoon from "../../../public/static/img/home/iconamoon_attention-square.svg";
import UpArrow from "../../../public/static/img/home/up-arrow.svg";
import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import { useAuth } from "../../context/useAuth";
import { Dropdown, Ripple, initTWE, Offcanvas } from "tw-elements";
import Sidebar from "../../components/sidebar";
import Triangle from "../../components/triangle";
import CircularProgress from "../../components/percentageCircle";
import SpeedMeter from "../../components/speedMeter";
import MultiLineChart from "../../charts/multiLineChart";
import MultiRadarChart from "../../charts/multiRadarChart";
import type { RadarData } from "../../charts/radarChart";
import RoleProgressChart from "../../components/alignmentStatus";

const LeaderReport = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const userId = searchParams.get("userId");
  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userRole = user?.role?.toLowerCase();
  const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";
  const isAdmin = userRole === "admin";
  const isReportPage = location.pathname.includes("reports");

  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });

    const fetchReport = async () => {
      try {
        const url = userId
          ? `dashboard/leader?userId=${userId}`
          : `dashboard/leader`;
        const res = await api.get(url);
        const data = res.data.report;
        setReportData(data);
        if (res.data.user) setUserData(res.data.user);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId]);

  const [selectedDomain, setSelectedDomain] =
    useState<string>("People Potential");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>("");

  useEffect(() => {
    if (reportData?.scores?.domains[selectedDomain]?.subdomains) {
      const firstSub = Object.keys(
        reportData.scores.domains[selectedDomain].subdomains,
      )[0];
      setSelectedSubdomain(firstSub);
    }
  }, [reportData, selectedDomain]);

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

  const domainScore = reportData?.scores?.domains[selectedDomain]?.score || 0;
  const subdomainScore =
    reportData?.scores?.domains[selectedDomain]?.subdomains?.[
      selectedSubdomain
    ] || 0;
  const overallScore = reportData?.scores?.overall || 0;

  const getStatus = (val: number) => {
    if (val < 50)
      return {
        label: "Needs Attention",
        color: "#FF5656",
        trail: "#FF56564b",
      };
    if (val < 75)
      return {
        label: "At Risk",
        color: "#FEE114",
        trail: "#FEE1144b",
      };
    return {
      label: "On Track",
      color: "#30AD43",
      trail: "#30AD434b",
    };
  };

  const currentStatus = getStatus(overallScore);

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    if (reportData?.scores?.domains[domain]?.subdomains) {
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

  const domainFeedback = reportData?.scores?.domains[selectedDomain]?.feedback;

  const domainInsights = domainFeedback?.insight
    ? domainFeedback.insight
        .split(". ")
        .filter((s: string) => s.trim().length > 0)
    : ["No specific insights available for this domain yet."];

  const coachingTips = domainFeedback?.coachingTips
    ? domainFeedback.coachingTips
        .split("\n")
        .map((s: string) => s.replace("•", "").trim())
        .filter((s: string) => s.length > 0)
    : ["No specific coaching tips available for this domain yet."];

  const recommendations = domainFeedback?.recommendedPrograms
    ? domainFeedback.recommendedPrograms
        .split("\n")
        .map((s: string) => s.replace("•", "").trim())
        .filter((s: string) => s.length > 0)
    : ["No specific recommendations available for this domain yet."];

  const domainOkrs: any = {
    "People Potential": {
      objective: "Cultivate high-trust, psychologically safe leadership",
      krs: [
        {
          label: "KR1",
          text: "Increase psychological safety scores by 25% from baseline",
          value: 85,
        },
        {
          label: "KR2",
          text: "90% leadership participation in empathy development focus groups",
          value: 90,
        },
        {
          label: "KR3",
          text: "15% improvement in cross-functional trust survey metrics",
          value: 75,
        },
      ],
    },
    "Operational Steadiness": {
      objective: "Enhance operational clarity and execution discipline",
      krs: [
        {
          label: "KR1",
          text: "Reduce priority-switching friction by 30% through alignment",
          value: 70,
        },
        {
          label: "KR2",
          text: "Standardize 100% of core leadership operating rhythms",
          value: 100,
        },
        {
          label: "KR3",
          text: "Achieve 95% adherence to newly defined execution standards",
          value: 95,
        },
      ],
    },
    "Digital Fluency": {
      objective: "Accelerate organizational digital maturity and AI adoption",
      krs: [
        {
          label: "KR1",
          text: "Achieve 80% proficiency in enterprise AI-assisted workflows",
          value: 80,
        },
        {
          label: "KR2",
          text: "Increase verified data-driven decision making by 40%",
          value: 40,
        },
        {
          label: "KR3",
          text: "Complete 100% of advanced digital enablement certifications",
          value: 100,
        },
      ],
    },
  };

  const currentOkr = domainOkrs[selectedDomain] || {
    objective: "Improve domain-specific capabilities",
    krs: [
      {
        label: "KR1",
        text: "Define and baseline key metrics for this domain",
        value: 50,
      },
      {
        label: "KR2",
        text: "Implement targeted development interventions",
        value: 50,
      },
      {
        label: "KR3",
        text: "Monitor and report on progress quarterly",
        value: 50,
      },
    ],
  };

  const topPriorities = Object.entries(reportData?.scores?.domains || {})
    .sort(([, a]: any, [, b]: any) => a.score - b.score)
    .slice(0, 3)
    .map(([name, data]: any) => ({
      name,
      score: Math.round(data.score),
      color: data.score < 50 ? "#D71818" : "#FF8D28",
    }));

  // Helper to get numeric score from response
  const getNumericScore = (res: any) => {
    if (res.scale === "SCALE_1_5" || res.scale === "NEVER_ALWAYS") {
      return (Number(res.value) || 1) * 20;
    }
    if (res.scale === "FORCED_CHOICE") {
      return res.selectedOption === res.higherValueOption ? 100 : 20;
    }
    return 20;
  };

  // Derive Radar Data from responses
  const radarData: RadarData = (() => {
    const subdomains = Object.keys(
      reportData?.scores?.domains[selectedDomain]?.subdomains || {},
    );
    const labels = subdomains;
    const mScores: number[] = [];
    const tScores: number[] = [];
    const pScores: number[] = [];

    labels.forEach((sub) => {
      const subRes = reportData?.responses?.filter(
        (r: any) => r.domain === selectedDomain && r.subdomain === sub,
      );

      const mResponses =
        subRes?.filter((r: any) => r.stakeholder === "manager") || [];
      const mAvg =
        mResponses.length > 0
          ? mResponses.reduce(
              (acc: number, curr: any) => acc + getNumericScore(curr),
              0,
            ) / mResponses.length
          : 0;

      const tResponses =
        subRes?.filter((r: any) => r.stakeholder === "employee") || [];
      const tAvg =
        tResponses.length > 0
          ? tResponses.reduce(
              (acc: number, curr: any) => acc + getNumericScore(curr),
              0,
            ) / tResponses.length
          : 0;

      const pResponses =
        subRes?.filter((r: any) => r.stakeholder === "leader") || [];
      const pAvg =
        pResponses.length > 0
          ? pResponses.reduce(
              (acc: number, curr: any) => acc + getNumericScore(curr),
              0,
            ) / pResponses.length
          : 0;

      mScores.push(Number((mAvg / 10).toFixed(1)));
      tScores.push(Number((tAvg / 10).toFixed(1)));
      pScores.push(Number((pAvg / 10).toFixed(1)));
    });

    return { labels, manager: mScores, team: tScores, peer: pScores };
  })();

  // Derive Role Data and Gaps from stakeholders
  const roleAverages = (() => {
    const roles = ["employee", "manager", "leader"];
    return roles.map((role) => {
      const responses =
        reportData?.responses?.filter((r: any) => r.stakeholder === role) || [];
      const score =
        responses.length > 0
          ? responses.reduce(
              (acc: number, curr: any) => acc + getNumericScore(curr),
              0,
            ) / responses.length
          : 0;

      const labelMap: any = {
        employee: "EMPLOYEE",
        manager: "MANAGER",
        leader: "SENIOR LEADER",
      };
      const colorMap: any = {
        employee: "#FF5656",
        manager: "#FEE114",
        leader: "#30AD43",
      };

      return {
        label: labelMap[role],
        value: Math.round(score),
        color: colorMap[role],
      };
    });
  })();

  const maxGapInfo = (() => {
    let largest = 0;
    let rolesText = "Balanced Views";
    for (let i = 0; i < roleAverages.length; i++) {
      for (let j = i + 1; j < roleAverages.length; j++) {
        if (roleAverages[i].value === 0 || roleAverages[j].value === 0)
          continue;
        const gap = Math.abs(roleAverages[i].value - roleAverages[j].value);
        if (gap > largest) {
          largest = gap;
          rolesText = `${roleAverages[i].label} VS ${roleAverages[j].label}`;
        }
      }
    }
    return { text: rolesText, value: largest };
  })();

  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    manager: [8.5, 0.1, 6.8, 0.1, 9.3],
    team: [5.8, 0.2, 5.5, 0.0, 5.4],
  };

  const roleData = roleAverages;

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

      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6">
        <div className="flex items-center flex-wrap gap-2 md:justify-between justify-center">
          <div>
            <h3 className="sm:text-2xl text-lg font-bold text-[var(--secondary-color)] ">
              {userData?.firstName}'s Organizational Health
            </h3>
          </div>
          <div>
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

        <div className="flex flex-wrap gap-4 mb-2 items-center"></div>
        <div className="mt-4 grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1  justify-between xl:gap-6 gap-5">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4  rounded-[12px] w-full">
            <div className="flex justify-end gap-2 flex-wrap ">
              {isSuperAdmin && (
                <div className="relative" data-twe-dropdown-ref>
                  <button
                    className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base 2xl:text-sm text-[12px] font-medium  leading-normal text-[#676767] rounded-[4px]  "
                    type="button"
                    id="dropdownMenuButton1"
                    data-twe-dropdown-toggle-ref
                    aria-expanded="false"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                  >
                    Organization
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
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              {(isSuperAdmin || isAdmin) && (
                <div className="relative" data-twe-dropdown-ref>
                  <button
                    className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base 2xl:text-sm text-[12px] font-medium  leading-normal text-[#676767] rounded-[4px]  "
                    type="button"
                    id="dropdownMenuButton1"
                    data-twe-dropdown-toggle-ref
                    aria-expanded="false"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                  >
                    Business Unit | Department
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
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              {(isSuperAdmin || isAdmin || isReportPage) && (
                <div className="relative " data-twe-dropdown-ref>
                  <button
                    className="ml-auto flex items-center  bg-[#EDF5FD] pr-5 pl-3 pb-2 pt-1 xl-text-base 2xl:text-sm text-[12px] font-medium  leading-normal text-[#676767] rounded-[4px]  "
                    type="button"
                    id="dropdownMenuButton1"
                    data-twe-dropdown-toggle-ref
                    aria-expanded="false"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                  >
                    Role
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
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                        href="#"
                        data-twe-dropdown-item-ref
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 md:justify-between justify-center items-center mt-6">
              <div
                style={{
                  // minHeight: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "40px",
                }}
              >
                <CircularProgress
                  value={overallScore}
                  width={180}
                  pathColor={currentStatus.color}
                  trailColor={currentStatus.trail}
                  textColor={currentStatus.color}
                />
              </div>
              <div>
                {" "}
                <div className="flex justify-center flex-col gap-1 ">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="w-6 h-2 bg-[#FF5656]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">
                        Needs Attention
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="w-6 h-2 bg-[#FEE114]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">
                        At Risk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="w-6 h-2 bg-[#30AD43]"></p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#474747]">
                        On Track
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row-span-2 border-[1px] border-[#448CD2] border-opacity-20 p-5 rounded-[12px] h-full bg-white flex flex-col items-center w-full">
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
            <div className="flex-1 flex items-center justify-center py-4 w-full max-w-[320px]">
              <Triangle data={triangleData} />
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
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
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
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4  rounded-[12px] ">
            <div>
              <div className="flex items-center justify-between mb-4 ">
                <div>
                  <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                    Alignment Status
                  </h3>
                  <p className="text-sm font-semibold text-[#D71818] mt-1 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 flex bg-[#D71818] rounded-full"></span>
                    Blind Spot Detected
                  </p>
                </div>

                <div>
                  <img src={OuiSecurity} alt="images" />
                </div>
              </div>
              <div className="sm:w-[400px] w-full my-10">
                <RoleProgressChart data={roleData} />
              </div>
              <p className="text-base font-medium text-[var(--secondary-color)]  mt-6">
                <b className="">Largest Gap:</b> {maxGapInfo.text} (+
                {maxGapInfo.value})
              </p>
              <div className="sm:mt-16 mt-6 ">
                <button
                  type="button"
                  className="ml-auto group text-[#D71818] rounded-full px-4 py-2 flex items-center gap-1.5 font-semibold text-sm uppercase bg-[#FFEBEB]"
                >
                  {maxGapInfo.value > 15
                    ? "Perception Risk Detected"
                    : "Alignment On Track"}
                </button>
              </div>
              <div></div>
            </div>
          </div>
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Priorities Attention
                </h3>
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

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px]">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                Overall Departmental POD Score
              </h3>
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
                  Organization
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
                  <li>
                    <a
                      className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                      href="#"
                      data-twe-dropdown-item-ref
                    >
                      Action
                    </a>
                  </li>
                  <li>
                    <a
                      className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                      href="#"
                      data-twe-dropdown-item-ref
                    >
                      Another action
                    </a>
                  </li>
                  <li>
                    <a
                      className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-[#EDF5FD]"
                      href="#"
                      data-twe-dropdown-item-ref
                    >
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <MultiRadarChart data={radarData} />
            </div>
          </div>
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px]"></div>
        </div>

        <div className="mt-8 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1  justify-between xl:gap-6 gap-5">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4  rounded-[12px] w-full ">
            <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
              Score by domain
            </h2>
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
                {reportData?.scores?.domains[selectedDomain]?.subdomains &&
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
          <div className="border-[1px] border-[#448CD2] xl:col-span-1 lg:col-span-2 border-opacity-20 p-4  rounded-[12px] w-full ">
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
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Insight for {selectedDomain}
                </h3>
                <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                  Analysis based on organizational health assessment
                </p>
              </div>
              <div>
                <img src={Streamline} alt="images" />
              </div>
            </div>
            <div>
              <ul className="mt-4 space-y-2">
                {domainInsights.map((insight: string, idx: number) => (
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
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Objectives and Key Results
                </h3>
                <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                  {currentOkr.objective}
                </p>
              </div>
              <div>
                <img src={Hugeicons} alt="images" />
              </div>
            </div>
            <div className="space-y-6">
              {currentOkr.krs.map((kr: any, idx: number) => (
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
            </div>
          </div>
        </div>
        {/*  */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-8">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Leader Coaching Tips
                </h3>
              </div>
              <div>
                <img src={StreamlinePlump} alt="images" />
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {coachingTips.map((tip: string, idx: number) => (
                <li key={idx} className="feature-list flex gap-2">
                  <img
                    src={IconStar}
                    alt="icon"
                    className="mt-1 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
            <div></div>
          </div>
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px]">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Key Recommendations
                </h3>
              </div>
              <div>
                <img src={Healthicons} alt="images" />
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {recommendations.map((rec: string, idx: number) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderReport;
