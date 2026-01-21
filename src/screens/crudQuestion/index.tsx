import { Icon } from "@iconify/react";

// import LastGraph from "../../../public/static/img/home/last-graph.svg";
import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";

import Sidebar from "../../components/sidebar";
import { Tab, initTWE } from "tw-elements";
import { useEffect } from "react";

const CrudQuestion = () => {
  useEffect(() => {
    initTWE({ Tab });
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
          <p className="sm:text-sm text-xs font-normal text-[var(--secondary-color)] mt-1">
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--secondary-color)]">
              Assessment Questions
            </h2>
          </div>
          <div>
            <button
              type="button"
              className="group text-white rounded-full py-2.5 sm:scale-100 scale-75 pr-4 pl-5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
            >
              <Icon
                icon="material-symbols:add-rounded"
                width="24"
                height="24"
              />
              Add new question
            </button>
          </div>
        </div>
        <div>
          <div className="mt-8">
            <div className="flex justify-end gap-5 items-center">
              <ul
                className="flex list-none flex-row flex-wrap border-b-0  bg-[#EDF5FD] rounded-full p-1.5 gap-2 justify-end w-fit ms-auto "
                id="tabs-tab3"
                role="tablist"
                data-twe-nav-ref
              >
                <li role="presentation">
                  <a
                    href="#tabs-home3"
                    className="block border-x-0 border-b-2 border-t-0 rounded-full border-transparent px-4 py-2.5 text-base font-semibold uppercase leading-tight text-[var(--secondary-color)] hover:isolate hover:border-transparent hover:bg-white focus:isolate focus:border-transparent data-[twe-nav-active]:bg-white"
                    id="tabs-home-tab3"
                    data-twe-toggle="pill"
                    data-twe-target="#tabs-home3"
                    data-twe-nav-active
                    role="tab"
                    aria-controls="tabs-home3"
                    aria-selected="true"
                  >
                    People potential
                  </a>
                </li>
                <li role="presentation">
                  <a
                    href="#tabs-profile3"
                    className="block border-x-0 border-b-2 border-t-0 rounded-full border-transparent px-4 py-2.5 text-base font-semibold uppercase leading-tight text-[var(--secondary-color)] hover:isolate hover:border-transparent hover:bg-white focus:isolate focus:border-transparent data-[twe-nav-active]:bg-white"
                    id="tabs-profile-tab3"
                    data-twe-toggle="pill"
                    data-twe-target="#tabs-profile3"
                    role="tab"
                    aria-controls="tabs-profile3"
                    aria-selected="false"
                  >
                    Operational Steadiness
                  </a>
                </li>
                <li role="presentation">
                  <a
                    href="#tabs-messages3"
                    className="block border-x-0 border-b-2 border-t-0 rounded-full border-transparent px-4 py-2.5 text-base font-semibold uppercase leading-tight text-[var(--secondary-color)] hover:isolate hover:border-transparent hover:bg-white focus:isolate focus:border-transparent data-[twe-nav-active]:bg-white"
                    id="tabs-messages-tab3"
                    data-twe-toggle="pill"
                    data-twe-target="#tabs-messages3"
                    role="tab"
                    aria-controls="tabs-messages3"
                    aria-selected="false"
                  >
                    Digital Fluency
                  </a>
                </li>
              </ul>
              <div>Filter</div>
            </div>
            <div>
              <div
                className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
                id="tabs-home3"
                role="tabpanel"
                data-twe-tab-active
                aria-labelledby="tabs-home-tab3"
              >
                Tab 1 content button version
              </div>
              <div
                className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
                id="tabs-profile3"
                role="tabpanel"
                aria-labelledby="tabs-profile-tab3"
              >
                Tab 2 content button version
              </div>
              <div
                className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
                id="tabs-messages3"
                role="tabpanel"
                aria-labelledby="tabs-profile-tab3"
              >
                Tab 3 content button version
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudQuestion;
