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
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import Sidebar from "../../components/sidebar";
import ScoreBar from "../../components/scoreBar";
import SpeedMeter from "../../components/speedMeter";
import MultiLineChart from "../../charts/multiLineChart";
import CircularProgress from "../../components/percentageCircle";
import Triangle from "../../components/triangle";
// // import { useDynamicTriangleData } from "../../components/triangle/useDynamicTriangleData";
import RadarChart from "../../charts/radarChart";
import type { RadarData } from "../../charts/radarChart";
import GapBarChart from "../../charts/gapBarChart";

const ManagerReport = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [reportData, setReportData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // setChartData
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });

    const fetchReport = async () => {
      try {
        const url = userId
          ? `dashboard/manager?userId=${userId}`
          : `dashboard/manager`;
        const res = await api.get(url);
        setReportData(res.data.report);
        setUserData(res.data.user);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId]);

  // Handle label selection from Radar Chart
  const handleRadarChartSelection = (label: string) => {
    setSelectedLabel(label);
  };

  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    manager: [8.5, 0.1, 6.8, 0.1, 9.3],
    team: [5.8, 0.2, 5.5, 0.0, 5.4],
  };

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

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
  };

  const domainScore = reportData?.scores?.domains[selectedDomain]?.score || 0;
  const subdomainScore =
    reportData?.scores?.domains[selectedDomain]?.subdomains?.[selectedSubdomain]
      ?.score || 0;
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
      objective: "Build high-performing, emotionally intelligent teams",
      krs: [
        {
          label: "KR1",
          text: "100% of team members complete role-specific EI training",
          value: 80,
        },
        {
          label: "KR2",
          text: "Achieve 90% positive team climate scores in feedback rounds",
          value: 90,
        },
        {
          label: "KR3",
          text: "Identify and mentor 2 high-potential leaders within the team",
          value: 100,
        },
      ],
    },
    "Operational Steadiness": {
      objective:
        "Standardize team execution discipline and workflow efficiency",
      krs: [
        {
          label: "KR1",
          text: "Achieve 100% adherence to weekly team operating rhythms",
          value: 95,
        },
        {
          label: "KR2",
          text: "Reduce project delivery friction metrics by 25%",
          value: 70,
        },
        {
          label: "KR3",
          text: "Implement verified accountability frameworks for all members",
          value: 100,
        },
      ],
    },
    "Digital Fluency": {
      objective:
        "Enable team digital transformation and AI workflow integration",
      krs: [
        {
          label: "KR1",
          text: "Transition 100% of team collaboration to digital-first norms",
          value: 85,
        },
        {
          label: "KR2",
          text: "Achieve 70% team proficiency in AI-assisted project management",
          value: 70,
        },
        {
          label: "KR3",
          text: "Audit and optimize 100% of team digital tool utilization",
          value: 100,
        },
      ],
    },
  };

  const currentOkr = domainOkrs[selectedDomain] || {
    objective: "Lead team improvements in this domain area",
    krs: [
      {
        label: "KR1",
        text: "Establish baseline performance metrics for the team",
        value: 50,
      },
      {
        label: "KR2",
        text: "Deliver monthly team development coaching sessions",
        value: 50,
      },
      {
        label: "KR3",
        text: "Report 15% growth in domain-specific team metrics",
        value: 50,
      },
    ],
  };

  // Calculate radar data dynamically from responses
  const getNumericScore = (res: any) => {
    if (res.scale === "SCALE_1_5" || res.scale === "NEVER_ALWAYS") {
      return (Number(res.value) || 1) * 20;
    }
    if (res.scale === "FORCED_CHOICE") {
      return res.selectedOption === res.higherValueOption ? 100 : 20;
    }
    return 20;
  };

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

  const deltaScores = radarData.team.map((t, i) =>
    Number((t - radarData.manager[i]).toFixed(1)),
  );

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

      {/* <div className="sticky top-6 z-10 flex items-center gap-2 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 rounded-[12px] py-3 px-3">
        <div>
          <div className="md:hidden visible restore-sidebar restore-sidebar-mobile absolute top-1/2 transform -translate-y-1/2 left-[-12px] cursor-pointer">
            <button
              type="button"
              data-twe-offcanvas-toggle
              data-twe-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              <img src={IconamoonArrow} alt="arrow" className="w-5 h-5" />
            </button>
          </div>
          <h3 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] ">
            Welcome back, Suzanna De S!
          </h3>
          <p className="sm:text-sm text-xs font-normal text-[var(--secondary-color)] mt-1 ">
            Complete platform oversight with real-time performance insights,
            user activity, and priority actions requiring your attention.
          </p>
        </div>

        <div className="relative">
          <button type="button">
            <Icon
              icon="tabler:bell"
              width="28"
              height="28"
              className="sm:w-7 sm:h-7 w-5 h-5"
            />
          </button>
          <p className="w-[6px] h-[6px] bg-[#FF0000] rounded-full absolute top-0 right-[8px] border border-white"></p>
        </div>
      </div> */}

      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="sm:text-2xl text-lg font-bold text-[var(--secondary-color)] ">
              {userData?.firstName}'s Insights (Manager View)
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
        <div className="mt-6 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1  justify-between xl:gap-6 gap-5">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4  rounded-[12px] w-full ">
            <h2 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
              Score by domain
            </h2>
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
                  reportData?.scores?.domains[selectedDomain]?.subdomains || {},
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
                  Overall analysis for this domain
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
            <div></div>
          </div>
        </div>
        {/*  */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
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
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Manager Coaching Tips
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
        </div>
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
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px]">
            <div className="flex items-center justify-between  ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Manager VS Team Gap
                </h3>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 mt-6">
              <div>
                <p className="w-9 h-4 bg-[#448bd26c]"></p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#474747]">
                  Manager Self Assessment
                </p>
              </div>
            </div>
            <div>
              <RadarChart
                data={radarData}
                selectedLabel={selectedLabel}
                onLabelSelect={handleRadarChartSelection}
              />
            </div>
          </div>
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 pb-11 rounded-[12px] ">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Delta Breakdown
                </h3>
              </div>
            </div>
            <div>
              <GapBarChart
                labels={radarData.labels}
                deltaScores={deltaScores}
                selectedLabel={selectedLabel}
              />
            </div>
          </div>
        </div>

        <div className="last-graph mt-8">
          <ScoreBar score={50} label="hello world" />
        </div>
      </div>
    </div>
  );
};

export default ManagerReport;
