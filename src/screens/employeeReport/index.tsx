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
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import Sidebar from "../../components/sidebar";
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
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [reportData, setReportData] = useState<any>(null);
  // const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic selection states
  const [selectedDomain, setSelectedDomain] =
    useState<string>("People Potential");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(
    "Mindset & Adaptability",
  );
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const url = userId
          ? `dashboard/employee?userId=${userId}`
          : `dashboard/employee`;
        const res = await api.get(url);
        const data = res.data.report;
        setReportData(data);
        // Dynamic domain/subdomain selection from organizational framework
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
  }, [userId]);

  // Re-initialize TW-Elements after data is loaded and components are rendered
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        initTWE({ Ripple, Offcanvas, Dropdown });
      }, 0);
    }
  }, [loading]);

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    const possibleSubs = ROLE_DOMAIN_SUBDOMAINS.employee[domain] || [];
    if (possibleSubs.length > 0) {
      setSelectedSubdomain(possibleSubs[0]);
    } else {
      setSelectedSubdomain("");
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

  const domainScore = reportData?.scores?.domains[selectedDomain]?.score || 0;
  const subdomainScore =
    reportData?.scores?.domains[selectedDomain]?.subdomains?.[
      selectedSubdomain
    ] || 0;

  // Get highlights/insights for the selected domain
  const domainFeedback = reportData?.scores?.domains[selectedDomain]?.feedback;

  const domainInsights = domainFeedback?.insight
    ? domainFeedback.insight
        .split(". ")
        .filter((s: string) => s.trim().length > 0)
    : ["No specific insights available for this domain yet."];

  const recommendations = domainFeedback?.recommendedPrograms
    ? domainFeedback.recommendedPrograms
        .split("\n")
        .map((s: string) => s.replace("•", "").trim())
        .filter((s: string) => s.length > 0)
    : ["No specific recommendations available for this domain yet."];

  const domainOkrs: any = {
    "People Potential": {
      objective: "Develop essential people leadership and EI skills",
      krs: [
        {
          label: "KR1",
          text: "Complete 100% of assigned EI and communication modules",
          value: 100,
        },
        {
          label: "KR2",
          text: "Participate in monthly peer-to-peer feedback circles",
          value: 100,
        },
        {
          label: "KR3",
          text: "Achieve 85% positive rating in team-readiness surveys",
          value: 85,
        },
      ],
    },
    "Operational Steadiness": {
      objective: "Improve personal execution discipline and workflow clarity",
      krs: [
        {
          label: "KR1",
          text: "Reduce personal backlog tasks by 20% through better planning",
          value: 65,
        },
        {
          label: "KR2",
          text: "Maintain 100% adherence to team operating rhythms",
          value: 100,
        },
        {
          label: "KR3",
          text: "Achieve 90% accuracy in task estimation and completion",
          value: 90,
        },
      ],
    },
    "Digital Fluency": {
      objective: "Boost personal digital proficiency and tool adoption",
      krs: [
        {
          label: "KR1",
          text: "Complete advanced training for core collaboration tools",
          value: 80,
        },
        {
          label: "KR2",
          text: "Implement at least 2 automation workflows in daily tasks",
          value: 50,
        },
        {
          label: "KR3",
          text: "Maintain 100% digital hygiene standards across platforms",
          value: 100,
        },
      ],
    },
  };

  const currentOkr = domainOkrs[selectedDomain] || {
    objective: "Enhance personal performance in this domain",
    krs: [
      {
        label: "KR1",
        text: "Identify 3 key areas for skill improvement",
        value: 50,
      },
      {
        label: "KR2",
        text: "Schedule and complete monthly development reviews",
        value: 50,
      },
      {
        label: "KR3",
        text: "Apply new learnings to at least 2 active projects",
        value: 50,
      },
    ],
  };

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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-extrabold text-[var(--secondary-color)]">
            Core Assessment Metrics
          </h3>
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
                {domainInsights.map((insight: string, idx: number) => (
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
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;
