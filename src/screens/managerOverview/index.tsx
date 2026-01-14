import { Icon } from "@iconify/react";
import Streamline from "../../../public/static/img/home/streamline-plump_graph-bar-increase.svg";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import Hugeicons from "../../../public/static/img/home/hugeicons_target-02.svg";
import StreamlinePlump from "../../../public/static/img/home/streamline-plump_ai-technology-spark.svg";
import Healthicons from "../../../public/static/img/home/healthicons_i-certificate-paper-outline.svg";
// import LastGraph from "../../../public/static/img/home/last-graph.svg";
import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
// import kri from "../../../public/static/img/home/kdi1111.svg";
import { Dropdown, Ripple, initTWE, Offcanvas } from "tw-elements";
import { useEffect } from "react";
import Sidebar from "../../components/sidebar";
import ScoreBar from "../../components/scoreBar";
import SpeedMeter from "../../components/speedMeter";
import MultiLineChart from "../../charts/multiLineChart";
import { TrendData } from "../../charts/data";
import CircularProgress from "../../components/percentageCircle";
import Triangle from "../../components/triangle";
import { useDynamicTriangleData } from "../../components/triangle/useDynamicTriangleData";
import RadarChart from "../../charts/radarChart";
import GapBarChart from "../../charts/gapBarChart";
import { useState } from "react";


const ManagerOverview = () => {

   const [chartData, setChartData] = useState<TrendData>({
    labels: ["Manager", "Structure & Clarity", "Impact of work", "Team Average", "Dependability & Clarity", "Psycological Safety"],
    manager: [4.5, 5, 5.8, 6.5, 7, 15],
    team: [4.8, 5.2, 5.5, 6, 6.4, 8.4],
  });

  // Optional: Dynamic triangle data (example)
  const data = useDynamicTriangleData();

  // Function to dynamically update chart data (in the future this can be tied to user input or API data)
  const updateChartData = () => {
    setChartData({
      labels: ["Manager", "Dependability & Clarity", "Team Average", "Impact of work", "Structure & Clarity", "Psychological Safety"],
      manager: [-0.5, 6, -6.2, 7, 7.5, 10],  // New manager scores
      team: [-0.5, 6.5, -6.8, 1, -7.5, 8],  // New team scores
    });
  };

  // Example of dynamic update using random data
  const generateRandomData = () => {
    setChartData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      manager: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10) + 1),
      team: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10) + 1),
    });
  };

  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });
  }, []);

  return (
    <div>
      <div>
        <div
          className="invisible fixed bottom-0 left-0 top-0 z-[1045] flex w-96 max-w-full -translate-x-full flex-col border-none bg-white bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out data-[twe-offcanvas-show]:transform-none dark:bg-body-dark dark:text-white"
          tabIndex={-1}
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
          data-twe-offcanvas-init
        >
          <div className="flex items-center justify-end p-4">
            <button
              type="button"
              className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
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

      <div className="sticky top-6 z-10 flex items-center gap-2 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 rounded-[12px] py-3 px-3">
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
      </div>

      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="sm:text-2xl text-lg font-bold text-[var(--secondary-color)] ">
              Overview
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
                People Potential
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
                className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
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
                  <p className="text-sm font-normal text-[#474747]">Neutral</p>
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
            <div className="pb-6">
              <SpeedMeter />
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
                Psychological Safety
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
                className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
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
                  <p className="text-sm font-normal text-[#474747]">Neutral</p>
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
            <div className="pb-6">
              <SpeedMeter />
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
              <MultiLineChart data={TrendData}/>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-8">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  Insight for psychological safety
                </h3>
                <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                  Lorem ipsum dolor sit
                </p>
              </div>
              <div>
                <img src={Streamline} alt="images" />
              </div>
            </div>
            <div>
              <ul className="mt-4 space-y-2">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text
                  </span>
                </li>
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
                  Improve analytical problem solving skills
                </p>
              </div>
              <div>
                <img src={Hugeicons} alt="images" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="text-lg-progress">
                <CircularProgress
                  value={75}
                  width={60}
                  textColor="#36454F"
                  pathColor="#1A3652"
                  trailColor="#D9D9D9"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize ">
                  KR1
                </h2>
                <p className="text-sm font-normal text-[var(--secondary-color)]">
                  80% of learners score ≥70% on analytical reasoning assessments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="text-lg-progress">
                <CircularProgress
                  value={75}
                  width={60}
                  textColor="#36454F"
                  pathColor="#1A3652"
                  trailColor="#D9D9D9"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize ">
                  KR2
                </h2>
                <p className="text-sm font-normal text-[var(--secondary-color)]">
                  Average problem-solving score increases by 15% over baseline
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="text-lg-progress">
                <CircularProgress
                  value={75}
                  width={60}
                  textColor="#36454F"
                  pathColor="#1A3652"
                  trailColor="#D9D9D9"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize ">
                  KR3
                </h2>
                <p className="text-sm font-normal text-[var(--secondary-color)]">
                  90% completion rate for advanced problem-solving tasks
                </p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        {/*  */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px]">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="sm:text-xl text-lg font-bold text-[var(--secondary-color)] capitalize ">
                  POD-360™ Model
                </h3>
              </div>
            </div>
            <div>
            </div>
            <div style={{ width: 400 }}>
              <Triangle data={data} />
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
              <li className="feature-list">
                <img src={IconStar} alt="icon" className="mt-1" />
                <span className="text-sm text-[var(--secondary-color)] font-normal">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </span>
              </li>
              <li className="feature-list">
                <img src={IconStar} alt="icon" className="mt-1" />{" "}
                <span className="text-sm text-[var(--secondary-color)] font-normal">
                  Lorem Ipsum is simply dummy text
                </span>
              </li>
              <li className="feature-list">
                <img src={IconStar} alt="icon" className="mt-1" />{" "}
                <span className="text-sm text-[var(--secondary-color)] font-normal">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </span>
              </li>
              <li className="feature-list">
                <img src={IconStar} alt="icon" className="mt-1" />{" "}
                <span className="text-sm text-[var(--secondary-color)] font-normal">
                  Lorem Ipsum is simply dummy text
                </span>
              </li>
              <li className="feature-list">
                <img src={IconStar} alt="icon" className="mt-1" />{" "}
                <span className="text-sm text-[var(--secondary-color)] font-normal">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </span>
              </li>
              <li className="feature-list">
                <img src={IconStar} alt="icon" className="mt-1" />{" "}
                <span className="text-sm text-[var(--secondary-color)] font-normal">
                  Lorem Ipsum is simply dummy text
                </span>
              </li>
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
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />
              <span className="text-sm text-[var(--secondary-color)] font-normal">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span className="text-sm text-[var(--secondary-color)] font-normal">
                Lorem Ipsum is simply dummy text
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span className="text-sm text-[var(--secondary-color)] font-normal">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span className="text-sm text-[var(--secondary-color)] font-normal">
                Lorem Ipsum is simply dummy text
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span className="text-sm text-[var(--secondary-color)] font-normal">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span className="text-sm text-[var(--secondary-color)] font-normal">
                Lorem Ipsum is simply dummy text
              </span>
            </li>
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
              <RadarChart data={chartData}/>
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
              <GapBarChart data={chartData} />
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

export default ManagerOverview;
